export interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string | null;
  file: string | File;
  duration?: number;
  localFile?: boolean;
} 