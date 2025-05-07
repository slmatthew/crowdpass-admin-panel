import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { CategoryAccordion } from "@/components/categories/CategoryAccordion";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { CategoryModal } from "@/components/categories/CategoryModal";
import { SubcategoryModal } from "@/components/categories/SubcategoryModal";
import { ConfirmModal } from "@/components/categories/ConfirmModal";
import { Category, Subcategory } from "@/types/models";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import { Pencil } from "lucide-react";
import { InfoBanner } from "@/components/ui/InfoBanner";

export default function CategoriesPage() {
  const api = useApiClient();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [subcategoryModalOpen, setSubcategoryModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmText, setConfirmText] = useState<{ title: string; desc?: string }>({ title: "" });

  const { data: categories = [], isLoading, refetch: refetchCtg, isRefetching: isRefetchingCtg } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/admin/categories?subcategories=1");
      return res.data;
    },
  });

  const { data: lostSubcategories = [], refetch: refetchLost, isRefetching: isRefetchingLost } = useQuery<Subcategory[]>({
    queryKey: ["lost-subcategories"],
    queryFn: async () => {
      const res = await api.get("/admin/subcategories/lost");
      return res.data;
    },
  });

  const refetch = async () => {
    await Promise.all([refetchCtg(), refetchLost()]);
  };

  const isRefetching = isRefetchingCtg || isRefetchingLost;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const isSearching = query.length > 0;

    return categories
      .map((cat) => {
        const matchCat =
          cat.name.toLowerCase().includes(query) ||
          cat.id.toString() === query;

        const matchedSubs = cat.subcategories?.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.id.toString() === query
        ) ?? [];

        if (matchCat || matchedSubs.length > 0) {
          return {
            ...cat,
            subcategories:
              isSearching && matchedSubs.length > 0 ? matchedSubs : cat.subcategories,
            _forceOpen: isSearching && matchedSubs.length > 0,
          };
        }

        return null;
      })
      .filter(Boolean) as (Category & { _forceOpen?: boolean })[];
  }, [categories, search]);

  const openEditCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setCategoryModalOpen(true);
  };

  const openCreateSubcategory = (categoryId: number) => {
    setSelectedSubcategory({ name: "", isDeleted: false, id: 0, categoryId });
    setSubcategoryModalOpen(true);
  };

  const openEditSubcategory = (sub: Subcategory) => {
    setSelectedSubcategory(sub);
    setSubcategoryModalOpen(true);
  };

  const openDeleteConfirm = (action: () => void, title: string, desc?: string) => {
    setConfirmAction(() => action);
    setConfirmText({ title, desc });
    setConfirmOpen(true);
  };

  const handleDeleteCategory = async (id: number) => {
    await api.delete(`/admin/categories/${id}`);
    toast.success("Категория удалена");
    refetch();
  };

  const handleDeleteSubcategory = async (id: number) => {
    await api.delete(`/admin/subcategories/${id}`);
    toast.success("Подкатегория удалена");
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold">Категории и подкатегории</h1>
        <div>
          <Button size="sm" onClick={() => refetch()} isLoading={isRefetching}>🔄 Обновить</Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setSelectedCategory(null);
              setCategoryModalOpen(true);
            }}
            className="ml-2"
          >
            ➕ Добавить категорию
          </Button>
        </div>
      </div>

      <input
        type="text"
        className="input mb-4 max-w-md"
        placeholder="Поиск по названию или ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <TabGroup>
        <TabList className="flex space-x-2 mb-4">
          <Tab
            className={({ selected }) =>
              clsx(
                "px-4 py-2 text-sm font-medium border-b-2",
                selected ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              )
            }
          >
            Категории
          </Tab>
          <Tab
            className={({ selected }) =>
              clsx(
                "px-4 py-2 text-sm font-medium border-b-2",
                selected ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              )
            }
          >
            Потерянные подкатегории
            {lostSubcategories.length > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full ml-2">
                {lostSubcategories.length}
              </span>
            )}
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {isLoading ? (
              <p className="text-gray-500">Загрузка...</p>
            ) : (
              <CategoryAccordion
                categories={filtered}
                onEditCategory={openEditCategory}
                onEditSubcategory={openEditSubcategory}
                onAddSubcategory={openCreateSubcategory}
                onDeleteCategory={(id) =>
                  openDeleteConfirm(() => handleDeleteCategory(id), "Удалить категорию?")
                }
                onDeleteSubcategory={(id) =>
                  openDeleteConfirm(() => handleDeleteSubcategory(id), "Удалить подкатегорию?")
                }
              />
            )}
          </TabPanel>

          <TabPanel>
            <InfoBanner
              title="Справка"
              message="Потерянные подкатегории – это подкатегории, родительская категория которых была удалена"
              variant="info"
              dismissible
            />

            {lostSubcategories.length === 0 ? (
              <p className="text-gray-500 italic">Нет потерянных подкатегорий 🎉</p>
            ) : (
              <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
                {lostSubcategories.map((sub) => (
                  <li key={sub.id} className="p-3 flex justify-between items-center text-sm">
                    <div>
                      {sub.name}
                      <span className="ml-2 text-xs text-gray-400">(ID: {sub.id})</span>
                      <span className="ml-4 text-xs text-gray-500 italic">
                        (Категория: {sub.category?.name ?? "—"})
                      </span>
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Pencil size={14} />}
                        onClick={() => openEditSubcategory(sub)}
                      >
                        Ред.
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="ml-2"
                        onClick={() =>
                          openDeleteConfirm(() => handleDeleteSubcategory(sub.id), "Удалить подкатегорию?")
                        }
                      >
                        Удалить
                      </Button>  
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {/* Модалки */}
      <CategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={async (data) => {
          if (selectedCategory) {
            await api.patch(`/admin/categories/${selectedCategory.id}`, data);
            toast.success("Категория обновлена");
          } else {
            await api.post(`/admin/categories`, data);
            toast.success("Категория создана");
          }
          setCategoryModalOpen(false);
          refetch();
        }}
        initialData={selectedCategory || undefined}
        mode={selectedCategory ? "edit" : "create"}
      />

      <SubcategoryModal
        open={subcategoryModalOpen}
        onClose={() => setSubcategoryModalOpen(false)}
        onSubmit={async (data) => {
          if (selectedSubcategory?.id) {
            await api.patch(`/admin/subcategories/${selectedSubcategory.id}`, data);
            toast.success("Подкатегория обновлена");
          } else {
            await api.post(`/admin/subcategories`, data);
            toast.success("Подкатегория создана");
          }
          setSubcategoryModalOpen(false);
          refetch();
        }}
        initialData={selectedSubcategory || undefined}
        categoryOptions={categories.map((c) => ({ id: c.id, name: c.name }))}
        mode={selectedSubcategory?.id ? "edit" : "create"}
      />

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          confirmAction?.();
          setConfirmOpen(false);
        }}
        title={confirmText.title}
        description={confirmText.desc}
      />
    </div>
  );
}