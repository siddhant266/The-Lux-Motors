// src/components/home/MarqueeStrip.jsx
import { MARQUEE_BRANDS } from './constants';

export default function MarqueeStrip() {
    return (
        <div className="border-t border-b border-[#1a1a1a] overflow-hidden py-4 bg-[#111]">
            <div className="marquee-track">
                {[...MARQUEE_BRANDS, ...MARQUEE_BRANDS].map((brand, i) => (
                    <span
                        key={i}
                        className="text-[#888] px-10 whitespace-nowrap tracking-[0.1em]"
                        style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(14px,1.5vw,18px)' }}
                    >
                        {brand}
                        <span className="text-[#bda588] mx-2">·</span>
                    </span>
                ))}
            </div>
        </div>
    );
}