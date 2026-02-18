import { verifyAuthToken, unauthorized } from "~/.server/auth";

interface PhotoItem {
  id: number;
  url: string;
  caption: string;
  date?: string;
  type?: "image" | "video";
}

const photoData: PhotoItem[] = [
  {
    id: 1,
    url: "/api/media/photos/together/7.jpg",
    caption: "Our first date",
    date: "Jul 2024",
  },
  {
    id: 2,
    url: "/api/media/photos/together/3.png",
    caption: "Cute moments",
    date: "Feb 2025",
  },
  {
    id: 3,
    url: "/api/media/photos/together/4.jpg",
    caption: "Awww...",
    date: "Feb 2025",
  },
  {
    id: 4,
    url: "/api/media/photos/together/5.jpg",
    caption: "Selfie fun",
    date: "Feb 2025",
  },
  {
    id: 5,
    url: "/api/media/photos/together/6.jpg",
    caption: "Hehe..",
    date: "Feb 2025",
  },
  {
    id: 6,
    url: "/api/media/videos/sweet.mp4",
    caption: "Sweet moments together",
    date: "Aug 2025",
    type: "video",
  },
  {
    id: 7,
    url: "/api/media/photos/together/1.jpg",
    caption: "Sunset vibes",
    date: "Dec 2025",
  },
  {
    id: 8,
    url: "/api/media/photos/together/2.jpg",
    caption: "Sunset memories",
    date: "Dec 2025",
  },
];

export async function loader({ request }: { request: Request }) {
  const decoded = verifyAuthToken(request);
  if (!decoded) return unauthorized();

  return Response.json(photoData);
}
