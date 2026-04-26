// src/components/home/Footer.jsx

const FOOTER_COLS = [
  { title: 'Collection', links: ['Vintage', 'Sports', 'Sedan', 'Adventure', 'Premium Luxury'] },
  { title: 'Company',    links: ['About Us', 'Our Story', 'Careers', 'Press'] },
  { title: 'Contact',   links: ['Book Test Drive', 'WhatsApp', 'Email Us', 'Showroom'] },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] px-12 md:px-24 pt-16 pb-10">
      {/* Column grid */}
      <div className="grid gap-16 mb-16" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
        {/* Brand blurb */}
        <div>
          <div
            className="text-[22px] tracking-[0.3em] text-[#e5e2e1] mb-5 font-light"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            THE LUX
          </div>
          <p
            className="text-xs text-[#888] leading-loose max-w-[280px]"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            Curated luxury and exotic automobiles for discerning collectors and enthusiasts across India.
          </p>
        </div>

        {/* Link columns */}
        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <h4
              className="uppercase tracking-[0.25em] text-[10px] text-[#bda588] mb-5"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              {col.title}
            </h4>
            {col.links.map((link) => (
              <div key={link} className="mb-2.5">
                <a
                  href="#"
                  className="text-xs text-[#888] no-underline transition-colors duration-200 hover:text-[#e5e2e1]"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  {link}
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #bda588, transparent)' }} />

      {/* Bottom bar */}
      <div className="flex justify-between items-center pt-6 flex-wrap gap-4">
        <p className="text-[11px] text-[#888]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
          © 2026 The Lux. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="/login"
            className="text-[11px] text-[#bda588] tracking-[0.1em] no-underline hover:text-[#e9c176] transition-colors"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            Admin Portal
          </a>
          <p className="text-[11px] text-[#888] tracking-[0.1em]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
            Crafted for connoisseurs.
          </p>
        </div>
      </div>
    </footer>
  );
}
