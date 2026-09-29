// 服务端 AI 系统提示词（公司知识库）。
// 模型按用户使用的语言回复；不编造精确单价，给区间并引导留资 / 转人工。

export function buildSystemPrompt(): string {
  return `你是深圳市光大远薄膜有限公司（GDY）官方的 AI 业务助手（AI Business Assistant），专业服务于全球 PET 保护膜采购客户与合作伙伴。

你的职责是用公司知识库回答客户的各类业务问题，包括：
- 公司简介与核心实力（成立于 2004 年、产能、认证、出口等）
- 6 大产品线（硅胶 / 亚克力 / PU / 防静电 / 耐高温 / 高透 PET 保护膜）的用途与特性
- 可提供的服务（研发定制、来样定制、OEM/ODM、免费样品、东南亚快速交货、全球出口）
- 服务的行业（电子、汽车、新能源、建材、家电、五金）
- 如何咨询 / 启动一个合作项目（提供规格 → 免费样品测试 → 正式报价 → 批量生产）
- 报价与定制（在规则范围内引导，复杂情况转人工）

# 公司简介
- 名称：深圳市光大远薄膜有限公司（Shenzhen Guangdayuan Film Co., Ltd.），品牌缩写 GDY
- 成立于 2004 年，20+ 年专注 PET 保护膜研发制造
- 工厂：16,000 ㎡，十万级 + 千级无尘车间，3 条全自动涂布线，年产能 1.2 亿㎡，月产能 1,000 万㎡
- 认证：ISO 9001、ISO 14001、SGS 检测、RoHS、REACH、国家高新技术企业
- 出口 40+ 国家，支持 DDP / DDU 贸易条款
- 与哈尔滨工业大学（HIT）联合实验室；基材采用日本东丽(Toray)、东洋纺(Toyobo)

# 6 大产品线（PET 保护膜）
1. 硅胶 PET 保护膜：无残胶、低粘高洁净、耐温 −40~150°C；手机/平板屏幕、光学镜片、精密电子元器件
2. 亚克力 PET 保护膜：粘着力 5–1500 g/in、透光率 ≥91%；金属板材、塑料件、玻璃表面运输保护
3. PU 胶 PET 保护膜：超洁净贴合、千级无尘室生产、零残胶；光学膜、显示面板、半导体精密组件
4. 防静电 PET 保护膜：表面电阻 10⁸–10¹¹ Ω、防静电持续 ≥12 个月；电子元器件、PCB/FPC、半导体封装
5. 耐高温 PET 保护膜：耐温 200°C+、喷涂/电镀不脱落；汽车喷涂遮蔽、电镀保护、高温工艺
6. 高透 PET 保护膜：透光率 ≥95%、光学级平整度；光学镜头、触摸屏、高光面产品

# 可定制参数
- 厚度：25–300 μm
- 幅宽：最大 1,600 mm
- 粘着力：1–1500 g/in（按需调配）
- 长度：不限，按客户卷径要求
- 特殊功能：防静电 / 抗UV / 耐高温 / 阻燃

# 服务的行业
电子/消费电子、汽车、新能源（太阳能板/锂电池/EV）、建材（铝型材/不锈钢/玻璃/石材）、家电、五金

# 服务能力
- 研发定制（哈工大联合实验室，按应用场景定制配方：粘着力/耐温/防静电等）
- 进口原料（Toray、Toyobo，不黄变、不脆化）
- 来样定制（免费样品测试，确认规格后批量生产）
- OEM/ODM（贴牌定制、专属规格开发）
- 东南亚快速交货（越南/泰国/印尼/马来/菲律宾常规物流通道，标准品 7 天发货）
- 全球出口（已出口 40+ 国家，支持 DDP/DDU）

# 报价与应答规则（非常重要）
1. 不要编造精确的单价数字。可给“参考区间”，并明确说明最终价格取决于规格、数量、贸易条款，需正式报价单确认。
2. 主动引导客户提供必要信息：产品类型、厚度、幅宽、粘着力、颜色/功能、数量、目标国家、贸易条款（FOB/CIF/DDP）。
3. 主动建议：可先提供免费样品测试，确认规格后再批量生产。
4. 起订量（MOQ）通常按规格定制，建议客户告知具体需求，由工程师确认。
5. 语气简洁、专业、友好。若客户使用某种语言，请用该语言回复。

# 转人工规则（非常重要）
当遇到以下情况，必须明确告诉客户：可点击聊天窗口中的“转人工客服”按钮，通过 WhatsApp 或微信联系我们的销售团队：
- 需要正式报价单 / 合同
- 复杂定制或特殊规格
- 要下单、谈付款/账期、要发票
- 涉及价格谈判
- 你不确定或无法准确回答的问题
人工客服联系方式：WhatsApp +86 181 1877 6356；微信客服二维码在聊天窗口中可查看。

# 身份约束
你是 GDY 的 AI 助手，不是其他公司。不知道的信息诚实说明，并引导转人工。`;
}

// ---------- AI 写稿（后台一键发文用） ----------

export const NEWS_LOCALES = ["en", "zh", "vi", "th", "id", "ms", "ar"] as const;
export type NewsLocale = (typeof NEWS_LOCALES)[number];

export const NEWS_COVERS = [
  "/images/facility-line.jpg",
  "/images/facility-film.jpg",
  "/images/hero-factory.jpg",
  "/images/app-building.jpg",
  "/images/app-electronics.jpg",
  "/images/app-home.jpg",
  "/images/prod-silicone.jpg",
  "/images/prod-acrylic.jpg",
  "/images/prod-pu.jpg",
  "/images/prod-antistatic.jpg",
  "/images/prod-hightemp.jpg",
  "/images/prod-clear.jpg",
] as const;

export interface GeneratedNews {
  slug: string;
  category: "company" | "industry";
  cover: string;
  source: string;
  title: Record<NewsLocale, string>;
  excerpt: Record<NewsLocale, string>;
  body: Record<NewsLocale, string[]>;
}

// 调用大模型生成一篇 7 语言新闻稿（结构化 JSON）。无 key / 上游错误时抛错。
export async function generateNewsArticle(
  topic: string,
  category: "company" | "industry"
): Promise<GeneratedNews> {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    throw new Error("LLM_API_KEY 未配置，无法生成文章。");
  }
  const baseUrl = (process.env.LLM_BASE_URL || "https://api.deepseek.com/v1").replace(
    /\/$/,
    ""
  );
  const model = process.env.LLM_MODEL || "deepseek-chat";

  const coverList = NEWS_COVERS.map((c) => `- ${c}`).join("\n");
  const system = `你是深圳市光大远薄膜有限公司（GDY）的内容编辑，负责撰写官网「新闻动态」栏目的多语言稿件。

# 公司背景（务必基于真实信息，不要编造未提供的测试数据 / 精确价格）
- GDY：2004 年成立，16,000㎡ 工厂，3 条全自动涂布线，年产能 1.6 亿㎡，出口 40+ 国家
- 认证：ISO 9001 / 14001、SGS、RoHS、REACH、国家高新技术企业；与哈工大联合实验室
- 6 大产品线：硅胶 / 亚克力 / PU / 防静电 / 耐高温 / 高透 PET 保护膜
- 可定制：厚度 25–300μm、幅宽最大 1600mm、粘着力 1–1500 g/in
- 服务行业：电子、汽车、新能源、建材、家电、五金；东南亚标准品 7 天发货

# 任务
围绕主题写一篇专业、简洁、面向 B2B 买家的新闻稿，语气自信、可信。
可用的封面图（必须从下面挑一个真实存在的路径）：
${coverList}

# 输出要求（严格返回 JSON，不要多余文字）
{
  "slug": "英文小写短横线 slug，全局唯一，如 new-coating-line",
  "category": "${category}",
  "cover": "从封面图列表选一个最贴切的路径",
  "source": "如有引用来源填 URL，没有则留空字符串",
  "title": { "en":"","zh":"","vi":"","th":"","id":"","ms":"","ar":"" },
  "excerpt": { "en":"","zh":"","vi":"","th":"","id":"","ms":"","ar":"" },
  "body": { "en":["段落1","段落2","段落3"], "zh":[...], "vi":[...], "th":[...], "id":[...], "ms":[...], "ar":[...] }
}
- 每种语言 3–5 个正文段落，信息一致、本地化自然（越南语带正确声调、阿拉伯语 RTL 正常）。
- 标题 ≤ 90 字符，摘要 ≤ 160 字符，要抓眼球但不夸张。
- slug 只含小写字母、数字和短横线。`;

  const upstream = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: `请基于以上背景，写一篇关于「${topic}」的新闻稿。` },
      ],
      temperature: 0.5,
      response_format: { type: "json_object" },
    }),
  });

  if (!upstream.ok) {
    let detail = "";
    try {
      const err = await upstream.json();
      detail = err?.error?.message || "";
    } catch {
      /* ignore */
    }
    throw new Error(
      `DeepSeek 调用失败（${upstream.status}）：${detail || upstream.statusText}`
    );
  }

  const data = await upstream.json();
  const content: string = data?.choices?.[0]?.message?.content || "";
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("AI 返回内容不是合法 JSON，请重试。");
  }
  return normalizeGeneratedNews(parsed, category);
}

// 校验 + 规整 AI 输出，确保 7 语言齐全、字段合法，避免脏数据写入仓库。
function normalizeGeneratedNews(raw: any, category: "company" | "industry"): GeneratedNews {
  const locales = NEWS_LOCALES;
  const title: any = {};
  const excerpt: any = {};
  const body: any = {};
  for (const l of locales) {
    const lt = raw?.title?.[l];
    const le = raw?.excerpt?.[l];
    const lb = raw?.body?.[l];
    title[l] = typeof lt === "string" && lt.trim() ? lt.trim() : (raw?.title?.en ?? "");
    excerpt[l] = typeof le === "string" && le.trim() ? le.trim() : (raw?.excerpt?.en ?? "");
    body[l] = Array.isArray(lb)
      ? lb.filter((p: any) => typeof p === "string" && p.trim()).map((p: string) => p.trim())
      : [];
    if (body[l].length === 0 && Array.isArray(raw?.body?.en)) {
      body[l] = raw.body.en.filter((p: any) => typeof p === "string");
    }
  }
  let slug =
    typeof raw?.slug === "string" && raw.slug.trim()
      ? raw.slug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      : `post-${Date.now()}`;
  const coverOk = (NEWS_COVERS as readonly string[]).includes(raw?.cover);
  const cover = coverOk ? raw.cover : NEWS_COVERS[0];
  return {
    slug,
    category: category === "industry" ? "industry" : "company",
    cover,
    source: typeof raw?.source === "string" ? raw.source : "",
    title,
    excerpt,
    body,
  };
}

// 无 API key 时的本地降级应答（基于关键词，保证 UI 可用、不报错）。
export function localReply(userText: string): string {
  const t = (userText || "").toLowerCase();
  if (/(price|quote|cost|报价|价格|多少钱|how much|rate)/.test(t)) {
    return "关于报价：我们的 PET 保护膜支持全参数定制（厚度 25–300μm、幅宽最大 1600mm、粘着力 1–1500 g/in）。最终单价取决于规格、数量与贸易条款，需要正式报价单确认。\n\n为快速报价，请告诉我：产品类型、厚度、幅宽、粘着力、数量与目标国家。也可点击「转人工客服」通过 WhatsApp / 微信联系我们的销售团队获取正式报价。";
  }
  if (/(moq|起订|minimum order|最小订单)/.test(t)) {
    return "起订量（MOQ）通常按具体规格定制确认。欢迎告知您的产品类型与预估用量，我们的工程师会为您确认可行的最小起订量，并建议先寄免费样品测试。需要正式确认请点击「转人工客服」。";
  }
  if (/(sample|样品|免费样|免费样品)/.test(t)) {
    return "我们提供免费样品测试：您提供目标规格（类型、厚度、幅宽、粘着力等），确认后我们寄出样品，测试通过再批量生产。请点击「转人工客服」留下收货信息，或通过 WhatsApp 联系我们安排寄样。";
  }
  if (/(industr|行业|application|应用|电子|汽车|新能源|建材|家电)/.test(t)) {
    return "我们服务的六大行业包括：电子/消费电子、汽车、新能源（太阳能板/锂电池/EV）、建材（铝型材/不锈钢/玻璃/石材）、家电、五金。六大产品线的核心特性可参考网站「产品」页面。更具体的选型建议，请点击「转人工客服」联系工程师。";
  }
  if (/(cert|认证|iso|rohs|reach|sgs)/.test(t)) {
    return "我们已通过 ISO 9001、ISO 14001 质量管理体系，产品通过 SGS 检测，符合 RoHS、REACH，并获评国家高新技术企业。可提供相关证书文件，请点击「转人工客服」索取。";
  }
  return "您好，我是 GDY 的 AI 业务助手。我可以为您介绍公司简介、PET 保护膜产品线（硅胶/亚克力/PU/防静电/耐高温/高透）、服务能力、行业应用与报价。\n\n当前为离线演示模式（未配置大模型密钥），仅能基础应答。如需正式报价、复杂定制或样品，请点击「转人工客服」通过 WhatsApp / 微信联系我们的销售团队。";
}
