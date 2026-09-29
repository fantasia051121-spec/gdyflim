// 公司专有信息（非文案数据）。文案翻译统一放在 src/messages/*.json。
// 公司/联系/社媒/微信数据已抽到 content/company.json，由后台可直接编辑并提交上线。
import companyData from "../../content/company.json";

export const site = companyData as {
  company: {
    name: string;
    nameZh: string;
    shortName: string;
    established: number;
    tagline: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    website: string;
  };
  social: {
    email: string;
    whatsapp: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
    madeInChina: string;
    platform1688: string;
  };
  wechat: {
    id: string;
    qr: string;
  };
};

// 6 大产品线配图（public/images）
export const productImages = [
  "/images/prod-silicone.jpg",
  "/images/prod-acrylic.jpg",
  "/images/prod-pu.jpg",
  "/images/prod-antistatic.jpg",
  "/images/prod-hightemp.jpg",
  "/images/prod-clear.jpg",
];

// 6 大行业配图（前 3 个有实拍图）
export const industryImages = [
  "/images/app-electronics.jpg",
  "/images/app-home.jpg",
  "/images/app-building.jpg",
  undefined,
  undefined,
  undefined,
];
