import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Clock,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FreeImageSearch } from "@/components/FreeImageSearch";
import AdminCategoryEditor from "@/components/admin/AdminCategoryEditor";

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category_group: string | null;
  is_approved: boolean | null;
  created_at: string;
}

interface Item {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  product_url: string | null;
  affiliate_url: string | null;
}

interface CategoryFormData {
  name: string;
  description: string;
  image_url: string;
  category_group: string;
}

type ViewMode = "grid" | "list";

// Predefined category groups with icons
const CATEGORY_GROUPS = [
  { id: "Technology", name: "Technology", icon: "💻" },
  { id: "Food & Beverages", name: "Food & Beverages", icon: "🍔" },
  { id: "Fashion & Apparel", name: "Fashion & Apparel", icon: "👗" },
  { id: "Entertainment", name: "Entertainment", icon: "🎬" },
  { id: "Sports & Fitness", name: "Sports & Fitness", icon: "⚽" },
  { id: "Home & Living", name: "Home & Living", icon: "🏠" },
  { id: "Travel & Tourism", name: "Travel & Tourism", icon: "✈️" },
  { id: "Health & Wellness", name: "Health & Wellness", icon: "💪" },
  { id: "Education", name: "Education", icon: "📚" },
  { id: "Automotive", name: "Automotive", icon: "🚗" },
  { id: "Gaming", name: "Gaming", icon: "🎮" },
  { id: "Beauty & Personal Care", name: "Beauty & Personal Care", icon: "💄" },
  { id: "Music & Audio", name: "Music & Audio", icon: "🎵" },
  { id: "Pets & Animals", name: "Pets & Animals", icon: "🐕" },
  { id: "Art & Design", name: "Art & Design", icon: "🎨" },
  { id: "Business & Finance", name: "Business & Finance", icon: "💼" },
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [itemsByCategory, setItemsByCategory] = useState<Record<string, Item[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Create/edit basic category (metadata only)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    image_url: "",
    category_group: "",
  });
  const [customGroup, setCustomGroup] = useState("");
  const [useCustomGroup, setUseCustomGroup] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const fetchCategories = async () => {
    setIsLoading(true);

    const [{ data: categoriesData, error: categoriesError }, { data: itemsData, error: itemsError }] =
      await Promise.all([
        supabase.from("categories").select("*").order("created_at", { ascending: false }),
        supabase.from("items").select("*").order("vote_count", { ascending: false }),
      ]);

    if (categoriesError) {
      toast.error("Gagal memuat kategori");
      console.error(categoriesError);
      setIsLoading(false);
      return;
    }

    if (itemsError) {
      // Items are optional for rendering; editor can still open with empty list.
      console.error(itemsError);
    }

    const grouped: Record<string, Item[]> = {};
    for (const it of (itemsData as Item[] | null) ?? []) {
      (grouped[it.category_id] ??= []).push(it);
    }

    setCategories((categoriesData as Category[] | null) ?? []);
    setItemsByCategory(grouped);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", description: "", image_url: "", category_group: "" });
    setEditingCategory(null);
    setCustomGroup("");
    setUseCustomGroup(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEditMeta = (category: Category) => {
    setEditingCategory(category);
    const existingGroup = CATEGORY_GROUPS.find((g) => g.id === category.category_group);
    setFormData({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
      category_group: existingGroup ? category.category_group || "" : "",
    });

    if (category.category_group && !existingGroup) {
      setUseCustomGroup(true);
      setCustomGroup(category.category_group);
    } else {
      setUseCustomGroup(false);
      setCustomGroup("");
    }

    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Nama kategori wajib diisi");
      return;
    }

    const finalGroup = useCustomGroup ? customGroup : formData.category_group;

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update({
            name: formData.name,
            description: formData.description || null,
            image_url: formData.image_url || null,
            category_group: finalGroup || null,
          })
          .eq("id", editingCategory.id);

        if (error) throw error;
        toast.success("Kategori berhasil diperbarui");
      } else {
        const { error } = await supabase.from("categories").insert({
          name: formData.name,
          description: formData.description || null,
          image_url: formData.image_url || null,
          category_group: finalGroup || null,
          is_approved: true,
        });

        if (error) throw error;
        toast.success("Kategori berhasil dibuat");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    }
  };

  const handleApprove = async (categoryId: string) => {
    const { error } = await supabase.from("categories").update({ is_approved: true }).eq("id", categoryId);

    if (error) {
      toast.error("Gagal menyetujui kategori");
    } else {
      toast.success("Kategori disetujui");
      fetchCategories();
    }
  };

  const handleReject = async (categoryId: string) => {
    const { error } = await supabase.from("categories").update({ is_approved: false }).eq("id", categoryId);

    if (error) {
      toast.error("Gagal menolak kategori");
    } else {
      toast.success("Kategori ditolak");
      fetchCategories();
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;

    const { error } = await supabase.from("categories").delete().eq("id", categoryId);

    if (error) {
      toast.error("Gagal menghapus kategori");
    } else {
      toast.success("Kategori dihapus");
      fetchCategories();
    }
  };

  const handleImageSelected = (imageUrl: string) => {
    setFormData({ ...formData, image_url: imageUrl });
  };

  const getGroupIcon = (groupId: string | null) => {
    const group = CATEGORY_GROUPS.find((g) => g.id === groupId);
    return group?.icon || "📁";
  };

  const pendingCategories = useMemo(
    () => categories.filter((c) => c.is_approved === false || c.is_approved === null),
    [categories]
  );

  const approvedCategories = useMemo(
    () => categories.filter((c) => c.is_approved === true),
    [categories]
  );

  const renderCategoryCard = (category: Category) => {
    const items = itemsByCategory[category.id] ?? [];

    return (
      <Card key={category.id}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span>{getGroupIcon(category.category_group)}</span>
              <CardTitle className="text-lg truncate">{category.name}</CardTitle>
            </div>
            {category.is_approved ? (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Approved
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-50 text-amber-700">
                Pending
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {category.image_url && (
            <img
              src={category.image_url}
              alt={category.name}
              className="w-full h-24 object-cover rounded-md mb-3"
              loading="lazy"
            />
          )}

          <p className="text-sm text-muted-foreground mb-3">
            {category.description || "Tidak ada deskripsi"}
          </p>

          {category.category_group && (
            <Badge variant="secondary" className="mb-3">
              {getGroupIcon(category.category_group)} {category.category_group}
            </Badge>
          )}

          <div className="flex flex-wrap gap-2">
            {/* Full editor (category + items) */}
            <AdminCategoryEditor
              category={{
                id: category.id,
                name: category.name,
                description: category.description,
                image_url: category.image_url,
                category_group: category.category_group,
              }}
              items={items.map((it) => ({
                id: it.id,
                name: it.name,
                description: it.description,
                image_url: it.image_url,
                product_url: it.product_url,
                affiliate_url: it.affiliate_url,
              }))}
              onUpdate={fetchCategories}
            />

            {/* Quick edit (metadata only) */}
            <Button size="sm" variant="outline" onClick={() => handleOpenEditMeta(category)}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit Info
            </Button>

            {!category.is_approved ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => handleApprove(category.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Setujui
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleReject(category.id)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Tolak
                </Button>
              </>
            ) : null}

            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleDelete(category.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Hapus
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Kelola Kategori</h2>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={viewMode === "list" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            List
          </Button>
          <Button
            type="button"
            variant={viewMode === "grid" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            Grid
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Edit Info Kategori" : "Tambah Kategori Baru"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nama kategori"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Deskripsi kategori"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gambar</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="URL gambar atau cari..."
                      className="flex-1"
                    />
                    <FreeImageSearch onImageSelected={handleImageSelected} />
                  </div>
                  {formData.image_url && (
                    <div className="mt-2">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-32 h-20 object-cover rounded-md border"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Grup Kategori</Label>
                  <div className="space-y-2">
                    <Select
                      value={useCustomGroup ? "custom" : formData.category_group}
                      onValueChange={(value) => {
                        if (value === "custom") {
                          setUseCustomGroup(true);
                          setFormData({ ...formData, category_group: "" });
                        } else {
                          setUseCustomGroup(false);
                          setFormData({ ...formData, category_group: value });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih grup kategori..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_GROUPS.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            <span className="flex items-center gap-2">
                              <span>{group.icon}</span>
                              <span>{group.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">
                          <span className="flex items-center gap-2">
                            <span>✏️</span>
                            <span>Custom Group...</span>
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {useCustomGroup && (
                      <Input
                        value={customGroup}
                        onChange={(e) => setCustomGroup(e.target.value)}
                        placeholder="Masukkan nama grup baru..."
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit">{editingCategory ? "Simpan" : "Buat"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {pendingCategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Menunggu Persetujuan ({pendingCategories.length})
          </h3>
          <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2" : "space-y-3"}>
            {pendingCategories.map(renderCategoryCard)}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Kategori Disetujui ({approvedCategories.length})
        </h3>

        {approvedCategories.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Belum ada kategori yang disetujui
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
            {approvedCategories.map(renderCategoryCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;

