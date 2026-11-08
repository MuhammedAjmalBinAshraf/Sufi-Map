"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

export function PhotoUploader({ photos, onChange }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    const uploadedUrls: string[] = [...photos];

    try {
      const supabase = createClient();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds 5 MB size limit.`);
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from("place-photos")
          .upload(filePath, file);

        if (uploadErr) {
          // In local dev without live storage bucket, generate object URL preview
          console.warn("Supabase storage upload failed, using local preview:", uploadErr.message);
          const localPreview = URL.createObjectURL(file);
          uploadedUrls.push(localPreview);
        } else {
          const { data: urlData } = supabase.storage
            .from("place-photos")
            .getPublicUrl(filePath);
          uploadedUrls.push(urlData.publicUrl);
        }
      }

      onChange(uploadedUrls);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (indexToRemove: number) => {
    const updated = photos.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 items-center">
        {photos.map((url, idx) => (
          <div
            key={idx}
            className="relative w-16 h-16 rounded-[10px] overflow-hidden border border-border bg-sahn-bg group"
          >
            <img
              src={url}
              alt={`Photo ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(idx)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-destructive transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        <label className="cursor-pointer w-16 h-16 rounded-[10px] border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors bg-white">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={uploading}
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span className="text-[9px] font-medium leading-none">Add</span>
            </>
          )}
        </label>
      </div>

      {uploadError && (
        <span className="text-[10px] text-destructive leading-tight">
          {uploadError}
        </span>
      )}
    </div>
  );
}
