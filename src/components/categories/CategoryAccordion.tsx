import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Category } from "@/types/models/Category";
import { Subcategory } from "@/types/models/Subcategory";

interface CategoryWithMeta extends Category {
  _forceOpen?: boolean;
}

interface Props {
  categories: CategoryWithMeta[];
  onEditCategory: (cat: Category) => void;
  onDeleteCategory: (id: number) => void;
  onAddSubcategory: (id: number) => void;
  onEditSubcategory: (sub: Subcategory) => void;
  onDeleteSubcategory: (id: number) => void;
}

export function CategoryAccordion({
  categories,
  onEditCategory,
  onDeleteCategory,
  onAddSubcategory,
  onEditSubcategory,
  onDeleteSubcategory,
}: Props) {
  return (
    <div className="space-y-4">
      {categories.map((cat) => (
        <Disclosure key={cat.id} defaultOpen={!!cat._forceOpen}>
          {({ open }) => (
            <div className="border border-gray-200 rounded-md">
              <DisclosureButton className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-md">
                <span className="flex items-center gap-2 font-medium text-sm">
                  {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span>
                    {cat.name}
                    <span className="ml-2 text-xs text-gray-400">#{cat.id}</span>
                  </span>
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Pencil size={14} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCategory(cat);
                    }}
                  >
                    Ред.
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    leftIcon={<Trash2 size={14} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCategory(cat.id);
                    }}
                  >
                    Удалить
                  </Button>
                </div>
              </DisclosureButton>

              <DisclosurePanel className="px-4 pb-4">
                {cat.subcategories && cat.subcategories.length > 0 ? (
                  cat.subcategories.map((sub: Subcategory) => (
                    <div
                      key={sub.id}
                      className="flex justify-between items-center py-1 border-b border-gray-200 last:border-none text-sm"
                    >
                      <span>
                        {sub.name}
                        <span className="ml-2 text-xs text-gray-400">#{sub.id}</span>
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Pencil size={14} />}
                          onClick={() => onEditSubcategory(sub)}
                        >
                          Ред.
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          leftIcon={<Trash2 size={14} />}
                          onClick={() => onDeleteSubcategory(sub.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic mt-2">Нет подкатегорий</p>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  leftIcon={<Plus size={14} />}
                  onClick={() => onAddSubcategory(cat.id)}
                >
                  Добавить подкатегорию
                </Button>
              </DisclosurePanel>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}