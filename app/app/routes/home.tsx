import ProtectedRoute from "~/components/ProtectedRoute";
import PhotoAlbum from "~/components/PhotoAlbum";

export default function Home() {
  return (
    <ProtectedRoute>
      <PhotoAlbum />
    </ProtectedRoute>
  );
}
