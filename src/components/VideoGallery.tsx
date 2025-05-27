
import { Card, CardContent } from '@/components/ui/card';
import VideoClip from './VideoClip';

interface VideoGalleryProps {
  clips: Array<{
    id: number;
    title: string;
    duration: number;
    thumbnail: string;
    videoUrl: string;
    createdAt: string;
  }>;
}

const VideoGallery = ({ clips }: VideoGalleryProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Your Video Clips</h2>
          <p className="text-purple-100">
            {clips.length} clips generated • Ready for download
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clips.map((clip) => (
            <VideoClip key={clip.id} clip={clip} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoGallery;
