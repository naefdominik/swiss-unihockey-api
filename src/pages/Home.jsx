import trailer from '../assets/trailer-compressed.mp4';
import overlay from '../assets/overlay-40.png';

export default function Home() {

    return (
        <div className="relative">
            <video autoPlay loop muted playsInline className="w-full bg-[#222222] aspect-video">
                <source src={trailer} type="video/mp4" />
            </video>

            <h1 className="absolute text-white text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-bold bottom-10 md:bottom-20 left-10 md:left-20 z-3" style={{ fontFamily: "SupremeLLTT" }}>
                UHC<br/>Winterthur<br/>United
            </h1>
            <img src={overlay} alt="Overlay" className="absolute inset-0 w-full h-full object-cover z-2" />
            <div className="absolute inset-0 bg-[#222222] opacity-75 z-1"></div>
        </div>
    )
}
