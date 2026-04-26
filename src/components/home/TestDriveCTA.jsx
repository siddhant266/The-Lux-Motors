// src/components/home/TestDriveCTA.jsx

/**
 * Props:
 *   openModal : () => void
 */
export default function TestDriveCTA({ openModal }) {
  return (
    <section className="mb-20 bg-black px-6 md:px-24 reveal">
      <div className="relative overflow-hidden border border-[#1f1f1f] bg-[#080808] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
        <div
          className="absolute inset-0 bg-cover bg-center scale-[1.03]"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1600)',
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,6,6,0.94)_0%,rgba(6,6,6,0.84)_38%,rgba(6,6,6,0.58)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(233,193,118,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(233,193,118,0.75),transparent)]" />
        <div className="absolute inset-y-10 right-[34%] hidden w-px bg-[linear-gradient(to_bottom,transparent,rgba(189,165,136,0.22),transparent)] xl:block" />

        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[minmax(0,1.3fr)_360px] gap-10 px-8 py-12 md:px-14 md:py-16 xl:px-20 xl:py-20 items-center">
          <div className="max-w-[760px]">
            <span
              className="inline-flex items-center gap-3 uppercase tracking-[0.35em] text-[10px] text-[#d2b07a]"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              <span className="h-px w-10 bg-[#bda588]" />
              Exclusive Experience
            </span>

            <h2
              className="mt-5 max-w-[760px] font-light leading-[0.96] text-[#f5f1e8]"
              style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2.35rem,4.3vw,4.85rem)' }}
            >
              Drive the Collection
              <br />
              Before You Own It.
            </h2>

            <p
              className="mt-6 max-w-[620px] text-[15px] leading-[1.95] text-[#c0b7ad] md:text-[17px]"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              Your private drive is arranged around you. Choose the model, choose the setting,
              and let our concierge deliver a calm, no-pressure experience that feels as refined
              as the machine itself.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              {['Private Concierge', 'Curated Routes', 'By Appointment Only'].map((item) => (
                <span
                  key={item}
                  className="border border-[rgba(189,165,136,0.28)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[#dbc8aa]"
                  style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="border border-[rgba(189,165,136,0.22)] bg-[linear-gradient(180deg,rgba(20,18,16,0.78),rgba(8,8,8,0.72))] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)] backdrop-blur-md md:p-8">
            <p
              className="mb-6 text-[10px] uppercase tracking-[0.3em] text-[#9d8b73]"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              Reserve Your Appointment
            </p>

            <div className="flex flex-col gap-4">
              <button
                className="bg-gradient-to-r from-[#e9c176] to-[#a17d39] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.26em] text-[#241700] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_18px_36px_rgba(233,193,118,0.2)] active:scale-[0.99]"
                style={{ fontFamily: '"Montserrat", sans-serif' }}
                onClick={openModal}
              >
                Schedule a Drive
              </button>

              <button
                className="border border-[rgba(189,165,136,0.65)] px-8 py-4 text-[11px] font-medium uppercase tracking-[0.26em] text-[#d8bf97] transition-all duration-300 hover:bg-[#bda588] hover:text-black"
                style={{ fontFamily: '"Montserrat", sans-serif' }}
                onClick={() => window.open('https://wa.me/9987984688', '_blank')}
              >
                WhatsApp Us
              </button>
            </div>

            <div className="mt-6 border-t border-[rgba(189,165,136,0.18)] pt-5">
              <p
                className="text-[13px] leading-7 text-[#aaa095]"
                style={{ fontFamily: '"Montserrat", sans-serif' }}
              >
                Weekday and weekend slots available for select vehicles in major cities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
