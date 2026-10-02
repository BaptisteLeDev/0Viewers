import { searchCategories } from "@/decouverte";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2 || q.length > 100) return Response.json({ categories: [] }, { status: 400 });
  try {
    return Response.json({ categories: await searchCategories(q) });
  } catch (error) {
    console.error(error);
    return Response.json({ categories: [] }, { status: 502 });
  }
}
