import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { verifyToken } from "~/lib/services";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    verifyToken().then((valid) => {
      if (!valid) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        setIsAuthorized(true);
      }
    });
  }, [navigate]);

  if (isAuthorized === null) {
    return null; // Brief flash while verifying - the album has its own loader
  }

  return <>{children}</>;
}
