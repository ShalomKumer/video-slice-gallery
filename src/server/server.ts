import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 * 1024 }, // 4GB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Not a video file'));
    }
  },
});

// Create clips directory if it doesn't exist
const clipsDir = path.join(__dirname, 'clips');
if (!fs.existsSync(clipsDir)) {
  fs.mkdirSync(clipsDir, { recursive: true });
}

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

// Upload endpoint
app.post('/api/upload', upload.single('video'), async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No video file uploaded' });
      return;
    }

    const videoPath = req.file.path;
    const clips = await splitVideoIntoClips(videoPath);
    
    res.json({ clips });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error processing video' });
  }
});

// Function to split video into 90-second clips
async function splitVideoIntoClips(videoPath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const clips: any[] = [];
    let clipIndex = 0;

    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const duration = metadata.format.duration || 0;
      const clipDuration = 90;
      const numberOfClips = Math.ceil(duration / clipDuration);

      let completedClips = 0;

      for (let i = 0; i < numberOfClips; i++) {
        const startTime = i * clipDuration;
        const outputPath = path.join(clipsDir, `clip-${Date.now()}-${i}.mp4`);

        ffmpeg(videoPath)
          .setStartTime(startTime)
          .setDuration(clipDuration)
          .output(outputPath)
          .on('end', () => {
            clips.push({
              id: clipIndex++,
              title: `Clip ${i + 1}`,
              duration: clipDuration,
              videoUrl: `/clips/${path.basename(outputPath)}`,
              thumbnail: '', // TODO: Generate thumbnails
              createdAt: new Date().toISOString(),
            });

            completedClips++;
            if (completedClips === numberOfClips) {
              resolve(clips);
            }
          })
          .on('error', reject)
          .run();
      }
    });
  });
}

// Serve static files
app.use('/clips', express.static(clipsDir));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 