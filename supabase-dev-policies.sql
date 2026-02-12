-- Dev mode RLS policies for ClawDirector
-- This allows the dev user UUID and any authenticated users to access tables

-- Workspaces policies
CREATE POLICY "Allow dev and auth users to insert workspaces"
ON workspaces FOR INSERT
TO public
WITH CHECK (
  user_id = '00000000-0000-0000-0000-000000000001'::uuid
  OR auth.uid() = user_id
);

CREATE POLICY "Allow dev and auth users to select workspaces"
ON workspaces FOR SELECT
TO public
USING (
  user_id = '00000000-0000-0000-0000-000000000001'::uuid
  OR auth.uid() = user_id
);

CREATE POLICY "Allow dev and auth users to update workspaces"
ON workspaces FOR UPDATE
TO public
USING (
  user_id = '00000000-0000-0000-0000-000000000001'::uuid
  OR auth.uid() = user_id
);

-- Agents policies
CREATE POLICY "Allow all to insert agents"
ON agents FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow all to select agents"
ON agents FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow all to update agents"
ON agents FOR UPDATE
TO public
USING (true);

-- Activities policies
CREATE POLICY "Allow all to insert activities"
ON activities FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow all to select activities"
ON activities FOR SELECT
TO public
USING (true);

-- Tasks policies
CREATE POLICY "Allow all to insert tasks"
ON tasks FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow all to select tasks"
ON tasks FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow all to update tasks"
ON tasks FOR UPDATE
TO public
USING (true);

-- Messages policies
CREATE POLICY "Allow all to insert messages"
ON messages FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow all to select messages"
ON messages FOR SELECT
TO public
USING (true);
