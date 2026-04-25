/* ============================================================
   Sheila Annisa — content data (edit me!)
   Add real photos/videos/embed links by editing arrays below.
   Each `image` / `video` field accepts a path or full URL.
   Until real assets are added, leave them as null/empty arrays;
   the gallery system will render themed SVG placeholders.
   ============================================================ */
(function (root) {
  'use strict';

  // ---------- Placeholder generator ----------
  function svgPlaceholder(label, hueA, hueB, iconPath) {
    const safeLabel = String(label || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').slice(0, 28);
    const a = hueA || '#14B8A6';
    const b = hueB || '#0284C7';
    const icon = iconPath || 'M12 6v12M6 12h12';
    const svg =
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 320'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='" + a + "'/><stop offset='1' stop-color='" + b + "'/></linearGradient>" +
      "<linearGradient id='gs' x1='0' y1='1' x2='0' y2='0'><stop offset='0' stop-color='rgba(255,255,255,0.0)'/><stop offset='1' stop-color='rgba(255,255,255,0.18)'/></linearGradient></defs>" +
      "<rect width='480' height='320' fill='url(#g)'/>" +
      "<rect width='480' height='320' fill='url(#gs)'/>" +
      "<g stroke='rgba(255,255,255,0.18)' stroke-width='1' fill='none'>" +
        "<path d='M0 220 Q120 180 240 210 T 480 200'/>" +
        "<path d='M0 250 Q120 220 240 240 T 480 230'/>" +
      "</g>" +
      "<g transform='translate(196 110)' fill='none' stroke='white' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'>" +
        "<path d='" + icon + "'/>" +
      "</g>" +
      "<text x='240' y='250' text-anchor='middle' fill='white' opacity='0.95' font-family='Inter, system-ui, sans-serif' font-size='22' font-weight='600'>" + safeLabel + "</text>" +
      "</svg>";
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  const ICONS = {
    bag: 'M5 8 H29 L26 30 H8 Z M11 8 V5 a6 6 0 0 1 12 0 v3',
    chart: 'M5 28 H29 M9 22 V14 M15 22 V8 M21 22 V18 M27 22 V12',
    pie: 'M17 4 A14 14 0 1 0 31 18 H17 Z',
    handshake: 'M4 18 l6 -6 l4 4 l8 -8 l6 6 l-8 8 l-4 -4 l-6 6 z',
    file: 'M8 4 H22 L26 8 V28 H8 Z M14 12 H22 M14 18 H22 M14 24 H18',
    camera: 'M6 10 H10 L12 7 H22 L24 10 H28 V26 H6 Z M17 14 a5 5 0 1 1 0 10 a5 5 0 0 1 0 -10 Z',
    speech: 'M5 8 H29 V22 H18 L13 28 V22 H5 Z',
    star: 'M17 4 L21 13 L31 14 L23 21 L25 31 L17 26 L9 31 L11 21 L3 14 L13 13 Z',
    book: 'M6 6 H16 a4 4 0 0 1 4 4 V28 a4 4 0 0 0 -4 -4 H6 Z M28 6 H18 a4 4 0 0 0 -4 4 V28 a4 4 0 0 1 4 -4 H28 Z',
    target: 'M17 4 a14 14 0 1 0 0 28 a14 14 0 0 0 0 -28 Z M17 10 a8 8 0 1 0 0 16 a8 8 0 0 0 0 -16 Z M17 14 a4 4 0 1 0 0 8 a4 4 0 0 0 0 -8 Z',
    growth: 'M4 26 L11 19 L17 23 L24 14 L30 18 M24 14 H30 V20',
    quote: 'M8 10 q-2 0 -2 4 v6 h6 v-6 h-3 q0 -3 3 -3 z M22 10 q-2 0 -2 4 v6 h6 v-6 h-3 q0 -3 3 -3 z',
  };

  // ---------- Experiences (Read More modal) ----------
  const experiences = [
    {
      id: 'velo',
      role: 'E-commerce Admin',
      company: 'Velo',
      period: '2023 — Sekarang',
      themeA: '#14B8A6', themeB: '#0F766E', icon: ICONS.bag,
      summary: 'Mengelola operasional toko online dan memastikan setiap pesanan diproses dengan teliti.',
      details: [
        'Mengelola data produk, stok, harga, dan deskripsi katalog di marketplace.',
        'Memproses pesanan, memverifikasi pembayaran, dan koordinasi pengiriman.',
        'Memberi support customer melalui chat: menjawab pertanyaan produk, retur, dan komplain.',
        'Membuat laporan harian penjualan dan rekap stok untuk owner.',
      ],
      skills: ['Marketplace Ops', 'Order Processing', 'Customer Service', 'Data Entry', 'Reporting'],
      gallery: [], // add image paths here later
    },
    {
      id: 'momeasy',
      role: 'Admin Sales',
      company: 'MomEasy',
      period: '2022 — 2023',
      themeA: '#0284C7', themeB: '#075985', icon: ICONS.file,
      summary: 'Mendukung tim sales dengan administrasi yang rapi dan komunikasi customer yang sigap.',
      details: [
        'Mencatat data customer, transaksi, dan kebutuhan tim sales.',
        'Menyusun rekap penjualan harian dan dokumen invoice.',
        'Berkoordinasi antara sales, gudang, dan finance.',
        'Menjaga akurasi database CRM dan pipeline customer.',
      ],
      skills: ['Sales Admin', 'CRM', 'Reporting', 'Coordination', 'Detail-Oriented'],
      gallery: [],
    },
    {
      id: 'laz',
      role: 'Public Relations & Fundraising',
      company: 'LAZ Harapan Dhuafa',
      period: '2021 — 2022',
      themeA: '#22D3EE', themeB: '#0284C7', icon: ICONS.handshake,
      summary: 'Terlibat dalam strategi penggalangan dana publik dan kerja sama CSR perusahaan.',
      details: [
        'Menyusun proposal program dan deck pitch untuk donor / mitra CSR.',
        'Mengelola komunikasi dan dokumentasi kegiatan fundraising.',
        'Marketing dan kampanye program di sosial media organisasi.',
        'Membangun relasi dengan stakeholders dan komunitas.',
      ],
      skills: ['Fundraising', 'Public Relations', 'Marketing', 'CSR', 'Relationship Building'],
      gallery: [],
    },
  ];

  // ---------- Activities & Gallery ----------
  const activities = [
    {
      id: 'social-microblog',
      title: 'Social Media Microblog',
      category: 'Social Media',
      date: '2024',
      role: 'Content Creator',
      description: 'Menulis dan mendesain microblog edukatif untuk akun organisasi dengan tema personal branding & literasi keuangan.',
      themeA: '#14B8A6', themeB: '#0EA5E9', icon: ICONS.speech,
      tags: ['Microblog', 'Personal Branding', 'Literasi Keuangan'],
      skills: ['Copywriting', 'Visual Design', 'Content Strategy'],
      images: [],
      videos: [],
    },
    {
      id: 'infographic-video',
      title: 'Infographic & Video Content',
      category: 'Social Media',
      date: '2024',
      role: 'Content Designer',
      description: 'Membuat infografis dan video pendek tentang program organisasi dan edukasi keuangan untuk audience muda.',
      themeA: '#0284C7', themeB: '#22D3EE', icon: ICONS.camera,
      tags: ['Infographic', 'Reels', 'Edukasi'],
      skills: ['Canva', 'Capcut', 'Storytelling'],
      images: [],
      videos: [],
    },
    {
      id: 'finance-doc',
      title: 'Financial Documentation',
      category: 'Finance',
      date: '2023',
      role: 'Finance Admin',
      description: 'Menyusun rekap keuangan kegiatan, laporan transaksi, dan reimburse organisasi.',
      themeA: '#0F766E', themeB: '#0284C7', icon: ICONS.file,
      tags: ['Laporan Keuangan', 'Reimburse', 'Budget'],
      skills: ['Excel', 'Bookkeeping', 'Detail-Oriented'],
      images: [],
      videos: [],
    },
    {
      id: 'event-admin',
      title: 'Event Administration',
      category: 'Event',
      date: '2023',
      role: 'Event Admin',
      description: 'Administrasi rangkaian acara: registrasi, surat-menyurat, vendor, dan dokumentasi.',
      themeA: '#22D3EE', themeB: '#14B8A6', icon: ICONS.target,
      tags: ['Event Ops', 'Surat Menyurat', 'Koordinasi'],
      skills: ['Project Coordination', 'Documentation', 'Time Management'],
      images: [],
      videos: [],
    },
    {
      id: 'fundraising-campaign',
      title: 'Fundraising Campaign',
      category: 'Fundraising',
      date: '2022',
      role: 'Fundraising Volunteer',
      description: 'Kampanye penggalangan dana publik dan kerja sama CSR. Termasuk relasi donor dan dokumentasi program.',
      themeA: '#0284C7', themeB: '#0EA5E9', icon: ICONS.handshake,
      tags: ['CSR', 'Public Relations', 'Donor Relations'],
      skills: ['Pitch Deck', 'Communication', 'Empathy'],
      images: [],
      videos: [],
    },
    {
      id: 'ecom-ops',
      title: 'E-commerce Operation',
      category: 'E-commerce',
      date: '2024',
      role: 'E-commerce Admin',
      description: 'Pengelolaan produk, stok, pesanan, dan customer service untuk toko Velo di marketplace.',
      themeA: '#14B8A6', themeB: '#0F766E', icon: ICONS.bag,
      tags: ['Marketplace', 'Order Processing', 'CS'],
      skills: ['Shopee', 'Tokopedia', 'TikTok Shop'],
      images: [],
      videos: [],
    },
    {
      id: 'organization',
      title: 'Organization Activities',
      category: 'Organization',
      date: '2021 — 2024',
      role: 'Member / Coordinator',
      description: 'Pengalaman aktif di 5+ organisasi kampus & komunitas: kepanitiaan, public relations, dan program kerja.',
      themeA: '#0EA5E9', themeB: '#22D3EE', icon: ICONS.star,
      tags: ['Kepanitiaan', 'Public Relations', 'Teamwork'],
      skills: ['Leadership', 'Teamwork', 'Communication'],
      images: [],
      videos: [],
    },
    {
      id: 'volunteer',
      title: 'Volunteer Activities',
      category: 'Volunteer',
      date: '2022 — 2023',
      role: 'Relawan',
      description: 'Volunteer di program sosial: edukasi anak, pengabdian masyarakat, dan kampanye kesehatan.',
      themeA: '#14B8A6', themeB: '#22D3EE', icon: ICONS.book,
      tags: ['Sosial', 'Edukasi', 'Komunitas'],
      skills: ['Empati', 'Public Speaking', 'Adaptability'],
      images: [],
      videos: [],
    },
  ];

  // ---------- Daily Activity posts ----------
  const dailyPosts = [
    { id: 'd1', date: '2025-04-22', category: 'Work', title: 'Membuat konten microblog organisasi', description: 'Brainstorm tema mingguan: "Why data accuracy matters" untuk audience freshgraduate.', tags: ['Content', 'Microblog'], themeA: '#14B8A6', themeB: '#0284C7', icon: ICONS.speech },
    { id: 'd2', date: '2025-04-21', category: 'Finance', title: 'Merapikan data administrasi keuangan', description: 'Audit catatan pengeluaran kuartal, kategorisasi ulang, dan reconcile bank statement.', tags: ['Finance', 'Excel'], themeA: '#0F766E', themeB: '#0284C7', icon: ICONS.file },
    { id: 'd3', date: '2025-04-20', category: 'Learning', title: 'Belajar strategi e-commerce', description: 'Mempelajari conversion funnel marketplace dan AB-test untuk product photo.', tags: ['E-commerce', 'Strategy'], themeA: '#22D3EE', themeB: '#14B8A6', icon: ICONS.target },
    { id: 'd4', date: '2025-04-19', category: 'Finance', title: 'Menyusun laporan keuangan kegiatan', description: 'Konsolidasi dana masuk + keluar program fundraising minggu ini, format laporan standar.', tags: ['Report', 'Fundraising'], themeA: '#0284C7', themeB: '#22D3EE', icon: ICONS.chart },
    { id: 'd5', date: '2025-04-18', category: 'Knowledge', title: 'Insight: pentingnya personal branding', description: 'Catatan dari podcast tentang bagaimana profesional muda membangun visibilitas online.', tags: ['Personal Branding'], themeA: '#0EA5E9', themeB: '#0F766E', icon: ICONS.book },
    { id: 'd6', date: '2025-04-17', category: 'Quotes', title: 'Quote of the day', description: '"Small progress every day builds professional confidence."', tags: ['Quote', 'Motivation'], themeA: '#14B8A6', themeB: '#0EA5E9', icon: ICONS.quote },
    { id: 'd7', date: '2025-04-16', category: 'Knowledge', title: 'Knowledge: data accuracy in admin sales', description: 'Mengapa 1 typo di nomor invoice bisa berdampak besar di rekap akhir bulan.', tags: ['Admin', 'Data'], themeA: '#0284C7', themeB: '#22D3EE', icon: ICONS.file },
    { id: 'd8', date: '2025-04-15', category: 'Social Media', title: 'Drafting reels carousel template', description: 'Template carousel untuk seri "Admin Tips" — 6 slide, soft tosca palette, hook kuat di slide 1.', tags: ['Reels', 'Template'], themeA: '#22D3EE', themeB: '#14B8A6', icon: ICONS.camera },
    { id: 'd9', date: '2025-04-14', category: 'Event', title: 'Koordinasi vendor event kampus', description: 'Confirm vendor catering, venue layout, dan run-down acara untuk minggu depan.', tags: ['Event', 'Coordination'], themeA: '#0F766E', themeB: '#0284C7', icon: ICONS.target },
    { id: 'd10', date: '2025-04-13', category: 'Organization', title: 'Rapat program kerja kuartal', description: 'Brainstorm 3 program prioritas kuartal mendatang, alokasi PIC, dan timeline.', tags: ['Org', 'Planning'], themeA: '#14B8A6', themeB: '#0F766E', icon: ICONS.star },
    { id: 'd11', date: '2025-04-12', category: 'Learning', title: 'Belajar formula Excel: SUMIFS, INDEX-MATCH', description: 'Praktik real-case untuk rekap data sales multi-region.', tags: ['Excel', 'Skills'], themeA: '#0EA5E9', themeB: '#22D3EE', icon: ICONS.growth },
    { id: 'd12', date: '2025-04-11', category: 'E-commerce', title: 'Update katalog produk Velo', description: 'Foto baru, deskripsi SEO-friendly, harga musim, dan tag promo.', tags: ['E-commerce', 'Catalog'], themeA: '#14B8A6', themeB: '#0284C7', icon: ICONS.bag },
  ];

  // ---------- Quotes ----------
  const quotes = [
    { id: 'q1', text: 'Small progress every day builds professional confidence.', author: 'Sheila' },
    { id: 'q2', text: 'Detail is not a small thing — detail is the thing.', author: 'Notes from work' },
    { id: 'q3', text: 'Communication clarity is half of a successful collaboration.', author: 'Daily learning' },
    { id: 'q4', text: 'Numbers tell the truth — your job is to listen carefully.', author: 'Finance reflection' },
    { id: 'q5', text: 'Discipline becomes freedom when it turns into habit.', author: 'Personal growth' },
    { id: 'q6', text: 'Empathy turns admin work into care work.', author: 'CSR experience' },
  ];

  // ---------- Knowledge / mini-articles ----------
  const knowledge = [
    {
      id: 'k1',
      title: 'Why data accuracy matters in sales administration',
      category: 'Admin',
      summary: 'Akurasi data customer dan transaksi adalah fondasi laporan & decision making yang sehat.',
      body: 'Sebagai admin sales, satu typo di nomor invoice bisa berdampak besar saat rekap akhir bulan. Praktik kecil — double-check before submit, validation rules di spreadsheet, dan template baku — menghemat waktu jam-jam debugging downstream.',
      themeA: '#14B8A6', themeB: '#0F766E', icon: ICONS.file,
    },
    {
      id: 'k2',
      title: 'Simple ways to organize financial documents',
      category: 'Finance',
      summary: 'Sistem folder + naming convention sederhana yang scale dari personal ke organisasi.',
      body: 'Naming convention "YYYY-MM-DD_kategori_jumlah" + 3-tier folder (Year > Quarter > Type) membuat dokumen mudah ditemukan. Tambahkan checksum mingguan supaya tidak ada yang missing.',
      themeA: '#0284C7', themeB: '#075985', icon: ICONS.chart,
    },
    {
      id: 'k3',
      title: 'How social media content supports public relations',
      category: 'Public Relations',
      summary: 'Konten konsisten + storytelling humanis = trust building dengan audience.',
      body: 'PR modern bukan sekadar press release — tone of voice di Instagram, Threads, dan LinkedIn membentuk persepsi yang sama kuatnya. Konsistensi visual dan empati dalam respons komentar adalah kunci.',
      themeA: '#22D3EE', themeB: '#14B8A6', icon: ICONS.speech,
    },
    {
      id: 'k4',
      title: 'What I learned from fundraising and CSR communication',
      category: 'Fundraising',
      summary: 'Tiga pelajaran dari pengalaman LAZ: empati, follow-up, dan dokumentasi.',
      body: 'Empati membaca kebutuhan donor, follow-up yang tidak agresif tapi konsisten, dan dokumentasi laporan dampak yang transparan — itu trinitas yang membuat program fundraising sustainable.',
      themeA: '#0EA5E9', themeB: '#22D3EE', icon: ICONS.handshake,
    },
  ];

  // ---------- Social posts (placeholders — paste real embed URLs later) ----------
  const socials = {
    instagram: [
      { caption: 'Personal branding tips carousel', url: '', date: '2025-04', placeholder: true },
      { caption: 'Admin tips reels series', url: '', date: '2025-03', placeholder: true },
    ],
    facebook: [
      { caption: 'Event documentation: Fundraising 2024', url: '', date: '2024-12', placeholder: true },
    ],
    linkedin: [
      { caption: 'Reflection on first year as E-commerce Admin', url: '', date: '2025-02', placeholder: true },
      { caption: 'Knowledge sharing: data accuracy', url: '', date: '2025-01', placeholder: true },
    ],
    threads: [
      { caption: 'Quote of the day · Discipline', url: '', date: '2025-04', placeholder: true },
      { caption: 'Mini-thread: organizing finance docs', url: '', date: '2025-03', placeholder: true },
    ],
  };
  const socialProfileUrls = {
    instagram: 'https://instagram.com/sheilaannisa.id',
    facebook: 'https://facebook.com/sheilaannisa',
    linkedin: 'https://linkedin.com/in/sheilaannisa213',
    threads: 'https://www.threads.net/@sheilaannisa.id',
  };

  root.SheilaData = {
    svgPlaceholder: svgPlaceholder,
    icons: ICONS,
    experiences: experiences,
    activities: activities,
    dailyPosts: dailyPosts,
    quotes: quotes,
    knowledge: knowledge,
    socials: socials,
    socialProfileUrls: socialProfileUrls,
  };
})(window);
