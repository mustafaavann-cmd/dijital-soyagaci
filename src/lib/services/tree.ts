import { createClient } from "@/lib/supabase/client";
import type {
  Tree,
  FamilyNode,
  FamilyEdge,
  CreateTreeInput,
  CreateNodeInput,
  UpdateNodeInput,
  CreateEdgeInput,
  Profile,
} from "@/types";

const supabase = createClient();

// ==========================================
// PROFILE OPERATIONS
// ==========================================

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    return null;
  }

  return data;
}

// ==========================================
// TREE OPERATIONS
// ==========================================

export async function getTrees(userId: string): Promise<Tree[]> {
  const { data, error } = await supabase
    .from("trees")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching trees:", error);
    return [];
  }

  return data || [];
}

export async function getTree(treeId: string): Promise<Tree | null> {
  const { data, error } = await supabase
    .from("trees")
    .select("*")
    .eq("id", treeId)
    .single();

  if (error) {
    console.error("Error fetching tree:", error);
    return null;
  }

  return data;
}

export async function createTree(
  userId: string,
  input: CreateTreeInput
): Promise<Tree | null> {
  const { data, error } = await supabase
    .from("trees")
    .insert({
      owner_id: userId,
      name: input.name,
      description: input.description || null,
      is_public: input.is_public ?? false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating tree:", error);
    return null;
  }

  return data;
}

export async function updateTree(
  treeId: string,
  updates: Partial<Tree>
): Promise<Tree | null> {
  const { data, error } = await supabase
    .from("trees")
    .update(updates)
    .eq("id", treeId)
    .select()
    .single();

  if (error) {
    console.error("Error updating tree:", error);
    return null;
  }

  return data;
}

export async function deleteTree(treeId: string): Promise<boolean> {
  const { error } = await supabase.from("trees").delete().eq("id", treeId);

  if (error) {
    console.error("Error deleting tree:", error);
    return false;
  }

  return true;
}
