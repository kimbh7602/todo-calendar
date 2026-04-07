CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  display_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  name text NOT NULL,
  color text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own categories" ON categories;
CREATE POLICY "Users can manage own categories" ON categories
  FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  is_routine boolean DEFAULT false,
  routine_days int[],
  routine_end_date date,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own todos" ON todos;
CREATE POLICY "Users can manage own todos" ON todos
  FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  todo_id uuid REFERENCES todos(id) ON DELETE CASCADE NOT NULL,
  completed_date date NOT NULL,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(todo_id, completed_date)
);

ALTER TABLE completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own completions" ON completions;
CREATE POLICY "Users can manage own completions" ON completions
  FOR ALL USING (
    todo_id IN (SELECT id FROM todos WHERE user_id = auth.uid())
  );

CREATE OR REPLACE FUNCTION create_default_categories()
RETURNS TRIGGER AS $$
DECLARE
  uid uuid;
BEGIN
  uid := NEW.id;
  INSERT INTO categories (user_id, name, color, sort_order) VALUES
    (uid, '개인', '#FF6B6B', 0),
    (uid, '업무', '#FFBE5C', 1),
    (uid, '운동', '#A8E06C', 2);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_default_categories();
