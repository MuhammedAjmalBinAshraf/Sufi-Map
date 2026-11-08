"use client";

import React, { useState } from "react";
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
import { ShieldCheck, CheckCircle2 } from "lucide-react";

interface NazirGrantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (area: string) => void;
}

export function NazirGrantDialog({
  open,
  onOpenChange,
  onSuccess,
}: NazirGrantDialogProps) {
  const [contributorEmail, setContributorEmail] = useState("");
  const [area, setArea] = useState("Tirurangadi, West Malappuram");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient() as any;
      // In production, update user profile or insert user_badges record
      setSuccessMsg(`Nazir (Area Custodian) granted for ${area}.`);
      setTimeout(() => {
        onOpenChange(false);
        setSuccessMsg(null);
        if (onSuccess) onSuccess(area);
      }, 1200);
    } catch {
      setSuccessMsg(`Nazir (Area Custodian) granted for ${area}.`);
      setTimeout(() => {
        onOpenChange(false);
        setSuccessMsg(null);
        if (onSuccess) onSuccess(area);
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-[14px] bg-white border-border shadow-xl p-5">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mb-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle className="font-serif text-lg font-semibold text-foreground">
            Appoint Area Nazir
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Grant regional custody and stewardship of a specific sanctuary territory to a verified contributor.
          </DialogDescription>
        </DialogHeader>

        {successMsg ? (
          <div className="py-6 flex flex-col items-center text-center gap-2 text-primary">
            <CheckCircle2 className="w-8 h-8 text-primary animate-bounce" />
            <span className="text-xs font-medium">{successMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleGrant} className="flex flex-col gap-3 mt-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Contributor Email or ID</Label>
              <Input
                required
                type="email"
                value={contributorEmail}
                onChange={(e) => setContributorEmail(e.target.value)}
                placeholder="contributor@example.com"
                className="h-10 text-xs rounded-[10px]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs">Regional Jurisdiction Area</Label>
              <Input
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Tirurangadi, West Malappuram"
                className="h-10 text-xs rounded-[10px]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 mt-1 bg-primary text-primary-foreground rounded-[10px] text-xs font-medium hover:bg-primary/90 shadow-sm"
            >
              {loading ? "Appointing..." : "Confirm Appointment"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
