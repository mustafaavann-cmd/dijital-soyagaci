"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getTrees, createTree } from "@/lib/services/tree";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TreePine, Plus, Loader2, Calendar, Lock, Globe } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { Tree } from "@/types";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTreeName, setNewTreeName] = useState("");
  const [newTreeDescription, setNewTreeDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);
      const userTrees = await getTrees(user.id);
      setTrees(userTrees);
      setLoading(false);
    };
    loadData();
  }, [supabase.auth, router]);

  const handleCreateTree = async () => {
    if (!user || !newTreeName.trim()) return;
    setCreating(true);
    const newTree = await createTree(user.id, { name: newTreeName.trim(), description: newTreeDescription.trim() || undefined });
    if (newTree) {
      setTrees([newTree, ...trees]);
      setCreateDialogOpen(false);
      setNewTreeName("");
      setNewTreeDescription("");
      router.push(`/tree/${newTree.id}`);
    }
    setCreating(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Soyağaçlarım</h1>
          <p className="text-muted-foreground mt-1">Aile ağaçlarınızı oluşturun ve yönetin</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Yeni Ağaç Oluştur</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Soyağacı Oluştur</DialogTitle>
              <DialogDescription>Yeni bir aile ağacı oluşturmak için aşağıdaki bilgileri doldurun.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="treeName">Ağaç Adı</Label>
                <Input id="treeName" placeholder="Örn: Babamin Ailesi" value={newTreeName} onChange={(e) => setNewTreeName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="treeDescription">Açıklama (Opsiyonel)</Label>
                <Textarea id="treeDescription" placeholder="Ağacınız hakkında kısa bir açıklama..." value={newTreeDescription} onChange={(e) => setNewTreeDescription(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>İptal</Button>
              <Button onClick={handleCreateTree} disabled={!newTreeName.trim() || creating}>
                {creating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Oluşturuluyor...</>) : ("Oluştur")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {trees.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <TreePine className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Henüz ağaç oluşturmadınız</h3>
            <p className="text-muted-foreground mb-4">İlk aile ağacınızı oluşturarak başlayın</p>
            <Button onClick={() => setCreateDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />İlk Ağacınızı Oluşturun</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trees.map((tree) => (
            <Card key={tree.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push(`/tree/${tree.id}`)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <TreePine className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tree.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {tree.is_public ? (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground"><Globe className="h-3 w-3" />Herkese Açık</span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" />Özel</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {tree.description && (<CardDescription className="mb-4 line-clamp-2">{tree.description}</CardDescription>)}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(tree.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
