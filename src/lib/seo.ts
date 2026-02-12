import { Metadata } from "next";
import { APP_NAME, APP_DESCRIPTION, BASE_URL } from "./constants";

interface MetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description = APP_DESCRIPTION,
  path = "/",
  noIndex = false,
}: MetadataOptions = {}): Metadata {
  const fullTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} - Fast, Analytics-Powered URL Shortener`;

  return {
    title: fullTitle,
    description,
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
    alternates: {
      canonical: `${BASE_URL}${path}`,
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/icon`,
  };
}

export function buildWebApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: APP_NAME,
    url: BASE_URL,
    description: APP_DESCRIPTION,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
