import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api/", "/signin", "/signup", "/forgot-password", "/reset-password", "/error"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
