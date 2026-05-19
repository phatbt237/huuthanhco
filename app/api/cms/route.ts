import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CmsContent } from "@/lib/cmsContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const cmsFilePath = path.join(process.cwd(), "data", "cmsContent.json");
const emptyContent: CmsContent = {
  news: [],
  projects: [],
  jobs: [],
};

async function readCmsContent(): Promise<CmsContent> {
  try {
    const raw = await readFile(cmsFilePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<CmsContent>;

    return {
      news: Array.isArray(parsed.news) ? parsed.news : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
    };
  } catch {
    return emptyContent;
  }
}

async function writeCmsContent(content: CmsContent) {
  await writeFile(cmsFilePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

export async function GET() {
  return Response.json(await readCmsContent());
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<CmsContent>;
  const content: CmsContent = {
    news: Array.isArray(body.news) ? body.news : [],
    projects: Array.isArray(body.projects) ? body.projects : [],
    jobs: Array.isArray(body.jobs) ? body.jobs : [],
  };

  await writeCmsContent(content);
  return Response.json(content);
}

export async function DELETE() {
  await writeCmsContent(emptyContent);
  return Response.json(emptyContent);
}
