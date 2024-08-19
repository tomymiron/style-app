import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Landing, Dashboard, Register, Login, ClientViewer, Booking } from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AnimatePresence } from "framer-motion";
const queryClient = new QueryClient();

export default function App() {
  return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                  <AppRoutes />
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
}

function AppRoutes() {
  const location = useLocation();

  return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route index element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<HandlerLogin component={<Login />} />} />
          <Route path="/dashboard" element={<ProtectedRoute component={<Dashboard />} />} />
          <Route path="/01" element={<ClientViewer />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </AnimatePresence>
  );
}

function ProtectedRoute({ component }) {
  const { authState } = useAuth();

  if (authState?.authenticated == null) return <div>Cargando...</div>;
  return authState.authenticated ? component : <Navigate to="/login" />;
}
function HandlerLogin({ component }) {
  const { authState } = useAuth();

  if (authState?.authenticated == null) return <div>Cargando...</div>;
  return authState.authenticated != true ? component : <Navigate to="/dashboard" />;
}