import type { Metadata } from "next";

import ConfigureUploadPageClient from "@/components/configure/ConfigureUploadPageClient";

export const metadata: Metadata = {
  title: "SpaceCase — конструктор космического чехла",
};

type PageProps = {
  searchParams: {
    date?: string;
  };
};

export default function ConfigureUploadPage({ searchParams }: PageProps) {
  return <ConfigureUploadPageClient initialDate={searchParams.date} />;
}

