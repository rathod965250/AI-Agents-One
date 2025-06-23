import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUp, ArrowDown, Edit2, Trash2, Plus } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  order: number;
  agent_count?: number;
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const { isAdmin, logAdminAction } = useAdminAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data, error } = await supabase
      .from('agent_categories')
      .select('id, name, order, ai_agents(count)')
      .order('order', { ascending: true });
    if (!error && data) {
      setCategories(
        data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          order: cat.order,
          agent_count: cat.ai_agents?.length || 0
        }))
      );
    }
    setLoading(false);
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    try {
      const maxOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) : 0;
      const { data, error } = await supabase
        .from('agent_categories')
        .insert({ name: newCategory.trim(), order: maxOrder + 1 })
        .select()
        .single();
      if (error) throw error;
      await logAdminAction('create_category', 'agent_categories', data.id, null, data);
      toast({ title: 'Category Added', description: `Category "${newCategory}" added.` });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    }
  }

  async function handleEditCategory(id: string) {
    if (!editingName.trim()) return;
    try {
      const oldCat = categories.find(c => c.id === id);
      const { error } = await supabase
        .from('agent_categories')
        .update({ name: editingName.trim() })
        .eq('id', id);
      if (error) throw error;
      await logAdminAction('edit_category', 'agent_categories', id, oldCat, { name: editingName.trim() });
      toast({ title: 'Category Updated', description: `Category updated to "${editingName}".` });
      setEditingId(null);
      setEditingName('');
      fetchCategories();
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const oldCat = categories.find(c => c.id === id);
      const { error } = await supabase
        .from('agent_categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await logAdminAction('delete_category', 'agent_categories', id, oldCat, null);
      toast({ title: 'Category Deleted', description: 'Category deleted.' });
      fetchCategories();
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    }
  }

  async function handleReorderCategory(idx: number, direction: 'up' | 'down') {
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= categories.length) return;
    const reordered = [...categories];
    const temp = reordered[idx];
    reordered[idx] = reordered[newIdx];
    reordered[newIdx] = temp;
    // Update order fields
    const updates = reordered.map((cat, i) => ({ id: cat.id, order: i + 1 }));
    try {
      for (const update of updates) {
        await supabase.from('agent_categories').update({ order: update.order }).eq('id', update.id);
      }
      await logAdminAction('reorder_categories', 'agent_categories', null, categories, updates);
      toast({ title: 'Categories Reordered', description: 'Category order updated.' });
      fetchCategories();
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Manage Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="New category name"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="w-64"
            onKeyDown={e => { if (e.key === 'Enter') handleAddCategory(); }}
          />
          <Button variant="default" disabled={!newCategory.trim()} onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Order</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Agents</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-400">No categories found.</td></tr>
              ) : (
                categories.map((cat, idx) => (
                  <tr key={cat.id} className="border-b">
                    <td className="p-2 flex gap-1 items-center">
                      <Button size="icon" variant="ghost" disabled={idx === 0} onClick={() => handleReorderCategory(idx, 'up')}><ArrowUp className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" disabled={idx === categories.length - 1} onClick={() => handleReorderCategory(idx, 'down')}><ArrowDown className="h-4 w-4" /></Button>
                    </td>
                    <td className="p-2">
                      {editingId === cat.id ? (
                        <Input
                          value={editingName}
                          onChange={e => setEditingName(e.target.value)}
                          className="w-40"
                          onKeyDown={e => { if (e.key === 'Enter') handleEditCategory(cat.id); }}
                        />
                      ) : (
                        cat.name
                      )}
                    </td>
                    <td className="p-2">{cat.agent_count}</td>
                    <td className="p-2 flex gap-2">
                      {editingId === cat.id ? (
                        <>
                          <Button size="sm" variant="default" onClick={() => handleEditCategory(cat.id)}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditingId(null); setEditingName(''); }}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button size="icon" variant="outline" onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }}><Edit2 className="h-4 w-4" /></Button>
                          <Button size="icon" variant="destructive" onClick={() => handleDeleteCategory(cat.id)}><Trash2 className="h-4 w-4" /></Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
} 