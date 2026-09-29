"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, X, Send, Sparkles, Wrench } from "lucide-react";
import { site } from "@/lib/site";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const t = useTranslations("chat");
  const ts = useTranslations("services");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWechat, setShowWechat] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [wiz, setWiz] = useState({
    product: "",
    thickness: "",
    width: "",
    adhesion: "",
    qty: "",
  });
  const [imgOk, setImgOk] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickItems = (t.raw("quickItems") as string[]) ?? [];
  const productOptions =
    ((ts.raw("items") as { title: string }[]) ?? []).map((i) => i.title);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, showWizard]);

  // 支持通过 ?chat=open 直接展开助手（用于预览 / 分享入口）
  useEffect(() => {
    if (typeof window !== "undefined" && /[?&]chat=open\b/.test(window.location.search)) {
      setOpen(true);
    }
  }, []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const history: Msg[] = [...messages, { role: "user", content }];
    setMessages(history);
    setInput("");
    setLoading(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = m.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = m.slice();
        copy[copy.length - 1] = { role: "assistant", content: t("offline") };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  function generateInquiry() {
    const lines = [
      `${t("wizardProduct")}: ${wiz.product || "-"}`,
      `${t("wizardThickness")}: ${wiz.thickness || "-"}`,
      `${t("wizardWidth")}: ${wiz.width || "-"}`,
      `${t("wizardAdhesion")}: ${wiz.adhesion || "-"}`,
      `${t("wizardQty")}: ${wiz.qty || "-"}`,
    ];
    setShowWizard(false);
    send("[Inquiry] " + lines.join("  |  "));
  }

  function openWhatsApp() {
    const summary = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join(" | ");
    const text = encodeURIComponent(
      "Hello GDY! I'd like to inquire about PET protective film. " + summary
    );
    window.open(`https://wa.me/8618118776356?text=${text}`, "_blank", "noopener");
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t("title")}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full text-white shadow-xl transition hover:scale-105"
        style={{
          background:
            "linear-gradient(135deg, var(--color-brand-2), var(--color-brand-3))",
        }}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div
          dir="ltr"
          className="fixed bottom-24 right-5 z-50 flex h-[72vh] max-h-[580px] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface"
          style={{ boxShadow: "0 24px 60px -20px rgba(11,31,60,0.4)" }}
        >
          {/* header */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-brand-2 to-brand-3 px-4 py-3 text-white">
            <Sparkles className="h-5 w-5" />
            <div className="text-sm font-semibold leading-tight">{t("title")}</div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-white/90 transition hover:text-white"
              aria-label="close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-3 py-4"
            style={{ background: "var(--color-bg)" }}
          >
            <div className="flex justify-start">
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm border border-line bg-surface px-3 py-2 text-sm text-ink">
                {t("subtitle")}
              </div>
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "rounded-br-sm bg-brand text-white"
                      : "rounded-bl-sm border border-line bg-surface text-ink"
                  }`}
                >
                  {m.content ||
                    (loading && i === messages.length - 1 ? t("thinking") : "")}
                </div>
              </div>
            ))}

            {/* quick questions */}
            {messages.length === 0 && (
              <div>
                <div className="mb-1 text-xs text-muted">{t("quick")}</div>
                <div className="flex flex-wrap gap-2">
                  {quickItems.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => send(q)}
                      className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink transition hover:border-brand"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* quote wizard */}
            {showWizard && (
              <div className="rounded-2xl border border-line bg-surface p-3">
                <div className="mb-2 flex items-center gap-1 text-xs font-semibold text-brand">
                  <Wrench className="h-3.5 w-3.5" /> {t("wizard")}
                </div>
                <div className="space-y-2">
                  <select
                    value={wiz.product}
                    onChange={(e) =>
                      setWiz({ ...wiz, product: e.target.value })
                    }
                    className="w-full rounded-lg border border-line bg-white px-2 py-1.5 text-sm text-ink"
                  >
                    <option value="">{t("wizardProduct")}</option>
                    {productOptions.map((p, i) => (
                      <option key={i} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder={t("wizardThickness")}
                      value={wiz.thickness}
                      onChange={(e) =>
                        setWiz({ ...wiz, thickness: e.target.value })
                      }
                      className="rounded-lg border border-line bg-white px-2 py-1.5 text-sm text-ink"
                    />
                    <input
                      placeholder={t("wizardWidth")}
                      value={wiz.width}
                      onChange={(e) => setWiz({ ...wiz, width: e.target.value })}
                      className="rounded-lg border border-line bg-white px-2 py-1.5 text-sm text-ink"
                    />
                    <input
                      placeholder={t("wizardAdhesion")}
                      value={wiz.adhesion}
                      onChange={(e) =>
                        setWiz({ ...wiz, adhesion: e.target.value })
                      }
                      className="rounded-lg border border-line bg-white px-2 py-1.5 text-sm text-ink"
                    />
                    <input
                      placeholder={t("wizardQty")}
                      value={wiz.qty}
                      onChange={(e) => setWiz({ ...wiz, qty: e.target.value })}
                      className="rounded-lg border border-line bg-white px-2 py-1.5 text-sm text-ink"
                    />
                  </div>
                  <button
                    onClick={generateInquiry}
                    className="btn-primary w-full text-xs"
                    style={{ padding: "0.5rem 0.75rem" }}
                  >
                    {t("wizardGenerate")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* bottom: human handoff + input */}
          <div className="flex-none border-t border-line bg-panel-2 px-3 py-2">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs text-muted">{t("humanDesc")}</span>
              <button
                onClick={() => setShowWizard((w) => !w)}
                className="flex items-center gap-1 rounded-full border border-line bg-surface px-2 py-1 text-xs text-ink transition hover:border-brand"
              >
                <Wrench className="h-3 w-3" /> {t("wizard")}
              </button>
            </div>
            <div className="mb-2 flex gap-2">
              <button
                onClick={openWhatsApp}
                className="btn-primary flex-1 text-xs"
                style={{ padding: "0.5rem 0.5rem" }}
              >
                {t("whatsapp")}
              </button>
              <button
                onClick={() => setShowWechat((w) => !w)}
                className="flex-1 rounded-full border border-line bg-surface px-2 py-2 text-xs font-semibold text-ink transition hover:border-brand"
              >
                {t("wechat")}
              </button>
            </div>
            {showWechat && (
              <div className="mb-2 rounded-xl border border-line bg-surface p-3 text-center">
                <div className="mb-1 text-xs text-muted">{t("wechatScan")}</div>
                {imgOk ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={site.wechat.qr}
                    alt="WeChat QR"
                    onError={() => setImgOk(false)}
                    className="mx-auto h-28 w-28 object-contain"
                  />
                ) : (
                  <div className="text-sm text-ink">
                    {t("wechatIdLabel")}: <b>{site.wechat.id}</b>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder={t("placeholder")}
                rows={1}
                className="max-h-24 min-h-[40px] flex-1 resize-none rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand"
              />
              <button
                onClick={() => send(input)}
                disabled={loading}
                className="btn-primary"
                style={{ padding: "0.5rem 0.75rem" }}
                aria-label={t("send")}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
