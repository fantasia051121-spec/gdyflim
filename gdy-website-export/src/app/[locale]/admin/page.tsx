"use client";

import { useEffect, useState } from "react";

type Tab = "news" | "company" | "content" | "faq";
type Status = { kind: "idle" | "loading" | "ok" | "error"; msg: string; link?: string };

const LOCALES = [
  { k: "en", label: "English" },
  { k: "zh", label: "中文" },
  { k: "vi", label: "Tiếng Việt" },
  { k: "th", label: "ไทย" },
  { k: "id", label: "Indonesia" },
  { k: "ms", label: "Melayu" },
  { k: "ar", label: "العربية" },
];

const NS_OPTIONS = [
  { k: "services", label: "产品 / Services（6 大产品线）" },
  { k: "cases", label: "案例 / Cases（6 大行业）" },
  { k: "advantages", label: "优势 / Advantages（卖点 + 认证）" },
  { k: "hero", label: "首页首屏 / Hero 文案" },
];

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

function StatusBanner({ s }: { s: Status }) {
  if (s.kind === "idle") return null;
  const cls =
    s.kind === "error"
      ? "bg-rose-50 text-rose-700"
      : s.kind === "ok"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-slate-100 text-slate-600";
  return (
    <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${cls}`}>
      {s.msg}
      {s.link && (
        <a href={s.link} target="_blank" rel="noreferrer" className="ml-2 underline">
          查看提交 ↗
        </a>
      )}
    </div>
  );
}

/* ---------------- 新闻（保留原 AI 发文） ---------------- */
function NewsEditor({ pw }: { pw: string }) {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<"company" | "industry">("company");
  const [status, setStatus] = useState<Status>({ kind: "idle", msg: "" });
  const [result, setResult] = useState<any>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return setStatus({ kind: "error", msg: "请填写文章主题。" });
    if (!pw) return setStatus({ kind: "error", msg: "请先在顶部输入后台密码。" });
    setStatus({ kind: "loading", msg: "AI 正在撰写 7 语言稿件并提交，请稍候（约 20–40 秒）…" });
    setResult(null);
    try {
      const res = await fetch("/api/news/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, category, password: pw }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) return setStatus({ kind: "error", msg: data?.error || "生成失败。" });
      setStatus({ kind: "ok", msg: data.note || "发布成功！" });
      setResult(data);
      setTopic("");
    } catch (err: any) {
      setStatus({ kind: "error", msg: "请求失败：" + (err?.message || err) });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">文章主题 *</label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={3}
          placeholder="例如：GDY 新增大宽幅涂布产线，满足新能源客户定制需求"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">分类</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as "company" | "industry")}
          className={inputCls}
        >
          <option value="company">公司动态</option>
          <option value="industry">行业资讯</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={status.kind === "loading"}
        className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
      >
        {status.kind === "loading" ? "生成中…" : "生成并发布"}
      </button>
      <StatusBanner s={status} />
      {result?.slug && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
          <div className="font-medium text-slate-700">
            已生成：<span className="font-mono text-blue-600">{result.slug}</span>
            {result.mode === "github" && (
              <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">已提交</span>
            )}
            {result.mode === "local" && (
              <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">本地草稿</span>
            )}
          </div>
          {result.commitUrl && (
            <a href={result.commitUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-blue-600 underline">
              查看提交记录 ↗
            </a>
          )}
          {result.preview && (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {Object.entries(result.preview as Record<string, string>).map(([loc, link]) => (
                <a
                  key={loc}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center text-xs text-slate-600 hover:border-blue-300 hover:text-blue-600"
                >
                  {LOCALES.find((l) => l.k === loc)?.label || loc}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </form>
  );
}

/* ---------------- 公司信息（结构化表单） ---------------- */
function CompanyEditor({ pw }: { pw: string }) {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle", msg: "" });

  useEffect(() => {
    if (!pw) return;
    fetch("/api/content?type=company")
      .then((r) => r.json())
      .then((d) => setData(d.data))
      .catch(() => setStatus({ kind: "error", msg: "加载失败" }));
  }, [pw]);

  function set(path: string[], value: string) {
    setData((d: any) => {
      const n = { ...d };
      let o = n;
      for (let i = 0; i < path.length - 1; i++) o = o[path[i]];
      o[path[path.length - 1]] = value;
      return n;
    });
  }

  async function save() {
    if (!pw) return setStatus({ kind: "error", msg: "请先在顶部输入后台密码。" });
    setStatus({ kind: "loading", msg: "保存中…" });
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "company", data, password: pw }),
      });
      const r = await res.json();
      setStatus(r.ok ? { kind: "ok", msg: r.note || "已保存", link: r.commitUrl } : { kind: "error", msg: r.error });
    } catch (e: any) {
      setStatus({ kind: "error", msg: "请求失败：" + (e?.message || e) });
    }
  }

  if (!data) return <p className="text-sm text-slate-500">{pw ? "加载中…" : "请先输入密码"}</p>;

  const Field = ({ label, path, ph }: { label: string; path: string[]; ph?: string }) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      <input
        className={inputCls}
        value={path.reduce((o, k) => o?.[k], data) ?? ""}
        placeholder={ph}
        onChange={(e) => set(path, e.target.value)}
      />
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">公司</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="公司名（英）" path={["company", "name"]} />
          <Field label="公司名（中）" path={["company", "nameZh"]} />
          <Field label="简称" path={["company", "shortName"]} />
          <Field label="建厂年份" path={["company", "established"]} />
          <div className="sm:col-span-2">
            <Field label="公司标语 / 定位" path={["company", "tagline"]} />
          </div>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">联系</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="邮箱" path={["contact", "email"]} />
          <Field label="电话 / WhatsApp" path={["contact", "phone"]} />
          <Field label="WhatsApp 链接" path={["contact", "whatsapp"]} />
          <Field label="官网" path={["contact", "website"]} />
          <div className="sm:col-span-2">
            <Field label="地址" path={["contact", "address"]} />
          </div>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">社媒链接</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Facebook" path={["social", "facebook"]} />
          <Field label="Instagram" path={["social", "instagram"]} />
          <Field label="LinkedIn" path={["social", "linkedin"]} />
          <Field label="YouTube" path={["social", "youtube"]} />
          <Field label="TikTok" path={["social", "tiktok"]} />
          <Field label="Made-in-China" path={["social", "madeInChina"]} />
          <Field label="1688" path={["social", "platform1688"]} />
          <Field label="微信 ID" path={["wechat", "id"]} />
        </div>
      </div>
      <button
        onClick={save}
        disabled={status.kind === "loading"}
        className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
      >
        {status.kind === "loading" ? "保存中…" : "保存公司信息"}
      </button>
      <StatusBanner s={status} />
    </div>
  );
}

/* ---------------- 内容（messages 命名空间，JSON 编辑） ---------------- */
function ContentEditor({ pw }: { pw: string }) {
  const [ns, setNs] = useState("services");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle", msg: "" });

  useEffect(() => {
    if (!pw) return;
    setText("");
    setStatus({ kind: "idle", msg: "" });
    fetch(`/api/content?type=messages&namespace=${ns}`)
      .then((r) => r.json())
      .then((d) => setText(JSON.stringify(d.data, null, 2)))
      .catch(() => setStatus({ kind: "error", msg: "加载失败" }));
  }, [ns, pw]);

  async function save() {
    if (!pw) return setStatus({ kind: "error", msg: "请先在顶部输入后台密码。" });
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return setStatus({ kind: "error", msg: "JSON 格式错误，请检查。" });
    }
    setStatus({ kind: "loading", msg: "保存中…" });
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "messages", namespace: ns, data: parsed, password: pw }),
      });
      const r = await res.json();
      setStatus(r.ok ? { kind: "ok", msg: r.note || "已保存", link: r.commitUrl } : { kind: "error", msg: r.error });
    } catch (e: any) {
      setStatus({ kind: "error", msg: "请求失败：" + (e?.message || e) });
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {NS_OPTIONS.map((o) => (
          <button
            key={o.k}
            onClick={() => setNs(o.k)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              ns === o.k ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500">
        按语言（en/zh/vi/th/id/ms/ar）编辑对应内容。保存即覆盖整段命名空间，请保持 JSON 结构（尤其数组顺序）。
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={18}
        spellCheck={false}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 outline-none focus:border-blue-400"
      />
      <button
        onClick={save}
        disabled={status.kind === "loading"}
        className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
      >
        {status.kind === "loading" ? "保存中…" : "保存内容"}
      </button>
      <StatusBanner s={status} />
    </div>
  );
}

/* ---------------- 常见问题 FAQ（结构化列表） ---------------- */
function FaqEditor({ pw }: { pw: string }) {
  const [data, setData] = useState<any>(null);
  const [loc, setLoc] = useState("en");
  const [status, setStatus] = useState<Status>({ kind: "idle", msg: "" });

  useEffect(() => {
    if (!pw) return;
    fetch("/api/content?type=faq")
      .then((r) => r.json())
      .then((d) => setData(d.data))
      .catch(() => setStatus({ kind: "error", msg: "加载失败" }));
  }, [pw]);

  function update(idx: number, key: "q" | "a", value: string) {
    setData((d: any) => {
      const n = { ...d };
      n[loc][idx][key] = value;
      return n;
    });
  }
  function add() {
    setData((d: any) => {
      const n = { ...d };
      n[loc] = [...(n[loc] || []), { q: "", a: "" }];
      return n;
    });
  }
  function remove(idx: number) {
    setData((d: any) => {
      const n = { ...d };
      n[loc] = n[loc].filter((_: any, i: number) => i !== idx);
      return n;
    });
  }

  async function save() {
    if (!pw) return setStatus({ kind: "error", msg: "请先在顶部输入后台密码。" });
    setStatus({ kind: "loading", msg: "保存中…" });
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "faq", data, password: pw }),
      });
      const r = await res.json();
      setStatus(r.ok ? { kind: "ok", msg: r.note || "已保存", link: r.commitUrl } : { kind: "error", msg: r.error });
    } catch (e: any) {
      setStatus({ kind: "error", msg: "请求失败：" + (e?.message || e) });
    }
  }

  if (!data) return <p className="text-sm text-slate-500">{pw ? "加载中…" : "请先输入密码"}</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {LOCALES.map((l) => (
          <button
            key={l.k}
            onClick={() => setLoc(l.k)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              loc === l.k ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {(data[loc] || []).map((it: any, i: number) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">#{i + 1}</span>
              <button onClick={() => remove(i)} className="text-xs text-rose-500 hover:underline">
                删除
              </button>
            </div>
            <input
              className={inputCls + " mb-2"}
              placeholder="问题 / Question"
              value={it.q}
              onChange={(e) => update(i, "q", e.target.value)}
            />
            <textarea
              className={inputCls}
              rows={2}
              placeholder="答案 / Answer"
              value={it.a}
              onChange={(e) => update(i, "a", e.target.value)}
            />
          </div>
        ))}
      </div>
      <button onClick={add} className="w-full rounded-xl border border-dashed border-slate-300 py-2 text-sm text-slate-500 transition hover:border-blue-400 hover:text-blue-600">
        + 添加一条
      </button>
      <button
        onClick={save}
        disabled={status.kind === "loading"}
        className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
      >
        {status.kind === "loading" ? "保存中…" : "保存 FAQ"}
      </button>
      <StatusBanner s={status} />
    </div>
  );
}

/* ---------------- 外壳 ---------------- */
const TABS: { k: Tab; label: string }[] = [
  { k: "news", label: "新闻 / News" },
  { k: "company", label: "公司信息" },
  { k: "content", label: "产品/案例/首页" },
  { k: "faq", label: "常见问题" },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("news");
  const [pw, setPw] = useState("");

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-sky-100 bg-white/80 p-6 shadow-sm backdrop-blur">
          <h1 className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-2xl font-bold text-transparent">
            GDY 内容后台 · CMS
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            无需改代码：公司信息、产品、案例、首页文案、新闻、常见问题均可在此直接更新并发布上线。
          </p>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              后台密码 <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="ADMIN_PASSWORD"
              className={inputCls}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            {TABS.map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  tab === t.k ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {tab === "news" && <NewsEditor pw={pw} />}
            {tab === "company" && <CompanyEditor pw={pw} />}
            {tab === "content" && <ContentEditor pw={pw} />}
            {tab === "faq" && <FaqEditor pw={pw} />}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          部署需在 Vercel 环境变量配置：ADMIN_PASSWORD、GITHUB_TOKEN、GITHUB_REPO。未配置 GitHub 时改动仅保存在开发机。
        </p>
      </div>
    </main>
  );
}
