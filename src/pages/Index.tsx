
import VideoUpload from '@/components/VideoUpload';
import VideoGallery from '@/components/VideoGallery';
import { useState } from 'react';

const Index = () => {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [clips, setClips] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Video Slice Gallery
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Transform your long-form videos into engaging 90-second clips perfect for social media
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <VideoUpload 
            onUploadComplete={setUploadedVideo}
            onClipsGenerated={setClips}
          />
        </div>

        {/* Gallery Section */}
        {clips.length > 0 && (
          <VideoGallery clips={clips} />
        )}
      </div>
    </div>
  );
};

export default Index;
