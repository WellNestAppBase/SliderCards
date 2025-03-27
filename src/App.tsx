import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import Loading from "./components/ui/loading";

// Lazy load components for better performance
const Landing = lazy(() => import("./components/b2gthr/auth/Landing"));
const Login = lazy(() => import("./components/b2gthr/auth/Login"));
const Signup = lazy(() => import("./components/b2gthr/auth/Signup"));
const B2GTHR = lazy(() => import("./components/b2gthr/B2GTHR"));

function App() {
  return (
    <Suspense
      fallback={
        <Loading fullScreen color="cyan" size="md" text="Loading App..." />
      }
    >
      <>
        {/* For the tempo routes */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

        <Routes>
          {/* B2GTHR App Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/b2gthr" element={<B2GTHR />} />

          {/* Legacy Home route - redirect to Landing */}
          <Route path="/home" element={<Navigate to="/" replace />} />

          {/* Add this before any catchall route */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}

          {/* Catch-all route - redirect to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
