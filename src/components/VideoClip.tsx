
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoClipProps {
  clip: {
    id: number;
    title: string;
    duration: number;
    thumbnail: string;
    videoUrl: string;
    createdAt: string;
  };
}

const VideoClip = ({ clip }: VideoClipProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      toast({
        title: "Download started",
        description: `${clip.title} is being downloaded`
      });
      setIsDownloading(false);
    }, 1000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-200 group">
      <CardContent className="p-4">
        <div className="relative mb-4 rounded-lg overflow-hidden">
          <img 
            src={clip.thumbnail} 
            alt={clip.title}
            className="w-full h-40 object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Video className="h-12 w-12 text-white" />
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(clip.duration)}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-white">{clip.title}</h3>
            <p className="text-sm text-purple-200">
              Created {new Date(clip.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-white/20 text-white hover:bg-white/10"
              size="sm"
            >
              Instagram Format
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoClip;
