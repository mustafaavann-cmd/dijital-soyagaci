import { createClient } from "@/lib/supabase/client";
import type { FamilyEdge, CreateEdgeInput } from "@/types";

const supabase = createClient();

// ==========================================
// EDGE (RELATIONSHIP) OPERATIONS
// ==========================================

export async function getEdges(treeId: string): Promise<FamilyEdge[]> {
  const { data, error } = await supabase
    .from("edges")
    .select("*")
    .eq("tree_id", treeId);

  if (error) {
    console.error("Error fetching edges:", error);
    return [];
  }

  return data || [];
}

export async function createEdge(
  input: CreateEdgeInput
): Promise<FamilyEdge | null> {
  const { data, error } = await supabase
    .from("edges")
    .insert({
      tree_id: input.tree_id,
      source_node_id: input.source_node_id,
      target_node_id: input.target_node_id,
      relation_type: input.relation_type,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating edge:", error);
    return null;
  }

  return data;
}

export async function deleteEdge(edgeId: string): Promise<boolean> {
  const { error } = await supabase.from("edges").delete().eq("id", edgeId);

  if (error) {
    console.error("Error deleting edge:", error);
    return false;
  }

  return true;
}

export async function deleteEdgesByNode(nodeId: string): Promise<boolean> {
  const { error } = await supabase
    .from("edges")
    .delete()
    .or(`source_node_id.eq.${nodeId},target_node_id.eq.${nodeId}`);

  if (error) {
    console.error("Error deleting edges by node:", error);
    return false;
  }

  return true;
}
