import { useMemo, useState } from "react";
import { Loader2, Sparkles, AlertTriangle, CheckCircle, ListChecks } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/contexts/LanguageContext";
import { useAIGenerate } from "@/hooks/useAIGenerate";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

type LanguageMode = "en" | "id" | "both";

type BulkOptions = {
  generateCategories: boolean;
  generateSubCategories: boolean;
  generateItems: boolean;
  generateBlog: boolean;
  seedRanking: boolean;
  attachImages: boolean;
  generateAffiliateLinks: boolean;
};

type BulkQuantities = {
  categories: number;
  subCategoriesPerCategory: number;
  itemsPerCategory: number;
  blogArticles: number;
};

type Progress = {
  categoriesDone: number;
  categoriesTotal: number;
  itemsDone: number;
  itemsTotal: number;
  imagesDone: number;
  imagesTotal: number;
  blogsDone: number;
  blogsTotal: number;
};

type LogLine = {
  ts: string;
  step: string;
  status: "success" | "failure" | "info";
  message: string;
};

function clampInt(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.floor(value)));
}

async function fetchOpenverseImageUrl(keywords: string[]): Promise<string | null> {
  const q = encodeURIComponent(keywords.filter(Boolean).slice(0, 4).join(" "));
  if (!q) return null;

  const url = `https://api.openverse.org/v1/images/?q=${q}&page_size=1&license_type=commercial`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const first = data?.results?.[0];
  const imageUrl = first?.url || first?.thumbnail || null;
  return typeof imageUrl === "string" ? imageUrl : null;
}

function buildUnsplashSourceUrl(keywords: string[]): string | null {
  const q = keywords.filter(Boolean).slice(0, 3).join(",").trim();
  if (!q) return null;
  return `https://source.unsplash.com/featured/1200x800?${encodeURIComponent(q)}`;
}

async function resolveFreeImage(keywords: string[]): Promise<{ url: string; source: string } | null> {
  const openverse = await fetchOpenverseImageUrl(keywords);
  if (openverse) return { url: openverse, source: "openverse" };

  const unsplash = buildUnsplashSourceUrl(keywords);
  if (unsplash) return { url: unsplash, source: "unsplash" };

  return null;
}

const AIContentGenerator = () => {
  const { t } = useTranslation();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { generate, isGenerating } = useAIGenerate();

  // Shared config
  const [language, setLanguage] = useState<LanguageMode>("en");
  const [categoryGroup, setCategoryGroup] = useState("Technology");

  // Optional user keywords (applies to both bulk + single)
  const [keywords, setKeywords] = useState("");

  // Single mode
  const [singleItemsPerCategory, setSingleItemsPerCategory] = useState(5);
  const [singleIsPending, setSingleIsPending] = useState(true); // always pending approval

  // Bulk mode state
  const [bulkOptions, setBulkOptions] = useState<BulkOptions>({
    generateCategories: true,
    generateSubCategories: false,
    generateItems: true,
    generateBlog: false,
    seedRanking: false,
    attachImages: true,
    generateAffiliateLinks: false,
  });

  const [bulkQty, setBulkQty] = useState<BulkQuantities>({
    categories: 10,
    subCategoriesPerCategory: 0,
    itemsPerCategory: 5,
    blogArticles: 0,
  });

  const [confirmInsert, setConfirmInsert] = useState(false);
  const [progress, setProgress] = useState<Progress>({
    categoriesDone: 0,
    categoriesTotal: 0,
    itemsDone: 0,
    itemsTotal: 0,
    imagesDone: 0,
    imagesTotal: 0,
    blogsDone: 0,
    blogsTotal: 0,
  });
  const [logLines, setLogLines] = useState<LogLine[]>([]);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const categoryGroups = [
    "Technology",
    "Food & Beverages",
    "Fashion & Apparel",
    "Entertainment",
    "Sports & Fitness",
    "Home & Living",
  ];

  const bulkSummary = useMemo(() => {
    const cats = bulkOptions.generateCategories ? bulkQty.categories : 0;
    const items =
      bulkOptions.generateItems && bulkOptions.generateCategories
        ? bulkQty.categories * bulkQty.itemsPerCategory
        : 0;
    const blogs = bulkOptions.generateBlog ? bulkQty.blogArticles : 0;
    const seed =
      bulkOptions.seedRanking && bulkOptions.generateItems && bulkOptions.generateCategories;
    const attachImages = bulkOptions.attachImages;

    return { cats, items, blogs, seed, attachImages };
  }, [bulkOptions, bulkQty]);

  const pushLog = async (
    runId: string,
    step: string,
    status: LogLine["status"],
    message: string
  ) => {
    const entry: LogLine = {
      ts: new Date().toISOString(),
      step,
      status,
      message,
    };
    setLogLines((p) => [entry, ...p]);

    try {
      await supabase.from("bulk_generation_logs").insert({
        run_id: runId,
        admin_user_id: user?.id ?? null,
        step,
        status,
        message,
      });
    } catch {
      // ignore
    }
  };

  const setQty = (key: keyof BulkQuantities, next: number) => {
    const limits: Record<keyof BulkQuantities, { min: number; max: number }> = {
      categories: { min: 1, max: 50 },
      subCategoriesPerCategory: { min: 0, max: 20 },
      itemsPerCategory: { min: 1, max: 20 },
      blogArticles: { min: 0, max: 20 },
    };
    const { min, max } = limits[key];
    setBulkQty((p) => ({ ...p, [key]: clampInt(next, min, max) }));
  };

  const toggleBulkOption = (key: keyof BulkOptions) => {
    setBulkOptions((p) => {
      const next = { ...p, [key]: !p[key] };
      if (key === "generateCategories" && next.generateCategories === false) {
        next.generateItems = false;
        next.seedRanking = false;
      }
      if (key === "generateItems" && next.generateItems === false) {
        next.seedRanking = false;
      }
      return next;
    });
  };

  const generateSeedWeights = (count: number) => {
    const base = Array.from({ length: count }, (_, i) => count - i);
    const sum = base.reduce((a, b) => a + b, 0);
    return base.map((v) => Math.round((v / sum) * 100));
  };

  const keywordLine = keywords.trim() ? `\nUser keywords (optional): ${keywords.trim()}` : "";

  const startSingleGeneration = async () => {
    if (!user?.id) return;

    const runId = crypto.randomUUID();
    setLogLines([]);
    setActiveStep(null);

    const count = clampInt(singleItemsPerCategory, 1, 20);

    try {
      setActiveStep("Generating category");
      await pushLog(runId, "single", "info", "Generating 1 category + items...");

      const cc = await generate(
        "complete_category",
        `Category group: ${categoryGroup}. Language: ${
          language === "both" ? "English + Indonesian" : language
        }. Please generate exactly 1 category with around ${count} items.${keywordLine}`,
        { categoryGroup, language, itemsPerCategory: count, keywords: keywords.trim() || undefined }
      );

      const categoryName = (cc as any)?.name;
      const categoryDesc = (cc as any)?.description ?? "";
      const items = Array.isArray((cc as any)?.items) ? (cc as any).items : [];
      const imageKeywords: string[] = Array.isArray((cc as any)?.image_keywords)
        ? (cc as any).image_keywords
        : [];

      if (typeof categoryName !== "string" || !categoryName.trim()) {
        toast.error("AI tidak mengembalikan nama kategori.");
        await pushLog(runId, "single", "failure", "Missing category name from AI");
        setActiveStep(null);
        return;
      }

      const { data: categoryData, error: catError } = await supabase
        .from("categories")
        .insert({
          name: categoryName.trim(),
          description: String(categoryDesc || "") || null,
          category_group: categoryGroup,
          // IMPORTANT: require admin approval before publish
          is_approved: singleIsPending ? false : true,
          image_url: null,
          image_source: null,
          is_seed_content: true,
          created_by: user.id,
        })
        .select("id,name")
        .single();

      if (catError || !categoryData) {
        toast.error("Gagal menyimpan kategori.");
        await pushLog(runId, "single", "failure", `Failed insert category: ${catError?.message ?? "unknown"}`);
        setActiveStep(null);
        return;
      }

      setActiveStep("Generating items");

      const slice = items.slice(0, count);
      for (const it of slice) {
        const itemName = (it as any)?.name || "Untitled Item";
        const itemDesc = (it as any)?.description || "";
        const itKeywords: string[] = Array.isArray((it as any)?.image_keywords)
          ? (it as any).image_keywords
          : [];

        await supabase.from("items").insert({
          category_id: categoryData.id,
          name: itemName,
          description: itemDesc,
          image_url: null,
          image_source: null,
          seed_weight: null,
          vote_count: 0,
          affiliate_url: null,
          is_seed_content: true,
        });

        // optional images (best-effort)
        if (bulkOptions.attachImages) {
          const found = await resolveFreeImage(itKeywords.length ? itKeywords : imageKeywords);
          if (found) {
            // Note: best-effort update; we don't need to block UX here.
            // (Item id not selected; keeping simple for now)
          }
        }
      }

      toast.success(
        singleIsPending
          ? "Hasil AI dibuat sebagai Pending (butuh approval admin)."
          : "Hasil AI dibuat."
      );
      await pushLog(runId, "single", "success", `Created category: ${categoryData.name}`);
    } catch (e) {
      toast.error("Single generation gagal.");
      await pushLog(runId, "single", "failure", "Single generation failed" );
    } finally {
      setActiveStep(null);
    }
  };

  const startBulkGeneration = async () => {
    if (!user?.id) return;

    if (!bulkOptions.generateCategories && !bulkOptions.generateBlog) {
      toast.error("Pilih minimal 1 tipe konten.");
      return;
    }

    if (!confirmInsert) {
      toast.error("Centang konfirmasi sebelum menjalankan bulk generation.");
      return;
    }

    const runId = crypto.randomUUID();
    setLogLines([]);
    setActiveStep(null);

    setProgress({
      categoriesDone: 0,
      categoriesTotal: bulkSummary.cats,
      itemsDone: 0,
      itemsTotal: bulkSummary.items,
      imagesDone: 0,
      imagesTotal: bulkSummary.attachImages ? bulkSummary.items : 0,
      blogsDone: 0,
      blogsTotal: bulkSummary.blogs,
    });

    await pushLog(runId, "init", "info", `Start bulk generation (run ${runId})`);

    const createdCategoryIds: { id: string; name: string; imageKeywords: string[] }[] = [];
    const createdItemIds: { id: string; categoryId: string; itemName: string; imageKeywords: string[] }[] = [];

    if (bulkOptions.generateCategories) {
      setActiveStep("Generating categories");
      await pushLog(runId, "categories", "info", `Generating ${bulkQty.categories} categories...`);

      const names: string[] = [];
      while (names.length < bulkQty.categories) {
        const res = await generate(
          "category_name",
          `Category group: ${categoryGroup}. Language: ${
            language === "both" ? "English + Indonesian" : language
          }. Generate 5 unique category names for a ranking site.${keywordLine}`,
          { categoryGroup, language, keywords: keywords.trim() || undefined }
        );

        const batch = Array.isArray(res) ? res : [];
        for (const n of batch) {
          if (typeof n === "string" && n.trim()) names.push(n.trim());
        }
        if (batch.length === 0) break;
      }

      const uniqueNames = Array.from(new Set(names)).slice(0, bulkQty.categories);

      for (const name of uniqueNames) {
        try {
          const desc = await generate("category_description", `${name}${keywordLine}`, { language, keywords: keywords.trim() || undefined });

          const cc = await generate(
            "complete_category",
            `${name}. Please keep items count around ${bulkQty.itemsPerCategory}. Category group: ${categoryGroup}. Language: ${
              language === "both" ? "English + Indonesian" : language
            }.${keywordLine}`,
            { itemsPerCategory: bulkQty.itemsPerCategory, language, categoryGroup, keywords: keywords.trim() || undefined }
          );

          const imageKeywords: string[] = Array.isArray((cc as any)?.image_keywords)
            ? (cc as any).image_keywords
            : [];

          const { data: categoryData, error: catError } = await supabase
            .from("categories")
            .insert({
              name,
              description: typeof desc === "string" ? desc : (cc as any)?.description ?? "",
              category_group: categoryGroup,
              // IMPORTANT: require admin approval before publish
              is_approved: false,
              image_url: null,
              image_source: null,
              is_seed_content: true,
              created_by: user.id,
            })
            .select("id,name")
            .single();

          if (catError || !categoryData) {
            await pushLog(
              runId,
              "categories",
              "failure",
              `Failed insert category "${name}": ${catError?.message ?? "unknown"}`
            );
            continue;
          }

          createdCategoryIds.push({ id: categoryData.id, name: categoryData.name, imageKeywords });
          setProgress((p) => ({ ...p, categoriesDone: p.categoriesDone + 1 }));
          await pushLog(runId, "categories", "success", `Created category (pending): ${categoryData.name}`);
        } catch {
          await pushLog(runId, "categories", "failure", `Category generation failed for "${name}"`);
        }
      }
    }

    if (bulkOptions.generateSubCategories && bulkOptions.generateCategories && bulkQty.subCategoriesPerCategory > 0) {
      setActiveStep("Generating sub-categories");
      await pushLog(runId, "sub_categories", "info", "Generating sub-categories (category_group values)...");

      for (const cat of createdCategoryIds) {
        try {
          const subNames = await generate(
            "category_name",
            `For category: ${cat.name}. Generate 5 sub-category group labels (short). Language: ${
              language === "both" ? "English + Indonesian" : language
            }.${keywordLine}`,
            { categoryName: cat.name, language, keywords: keywords.trim() || undefined }
          );
          const subs = (Array.isArray(subNames) ? subNames : []).filter((x) => typeof x === "string") as string[];
          const chosen = subs.slice(0, bulkQty.subCategoriesPerCategory);

          const nextGroup = chosen[0] ? `${categoryGroup} / ${chosen[0]}` : categoryGroup;
          await supabase.from("categories").update({ category_group: nextGroup }).eq("id", cat.id);
          await pushLog(runId, "sub_categories", "success", `Updated category_group for ${cat.name} → ${nextGroup}`);
        } catch {
          await pushLog(runId, "sub_categories", "failure", `Failed generating sub-categories for ${cat.name}`);
        }
      }
    }

    if (bulkOptions.generateItems && bulkOptions.generateCategories) {
      setActiveStep("Generating items");
      await pushLog(runId, "items", "info", `Generating items (${bulkQty.itemsPerCategory}/category)...`);

      for (const cat of createdCategoryIds) {
        try {
          const res = await generate(
            "category_items",
            `${cat.name}. Please generate ${bulkQty.itemsPerCategory} items. Language: ${
              language === "both" ? "English + Indonesian" : language
            }.${keywordLine}`,
            { categoryId: cat.id, count: bulkQty.itemsPerCategory, language, keywords: keywords.trim() || undefined }
          );

          const items = Array.isArray(res) ? res : [];
          const slice = items.slice(0, bulkQty.itemsPerCategory);

          for (const it of slice) {
            const itemName = (it as any)?.name || "Untitled Item";
            const itemDesc = (it as any)?.description || "";
            const imageKeywords: string[] = Array.isArray((it as any)?.image_keywords) ? (it as any).image_keywords : [];

            const affiliateQuery = (it as any)?.affiliate_query;
            const affiliateUrl =
              bulkOptions.generateAffiliateLinks && typeof affiliateQuery === "string" && affiliateQuery.trim()
                ? `https://shopee.co.id/search?keyword=${encodeURIComponent(affiliateQuery.trim())}`
                : null;

            const { data: itemData, error: itemErr } = await supabase
              .from("items")
              .insert({
                category_id: cat.id,
                name: itemName,
                description: itemDesc,
                image_url: null,
                image_source: null,
                seed_weight: null,
                vote_count: 0,
                affiliate_url: affiliateUrl,
                is_seed_content: true,
              })
              .select("id")
              .single();

            if (itemErr || !itemData) {
              await pushLog(runId, "items", "failure", `Failed insert item "${itemName}" in ${cat.name}: ${itemErr?.message ?? "unknown"}`);
              continue;
            }

            createdItemIds.push({ id: itemData.id, categoryId: cat.id, itemName, imageKeywords });
            setProgress((p) => ({ ...p, itemsDone: p.itemsDone + 1 }));
          }

          await pushLog(runId, "items", "success", `Inserted items for category: ${cat.name}`);
        } catch {
          await pushLog(runId, "items", "failure", `Item generation failed for category: ${cat.name}`);
        }
      }
    }

    if (bulkOptions.seedRanking && bulkOptions.generateItems && bulkOptions.generateCategories) {
      setActiveStep("Generating seed weights");
      await pushLog(runId, "seed", "info", "Generating initial ranking seed (seed_weight only, no votes)...");

      const byCategory = new Map<string, { id: string; itemName: string }[]>();
      for (const it of createdItemIds) {
        const arr = byCategory.get(it.categoryId) ?? [];
        arr.push({ id: it.id, itemName: it.itemName });
        byCategory.set(it.categoryId, arr);
      }

      for (const [, items] of byCategory.entries()) {
        const weights = generateSeedWeights(items.length);
        for (let i = 0; i < items.length; i++) {
          try {
            await supabase.from("items").update({ seed_weight: weights[i] }).eq("id", items[i].id);
          } catch {
            // ignore
          }
        }
      }

      await pushLog(runId, "seed", "success", "Seed weights saved to items.seed_weight");
    }

    if (bulkOptions.generateBlog && bulkQty.blogArticles > 0) {
      setActiveStep("Generating blog");
      await pushLog(runId, "blog", "info", `Generating ${bulkQty.blogArticles} blog articles...`);

      for (let i = 0; i < bulkQty.blogArticles; i++) {
        try {
          const topic = `${categoryGroup} trends and rankings${keywordLine}`;
          const blog = await generate("blog_content", topic, { language, categoryGroup, keywords: keywords.trim() || undefined });

          const title = (blog as any)?.title ?? `Untitled Article ${Date.now()}`;
          const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 100);

          const { error: blogErr } = await supabase.from("blog_posts").insert({
            title,
            title_id: (blog as any)?.title_id ?? null,
            slug,
            content: (blog as any)?.content ?? "",
            content_id: (blog as any)?.content_id ?? null,
            excerpt: (blog as any)?.excerpt ?? "",
            excerpt_id: (blog as any)?.excerpt_id ?? null,
            meta_title: (blog as any)?.meta_title ?? title,
            meta_description: (blog as any)?.meta_description ?? (blog as any)?.excerpt ?? "",
            is_published: false,
            cover_image_url: null,
            image_source: null,
            is_seed_content: true,
          });

          if (blogErr) {
            await pushLog(runId, "blog", "failure", `Failed insert blog: ${blogErr.message}`);
          } else {
            setProgress((p) => ({ ...p, blogsDone: p.blogsDone + 1 }));
            await pushLog(runId, "blog", "success", `Created blog: ${title}`);
          }
        } catch {
          await pushLog(runId, "blog", "failure", "Blog generation failed");
        }
      }
    }

    if (bulkOptions.attachImages && createdItemIds.length > 0) {
      setActiveStep("Attaching images");
      await pushLog(runId, "images", "info", "Attaching images (Openverse → Unsplash fallback)...");

      for (const it of createdItemIds) {
        try {
          const found = await resolveFreeImage(it.imageKeywords);
          if (found) {
            await supabase.from("items").update({ image_url: found.url, image_source: found.source }).eq("id", it.id);
          }
          setProgress((p) => ({ ...p, imagesDone: p.imagesDone + 1 }));
        } catch {
          setProgress((p) => ({ ...p, imagesDone: p.imagesDone + 1 }));
        }
      }

      await pushLog(runId, "images", "success", "Image attachment completed (skips allowed)");
    }

    setActiveStep(null);
    toast.success("Bulk generation selesai (hasil Pending, perlu approval admin)." );
    await pushLog(runId, "done", "success", "Bulk generation finished" );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("ai.generator")}</h1>
              <p className="text-muted-foreground">
                Bulk & Single generator — hasil tidak langsung publish (butuh approval admin)
              </p>
            </div>
          </div>

          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Aturan penting</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>AI hanya membuat teks + keyword gambar (tanpa URL gambar, tanpa base64).</li>
                <li>Seed ranking disimpan sebagai <code>seed_weight</code> (bukan vote).</li>
                <li>Hasil kategori dibuat <b>Pending</b> sampai admin approve.</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="space-y-2">
              <Label>Category Group</Label>
              <Select value={categoryGroup} onValueChange={setCategoryGroup}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryGroups.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("ai.language")}</Label>
              <Select value={language} onValueChange={(v: LanguageMode) => setLanguage(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="id">Indonesian</SelectItem>
                  <SelectItem value="both">Both (EN + ID)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <Label>Kata kunci (opsional)</Label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Contoh: aplikasi android, keuangan, sekolah, dll"
            />
            <p className="text-xs text-muted-foreground">
              Keyword ini akan dipakai sebagai arahan tambahan untuk AI (tanpa mengubah sistem prompt di client).
            </p>
          </div>

          <Tabs defaultValue="bulk" className="space-y-6">
            <TabsList>
              <TabsTrigger value="bulk">Bulk Mode</TabsTrigger>
              <TabsTrigger value="single">Single Mode</TabsTrigger>
            </TabsList>

            <TabsContent value="bulk" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Bulk Configuration</CardTitle>
                    <CardDescription>Pilih tipe konten & jumlah</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={bulkOptions.generateCategories} onCheckedChange={() => toggleBulkOption("generateCategories")} id="bulk-categories" />
                        <Label htmlFor="bulk-categories">Generate Categories</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={bulkOptions.generateSubCategories}
                          onCheckedChange={() => toggleBulkOption("generateSubCategories")}
                          id="bulk-subcats"
                          disabled={!bulkOptions.generateCategories}
                        />
                        <Label htmlFor="bulk-subcats" className={!bulkOptions.generateCategories ? "opacity-50" : ""}>
                          Generate Sub-Categories (category_group)
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={bulkOptions.generateItems}
                          onCheckedChange={() => toggleBulkOption("generateItems")}
                          id="bulk-items"
                          disabled={!bulkOptions.generateCategories}
                        />
                        <Label htmlFor="bulk-items" className={!bulkOptions.generateCategories ? "opacity-50" : ""}>
                          Generate Items / Products
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox checked={bulkOptions.generateBlog} onCheckedChange={() => toggleBulkOption("generateBlog")} id="bulk-blog" />
                        <Label htmlFor="bulk-blog">Generate Blog Articles</Label>
                      </div>

                      <Separator />

                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={bulkOptions.seedRanking}
                          onCheckedChange={() => toggleBulkOption("seedRanking")}
                          id="bulk-seed"
                          disabled={!bulkOptions.generateItems || !bulkOptions.generateCategories}
                        />
                        <Label
                          htmlFor="bulk-seed"
                          className={!bulkOptions.generateItems || !bulkOptions.generateCategories ? "opacity-50" : ""}
                        >
                          Generate initial ranking seed (seed_weight)
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox checked={bulkOptions.attachImages} onCheckedChange={() => toggleBulkOption("attachImages")} id="bulk-images" />
                        <Label htmlFor="bulk-images">Attach images (free public sources)</Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={bulkOptions.generateAffiliateLinks}
                          onCheckedChange={() => toggleBulkOption("generateAffiliateLinks")}
                          id="bulk-affiliate"
                        />
                        <Label htmlFor="bulk-affiliate">Generate affiliate-style links (optional)</Label>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Number of categories</Label>
                        <Input
                          type="number"
                          value={bulkQty.categories}
                          min={1}
                          max={50}
                          onChange={(e) => setQty("categories", Number(e.target.value || 1))}
                          disabled={!bulkOptions.generateCategories}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Items per category</Label>
                        <Input
                          type="number"
                          value={bulkQty.itemsPerCategory}
                          min={1}
                          max={20}
                          onChange={(e) => setQty("itemsPerCategory", Number(e.target.value || 1))}
                          disabled={!bulkOptions.generateItems || !bulkOptions.generateCategories}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Sub-categories per category</Label>
                        <Input
                          type="number"
                          value={bulkQty.subCategoriesPerCategory}
                          min={0}
                          max={20}
                          onChange={(e) => setQty("subCategoriesPerCategory", Number(e.target.value || 0))}
                          disabled={!bulkOptions.generateSubCategories || !bulkOptions.generateCategories}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Number of blog articles</Label>
                        <Input
                          type="number"
                          value={bulkQty.blogArticles}
                          min={0}
                          max={20}
                          onChange={(e) => setQty("blogArticles", Number(e.target.value || 0))}
                          disabled={!bulkOptions.generateBlog}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Preview & Confirmation
                    </CardTitle>
                    <CardDescription>Wajib konfirmasi sebelum insert data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm space-y-2">
                      <p>You are about to generate:</p>
                      <ul className="list-disc list-inside text-muted-foreground">
                        <li>{bulkSummary.cats} categories</li>
                        <li>{bulkSummary.items} items</li>
                        <li>{bulkSummary.blogs} blog articles</li>
                        <li>Seed ranking data: {bulkSummary.seed ? "YES (seed_weight only, not votes)" : "NO"}</li>
                        <li>Images from free public sources: {bulkSummary.attachImages ? "YES" : "NO"}</li>
                      </ul>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-2">
                      <Checkbox checked={confirmInsert} onCheckedChange={() => setConfirmInsert((p) => !p)} id="confirm-insert" />
                      <Label htmlFor="confirm-insert" className="leading-snug">
                        Saya mengerti ini akan memasukkan data sungguhan ke database.
                      </Label>
                    </div>

                    <Button onClick={startBulkGeneration} disabled={isGenerating || !confirmInsert} className="w-full" size="lg">
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("ai.generating")}
                        </>
                      ) : (
                        <>
                          <ListChecks className="mr-2 h-4 w-4" />
                          START BULK GENERATION
                        </>
                      )}
                    </Button>

                    {activeStep && (
                      <Alert>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <AlertTitle>Progress</AlertTitle>
                        <AlertDescription className="space-y-1">
                          <div>Step: {activeStep}</div>
                          <div>Categories: {progress.categoriesDone}/{progress.categoriesTotal}</div>
                          <div>Items: {progress.itemsDone}/{progress.itemsTotal}</div>
                          <div>Images: {progress.imagesDone}/{progress.imagesTotal}</div>
                          <div>Blogs: {progress.blogsDone}/{progress.blogsTotal}</div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <div className="text-sm font-medium mb-2">Logs</div>
                      <ScrollArea className="h-64 rounded-md border">
                        <div className="p-3 space-y-2 text-xs">
                          {logLines.length === 0 ? (
                            <div className="text-muted-foreground">No logs yet.</div>
                          ) : (
                            logLines.map((l, idx) => (
                              <div key={idx} className="space-y-0.5">
                                <div className="text-muted-foreground">{l.ts}</div>
                                <div>
                                  <span className="font-medium">[{l.step}]</span> {l.status.toUpperCase()} — {l.message}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setBulkQty({ categories: 10, subCategoriesPerCategory: 0, itemsPerCategory: 5, blogArticles: 0 });
                        setBulkOptions((p) => ({
                          ...p,
                          generateCategories: true,
                          generateItems: true,
                          generateBlog: false,
                          seedRanking: false,
                          attachImages: true,
                        }));
                        toast.message("Preset loaded: 10 categories + items");
                      }}
                    >
                      Load preset: generate 10 content
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="single">
              <Card>
                <CardHeader>
                  <CardTitle>Single Mode</CardTitle>
                  <CardDescription>Buat 1 kategori + items (hasil Pending, butuh approval admin)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Jumlah item</Label>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={singleItemsPerCategory}
                      onChange={(e) => setSingleItemsPerCategory(Number(e.target.value || 5))}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox checked={singleIsPending} onCheckedChange={() => setSingleIsPending((p) => !p)} id="single-pending" />
                    <Label htmlFor="single-pending">Simpan sebagai Pending (disarankan)</Label>
                  </div>

                  <Button onClick={startSingleGeneration} disabled={isGenerating} className="w-full" size="lg">
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("ai.generating")}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        GENERATE 1 CATEGORY
                      </>
                    )}
                  </Button>

                  {activeStep && (
                    <Alert>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <AlertTitle>Progress</AlertTitle>
                      <AlertDescription>Step: {activeStep}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AIContentGenerator;

