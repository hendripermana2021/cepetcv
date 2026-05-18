import Link from 'next/link';

const features = [
  {
    icon: '⚡',
    title: 'Cepat & Mudah',
    desc: 'Isi form, preview langsung terbentuk. Tidak perlu desain dari nol.',
  },
  {
    icon: '🔒',
    title: 'Privasi Terjaga',
    desc: 'Data tersimpan di browser kamu sendiri, tidak pernah dikirim ke server.',
  },
  {
    icon: '📄',
    title: 'Download PDF',
    desc: 'Export CV dalam format PDF A4, siap kirim ke HRD kapan saja.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <span className="font-bold text-blue-600 text-2xl tracking-tight">CepetCV</span>
        <Link
          href="/builder"
          className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Buat CV
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <span className="inline-block bg-blue-100 text-blue-700 text-xs px-4 py-1.5 rounded-full font-semibold mb-6 tracking-wide uppercase">
          100% Gratis · Tanpa Akun · Data di Browser Kamu
        </span>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-5 max-w-3xl">
          Buat CV Profesional{' '}
          <span className="text-blue-600">dalam Menit</span>
        </h1>

        <p className="text-lg text-gray-500 mb-10 max-w-xl">
          Isi form sederhana, lihat preview langsung, dan download PDF. Tidak perlu
          akun, tidak perlu bayar.
        </p>

        <Link
          href="/builder"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:-translate-y-0.5"
        >
          Buat CV Sekarang — Gratis →
        </Link>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-20 max-w-3xl w-full text-left">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-sm text-gray-400">
        Made with ❤️ · CepetCV 2025 · Gratis selamanya
      </footer>
    </div>
  );
}

