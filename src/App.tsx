import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import Loading from "./components/ui/loading";
import { useAuth } from "./contexts/AuthContext";

// Lazy load components for better performance
const LandingPage = lazy(() => import("./components/LandingPage"));
const Login = lazy(() => import("./components/b2gthr/auth/Login"));
const Signup = lazy(() => import("./components/b2gthr/auth/Signup"));
const B2GTHR = lazy(() => import("./components/b2gthr/B2GTHR"));
const ForgotPassword = lazy(
  () => import("./components/b2gthr/auth/ForgotPassword"),
);
const ResetPassword = lazy(
  () => import("./components/b2gthr/auth/ResetPassword"),
);
const InvestmentOpportunities = lazy(
  () => import("./components/InvestmentOpportunities"),
);
const FundingSchedule = lazy(() => import("./components/FundingSchedule"));
const Roadmap = lazy(() => import("./components/Roadmap"));

// Protected route component
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Loading
        fullScreen
        color="cyan"
        size="md"
        text="Checking authentication..."
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Public route that redirects authenticated users
const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Loading
        fullScreen
        color="cyan"
        size="md"
        text="Checking authentication..."
      />
    );
  }

  if (user) {
    return <Navigate to="/b2gthr" replace />;
  }

  return <Outlet />;
};

// Public route that doesn't redirect authenticated users
const OpenRoute = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Loading
        fullScreen
        color="cyan"
        size="md"
        text="Checking authentication..."
      />
    );
  }

  return <Outlet />;
};

function App() {
  const { loading } = useAuth();
  // Move useRoutes hook outside of conditional rendering
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  if (loading) {
    return <Loading fullScreen color="cyan" size="md" text="Loading App..." />;
  }

  return (
    <Suspense
      fallback={
        <Loading fullScreen color="cyan" size="md" text="Loading App..." />
      }
    >
      <>
        {/* For the tempo routes */}
        {tempoRoutes}

        <Routes>
          {/* Open Routes (accessible to all) */}
          <Route element={<OpenRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/investment" element={<InvestmentOpportunities />} />
            <Route path="/funding-schedule" element={<FundingSchedule />} />
            <Route path="/roadmap" element={<Roadmap />} />
          </Route>

          {/* Public Routes (redirect if authenticated) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/b2gthr" element={<B2GTHR />} />
          </Route>

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
