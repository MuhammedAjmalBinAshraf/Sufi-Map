import { useState } from "react";
import { Loader2, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { t } = useI18n();
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          toast.error(error.message || "Failed to sign in");
        } else {
          toast.success(t("authSuccessSignIn"));
          onOpenChange(false);
          setEmail("");
          setPassword("");
        }
      } else {
        const { error } = await signUpWithEmail(email, password, fullName);
        if (error) {
          toast.error(error.message || "Failed to create account");
        } else {
          toast.success(t("authSuccessSignUp"));
          onOpenChange(false);
          setEmail("");
          setPassword("");
          setFullName("");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(error.message || "Google sign in failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      toast.success(t("authSuccessSignOut"));
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[14px] bg-card p-6 shadow-float">
        <DialogHeader className="space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-[14px] bg-primary/10 text-primary">
            <UserIcon className="size-6" />
          </div>
          <DialogTitle className="text-center font-serif text-xl tracking-tight text-foreground">
            {user ? t("account") : mode === "signin" ? t("signIn") : t("signUp")}
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-muted-foreground leading-relaxed">
            {user ? t("signedInAs", { email: user.email || "" }) : t("authPrompt")}
          </DialogDescription>
        </DialogHeader>

        {user ? (
          <div className="space-y-4 pt-2">
            <div className="rounded-[12px] border bg-accent/40 p-4 text-center">
              <p className="text-xs text-muted-foreground">Logged in with</p>
              <p className="font-medium text-sm text-foreground mt-0.5">{user.email}</p>
            </div>

            <Button
              variant="outline"
              onClick={handleSignOut}
              disabled={loading}
              className="w-full rounded-[12px] h-11 text-sm font-medium border-border hover:bg-destructive/10 hover:text-destructive flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
              <span>{t("signOut")}</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full rounded-[12px] h-11 border-border bg-card hover:bg-accent font-medium text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{t("googleSignIn")}</span>
            </Button>

            {/* Subtle Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-3 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                {t("orEmail")}
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="auth-name" className="text-xs font-medium text-foreground">
                    {t("fullName")}
                  </Label>
                  <Input
                    id="auth-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Zainuddin Makhdum"
                    className="h-10 rounded-[10px] text-[16px] md:text-sm bg-card"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="auth-email" className="text-xs font-medium text-foreground">
                  {t("email")}
                </Label>
                <Input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="h-10 rounded-[10px] text-[16px] md:text-sm bg-card"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="auth-password" className="text-xs font-medium text-foreground">
                  {t("password")}
                </Label>
                <Input
                  id="auth-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 rounded-[10px] text-[16px] md:text-sm bg-card"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-[12px] h-11 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-hover transition-all duration-200 mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LogIn className="size-4 rtl:-scale-x-100" />
                )}
                <span>{mode === "signin" ? t("signIn") : t("signUp")}</span>
              </Button>
            </form>

            {/* Switch between Sign In and Sign Up */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-xs text-primary hover:underline font-medium"
              >
                {mode === "signin"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
