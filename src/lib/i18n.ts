// Lightweight dictionary-based translation system
// Default language: English

export type Language = 'en' | 'id';

export const translations = {
  // Navigation
  'nav.categories': { en: 'Categories', id: 'Kategori' },
  'nav.blog': { en: 'Blog', id: 'Blog' },
  'nav.submit': { en: 'Submit', id: 'Kirim' },
  'nav.admin': { en: 'Admin', id: 'Admin' },
  'nav.login': { en: 'Login', id: 'Masuk' },
  'nav.register': { en: 'Register', id: 'Daftar' },
  'nav.logout': { en: 'Logout', id: 'Keluar' },
  'nav.lightMode': { en: 'Light Mode', id: 'Mode Terang' },
  'nav.darkMode': { en: 'Dark Mode', id: 'Mode Gelap' },
  
  // Hero section
  'hero.title': { en: 'Vote for your favorites, worldwide', id: 'Vote untuk favoritmu, seluruh dunia' },
  'hero.subtitle': { en: 'Rankinge lets you vote on the best products, brands, and more across thousands of categories. Discover what\'s popular and add your voice.', id: 'Rankinge memungkinkan Anda memilih produk, merek, dan lainnya terbaik di ribuan kategori. Temukan yang populer dan berikan suaramu.' },
  'hero.browseCategories': { en: 'Browse Categories', id: 'Jelajahi Kategori' },
  'hero.submitCategory': { en: 'Submit New Category', id: 'Kirim Kategori Baru' },
  
  // Categories
  'categories.title': { en: 'All Categories', id: 'Semua Kategori' },
  'categories.popular': { en: 'Popular Categories', id: 'Kategori Populer' },
  'categories.featured': { en: 'Featured Categories', id: 'Kategori Unggulan' },
  'categories.viewAll': { en: 'View all categories', id: 'Lihat semua kategori' },
  'categories.browseAll': { en: 'Browse All Categories', id: 'Jelajahi Semua Kategori' },
  'categories.notFound': { en: 'Category Not Found', id: 'Kategori Tidak Ditemukan' },
  'categories.notFoundDesc': { en: 'The category you\'re looking for doesn\'t exist or has been removed.', id: 'Kategori yang Anda cari tidak ada atau telah dihapus.' },
  'categories.backToAll': { en: 'Back to all categories', id: 'Kembali ke semua kategori' },
  'categories.empty': { en: 'No categories available yet.', id: 'Belum ada kategori tersedia.' },
  'categories.createFirst': { en: 'Create the first category', id: 'Buat kategori pertama' },
  'categories.noCategories': { en: 'No categories found. Be the first to create one!', id: 'Tidak ada kategori ditemukan. Jadilah yang pertama!' },
  
  // Ranking
  'ranking.title': { en: 'Rankings', id: 'Peringkat' },
  'ranking.live': { en: 'Live Ranking', id: 'Peringkat Langsung' },
  'ranking.about': { en: 'About This Ranking', id: 'Tentang Peringkat Ini' },
  'ranking.items': { en: 'Items', id: 'Item' },
  'ranking.totalVotes': { en: 'Total Votes', id: 'Total Suara' },
  'ranking.yourVote': { en: 'Your Vote', id: 'Suara Anda' },
  'ranking.notVotedYet': { en: 'Not voted yet', id: 'Belum memilih' },
  'ranking.displayFormat': { en: 'Display Format', id: 'Format Tampilan' },
  'ranking.movement.up': { en: 'Up', id: 'Naik' },
  'ranking.movement.down': { en: 'Down', id: 'Turun' },
  'ranking.movement.stable': { en: 'Stable', id: 'Stabil' },
  'ranking.lastUpdated': { en: 'Last updated', id: 'Terakhir diperbarui' },
  'ranking.seedContent': { en: 'Initial ranking — generated to bootstrap content. Rankings will evolve with user votes.', id: 'Peringkat awal — dibuat untuk bootstrap konten. Peringkat akan berubah sesuai voting pengguna.' },
  
  // Voting
  'vote.button': { en: 'Vote', id: 'Vote' },
  'vote.voted': { en: 'Voted', id: 'Terpilih' },
  'vote.loginToVote': { en: 'Login to vote', id: 'Masuk untuk memilih' },
  'vote.rules': { en: 'Voting Rules', id: 'Aturan Voting' },
  'vote.rule1': { en: 'You can vote for one item in this category.', id: 'Anda dapat memilih satu item dalam kategori ini.' },
  'vote.rule2': { en: 'You can change your vote at any time.', id: 'Anda dapat mengubah pilihan kapan saja.' },
  'vote.rule3': { en: 'Results are updated in real-time.', id: 'Hasil diperbarui secara real-time.' },
  'vote.rule4': { en: 'Rankings are based on user votes only.', id: 'Peringkat hanya berdasarkan suara pengguna.' },
  'vote.votes': { en: 'votes', id: 'suara' },
  
  // Blog
  'blog.title': { en: 'Blog', id: 'Blog' },
  'blog.subtitle': { en: 'Latest articles and news', id: 'Artikel dan berita terbaru' },
  'blog.noPosts': { en: 'No posts yet', id: 'Belum ada artikel' },
  'blog.comingSoon': { en: 'Posts coming soon', id: 'Artikel akan segera hadir' },
  'blog.backToBlog': { en: 'Back to Blog', id: 'Kembali ke Blog' },
  'blog.postNotFound': { en: 'Post not found', id: 'Artikel tidak ditemukan' },
  'blog.relatedCategories': { en: 'Related Categories', id: 'Kategori Terkait' },
  
  // Submit
  'submit.title': { en: 'Submit a Category', id: 'Kirim Kategori' },
  'submit.subtitle': { en: 'Suggest a new category for the community to vote on', id: 'Sarankan kategori baru untuk divoting komunitas' },
  
  // How it works
  'howItWorks.title': { en: 'How Rankinge Works', id: 'Cara Kerja Rankinge' },
  'howItWorks.vote.title': { en: 'Vote on Categories', id: 'Vote di Kategori' },
  'howItWorks.vote.desc': { en: 'Cast your vote on thousands of items across different categories. One vote per category ensures fairness.', id: 'Berikan suara Anda pada ribuan item di berbagai kategori. Satu suara per kategori memastikan keadilan.' },
  'howItWorks.view.title': { en: 'View Rankings', id: 'Lihat Peringkat' },
  'howItWorks.view.desc': { en: 'See real-time results and discover which items are most popular among users worldwide.', id: 'Lihat hasil real-time dan temukan item mana yang paling populer di seluruh dunia.' },
  'howItWorks.submit.title': { en: 'Submit Categories', id: 'Kirim Kategori' },
  'howItWorks.submit.desc': { en: 'Don\'t see what you\'re looking for? Suggest new categories and items for others to vote on.', id: 'Tidak menemukan yang Anda cari? Sarankan kategori dan item baru untuk divoting.' },
  
  // CTA
  'cta.title': { en: 'Ready to start voting?', id: 'Siap mulai voting?' },
  'cta.subtitle': { en: 'Join thousands of users and help determine the best in every category.', id: 'Bergabunglah dengan ribuan pengguna dan bantu tentukan yang terbaik di setiap kategori.' },
  'cta.button': { en: 'Start Exploring', id: 'Mulai Jelajahi' },
  
  // Footer
  'footer.rights': { en: 'All rights reserved.', id: 'Hak cipta dilindungi.' },
  'footer.affiliate': { en: 'Some links are affiliate links.', id: 'Beberapa tautan adalah tautan afiliasi.' },
  'footer.quickLinks': { en: 'Quick Links', id: 'Tautan Cepat' },
  'footer.company': { en: 'Company', id: 'Perusahaan' },
  'footer.legal': { en: 'Legal', id: 'Legal' },
  'footer.aboutUs': { en: 'About Us', id: 'Tentang Kami' },
  'footer.contactUs': { en: 'Contact Us', id: 'Hubungi Kami' },
  'footer.terms': { en: 'Terms of Service', id: 'Syarat Layanan' },
  'footer.privacy': { en: 'Privacy Policy', id: 'Kebijakan Privasi' },
  
  // Actions
  'action.visitWebsite': { en: 'Visit Website', id: 'Kunjungi Situs' },
  'action.buy': { en: 'Buy', id: 'Beli' },
  'action.search': { en: 'Search', id: 'Cari' },
  'action.cancel': { en: 'Cancel', id: 'Batal' },
  'action.save': { en: 'Save', id: 'Simpan' },
  'action.create': { en: 'Create', id: 'Buat' },
  'action.edit': { en: 'Edit', id: 'Ubah' },
  'action.delete': { en: 'Delete', id: 'Hapus' },
  
  // Status
  'status.loading': { en: 'Loading...', id: 'Memuat...' },
  'status.pendingApproval': { en: 'This category is pending approval', id: 'Kategori ini menunggu persetujuan' },
  'status.pendingDesc': { en: 'This category has been submitted and is awaiting admin review before it becomes available for public voting.', id: 'Kategori ini telah dikirim dan menunggu tinjauan admin sebelum tersedia untuk voting publik.' },
  
  // Auth
  'auth.login': { en: 'Login', id: 'Masuk' },
  'auth.register': { en: 'Register', id: 'Daftar' },
  'auth.email': { en: 'Email', id: 'Email' },
  'auth.password': { en: 'Password', id: 'Kata Sandi' },
  'auth.confirmPassword': { en: 'Confirm Password', id: 'Konfirmasi Kata Sandi' },
  
  // Admin
  'admin.settings': { en: 'Settings', id: 'Pengaturan' },
  'admin.categories': { en: 'Categories', id: 'Kategori' },
  'admin.blog': { en: 'Blog', id: 'Blog' },
  'admin.aiGenerator': { en: 'AI Content Generator', id: 'Generator Konten AI' },
  'admin.users': { en: 'User Management', id: 'Manajemen Pengguna' },
  'admin.pages': { en: 'Static Pages', id: 'Halaman Statis' },
  'admin.messages': { en: 'Messages', id: 'Pesan' },
  
  // Image Search
  'imageSearch.button': { en: 'Search Free Images', id: 'Cari Gambar Gratis' },
  'imageSearch.title': { en: 'Free Image Search', id: 'Pencarian Gambar Gratis' },
  'imageSearch.placeholder': { en: 'Search images... (e.g., smartphone, coffee)', id: 'Cari gambar... (contoh: smartphone, kopi)' },
  'imageSearch.empty': { en: 'Search for images or select a collection to start', id: 'Cari gambar atau pilih koleksi untuk memulai' },
  'imageSearch.attribution': { en: 'Images from Unsplash - Free for commercial use', id: 'Gambar dari Unsplash - Gratis untuk penggunaan komersial' },
  
  // AI Generator
  'ai.generator': { en: 'AI Content Generator', id: 'Generator Konten AI' },
  'ai.generateCategories': { en: 'Generate Categories', id: 'Buat Kategori' },
  'ai.generateItems': { en: 'Generate Items', id: 'Buat Item' },
  'ai.generateBlog': { en: 'Generate Blog Content', id: 'Buat Konten Blog' },
  'ai.seedRanking': { en: 'Generate Initial Ranking Distribution', id: 'Buat Distribusi Peringkat Awal' },
  'ai.seedWarning': { en: 'This creates initial rankings only. Real votes will override seed data.', id: 'Ini hanya membuat peringkat awal. Vote asli akan menggantikan data seed.' },
  'ai.language': { en: 'Content Language', id: 'Bahasa Konten' },
  'ai.quantity': { en: 'Quantity', id: 'Jumlah' },
  'ai.generate': { en: 'Generate', id: 'Buat' },
  'ai.generating': { en: 'Generating...', id: 'Membuat...' },
  'ai.success': { en: 'Content generated successfully', id: 'Konten berhasil dibuat' },
  'ai.error': { en: 'Failed to generate content', id: 'Gagal membuat konten' },
  
  // Static Pages
  'pages.about': { en: 'About', id: 'Tentang' },
  'pages.faq': { en: 'FAQ', id: 'FAQ' },
  'pages.contact': { en: 'Contact', id: 'Kontak' },
  'pages.terms': { en: 'Terms', id: 'Syarat' },
  'pages.privacy': { en: 'Privacy', id: 'Privasi' },
} as const;

export type TranslationKey = keyof typeof translations;
