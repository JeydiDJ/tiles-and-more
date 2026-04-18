import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const siteUrl = new URL(siteConfig.url);
export const defaultOgImagePath = "/opengraph-image";

type PageMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function createPageMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  keywords = [],
  image = defaultOgImagePath,
  type = "website",
  noIndex = false,
}: PageMetadataInput = {}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      url,
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description,
      siteName: siteConfig.name,
      locale: "en_PH",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} preview image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
