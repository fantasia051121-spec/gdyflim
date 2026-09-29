import { NextRequest } from "next/server";
import { buildSystemPrompt, localReply } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  let messages: { role: string; content: string }[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    messages = [];
  }

  const encoder = new TextEncoder();

  // 降级：未配置 API key 时，使用本地规则应答（保证 UI 始终可用、不报错）。
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    const lastUser =
      [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const reply = localReply(lastUser);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(reply));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const baseUrl = (process.env.LLM_BASE_URL || "https://api.deepseek.com/v1").replace(
    /\/$/,
    ""
  );
  const model = process.env.LLM_MODEL || "deepseek-chat";

  const upstream = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
      stream: true,
      temperature: 0.3,
    }),
  });

  // 上游失败也降级，避免白屏。
  if (!upstream.ok || !upstream.body) {
    const lastUser =
      [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const reply =
      "（AI 服务暂时不可用，已切换为基础应答）\n\n" + localReply(lastUser);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(reply));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const reader = upstream.body.getReader();
  const stream = new ReadableStream({
    async start(controller) {
      const decoder = new TextDecoder();
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const json = JSON.parse(data);
              const delta: string = json.choices?.[0]?.delta?.content || "";
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // 忽略不完整分片
            }
          }
        }
      } catch {
        // 流式中断不影响已输出内容
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
