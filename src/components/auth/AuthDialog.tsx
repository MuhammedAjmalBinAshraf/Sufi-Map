"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Compass, Sparkles, CheckCircle2 } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
  const t = useTranslations("auth");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const supabase = createClient();
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        setSuccessMsg(
          "Account created successfully. You are now signed in as a contributor."
        );
        setTimeout(() => {
          onOpenChange(false);
          if (onSuccess) onSuccess();
        }, 1200);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg("Welcome back to Sufi Map.");
        setTimeout(() => {
          onOpenChange(false);
          if (onSuccess) onSuccess();
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(
        err.message || "An error occurred during authentication. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-[14px] bg-white border-border shadow-xl p-5">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mb-2">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="font-serif text-lg font-semibold text-foreground">
            {isSignUp ? t("signUp") : t("signIn")}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            {t("loginPrompt")}
          </DialogDescription>
        </DialogHeader>

        {successMsg ? (
          <div className="py-6 flex flex-col items-center text-center gap-2 text-primary">
            <CheckCircle2 className="w-8 h-8 text-primary animate-bounce" />
            <span className="text-xs font-medium">{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-2">
            {isSignUp && (
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-foreground font-medium">
                  {t("fullName")}
                </Label>
                <Input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ahmad Kutty"
                  className="h-10 text-xs rounded-[10px] border-border"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-foreground font-medium">
                {t("email")}
              </Label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-10 text-xs rounded-[10px] border-border"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-foreground font-medium">
                {t("password")}
              </Label>
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10 text-xs rounded-[10px] border-border"
              />
            </div>

            {errorMsg && (
              <p className="text-[11px] text-destructive bg-destructive/10 p-2 rounded-md leading-tight">
                {errorMsg}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-1 bg-primary text-primary-foreground rounded-[10px] text-xs font-medium hover:bg-primary/90 shadow-sm"
            >
              {loading
                ? "Processing..."
                : isSignUp
                ? t("signUp")
                : t("signIn")}
            </Button>

            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
              }}
              className="text-[11px] text-muted-foreground hover:text-foreground text-center mt-1"
            >
              {isSignUp ? t("alreadyHaveAccount") : t("needAccount")}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
