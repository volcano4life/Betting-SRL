import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

// Form schemas
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { t, language } = useLanguage();
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submissions
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData);
  };

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left side - Forms */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          {/* Tabs */}
          <div className="flex border-b border-muted">
            <button 
              className={`px-4 py-2 font-medium ${loginForm.formState.isSubmitted ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
              onClick={() => {
                document.getElementById('login-form')?.classList.remove('hidden');
                document.getElementById('register-form')?.classList.add('hidden');
              }}
            >
              {t('auth.login')}
            </button>
            <button 
              className={`px-4 py-2 font-medium ${registerForm.formState.isSubmitted ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
              onClick={() => {
                document.getElementById('login-form')?.classList.add('hidden');
                document.getElementById('register-form')?.classList.remove('hidden');
              }}
            >
              {t('auth.register')}
            </button>
          </div>

          {/* Login Form */}
          <div id="login-form" className="">
            <h2 className="text-2xl font-bold mb-6">{t('auth.welcomeBack')}</h2>
            <p className="text-muted-foreground mb-6">{t('auth.loginDesc')}</p>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="login-username" className="text-sm font-medium">
                  {t('auth.username')}
                </label>
                <input
                  id="login-username"
                  type="text"
                  placeholder={t('auth.usernamePlaceholder')}
                  className="w-full p-2 border border-input rounded-md"
                  {...loginForm.register("username")}
                />
                {loginForm.formState.errors.username && (
                  <p className="text-destructive text-sm">{loginForm.formState.errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm font-medium">
                  {t('auth.password')}
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder={t('auth.passwordPlaceholder')}
                  className="w-full p-2 border border-input rounded-md"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-destructive text-sm">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? t('auth.loginButton') + '...' : t('auth.loginButton')}
              </button>
            </form>
          </div>

          {/* Register Form */}
          <div id="register-form" className="hidden">
            <h2 className="text-2xl font-bold mb-6">{t('auth.createAccount')}</h2>
            <p className="text-muted-foreground mb-6">{t('auth.registerDesc')}</p>
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="register-username" className="text-sm font-medium">
                  {t('auth.username')}
                </label>
                <input
                  id="register-username"
                  type="text"
                  placeholder={t('auth.usernamePlaceholder')}
                  className="w-full p-2 border border-input rounded-md"
                  {...registerForm.register("username")}
                />
                {registerForm.formState.errors.username && (
                  <p className="text-destructive text-sm">{registerForm.formState.errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="register-password" className="text-sm font-medium">
                  {t('auth.password')}
                </label>
                <input
                  id="register-password"
                  type="password"
                  placeholder={t('auth.passwordPlaceholder')}
                  className="w-full p-2 border border-input rounded-md"
                  {...registerForm.register("password")}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-destructive text-sm">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="register-confirm-password" className="text-sm font-medium">
                  {t('auth.confirmPassword')}
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  className="w-full p-2 border border-input rounded-md"
                  {...registerForm.register("confirmPassword")}
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-destructive text-sm">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? t('auth.registerButton') + '...' : t('auth.registerButton')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="w-full md:w-1/2 bg-gradient-to-r from-primary/20 to-primary p-8 text-white hidden md:flex md:flex-col md:justify-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-4">{t('auth.heroTitle')}</h1>
          <p className="text-lg mb-6">
            {t('auth.heroDescription')}
          </p>
          <ul className="space-y-4 mb-6">
            <li className="flex">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold">{t('auth.feature1Title')}</h3>
                <p className="text-sm opacity-90">{t('auth.feature1Desc')}</p>
              </div>
            </li>
            <li className="flex">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold">{t('auth.feature2Title')}</h3>
                <p className="text-sm opacity-90">{t('auth.feature2Desc')}</p>
              </div>
            </li>
          </ul>
          <Link href="/" className="inline-block bg-white text-primary px-4 py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors">
            {t('nav.home')}
          </Link>
        </div>
      </div>
    </div>
  );
}