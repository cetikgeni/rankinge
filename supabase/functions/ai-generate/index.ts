import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
Generate popular and relevant items for the given category.
Return ONLY a JSON array of 5 items, each with "name" and "description" fields.
Example: [{"name": "Item Name", "description": "Brief description of the item"}]`;
        userPrompt = `Suggest items for the category: "${prompt}"`;
        break;

      case "complete_category":
        systemPrompt = `You are an expert at creating complete voting categories.
Based on a single keyword or topic, generate a complete category with name, description, and items.
Return ONLY a valid JSON object with this exact structure:
{
  "name": "Category Name",
  "description": "Category description (2-3 sentences)",
  "items": [
    {"name": "Item 1", "description": "Description of item 1"},
    {"name": "Item 2", "description": "Description of item 2"},
    {"name": "Item 3", "description": "Description of item 3"},
    {"name": "Item 4", "description": "Description of item 4"},
    {"name": "Item 5", "description": "Description of item 5"}
  ]
}`;
        userPrompt = `Create a complete voting category for: "${prompt}"`;
        break;

      case "blog_title":
        systemPrompt = `You are an expert content writer specializing in creating engaging blog titles.
Generate 5 catchy and SEO-friendly blog title suggestions based on the topic.
Return ONLY a JSON array of 5 title suggestions, nothing else.`;
        break;

      case "blog_content":
        systemPrompt = `You are an expert content writer. Write engaging blog content in Markdown format.
Include proper headings (##, ###), paragraphs, and formatting.
Write approximately 300-500 words of high-quality content.
Return ONLY the markdown content, nothing else.`;
        userPrompt = `Write a blog post about: "${prompt}"${context ? `\n\nAdditional context: ${context}` : ""}`;
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
    if (["category_name", "category_items", "complete_category", "blog_title"].includes(type)) {
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
