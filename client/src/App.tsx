import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ReviewListingPage from "@/pages/ReviewListingPage";
import ReviewDetailPage from "@/pages/ReviewDetailPage";
import NewsDetailPage from "@/pages/NewsDetailPage";
import NewsListingPage from "@/pages/NewsListingPage";
import AuthPage from "@/pages/AuthPage";
import AdminPage from "@/pages/AdminPage";
import ChangePasswordPage from "@/pages/ChangePasswordPage";
import AboutUsPage from "@/pages/AboutUsPage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageWithSidebars from "@/components/layout/PageWithSidebars";
import CookieConsent from "@/components/common/CookieConsent";
import { LanguageProvider } from "./contexts/LanguageContext";
import { LogoProvider } from "./contexts/LogoContext";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import PageTransition from "@/components/ui/page-transition";

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location === "/admin";
  const isAuthRoute = location === "/auth";
  
  // Don't show header/footer on admin page
  const showHeaderFooter = !isAdminRoute && !isAuthRoute;

  // Determine the appropriate transition type based on the route
  const getTransitionType = () => {
    if (isAdminRoute) return 'fade';
    if (isAuthRoute) return 'scale';
    if (location.includes('/reviews/')) return 'slideDown';
    if (location === '/reviews') return 'slideUp';
    if (location === '/change-password') return 'slide';
    return 'slideUp';
  };
  
  return (
    <>
      {showHeaderFooter && <Header />}
      <main className={`flex-grow ${!showHeaderFooter ? 'min-h-screen' : 'pt-20'}`}>
        <PageTransition location={location} type={getTransitionType()} duration={0.4}>
          {showHeaderFooter ? (
            <PageWithSidebars>
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/reviews" component={ReviewListingPage} />
                <Route path="/reviews/:slug" component={ReviewDetailPage} />
                <Route path="/news" component={NewsListingPage} />
                <Route path="/news/:slug" component={NewsDetailPage} />
                <ProtectedRoute path="/change-password" component={ChangePasswordPage} />
                {/* Fallback to 404 */}
                <Route component={NotFound} />
              </Switch>
            </PageWithSidebars>
          ) : (
            <Switch>
              <Route path="/auth" component={AuthPage} />
              <ProtectedRoute path="/admin" component={AdminPage} adminOnly={true} />
              {/* Fallback to 404 */}
              <Route component={NotFound} />
            </Switch>
          )}
        </PageTransition>
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
          <LogoProvider>
            <TooltipProvider>
              <Toaster />
              <div className="min-h-screen flex flex-col">
                <Router />
                <CookieConsent />
              </div>
            </TooltipProvider>
          </LogoProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
