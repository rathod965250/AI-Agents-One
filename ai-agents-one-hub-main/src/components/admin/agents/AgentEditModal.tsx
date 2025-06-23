import { useState, useEffect } from 'react';
import type { Agent, FAQ } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AgentEditModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const agentCategories = ["conversational_ai", "image_generation", "content_creation", "data_analysis", "code_assistant", "voice_ai", "automation", "research", "translation", "customer_support", "marketing", "productivity", "education", "healthcare", "finance", "gaming", "ai_agent_builders", "coding", "personal_assistant", "general_purpose", "digital_workers", "design", "sales", "business_intelligence", "hr", "science", "other"];
const pricingTypes = ["free", "freemium", "paid", "subscription"];

export const AgentEditModal = ({ agent, isOpen, onClose, onUpdate }: AgentEditModalProps) => {
  const [formData, setFormData] = useState<Partial<Agent>>(agent);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { logAdminAction } = useAdminAuth();

  // FAQ management state
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [faqLoading, setFaqLoading] = useState(false);
  const [faqEdit, setFaqEdit] = useState<Partial<FAQ> | null>(null);
  const [faqEditIdx, setFaqEditIdx] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && agent.id) {
      fetchFaqs();
    }
    // eslint-disable-next-line
  }, [isOpen, agent.id]);

  const fetchFaqs = async () => {
    setFaqLoading(true);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('agent_id', agent.id)
      .order('created_at', { ascending: true });
    if (!error && data) setFaqs(data);
    setFaqLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleArrayChange = (id: 'features' | 'integrations' | 'gallery' | 'case_studies' | 'technical_specs', value: string) => {
    setFormData(prev => ({ ...prev, [id]: value.split(',').map(s => s.trim()).filter(Boolean) }));
  };

  const handleFaqChange = (field: 'question' | 'answer', value: string) => {
    setFaqEdit(prev => ({ ...prev, [field]: value }));
  };

  const handleFaqSave = async () => {
    if (!faqEdit?.question || !faqEdit?.answer) return;
    let res;
    if (faqEditIdx !== null) {
      // Update existing
      res = await supabase
        .from('faqs')
        .update({ question: faqEdit.question, answer: faqEdit.answer, updated_at: new Date().toISOString() })
        .eq('id', faqEdit.id);
    } else {
      // Insert new
      res = await supabase
        .from('faqs')
        .insert([{ agent_id: agent.id, question: faqEdit.question, answer: faqEdit.answer }]);
    }
    if (res.error) {
      toast({ title: 'Error', description: 'Failed to save FAQ.', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'FAQ saved.' });
      setFaqEdit(null);
      setFaqEditIdx(null);
      fetchFaqs();
    }
  };

  const handleFaqEdit = (idx: number) => {
    setFaqEdit(faqs[idx]);
    setFaqEditIdx(idx);
  };

  const handleFaqDelete = async (id: string) => {
    if (!window.confirm('Delete this FAQ?')) return;
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete FAQ.', variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'FAQ deleted.' });
      fetchFaqs();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('ai_agents')
      .update(formData)
      .eq('id', agent.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update agent.', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `${agent.name} has been updated.` });
      await logAdminAction('edit_agent', JSON.stringify({ agent_id: agent.id, agent_name: agent.name, changes: formData }));
      onUpdate();
      onClose();
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Agent: {agent.name}</DialogTitle>
          <DialogDescription>Make changes to the agent details and save.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={formData.name || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="developer" className="text-right">Developer</Label>
            <Input id="developer" value={formData.developer || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tagline" className="text-right">Tagline</Label>
            <Input id="tagline" value={formData.tagline || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" value={formData.description || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="website_url" className="text-right">Website URL</Label>
            <Input id="website_url" value={formData.website_url || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                {agentCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pricing_type" className="text-right">Pricing</Label>
            <Select value={formData.pricing_type} onValueChange={(value) => handleSelectChange('pricing_type', value)}>
              <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                {pricingTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="features" className="text-right">Features</Label>
            <Textarea id="features" placeholder="Comma-separated" value={formData.features?.join(', ') || ''} onChange={(e) => handleArrayChange('features', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="integrations" className="text-right">Integrations</Label>
            <Textarea id="integrations" placeholder="Comma-separated" value={formData.integrations?.join(', ') || ''} onChange={(e) => handleArrayChange('integrations', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gallery" className="text-right">Gallery</Label>
            <Textarea id="gallery" placeholder="Comma-separated URLs" value={formData.gallery?.join(', ') || ''} onChange={(e) => handleArrayChange('gallery', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="case_studies" className="text-right">Case Studies</Label>
            <Textarea id="case_studies" placeholder="Comma-separated" value={formData.case_studies?.join(', ') || ''} onChange={(e) => handleArrayChange('case_studies', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="technical_specs" className="text-right">Tech Specs</Label>
            <Textarea id="technical_specs" placeholder="Comma-separated" value={formData.technical_specs?.join(', ') || ''} onChange={(e) => handleArrayChange('technical_specs', e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="moderation_notes" className="text-right">Mod Notes</Label>
            <Textarea id="moderation_notes" value={formData.moderation_notes || ''} onChange={handleInputChange} className="col-span-3" />
          </div>
        </div>
        {/* FAQ Management Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">FAQs for this Agent</h3>
          {faqLoading ? (
            <div className="text-gray-500">Loading FAQs...</div>
          ) : (
            <div className="space-y-4">
              {faqs.length === 0 && <div className="text-gray-500">No FAQs yet.</div>}
              {faqs.map((faq, idx) => (
                <div key={faq.id} className="border rounded-lg p-3 flex flex-col gap-2 bg-gray-50">
                  <div className="font-medium">Q: {faq.question}</div>
                  <div className="text-gray-700">A: {faq.answer}</div>
                  <div className="flex gap-2 mt-1">
                    <Button size="sm" variant="outline" onClick={() => handleFaqEdit(idx)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleFaqDelete(faq.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Add/Edit FAQ Form */}
          <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold mb-2">{faqEdit ? (faqEditIdx !== null ? 'Edit FAQ' : 'Add FAQ') : 'Add FAQ'}</h4>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Question"
                value={faqEdit?.question || ''}
                onChange={e => handleFaqChange('question', e.target.value)}
                className="mb-2"
              />
              <Textarea
                placeholder="Answer"
                value={faqEdit?.answer || ''}
                onChange={e => handleFaqChange('answer', e.target.value)}
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleFaqSave} disabled={!faqEdit?.question || !faqEdit?.answer}>
                  {faqEditIdx !== null ? 'Save Changes' : 'Add FAQ'}
                </Button>
                {faqEdit && (
                  <Button size="sm" variant="outline" onClick={() => { setFaqEdit(null); setFaqEditIdx(null); }}>Cancel</Button>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* End FAQ Management Section */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
