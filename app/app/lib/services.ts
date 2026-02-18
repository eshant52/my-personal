import api from "./api";
import type { Photo } from "~/types/photo";

export async function login(
  username: string,
  password: string,
): Promise<{
  token: string;
  user: { id: number; username: string };
  passwordChanged: boolean;
}> {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string; token: string }> {
  const response = await api.post("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
}

export async function verifyToken(): Promise<boolean> {
  try {
    const response = await api.get("/auth/verify");
    return response.data.valid;
  } catch {
    return false;
  }
}

export async function getPhotos(): Promise<Photo[]> {
  const response = await api.get("/media/photos");
  return response.data;
}

export function getMediaUrl(path: string): string {
  const token = localStorage.getItem("token");
  return `${path}?token=${token}`;
}

export function getBirthdayPhotoUrl(): string {
  const token = localStorage.getItem("token");
  return `/api/media/birthday-photo?token=${token}`;
}

export function getMusicUrl(): string {
  const token = localStorage.getItem("token");
  return `/api/media/music/happy-birthday.mp3?token=${token}`;
}
