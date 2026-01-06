-- Create static_pages table for admin-editable pages
CREATE TABLE public.static_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  title_id TEXT,
  content TEXT NOT NULL,
  content_id TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.static_pages ENABLE ROW LEVEL SECURITY;

-- Anyone can view published pages
CREATE POLICY "Anyone can view published pages"
ON public.static_pages
FOR SELECT
USING (is_published = true);

-- Admins can manage all pages
CREATE POLICY "Admins can manage all pages"
ON public.static_pages
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert contact messages
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
ON public.contact_messages
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update message read status
CREATE POLICY "Admins can update messages"
ON public.contact_messages
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update profiles
CREATE POLICY "Admins can update profiles"
ON public.profiles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can create their own profile
CREATE POLICY "Users can create own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at on static_pages
CREATE TRIGGER update_static_pages_updated_at
BEFORE UPDATE ON public.static_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default static pages
INSERT INTO public.static_pages (slug, title, title_id, content, content_id) VALUES
('about', 'About Rankinge', 'Tentang Rankinge', 
'# About Rankinge

Rankinge is a transparent, community-driven ranking platform where real users vote to determine the best products, services, and items across thousands of categories.

## Our Mission

To provide unbiased, authentic rankings based purely on user votes - not advertising dollars or paid placements.

## How It Works

1. **Browse Categories** - Explore thousands of categories from technology to food
2. **Cast Your Vote** - Each user gets one vote per category
3. **See Live Rankings** - Watch rankings update in real-time as votes come in

## Transparency

- Rankings are 100% based on user votes
- Affiliate links are clearly disclosed and never affect rankings
- Ranking history is tracked and visible to all users',

'# Tentang Rankinge

Rankinge adalah platform peringkat berbasis komunitas yang transparan, di mana pengguna nyata memberikan suara untuk menentukan produk, layanan, dan item terbaik di ribuan kategori.

## Misi Kami

Menyediakan peringkat yang tidak memihak dan autentik berdasarkan murni suara pengguna - bukan uang iklan atau penempatan berbayar.

## Cara Kerja

1. **Jelajahi Kategori** - Eksplorasi ribuan kategori dari teknologi hingga makanan
2. **Berikan Suara** - Setiap pengguna mendapat satu suara per kategori
3. **Lihat Peringkat Langsung** - Saksikan peringkat diperbarui secara real-time

## Transparansi

- Peringkat 100% berdasarkan suara pengguna
- Tautan afiliasi diungkapkan dengan jelas dan tidak pernah mempengaruhi peringkat
- Riwayat peringkat dilacak dan dapat dilihat semua pengguna'),

('faq', 'Frequently Asked Questions', 'Pertanyaan yang Sering Diajukan',
'# Frequently Asked Questions

## How does ranking work?
Rankings are determined solely by user votes. Each registered user can cast one vote per category. The item with the most votes ranks highest.

## What is Live Ranking?
Live Ranking shows real-time updates as users vote. You can see ranking changes happen instantly without refreshing the page.

## What is Ranking History?
We track ranking snapshots over time, showing how items move up or down. This helps you see trends and understand how popularity changes.

## What about seed/initial rankings?
Some categories may start with initial seed data to bootstrap content. This is clearly labeled and will be replaced by real user votes over time.

## Do affiliate links affect rankings?
No. Affiliate links are a separate feature and never influence item positions. Rankings are based purely on votes.

## How can I participate?
1. Create a free account
2. Browse categories
3. Vote for your favorites
4. Submit new categories if you have ideas',

'# Pertanyaan yang Sering Diajukan

## Bagaimana cara kerja peringkat?
Peringkat ditentukan hanya oleh suara pengguna. Setiap pengguna terdaftar dapat memberikan satu suara per kategori. Item dengan suara terbanyak mendapat peringkat tertinggi.

## Apa itu Peringkat Langsung?
Peringkat Langsung menampilkan pembaruan real-time saat pengguna memberikan suara. Anda dapat melihat perubahan peringkat terjadi secara instan tanpa menyegarkan halaman.

## Apa itu Riwayat Peringkat?
Kami melacak snapshot peringkat dari waktu ke waktu, menunjukkan bagaimana item naik atau turun. Ini membantu Anda melihat tren dan memahami bagaimana popularitas berubah.

## Bagaimana dengan peringkat awal/seed?
Beberapa kategori mungkin dimulai dengan data seed awal untuk memulai konten. Ini diberi label dengan jelas dan akan diganti oleh suara pengguna nyata seiring waktu.

## Apakah tautan afiliasi mempengaruhi peringkat?
Tidak. Tautan afiliasi adalah fitur terpisah dan tidak pernah mempengaruhi posisi item. Peringkat murni berdasarkan suara.

## Bagaimana cara berpartisipasi?
1. Buat akun gratis
2. Jelajahi kategori
3. Vote untuk favoritmu
4. Kirim kategori baru jika ada ide'),

('contact', 'Contact Us', 'Hubungi Kami',
'# Contact Us

Have questions, feedback, or suggestions? We would love to hear from you!

Use the contact form below to get in touch with our team.

## Response Time
We typically respond within 24-48 hours during business days.

## Other Ways to Reach Us
- Email: hello@rankinge.com
- Social Media: @rankinge',

'# Hubungi Kami

Punya pertanyaan, masukan, atau saran? Kami ingin mendengar dari Anda!

Gunakan formulir kontak di bawah untuk menghubungi tim kami.

## Waktu Respons
Kami biasanya merespons dalam 24-48 jam pada hari kerja.

## Cara Lain Menghubungi Kami
- Email: hello@rankinge.com
- Media Sosial: @rankinge'),

('terms', 'Terms of Service', 'Syarat Layanan',
'# Terms of Service

By using Rankinge, you agree to these terms.

## User Conduct
- One account per person
- One vote per category
- No manipulation of rankings
- Respectful behavior

## Voting Rules
- Votes must be genuine
- No automated voting
- No vote trading

## Content
- User-submitted categories are reviewed before publishing
- We reserve the right to remove inappropriate content

## Disclaimer
Rankings reflect user opinions and are not professional recommendations.',

'# Syarat Layanan

Dengan menggunakan Rankinge, Anda menyetujui syarat-syarat ini.

## Perilaku Pengguna
- Satu akun per orang
- Satu suara per kategori
- Tidak ada manipulasi peringkat
- Perilaku yang sopan

## Aturan Voting
- Suara harus asli
- Tidak ada voting otomatis
- Tidak ada pertukaran suara

## Konten
- Kategori yang dikirim pengguna ditinjau sebelum dipublikasikan
- Kami berhak menghapus konten yang tidak pantas

## Disclaimer
Peringkat mencerminkan opini pengguna dan bukan rekomendasi profesional.'),

('privacy', 'Privacy Policy', 'Kebijakan Privasi',
'# Privacy Policy

Your privacy is important to us.

## Data We Collect
- Account information (email)
- Voting history
- Device information for analytics

## How We Use Data
- To provide ranking services
- To prevent fraud
- To improve our platform

## Data Security
We use industry-standard security measures to protect your data.

## Your Rights
- Access your data
- Delete your account
- Export your voting history

## Cookies
We use cookies for authentication and analytics.',

'# Kebijakan Privasi

Privasi Anda penting bagi kami.

## Data yang Kami Kumpulkan
- Informasi akun (email)
- Riwayat voting
- Informasi perangkat untuk analitik

## Cara Kami Menggunakan Data
- Untuk menyediakan layanan peringkat
- Untuk mencegah penipuan
- Untuk meningkatkan platform kami

## Keamanan Data
Kami menggunakan langkah-langkah keamanan standar industri untuk melindungi data Anda.

## Hak Anda
- Akses data Anda
- Hapus akun Anda
- Ekspor riwayat voting Anda

## Cookies
Kami menggunakan cookies untuk autentikasi dan analitik.');