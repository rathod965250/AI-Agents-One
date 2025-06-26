import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, ImageOff } from 'lucide-react';
import type { Agent } from '@/integrations/supabase/types';

interface AgentGalleryProps {
  agent: Agent;
}

const AgentGallery = ({ agent }: AgentGalleryProps) => {
  // Ensure we always have exactly 3 items (either actual images or placeholders)
  const galleryItems = Array(3).fill(null).map((_, index) => {
    const gallery = agent.gallery || [];
    return index < gallery.length ? gallery[index] : null;
  });

  const isImage = (url: string | null) => url && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  const isVideo = (url: string | null) => url && /\.(mp4|webm|ogg)$/i.test(url);

  // Don't render if there are no gallery items at all
  if (galleryItems.every(item => item === null)) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Screenshots & Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {galleryItems.map((url, index) => (
            <div 
              key={index} 
              className={`rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${
                url ? 'bg-white' : 'bg-gray-50 border-dashed border-gray-200'
              }`}
            >
              {url ? (
                isImage(url) ? (
                  <img 
                    src={url} 
                    alt={`${agent.name} screenshot ${index + 1}`} 
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : isVideo(url) ? (
                  <video 
                    src={url} 
                    controls 
                    className="w-full h-48 object-cover"
                    aria-label={`Video demo ${index + 1}`}
                  />
                ) : (
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center w-full h-48 p-4 text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Image className="w-5 h-5" />
                      View Media
                    </span>
                  </a>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                  <ImageOff className="w-10 h-10 mb-2" />
                  <span className="text-sm">Screenshot {index + 1}</span>
                  <span className="text-xs text-gray-400">Coming soon</span>
                </div>
              )}
              
              {/* Image caption or number */}
              <div className="p-3 text-center text-sm text-gray-500 bg-gray-50 border-t border-gray-100">
                {url ? `Screenshot ${index + 1}` : 'Preview not available'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentGallery;