import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),

  // API routes
  route("api/auth/login", "routes/api.auth.login.ts"),
  route("api/auth/change-password", "routes/api.auth.change-password.ts"),
  route("api/auth/verify", "routes/api.auth.verify.ts"),
  route("api/media/photos", "routes/api.media.photos._index.ts"),
  route("api/media/birthday-photo", "routes/api.media.birthday-photo.ts"),
  route("api/media/music/:filename", "routes/api.media.music.$filename.ts"),
  route(
    "api/media/photos/:folder/:filename",
    "routes/api.media.photos.$folder.$filename.ts",
  ),
  route("api/media/videos/:filename", "routes/api.media.videos.$filename.ts"),
  route("api/health", "routes/api.health.ts"),
] satisfies RouteConfig;
