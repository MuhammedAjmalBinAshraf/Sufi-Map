"use client";

import React, { useState } from "react";
import { Database } from "@/types/database";
import { ModerationQueue } from "@/components/admin/ModerationQueue";
import { QuoteManager } from "@/components/admin/QuoteManager";
import { NazirGrantDialog } from "@/components/admin/NazirGrantDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Quote as QuoteIcon, Users, UserCheck } from "lucide-react";

type Quote = Database["public"]["Tables"]["quotes"]["Row"];

interface AdminDashboardProps {
  initialQuotes: Quote[];
}

export function AdminDashboard({ initialQuotes }: AdminDashboardProps) {
  const [nazirDialogOpen, setNazirDialogOpen] = useState(false);
  const [activeAreaNotice, setActiveAreaNotice] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {/* Quick Action Banner */}
      <div className="p-3.5 rounded-[14px] bg-white border border-border shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-foreground block">
              Regional Stewardship
            </span>
            <span className="text-[10px] text-muted-foreground">
              Appoint an area Nazir custodian
            </span>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => setNazirDialogOpen(true)}
          className="h-8 text-xs rounded-[8px] bg-primary text-primary-foreground"
        >
          Appoint Nazir
        </Button>
      </div>

      {activeAreaNotice && (
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">
          {activeAreaNotice}
        </div>
      )}

      {/* Admin Tabs */}
      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="grid grid-cols-2 h-10 p-1 bg-white border border-border rounded-[12px] shadow-sm mb-4">
          <TabsTrigger
            value="queue"
            className="text-xs font-medium rounded-[8px] data-[state=active]:bg-sahn-bg data-[state=active]:text-primary"
          >
            Review Queue
          </TabsTrigger>
          <TabsTrigger
            value="quotes"
            className="text-xs font-medium rounded-[8px] data-[state=active]:bg-sahn-bg data-[state=active]:text-primary"
          >
            Manage Quotes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          <ModerationQueue />
        </TabsContent>

        <TabsContent value="quotes">
          <QuoteManager initialQuotes={initialQuotes} />
        </TabsContent>
      </Tabs>

      <NazirGrantDialog
        open={nazirDialogOpen}
        onOpenChange={setNazirDialogOpen}
        onSuccess={(area) => {
          setActiveAreaNotice(`Nazir badge successfully assigned for ${area}.`);
          setTimeout(() => setActiveAreaNotice(null), 4000);
        }}
      />
    </div>
  );
}
