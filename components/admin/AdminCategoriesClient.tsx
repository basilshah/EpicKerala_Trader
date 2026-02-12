'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Edit,
  Trash2,
  Image as ImageIcon,
  FolderTree,
  ChevronDown,
  ChevronRight,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  parent?: {
    name: string;
  } | null;
  children: Category[];
  _count: {
    products: number;
  };
}

interface AdminCategoriesClientProps {
  categories: Category[];
}

export default function AdminCategoriesClient({ categories }: AdminCategoriesClientProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const mainCategories = categories.filter((cat) => !cat.parentId);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setDeleteId(id);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to delete category');
        return;
      }

      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete category');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {mainCategories.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-slate-700 text-center">
              No categories yet. Create your first category!
            </p>
          </CardContent>
        </Card>
      ) : (
        mainCategories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const hasChildren = category.children.length > 0;

          return (
            <Card key={category.id} className="overflow-hidden">
              {/* Main Category Header */}
              <div className="border-b border-slate-200 bg-slate-50">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Category Image */}
                    <div className="flex-shrink-0">
                      {category.imageUrl ? (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-24 h-24 object-cover rounded-lg border-2 border-slate-200"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center border-2 border-slate-300">
                          <ImageIcon className="w-10 h-10 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Category Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-xl mb-1">{category.name}</h3>
                          <p className="text-sm text-slate-800 font-mono mb-2 font-medium">
                            /{category.slug}
                          </p>
                          {category.description && (
                            <p className="text-sm text-slate-800 leading-relaxed">
                              {category.description}
                            </p>
                          )}
                          <div className="flex items-center gap-6 mt-3 text-sm text-slate-800 font-medium">
                            <span className="flex items-center gap-1">
                              <FolderTree className="w-4 h-4" />
                              {category.children.length} subcategories
                            </span>
                            <span>{category._count.products} products</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <Link href={`/admin/categories/${category.id}/edit`}>
                            <Button variant="outline" size="sm" className="w-full">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(category.id, category.name)}
                            disabled={isDeleting && deleteId === category.id}
                            className="text-red-600 hover:text-red-700 hover:border-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expand/Collapse & Add Subcategory */}
                  {hasChildren && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategory(category.id)}
                        className="text-slate-800 hover:text-slate-900 font-medium"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronDown className="w-4 h-4 mr-2" />
                            Hide Subcategories
                          </>
                        ) : (
                          <>
                            <ChevronRight className="w-4 h-4 mr-2" />
                            Show Subcategories ({category.children.length})
                          </>
                        )}
                      </Button>
                      <Link href={`/admin/categories/add?parent=${category.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-emerald-700 border-emerald-600 hover:bg-emerald-50"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Subcategory
                        </Button>
                      </Link>
                    </div>
                  )}

                  {!hasChildren && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <Link href={`/admin/categories/add?parent=${category.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-emerald-700 border-emerald-600 hover:bg-emerald-50"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Subcategory
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Subcategories List */}
              {hasChildren && isExpanded && (
                <div className="bg-white">
                  <div className="divide-y divide-slate-100">
                    {category.children.map((subcat) => (
                      <div key={subcat.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0 pl-8">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                              <h4 className="font-semibold text-slate-900">{subcat.name}</h4>
                            </div>
                            <p className="text-sm text-slate-800 font-mono ml-4 font-medium">
                              /{subcat.slug}
                            </p>
                            {subcat.description && (
                              <p className="text-sm text-slate-800 mt-1 ml-4">
                                {subcat.description}
                              </p>
                            )}
                            <p className="text-xs text-slate-700 mt-2 ml-4 font-medium">
                              {subcat._count.products} products
                            </p>
                          </div>

                          <div className="flex gap-2 flex-shrink-0">
                            <Link href={`/admin/categories/${subcat.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(subcat.id, subcat.name)}
                              disabled={isDeleting && deleteId === subcat.id}
                              className="text-red-600 hover:text-red-700 hover:border-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
