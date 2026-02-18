export interface Photo {
  id: number;
  url: string;
  caption: string;
  date?: string;
  type?: "image" | "video";
}
