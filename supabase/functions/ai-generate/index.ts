import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify JWT and get user claims
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error("Auth error:", claimsError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID not found in token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user has admin role (required for all AI generation)
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) {
      console.error("Role check error:", roleError);
      return new Response(
        JSON.stringify({ error: "Failed to verify permissions" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`AI generation request from admin user: ${userId}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { type, prompt, context } = await req.json();

    let systemPrompt = "";
    let userPrompt = prompt;

    switch (type) {
      case "category_name":
        systemPrompt = `You are an expert at creating engaging category names for voting platforms. 
Generate creative and catchy category names based on the topic provided. 
Return ONLY a JSON array of 5 category name suggestions, nothing else.
Example: ["Best Breakfast Cereals", "Top Gaming Laptops", "Ultimate Running Shoes"]`;
        break;

      case "category_description":
        systemPrompt = `You are an expert at writing compelling category descriptions for voting platforms.
Write a concise but engaging description (2-3 sentences max) for the category.
Return ONLY the description text, nothing else.`;
        userPrompt = `Write a description for the category: "${prompt}"`;
        break;

      case "category_items":
        systemPrompt = `You are an expert at suggesting items for voting categories.
Return ONLY a JSON array of items with this structure:
[{"name":"Item Name","description":"Brief description","image_keywords":["k1","k2"],"affiliate_query":"optional search query"}]
Rules:
- Do NOT include image URLs.
- image_keywords MUST be generic and non-branded.
- affiliate_query (if present) should be a generic search phrase, not a brand.`;
        userPrompt = `Suggest items for the category: "${prompt}"`;
        break;

      case "complete_category":
        systemPrompt = `You are an expert at creating complete voting categories.
Return ONLY a valid JSON object with this exact structure:
{
  "name": "Category Name",
  "description": "Category description (2-3 sentences)",
  "image_keywords": ["keyword1", "keyword2", "keyword3"],
  "items": [
    {"name": "Item 1", "description": "Description", "image_keywords": ["k1","k2"], "affiliate_query": "optional search query"}
  ]
}
Rules:
- Do NOT include image URLs.
- image_keywords MUST be generic and non-branded.
- items length should be 5-10 when asked.`;
        userPrompt = `Create a complete voting category for: "${prompt}"`;
        break;

      case "blog_title":
        systemPrompt = `You are an expert content writer specializing in creating engaging blog titles.
Generate 5 catchy and SEO-friendly blog title suggestions based on the topic.
Return ONLY a JSON array of 5 title suggestions, nothing else.`;
        break;

      case "blog_content":
        systemPrompt = `You are an expert SEO content writer.
Return ONLY valid JSON with this exact structure (no markdown fences):
{
  "title": "English title",
  "title_id": "Indonesian title or null",
  "content": "Markdown content (English)",
  "content_id": "Markdown content (Indonesian) or null",
  "excerpt": "English excerpt under 160 chars",
  "excerpt_id": "Indonesian excerpt under 160 chars or null",
  "meta_title": "SEO meta title under 60 chars (English)",
  "meta_description": "SEO meta description under 160 chars (English)",
  "image_keywords": ["keyword1", "keyword2", "keyword3"]
}
Rules:
- Keep content ~300-500 words.
- If the request language is English only, set *_id fields to null.
- Do NOT include any image URLs. Only image_keywords.`;
        userPrompt = `Write a blog post about: "${prompt}"${context ? `\n\nAdditional context: ${JSON.stringify(context)}` : ""}`;
        break;

      case "blog_excerpt":
        systemPrompt = `You are an expert at writing compelling blog excerpts/summaries.
Write a concise, engaging excerpt (1-2 sentences max, under 160 characters).
Return ONLY the excerpt text, nothing else.`;
        userPrompt = `Write an excerpt for this blog post:\n\nTitle: ${context?.title || ""}\n\nContent preview: ${prompt?.substring(0, 500)}`;
        break;

      default:
        throw new Error("Invalid generation type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    // Try to parse as JSON if expected
    let result = content;
    if (["category_name", "category_items", "complete_category", "blog_title", "blog_content"].includes(type)) {
      try {
        // Extract JSON from the response (handle markdown code blocks)
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
        result = JSON.parse(jsonMatch[1].trim());
      } catch (e) {
        console.error("JSON parse error:", e, "Content:", content);
        // Return raw content if JSON parsing fails
        result = content;
      }
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
