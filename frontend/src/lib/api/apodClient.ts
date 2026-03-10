const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type ApodResponse = {
  date: string;
  title: string;
  explanation: string;
  media_type: string;
  url: string;
  hdurl?: string | null;
  copyright?: string | null;
};

export async function fetchApod(date?: string): Promise<ApodResponse> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const url = new URL("/v1/apod", API_URL);

  if (date) {
    url.searchParams.set("date", date);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const message = `Failed to fetch APOD (${response.status})`;
    throw new Error(message);
  }

  const data = (await response.json()) as ApodResponse;

  return data;
}

