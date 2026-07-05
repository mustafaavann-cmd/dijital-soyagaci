"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Edit, Trash2, Save, X, Loader2 } from "lucide-react";
import type { FamilyNode, Gender } from "@/types";

interface MemberDetailSheetProps {
  node: FamilyNode;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Partial<FamilyNode>) => Promise<void>;
  onDelete: (nodeId: string) => Promise<void>;
}

export function MemberDetailSheet({
  node,
  onClose,
  onUpdate,
  onDelete,
}: MemberDetailSheetProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: node.first_name,
    last_name: node.last_name,
    maiden_name: node.maiden_name || "",
    gender: node.gender,
    birth_date: node.birth_date || "",
    death_date: node.death_date || "",
    is_alive: node.is_alive,
    birth_place: node.birth_place || "",
    biography: node.biography || "",
    profile_image_url: node.profile_image_url || "",
  });

  const getInitials = () =>
    `${node.first_name[0] || ""}${node.last_name[0] || ""}`.toUpperCase();

  const getGenderLabel = (g: Gender) => {
    const labels: Record<Gender, string> = { Male: "Erkek", Female: "Kadın", Other: "Diğer" };
    return labels[g];
  };

  const formatDate = (d: string | null) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });
  };

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(node.id, formData);
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("Bu üyeyi silmek istediğinizden emin misiniz?")) return;
    setDeleting(true);
    await onDelete(node.id);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l shadow-xl flex flex-col animate-in slide-in-from-right">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Üye Detayları</h2>
        <div className="flex items-center gap-2">
          {!editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={node.profile_image_url || undefined} />
            <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{node.first_name} {node.last_name}</h3>
            <p className="text-sm text-muted-foreground">
              {getGenderLabel(node.gender)}
              {node.maiden_name && ` · Kızlık Soyadı: ${node.maiden_name}`}
            </p>
          </div>
        </div>

        <Separator />

        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ad</Label>
                <Input value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Soyad</Label>
                <Input value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kızlık Soyadı</Label>
              <Input value={formData.maiden_name} onChange={(e) => setFormData({ ...formData, maiden_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Cinsiyet</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}>
                <option value="Male">Erkek</option>
                <option value="Female">Kadın</option>
                <option value="Other">Diğer</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Doğum Tarihi</Label>
                <Input type="date" value={formData.birth_date} onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Ölüm Tarihi</Label>
                <Input type="date" value={formData.death_date} disabled={formData.is_alive} onChange={(e) => setFormData({ ...formData, death_date: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="editIsAlive" checked={formData.is_alive} onChange={(e) => setFormData({ ...formData, is_alive: e.target.checked, death_date: e.target.checked ? "" : formData.death_date })} className="h-4 w-4 rounded" />
              <Label htmlFor="editIsAlive" className="text-sm font-normal">Hayatta</Label>
            </div>
            <div className="space-y-2">
              <Label>Doğum Yeri</Label>
              <Input value={formData.birth_place} onChange={(e) => setFormData({ ...formData, birth_place: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Profil Resmi URL</Label>
              <Input value={formData.profile_image_url} onChange={(e) => setFormData({ ...formData, profile_image_url: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Biyografi</Label>
              <Textarea rows={3} value={formData.biography} onChange={(e) => setFormData({ ...formData, biography: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Kaydediliyor...</> : <><Save className="mr-2 h-4 w-4" />Kaydet</>}
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)}>İptal</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Doğum Tarihi" value={formatDate(node.birth_date)} />
              <InfoItem label="Ölüm Tarihi" value={node.is_alive ? "Hayatta" : formatDate(node.death_date)} />
            </div>
            {node.birth_place && <InfoItem label="Doğum Yeri" value={node.birth_place} />}
            {node.maiden_name && <InfoItem label="Kızlık Soyadı" value={node.maiden_name} />}
            {node.biography && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Biyografi</p>
                <p className="text-sm">{node.biography}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <Button variant="destructive" className="w-full" onClick={handleDelete} disabled={deleting}>
          {deleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Siliniyor...</> : <><Trash2 className="mr-2 h-4 w-4" />Üyeyi Sil</>}
        </Button>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}