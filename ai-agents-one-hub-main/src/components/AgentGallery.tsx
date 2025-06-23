import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from 'lucide-react';
import type { Agent } from '@/integrations/supabase/types';

interface AgentGalleryProps {
  agent: Agent;
}

const AgentGallery = ({ agent }: AgentGalleryProps) => {
  const gallery = agent.gallery || [];
  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  if (!gallery.length) {
    return null; // Don't render if no gallery items
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((url, idx) => (
            <div key={idx} className="rounded-lg overflow-hidden border bg-gray-50 aspect-video">
              {isImage(url) ? (
                <img src={url} alt={`Gallery item ${idx + 1}`} className="w-full h-full object-cover" />
              ) : isVideo(url) ? (
                <video src={url} controls className="w-full h-full object-cover" />
              ) : (
                <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full p-4 text-blue-600 underline">
                  View Media
                </a>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentGallery;