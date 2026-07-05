// ==========================================
// Database Types for Dijital Soyağacı
// ==========================================

export type Gender = "Male" | "Female" | "Other";
export type RelationType = "Parent-Child" | "Spouse" | "Sibling";

// Profile type - maps to 'profiles' table
export interface Profile {
  id: string;
  updated_at: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

// Tree type - maps to 'trees' table
export interface Tree {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
}

// Family Node type - maps to 'nodes' table
export interface FamilyNode {
  id: string;
  tree_id: string;
  first_name: string;
  last_name: string;
  maiden_name: string | null;
  birth_date: string | null;
  death_date: string | null;
  is_alive: boolean;
  birth_place: string | null;
  biography: string | null;
  profile_image_url: string | null;
  created_by: string | null;
  gender: Gender;
  created_at?: string;
}

// Edge type - maps to 'edges' table
export interface FamilyEdge {
  id: string;
  tree_id: string;
  source_node_id: string;
  target_node_id: string;
  relation_type: RelationType;
  created_at?: string;
}

// Insert types (for creating new records)
export interface CreateTreeInput {
  name: string;
  description?: string;
  is_public?: boolean;
}

export interface CreateNodeInput {
  tree_id: string;
  first_name: string;
  last_name: string;
  maiden_name?: string;
  birth_date?: string;
  death_date?: string;
  is_alive?: boolean;
  birth_place?: string;
  biography?: string;
  profile_image_url?: string;
  gender: Gender;
}

export interface UpdateNodeInput {
  first_name?: string;
  last_name?: string;
  maiden_name?: string | null;
  birth_date?: string | null;
  death_date?: string | null;
  is_alive?: boolean;
  birth_place?: string | null;
  biography?: string | null;
  profile_image_url?: string | null;
  gender?: Gender;
}

export interface CreateEdgeInput {
  tree_id: string;
  source_node_id: string;
  target_node_id: string;
  relation_type: RelationType;
}

// ReactFlow compatible types
export interface FamilyNodeData {
  label: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate: string | null;
  deathDate: string | null;
  isAlive: boolean;
  profileImageUrl: string | null;
  birthPlace: string | null;
  biography: string | null;
}

// Relation labels in Turkish
export const RELATION_LABELS: Record<RelationType, string> = {
  "Parent-Child": "Anne-Baba / Çocuk",
  Spouse: "Eş",
  Sibling: "Kardeş",
};

// Gender labels in Turkish
export const GENDER_LABELS: Record<Gender, string> = {
  Male: "Erkek",
  Female: "Kadın",
  Other: "Diğer",
};
