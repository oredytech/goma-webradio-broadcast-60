// Supabase Edge Function: WordPress proxy to bypass CORS
// - list posts: POST body { type: 'list', perPage?: number }
// - single post: POST body { type: 'single', id: number }
// CORS: open to any origin (public content)

// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { type, perPage = 30, id } = await req.json().catch(() => ({}));

    const base = "https://gomawebradio.com/news/wp-json/wp/v2";
    let target = "";

    if (type === "list") {
      target = `${base}/posts?_embed&per_page=${encodeURIComponent(perPage)}`;
    } else if (type === "single" && typeof id === "number") {
      target = `${base}/posts/${id}?&_embed`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const wpResp = await fetch(target);
    if (!wpResp.ok) {
      const text = await wpResp.text();
      return new Response(JSON.stringify({ error: "Upstream error", status: wpResp.status, details: text }), {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const data = await wpResp.json();
    return new Response(JSON.stringify(data), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Unexpected error", details: String(e) }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
