-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE edges ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- TREES policies
CREATE POLICY "Users can view own trees"
  ON trees FOR SELECT
  USING (auth.uid() = owner_id OR is_public = TRUE);

CREATE POLICY "Users can create trees"
  ON trees FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own trees"
  ON trees FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own trees"
  ON trees FOR DELETE
  USING (auth.uid() = owner_id);

-- NODES policies
CREATE POLICY "Users can view nodes of own trees"
  ON nodes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trees
      WHERE trees.id = nodes.tree_id
      AND (trees.owner_id = auth.uid() OR trees.is_public = TRUE)
    )
  );

CREATE POLICY "Users can create nodes in own trees"
  ON nodes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trees
      WHERE trees.id = nodes.tree_id
      AND trees.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update nodes in own trees"
  ON nodes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trees
      WHERE trees.id = nodes.tree_id
      AND trees.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete nodes in own trees"
  ON nodes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trees
      WHERE trees.id = nodes.tree_id
      AND trees.owner_id = auth.uid()
    )
  );

-- EDGES policies
CREATE POLICY "Users can view edges of own trees"
  ON edges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trees
      WHERE trees.id = edges.tree_id
      AND (trees.owner_id = auth.uid() OR trees.is_public = TRUE)
    )
  );

CREATE POLICY "Users can create edges in own trees"
  ON edges FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trees
      WHERE trees.id = edges.tree_id
      AND trees.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete edges in own trees"
  ON edges FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM trees
      WHERE trees.id = edges.tree_id
      AND trees.owner_id = auth.uid()
    )
  );

-- ==========================================
-- INDEXES for Performance
-- ==========================================

CREATE INDEX idx_trees_owner ON trees(owner_id);
CREATE INDEX idx_nodes_tree ON nodes(tree_id);
CREATE INDEX idx_nodes_created_by ON nodes(created_by);
CREATE INDEX idx_edges_tree ON edges(tree_id);
CREATE INDEX idx_edges_source ON edges(source_node_id);
CREATE INDEX idx_edges_target ON edges(target_node_id);
