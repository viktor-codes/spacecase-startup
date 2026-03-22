import type { Metadata } from "next";

import ConfigureUploadPageClient from "@/components/configure/ConfigureUploadPageClient";

export const metadata: Metadata = {
  title: "SpaceCase — Design Your Cosmic Phone Case",
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

