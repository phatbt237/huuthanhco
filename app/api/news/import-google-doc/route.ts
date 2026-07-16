const GOOGLE_DOC_PATTERN = /^https:\/\/docs\.google\.com\/document\/d\/([A-Za-z0-9_-]+)(?:\/|$)/;
const MAX_DOCX_SIZE = 20 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: unknown };
    const url = typeof body.url === "string" ? body.url.trim() : "";
    const match = url.match(GOOGLE_DOC_PATTERN);
    if (!match) return Response.json({ error: "Link Google Docs không hợp lệ." }, { status: 400 });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const exportUrl = `https://docs.google.com/document/d/${match[1]}/export?format=docx`;
      const response = await fetch(exportUrl, { cache: "no-store", redirect: "follow", signal: controller.signal });
      if (!response.ok) {
        return Response.json(
          { error: "Không tải được tài liệu. Hãy bật quyền 'Bất kỳ ai có liên kết đều có thể xem'." },
          { status: response.status === 404 ? 404 : 502 },
        );
      }
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength > MAX_DOCX_SIZE) return Response.json({ error: "Tài liệu vượt quá 20 MB." }, { status: 413 });
      if (bytes.byteLength < 100 || response.headers.get("content-type")?.includes("text/html")) {
        return Response.json({ error: "Google Docs chưa được chia sẻ công khai hoặc không thể export DOCX." }, { status: 422 });
      }
      return new Response(bytes, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": 'attachment; filename="google-doc.docx"',
          "Cache-Control": "no-store",
        },
      });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    const message = error instanceof Error && error.name === "AbortError" ? "Google Docs phản hồi quá lâu." : "Không thể xử lý link Google Docs.";
    return Response.json({ error: message }, { status: 400 });
  }
}
