"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { Gender, FamilyNode } from "@/types";

interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: MemberFormData) => Promise<void>;
  initialData?: FamilyNode | null;
  title: string;
}

export interface MemberFormData {
  first_name: string;
  last_name: string;
  maiden_name: string;
  gender: Gender;
  birth_date: string;
  death_date: string;
  is_alive: boolean;
  birth_place: string;
  biography: string;
  profile_image_url: string;
}

export function MemberDialog({
  open,
  onOpenChange,
  onSave,
  initialData,
  title,
}: MemberDialogProps) {
  const [formData, setFormData] = useState<MemberFormData>({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    maiden_name: initialData?.maiden_name || "",
    gender: initialData?.gender || "Male",
    birth_date: initialData?.birth_date || "",
    death_date: initialData?.death_date || "",
    is_alive: initialData?.is_alive ?? true,
    birth_place: initialData?.birth_place || "",
    biography: initialData?.biography || "",
    profile_image_url: initialData?.profile_image_url || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Aile üyesi bilgilerini doldurun. Zorunlu alanlar (*) ile işaretlidir.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Ad *</Label>
            <Input
              id="firstName"
              placeholder="Adı"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Soyad *</Label>
            <Input
              id="lastName"
              placeholder="Soyadı"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maidenName">Kızlık Soyadı</Label>
            <Input
              id="maidenName"
              placeholder="Kızlık soyadı (opsiyonel)"
              value={formData.maiden_name}
              onChange={(e) =>
                setFormData({ ...formData, maiden_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Cinsiyet *</Label>
            <select
              id="gender"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value as Gender })
              }
            >
              <option value="Male">Erkek</option>
              <option value="Female">Kadın</option>
              <option value="Other">Diğer</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Doğum Tarihi</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birth_date}
              onChange={(e) =>
                setFormData({ ...formData, birth_date: e.target.value })
              }
            />
          </div>
          <div className="space-y-2 flex items-end gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="deathDate">Ölüm Tarihi</Label>
              <Input
                id="deathDate"
                type="date"
                value={formData.death_date}
                disabled={formData.is_alive}
                onChange={(e) =>
                  setFormData({ ...formData, death_date: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2 pb-0.5">
              <input
                type="checkbox"
                id="isAlive"
                checked={formData.is_alive}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_alive: e.target.checked,
                    death_date: e.target.checked ? "" : formData.death_date,
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isAlive" className="text-sm font-normal">
                Hayatta
              </Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthPlace">Doğum Yeri</Label>
            <Input
              id="birthPlace"
              placeholder="Doğum yeri"
              value={formData.birth_place}
              onChange={(e) =>
                setFormData({ ...formData, birth_place: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profileImageUrl">Profil Resmi URL</Label>
            <Input
              id="profileImageUrl"
              placeholder="https://..."
              value={formData.profile_image_url}
              onChange={(e) =>
                setFormData({ ...formData, profile_image_url: e.target.value })
              }
            />
          </div>
          <div className="col-span-full space-y-2">
            <Label htmlFor="biography">Biyografi</Label>
            <Textarea
              id="biography"
              placeholder="Kişi hakkında kısa bilgi..."
              rows={3}
              value={formData.biography}
              onChange={(e) =>
                setFormData({ ...formData, biography: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.first_name.trim() || !formData.last_name.trim() || saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              "Kaydet"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
