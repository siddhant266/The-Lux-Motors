// src/components/home/StatsSection.jsx
import { STATS } from './constants';

export default function StatsSection() {
    return (
        <section className="py-20 px-12 md:px-24 bg-black border-b border-[#1a1a1a]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-[1200px] mx-auto">
                {STATS.map((stat, i) => (
                    <div key={i} className="reveal text-center" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div
                            className="text-[#bda588] font-light leading-none"
                            style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(3rem,6vw,5rem)' }}
                        >
                            {stat.num}
                        </div>
                        <div
                            className="uppercase tracking-[0.25em] text-[10px] text-[#888] mt-2"
                            style={{ fontFamily: '"Montserrat", sans-serif' }}
                        >
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}