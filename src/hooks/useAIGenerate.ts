import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type GenerationType =
  | "category_name"
  | "category_description"
  | "category_items"
  | "complete_category"
  | "blog_title"
  | "blog_content"
  | "blog_excerpt";

interface UseAIGenerateOptions {
  onSuccess?: (result: unknown) => void;
  onError?: (error: string) => void;
}

export function useAIGenerate(options?: UseAIGenerateOptions) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async (
    type: GenerationType,
    prompt: string,
    context?: Record<string, unknown>
  ) => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return null;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-generate", {
        body: { type, prompt, context },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      options?.onSuccess?.(data.result);
      return data.result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI generation failed";
      toast.error(message);
      options?.onError?.(message);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate, isGenerating };
}
