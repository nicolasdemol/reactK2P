import "./App.css";
import * as React from "react";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import { Layout } from "./components/common/layout";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Root from "./views/Root";
import Login from "@/views/Login";
import TaskPage from "./views/Tasks";
import MessagePage from "./views/Messages";
import SettingsProfilePage from "./views/Settings";
import DocPage from "./views/Docs";
import AdminPage from "./views/Admin";

const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    id: "root",
    path: "/*",
    Component: RequireAuth,
    children: [
      {
        index: true,
        Component: Root,
      },
      {
        path: "settings/*",
        Component: SettingsProfilePage,
      },
      {
        path: "tasks",
        Component: TaskPage,
      },
      {
        path: "messages",
        Component: MessagePage,
      },
      {
        path: "docs",
        Component: DocPage,
      },
      {
        path: "admin",
        Component: RequireAdmin,
        children: [
          {
            index: true,
            element: <AdminPage />,
          },
        ],
      },
    ],
  },
]);

function RequireAuth() {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  }
}

function RequireAdmin() {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(true); // Ajouter un état de chargement

  // Utiliser un effet pour gérer le chargement
  React.useEffect(() => {
    if (user && user.role) {
      setIsLoading(false); // Marquer le chargement comme terminé
    }
  }, [user]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (user && user.role === "admin") {
    return <Outlet />;
  } else {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
}

function App() {
  return (
    <AuthProvider>
      <RouterProvider
        router={router}
        fallbackElement={<p>Initial Load...</p>}
      />
    </AuthProvider>
  );
}

export default App;
