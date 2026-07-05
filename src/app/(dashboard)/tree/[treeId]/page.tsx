"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge as RFEdge,
  type Node as RFNode,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { createClient } from "@/lib/supabase/client";
import { getTree } from "@/lib/services/tree";
import { getNodes, createNode, updateNode, deleteNode } from "@/lib/services/node";
import { getEdges, createEdge, deleteEdge } from "@/lib/services/edge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FamilyMemberNode from "@/components/tree/family-member-node";
import { MemberDialog, type MemberFormData } from "@/components/tree/member-dialog";
import { MemberDetailSheet } from "@/components/tree/member-detail-sheet";
import { Plus, ArrowLeft, Loader2, TreePine } from "lucide-react";
import type { Tree, FamilyNode, FamilyEdge, RelationType } from "@/types";

const nodeTypes = { familyMember: FamilyMemberNode };

export default function TreePage() {
  const params = useParams();
  const router = useRouter();
  const treeId = params.treeId as string;
  const supabase = createClient();

  const [tree, setTree] = useState<Tree | null>(null);
  const [familyNodes, setFamilyNodes] = useState<FamilyNode[]>([]);
  const [familyEdges, setFamilyEdges] = useState<FamilyEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addRelationType, setAddRelationType] = useState<RelationType>("Parent-Child");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<FamilyNode | null>(null);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push("/login"); return; }
      setUser(authUser);

      const treeData = await getTree(treeId);
      if (!treeData) { router.push("/dashboard"); return; }
      setTree(treeData);

      const [nodesData, edgesData] = await Promise.all([
        getNodes(treeId),
        getEdges(treeId),
      ]);
      setFamilyNodes(nodesData);
      setFamilyEdges(edgesData);
      setLoading(false);
    };
    loadData();
  }, [treeId, supabase.auth, router]);

  // Convert family nodes/edges to ReactFlow format
  useEffect(() => {
    const rfNodes: RFNode[] = familyNodes.map((fn, index) => ({
      id: fn.id,
      type: "familyMember",
      position: { x: (index % 4) * 250, y: Math.floor(index / 4) * 200 },
      data: {
        label: `${fn.first_name} ${fn.last_name}`,
        firstName: fn.first_name,
        lastName: fn.last_name,
        gender: fn.gender,
        birthDate: fn.birth_date,
        deathDate: fn.death_date,
        isAlive: fn.is_alive,
        profileImageUrl: fn.profile_image_url,
        birthPlace: fn.birth_place,
        biography: fn.biography,
      },
    }));

    const rfEdges: RFEdge[] = familyEdges.map((fe) => ({
      id: fe.id,
      source: fe.source_node_id,
      target: fe.target_node_id,
      type: "smoothstep",
      animated: fe.relation_type === "Spouse",
      label: fe.relation_type === "Spouse" ? "Eş" : fe.relation_type === "Sibling" ? "Kardeş" : "",
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: fe.relation_type === "Spouse" ? "#ec4899" : "#6b7280" },
    }));

    setNodes(rfNodes);
    setEdges(rfEdges);
  }, [familyNodes, familyEdges, setNodes, setEdges]);

  const handleAddMember = async (data: MemberFormData) => {
    if (!user) return;
    const newNode = await createNode(user.id, {
      tree_id: treeId,
      first_name: data.first_name,
      last_name: data.last_name,
      maiden_name: data.maiden_name || undefined,
      gender: data.gender,
      birth_date: data.birth_date || undefined,
      death_date: data.death_date || undefined,
      is_alive: data.is_alive,
      birth_place: data.birth_place || undefined,
      biography: data.biography || undefined,
      profile_image_url: data.profile_image_url || undefined,
    });
    if (newNode) {
      setFamilyNodes((prev) => [...prev, newNode]);
      setAddDialogOpen(false);
    }
  };

  const handleUpdateMember = async (nodeId: string, data: Partial<FamilyNode>) => {
    const updated = await updateNode(nodeId, data);
    if (updated) {
      setFamilyNodes((prev) => prev.map((n) => (n.id === nodeId ? updated : n)));
      setSelectedNode(updated);
    }
  };

  const handleDeleteMember = async (nodeId: string) => {
    const success = await deleteNode(nodeId);
    if (success) {
      setFamilyNodes((prev) => prev.filter((n) => n.id !== nodeId));
      setFamilyEdges((prev) => prev.filter((e) => e.source_node_id !== nodeId && e.target_node_id !== nodeId));
      setSelectedNode(null);
      setSelectedNodeId(null);
    }
  };

  const onConnect = useCallback((connection: Connection) => {
    setPendingConnection(connection);
    setConnectDialogOpen(true);
  }, []);

  const handleConnectConfirm = async (relationType: RelationType) => {
    if (!pendingConnection || !pendingConnection.source || !pendingConnection.target) return;
    const newEdge = await createEdge({
      tree_id: treeId,
      source_node_id: pendingConnection.source,
      target_node_id: pendingConnection.target,
      relation_type: relationType,
    });
    if (newEdge) {
      setFamilyEdges((prev) => [...prev, newEdge]);
      setConnectDialogOpen(false);
      setPendingConnection(null);
    }
  };

  const onNodeClick = useCallback((_: React.MouseEvent, node: RFNode) => {
    setSelectedNodeId(node.id);
    const fn = familyNodes.find((n) => n.id === node.id);
    setSelectedNode(fn || null);
  }, [familyNodes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-57px)] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Geri
          </Button>
          <div className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-green-600" />
            <h1 className="text-lg font-semibold">{tree?.name}</h1>
          </div>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Üye Ekle
        </Button>
      </div>

      {/* ReactFlow Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Add Member Dialog */}
      <MemberDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleAddMember}
        title="Yeni Üye Ekle"
      />

      {/* Connect Dialog */}
      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bağlantı Türü Seçin</DialogTitle>
            <DialogDescription>Bu iki kişi arasındaki ilişki türünü seçin.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 py-4">
            <Button variant="outline" className="justify-start h-auto py-3" onClick={() => handleConnectConfirm("Parent-Child")}>
              <div className="text-left"><p className="font-medium">Anne-Baba / Çocuk</p><p className="text-xs text-muted-foreground">Üst-Alt hiyerarşik ilişki</p></div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3" onClick={() => handleConnectConfirm("Spouse")}>
              <div className="text-left"><p className="font-medium">Eş</p><p className="text-xs text-muted-foreground">Evlilik ilişkisi</p></div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3" onClick={() => handleConnectConfirm("Sibling")}>
              <div className="text-left"><p className="font-medium">Kardeş</p><p className="text-xs text-muted-foreground">Kardeşlik ilişkisi</p></div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Member Detail Sheet */}
      {selectedNode && (
        <MemberDetailSheet
          node={selectedNode}
          onClose={() => { setSelectedNode(null); setSelectedNodeId(null); }}
          onUpdate={handleUpdateMember}
          onDelete={handleDeleteMember}
        />
      )}
    </div>
  );
}