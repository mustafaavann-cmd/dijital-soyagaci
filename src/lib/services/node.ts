import { createClient } from "@/lib/supabase/client";
import type {
  FamilyNode,
  FamilyEdge,
  CreateNodeInput,
  UpdateNodeInput,
  CreateEdgeInput,
} from "@/types";

const supabase = createClient();

// ==========================================
// NODE (FAMILY MEMBER) OPERATIONS
// ==========================================

export async function getNodes(treeId: string): Promise<FamilyNode[]> {
  const { data, error } = await supabase
    .from("nodes")
    .select("*")
    .eq("tree_id", treeId);

  if (error) {
    console.error("Error fetching nodes:", error);
    return [];
  }

  return data || [];
}

export async function getNode(nodeId: string): Promise<FamilyNode | null> {
  const { data, error } = await supabase
    .from("nodes")
    .select("*")
    .eq("id", nodeId)
    .single();

  if (error) {
    console.error("Error fetching node:", error);
    return null;
  }

  return data;
}

export async function createNode(
  userId: string,
  input: CreateNodeInput
): Promise<FamilyNode | null> {
  const { data, error } = await supabase
    .from("nodes")
    .insert({
      tree_id: input.tree_id,
      first_name: input.first_name,
      last_name: input.last_name,
      maiden_name: input.maiden_name || null,
      birth_date: input.birth_date || null,
      death_date: input.death_date || null,
      is_alive: input.is_alive ?? true,
      birth_place: input.birth_place || null,
      biography: input.biography || null,
      profile_image_url: input.profile_image_url || null,
      created_by: userId,
      gender: input.gender,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating node:", error);
    return null;
  }

  return data;
}

export async function updateNode(
  nodeId: string,
  updates: UpdateNodeInput
): Promise<FamilyNode | null> {
  const { data, error } = await supabase
    .from("nodes")
    .update(updates)
    .eq("id", nodeId)
    .select()
    .single();

  if (error) {
    console.error("Error updating node:", error);
    return null;
  }

  return data;
}

export async function deleteNode(nodeId: string): Promise<boolean> {
  // First, delete all edges connected to this node
  const { error: edgeError } = await supabase
    .from("edges")
    .delete()
    .or(`source_node_id.eq.${nodeId},target_node_id.eq.${nodeId}`);

  if (edgeError) {
    console.error("Error deleting edges for node:", edgeError);
    return false;
  }

  // Then delete the node
  const { error } = await supabase.from("nodes").delete().eq("id", nodeId);

  if (error) {
    console.error("Error deleting node:", error);
    return false;
  }

  return true;
}
