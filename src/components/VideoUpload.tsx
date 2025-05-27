
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Video, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoUploadProps {
  onUploadComplete: (videoUrl: string) => void;
  onClipsGenerated: (clips: any[]) => void;
}

const VideoUpload = ({ onUploadComplete, onClipsGenerated }: VideoUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      handleFileSelect(videoFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file (MP4 format)",
        variant: "destructive"
      });
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 4 * 1024 * 1024 * 1024) { // 4GB limit
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 4GB",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    simulateUpload(file);
  };

  const simulateUpload = (file: File) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          simulateProcessing();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const simulateProcessing = () => {
    setIsProcessing(true);
    toast({
      title: "Upload complete!",
      description: "Processing video into 90-second clips..."
    });

    // Simulate processing time
    setTimeout(() => {
      const mockClips = Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        title: `Clip ${i + 1}`,
        duration: 90,
        thumbnail: `https://picsum.photos/320/180?random=${i}`,
        videoUrl: `#clip-${i + 1}`,
        createdAt: new Date().toISOString()
      }));

      onClipsGenerated(mockClips);
      setIsProcessing(false);
      
      toast({
        title: "Processing complete!",
        description: `Generated ${mockClips.length} clips ready for download`
      });
    }, 3000);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
      <CardContent className="p-8">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
            isDragging 
              ? 'border-purple-300 bg-purple-500/20' 
              : 'border-white/30 hover:border-white/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!uploadedFile ? (
            <>
              <Video className="h-16 w-16 mx-auto mb-4 text-purple-200" />
              <h3 className="text-2xl font-semibold mb-2">Upload Your Video</h3>
              <p className="text-purple-100 mb-6 max-w-md mx-auto">
                Drag and drop your MP4 file here, or click to browse. 
                Maximum file size: 4GB, up to 4 hours duration.
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              >
                <Upload className="h-5 w-5 mr-2" />
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <Video className="h-8 w-8 text-purple-200" />
                <div>
                  <h4 className="font-semibold">{uploadedFile.name}</h4>
                  <p className="text-sm text-purple-200">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              </div>

              {uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <p className="text-center">Processing video into clips...</p>
                  <div className="animate-pulse bg-purple-500/30 h-2 rounded"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoUpload;
