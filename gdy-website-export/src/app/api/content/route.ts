import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { commitFile } from "@/lib/github";
import { LOCALES } from "@/lib/content";

const CONTENT_DIR = path.join(process.cwd(), "content");
const MESSAGES_DIR = path.join(process.cwd(), "src", "messages");

const CONTENT_FILES: Record<string, string> = {
  company: "company.json",
  faq: "faq.json",
};

function readJson(p: string) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function writeJson(p: string, obj: unknown) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (type === "company" || type === "faq") {
    const file = CONTENT_FILES[type];
    const p = path.join(CONTENT_DIR, file);
    if (!fs.existsSync(p)) return NextResponse.json({ error: "文件不存在" }, { status: 404 });
    return NextResponse.json({ data: readJson(p) });
  }

  if (type === "messages") {
    const namespace = searchParams.get("namespace");
    if (!namespace) return NextResponse.json({ error: "缺少 namespace" }, { status: 400 });
    const out: Record<string, unknown> = {};
    for (const loc of LOCALES) {
      const p = path.join(MESSAGES_DIR, `${loc}.json`);
      const d = readJson(p);
      out[loc] = d[namespace];
    }
    return NextResponse.json({ namespace, data: out });
  }

  return NextResponse.json({ error: "未知 type" }, { status: 400 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "请求体无效" }, { status: 400 });

  const password = body.password as string;
  if (!password) return NextResponse.json({ error: "缺少密码" }, { status: 401 });
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }

  const type = body.type as string;

  try {
    // 1) content/*.json（company / faq）
    if (type === "company" || type === "faq") {
      const file = CONTENT_FILES[type];
      const p = path.join(CONTENT_DIR, file);
      writeJson(p, body.data);
      const res = await commitFile(
        `content/${file}`,
        JSON.stringify(body.data, null, 2) + "\n",
        `${type}: update via admin`
      );
      if (res.mode === "disabled") {
        return NextResponse.json({
          ok: true,
          mode: "local",
          note: "已写入本地（未配置 GitHub，仅开发机可见）。部署请在 Vercel 配置 GITHUB_TOKEN/GITHUB_REPO。",
        });
      }
      return NextResponse.json({
        ok: true,
        mode: "github",
        commitUrl: res.commitUrl,
        note: "已提交 GitHub，Vercel 将自动重建上线。",
      });
    }

    // 2) messages 命名空间（services / cases / advantages / hero ...）
    if (type === "messages") {
      const ns = body.namespace as string;
      const data = body.data as Record<string, unknown>;
      if (!ns || !data) return NextResponse.json({ error: "缺少 namespace 或 data" }, { status: 400 });

      const committed: string[] = [];
      for (const loc of LOCALES) {
        const p = path.join(MESSAGES_DIR, `${loc}.json`);
        const d = readJson(p);
        d[ns] = data[loc] ?? d[ns];
        writeJson(p, d);
        committed.push(`${loc}.json`);
      }
      const res = await commitFile(
        `src/messages/${LOCALES[0]}.json`,
        JSON.stringify(readJson(path.join(MESSAGES_DIR, `${LOCALES[0]}.json`)), null, 2) + "\n",
        `content: update ${ns} via admin`
      );
      if (res.mode === "disabled") {
        return NextResponse.json({
          ok: true,
          mode: "local",
          note: `已写入本地 ${committed.join(", ")}（未配置 GitHub，仅开发机可见）。`,
        });
      }
      return NextResponse.json({
        ok: true,
        mode: "github",
        commitUrl: res.commitUrl,
        note: "已提交 GitHub，Vercel 将自动重建上线。",
      });
    }

    return NextResponse.json({ error: "未知 type" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "保存失败：" + (err?.message || err) },
      { status: 500 }
    );
  }
}
