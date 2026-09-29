import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// 站点已升级为带服务端的 Next.js（支持 /api/chat 大模型代理）。
// 部署目标：Vercel（密钥放环境变量，前端永不接触 API key）。
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
