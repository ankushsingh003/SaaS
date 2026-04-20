import { Link } from 'react-router-dom';
import { LayoutDashboard, Download, ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

/**
 * Landing Page:
 * A high-end, Discord-inspired landing page for the SaaS.
 */
const Landing = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#404eed] font-sans selection:bg-black/20 selection:text-white">
            {/* Navigation */}
            <nav className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between relative z-50">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <LayoutDashboard size={22} className="text-[#404eed]" />
                    </div>
                    <span className="font-black text-2xl text-white tracking-tighter">SaaSify</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8 font-bold text-sm text-white">
                    <a href="#" className="hover:underline underline-offset-4">Download</a>
                    <a href="#" className="hover:underline underline-offset-4">Nitro</a>
                    <a href="#" className="hover:underline underline-offset-4">Discover</a>
                    <a href="#" className="hover:underline underline-offset-4">Safety</a>
                    <a href="#" className="hover:underline underline-offset-4">Support</a>
                    <a href="#" className="hover:underline underline-offset-4">Blog</a>
                    <a href="#" className="hover:underline underline-offset-4">Careers</a>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/login" className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:shadow-xl hover:text-[#404eed] transition-all">
                        Login
                    </Link>
                    <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Nav Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-[#404eed] z-40 p-10 lg:hidden pt-24 text-white">
                    <div className="flex flex-col gap-6 text-xl font-bold">
                        <a href="#">Download</a>
                        <a href="#">Nitro</a>
                        <a href="#">SaaSify Pro</a>
                        <a href="#">Support</a>
                        <Link to="/register">Get Started</Link>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <header className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-40">
                <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2">
                        <h1 className="text-4xl md:text-7xl font-black text-white leading-[0.95] tracking-tighter mb-8 uppercase">
                            IMAGINE A <br />
                            PLACE...
                        </h1>
                        <p className="text-white text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 opacity-90">
                            ...where you can belong to a team space, a startup, or a global community. 
                            Where analytics meet collaboration, and data becomes a conversation. 
                            Simple, beautiful, and built for you.
                        </p>
                        
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:text-[#404eed] transition-all group">
                                <Download size={20} />
                                Download for Windows
                            </button>
                            <Link to="/dashboard" className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#23272a] text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:bg-[#2c2f33] transition-all">
                                Open SaaSify in your browser
                            </Link>
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative h-[500px] md:h-[700px] flex items-center justify-center lg:justify-end">
                        {/* Base Office Image (Bottom Left) */}
                        <div className="absolute top-[20%] left-[-10%] md:left-0 w-[80%] z-10 transition-all duration-700 hover:scale-105 hover:z-30">
                            <img 
                                src="/hero_office_1.png" 
                                alt="Team Space Base" 
                                className="w-full h-auto rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] border-4 border-white/10"
                            />
                        </div>
                        
                        {/* Overlapping Office Image (Top Right) */}
                        <div className="absolute top-[5%] right-[-10%] md:right-[-20%] w-[85%] z-20 transition-all duration-700 hover:scale-110 hover:z-30 filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]">
                            <img 
                                src="/hero_office_2.png" 
                                alt="Team Space Overlay" 
                                className="w-full h-auto rounded-[3rem] shadow-[0_50px_120px_rgba(0,0,0,0.7)] ring-1 ring-white/20 border-4 border-[#404eed]"
                            />
                        </div>

                        {/* Glow and Aura elements */}
                        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                    </div>
                </div>

                {/* Bottom Graphic Waves */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0 rotate-180">
                    <svg className="relative block w-full h-[150px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#23272a"></path>
                    </svg>
                </div>
            </header>

            {/* Features Section (Brief) */}
            <section className="bg-white py-24 md:py-40">
                <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
                    <div className="md:w-1/2 order-2 md:order-1">
                        <img 
                            src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop" 
                            alt="Collaboration" 
                            className="w-full h-auto rounded-2xl shadow-2xl"
                        />
                    </div>
                    <div className="md:w-1/2 order-1 md:order-2">
                        <h2 className="text-3xl md:text-5xl font-black text-black leading-tight mb-6 uppercase tracking-tighter">
                            Create an <br />
                            invite-only place <br />
                            where you belong
                        </h2>
                        <p className="text-slate-600 text-lg leading-relaxed mb-8">
                            SaaSify workspaces are organized into topic-based channels where you can collaborate, share code, and monitor real-time analytics without clogging up a group chat. 
                        </p>
                        <button className="flex items-center gap-2 font-bold text-lg hover:underline underline-offset-4 group">
                           Learn more <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer Placeholder matching Discord */}
            <footer className="bg-[#23272a] py-24 text-white">
                <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-12">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <LayoutDashboard size={24} className="text-white" />
                            <span className="font-black text-xl tracking-tighter">SaaSify</span>
                        </div>
                        <div className="flex gap-4">
                           {/* Social icons placeholder */}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[#404eed] font-bold mb-6">Product</h4>
                        <ul className="space-y-3 text-sm font-medium opacity-80">
                            <li><a href="#">Download</a></li>
                            <li><a href="#">Nitro</a></li>
                            <li><a href="#">Status</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[#404eed] font-bold mb-6">Company</h4>
                        <ul className="space-y-3 text-sm font-medium opacity-80">
                            <li><a href="#">About</a></li>
                            <li><a href="#">Jobs</a></li>
                            <li><a href="#">Brand</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[#404eed] font-bold mb-6">Resources</h4>
                        <ul className="space-y-3 text-sm font-medium opacity-80">
                            <li><a href="#">College</a></li>
                            <li><a href="#">Support</a></li>
                            <li><a href="#">Safety</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[#404eed] font-bold mb-6">Policies</h4>
                        <ul className="space-y-3 text-sm font-medium opacity-80">
                            <li><a href="#">Terms</a></li>
                            <li><a href="#">Privacy</a></li>
                            <li><a href="#">Cookie Settings</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-[1200px] mx-auto px-6 border-t border-[#404eed]/20 mt-20 pt-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard size={20} className="text-white" />
                        <span className="font-black text-lg tracking-tighter">SaaSify</span>
                    </div>
                    <Link to="/register" className="bg-[#404eed] px-6 py-2 rounded-full text-xs font-bold hover:shadow-xl transition-all">
                        Sign up
                    </Link>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
