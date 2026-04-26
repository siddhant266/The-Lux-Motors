// src/components/home/ExperienceSection.jsx

export default function ExperienceSection() {
  return (
    <section className="py-24 px-12 md:px-24 bg-black">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

        {/* Left: image collage */}
        <div className="reveal relative h-[520px]">
          <img
            src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800"
            alt="luxury car"
            className="absolute top-0 left-0 w-3/4 h-3/4 object-cover border border-[#1a1a1a]"
          />
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600"
            alt="adventure car"
            className="absolute bottom-0 right-0 w-[55%] h-[55%] object-cover border-[4px] border-black outline outline-1 outline-[#1a1a1a]"
          />
          {/* Gold accent line */}
          <div
            className="absolute w-10 h-px bg-[#bda588]"
            style={{ bottom: '30%', left: '-20px' }}
          />
        </div>

        {/* Right: text */}
        <div className="reveal">
          <span
            className="uppercase tracking-[0.3em] text-[10px] text-[#bda588]"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            Our Philosophy
          </span>

          <h2
            className="font-light text-[#f3f4f6] mt-4 mb-6 leading-[1.15]"
            style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem,3.5vw,3rem)' }}
          >
            Where Performance<br /><em>Meets Prestige</em>
          </h2>

          <p
            className="text-sm leading-loose text-[#a0a0a0] mb-5"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            At The Lux, we believe an automobile is more than transportation — it is an extension
            of identity. Every vehicle in our collection is handpicked for its engineering brilliance,
            heritage, and the visceral joy it delivers.
          </p>

          <p
            className="text-sm leading-loose text-[#a0a0a0] mb-10"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            From track-bred hypercars to timeless vintage classics, our concierge team ensures your
            acquisition is as exceptional as the car itself.
          </p>

          <button
            className="border border-[#bda588] text-[#bda588] px-9 py-3 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:bg-[#bda588] hover:text-black"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
          >
            Our Story →
          </button>
        </div>

      </div>
    </section>
  );
}
