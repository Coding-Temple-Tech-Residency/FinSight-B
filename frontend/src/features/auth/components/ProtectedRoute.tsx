import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "../hooks/useAuth";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <section className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
