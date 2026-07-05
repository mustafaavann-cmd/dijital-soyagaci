-- ==========================================
-- Dijital Soyağacı - Düzeltme Scripti
-- Mevcut şemaya eksik policy ve trigger'ları ekler
-- ==========================================

-- 1) Profiles tablosuna INSERT policy ekle (eksik!)
-- Kullanıcı kendi profilini oluşturabilmeli
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2) Trigger fonksiyonunu yeniden oluştur (varsa değiştir)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3) Trigger'ı yeniden oluştur (varsa değiştir)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4) Mevcut kullanıcılar için eksik profilleri oluştur
INSERT INTO public.profiles (id, full_name, email, avatar_url)
SELECT
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  au.email,
  COALESCE(au.raw_user_meta_data->>'avatar_url', '')
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;
