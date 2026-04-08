import type { Metadata } from "next";

import ConfigureUploadPageClient from "@/components/configure/ConfigureUploadPageClient";

export const metadata: Metadata = {
  title: "CosmicCase — Design your phone case",
};

type PageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

export default async function ConfigureUploadPage({ searchParams }: PageProps) {
  const { date } = await searchParams;
  return <ConfigureUploadPageClient initialDate={date} />;
}
