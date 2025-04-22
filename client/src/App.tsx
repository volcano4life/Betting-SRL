import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ReviewListingPage from "@/pages/ReviewListingPage";
import ReviewDetailPage from "@/pages/ReviewDetailPage";
import AuthPage from "@/pages/AuthPage";
import AdminPage from "@/pages/AdminPage";
import ChangePasswordPage from "@/pages/ChangePasswordPage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location === "/admin";
  const isAuthRoute = location === "/auth";
  
  // Don't show header/footer on admin page
  const showHeaderFooter = !isAdminRoute && !isAuthRoute;
  
  return (
    <>
      {showHeaderFooter && <Header />}
      <main className={`flex-grow ${!showHeaderFooter ? 'min-h-screen' : ''}`}>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/reviews" component={ReviewListingPage} />
          <Route path="/reviews/:slug" component={ReviewDetailPage} />
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/admin" component={AdminPage} adminOnly={true} />
          <ProtectedRoute path="/change-password" component={ChangePasswordPage} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      {showHeaderFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <div className="min-h-screen flex flex-col">
              <Router />
            </div>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
