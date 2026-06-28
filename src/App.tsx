/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform 
} from "motion/react";
import { 
  Droplets, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  Mail, 
  Star, 
  ArrowRight, 
  ChevronDown, 
  ShieldCheck, 
  Percent, 
  Calendar, 
  Zap, 
  Award, 
  BadgeCheck,
  Check,
  HelpCircle,
  Menu,
  X
} from "lucide-react";

// Service type definition
interface Service {
  id: string;
  name: string;
  icon: React.ReactNode;
  rate: number; // Cost per sq ft
  desc: string;
  features: string[];
}

// Animation Presets
const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1, transition: { staggerChildren: 0.12 } },
  viewport: { once: true, margin: "-100px" }
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function App() {
  // Navigation & UI States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Before & After Interactive Slider State (0 to 100)
  const [sliderPos, setSliderPos] = useState(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [isSliding, setIsSliding] = useState(false);

  // Instant Estimator State
  const services: Service[] = [
    { 
      id: "house", 
      name: "House Soft Wash", 
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />, 
      rate: 0.18,
      desc: "Gentle low-pressure cleaning with eco-safe solutions that melt away green mold & dirt.",
      features: ["Safe for all siding types", "Kills algae at the root", "Includes window exterior"]
    },
    { 
      id: "driveway", 
      name: "Driveway & Concrete", 
      icon: <Droplets className="w-5 h-5 text-teal-500" />, 
      rate: 0.22,
      desc: "Deep rotary pressure wash that blasts away oil spills, moss, tire marks, and dark grime.",
      features: ["Industrial surface cleaner", "Post-wash algae prevention", "Brightens concrete instantly"]
    },
    { 
      id: "roof", 
      name: "Roof Soft Wash", 
      icon: <ShieldCheck className="w-5 h-5 text-cyan-500" />, 
      rate: 0.35,
      desc: "Low pressure misting that safely removes black streaks and moss without lifting shingles.",
      features: ["Extends roof life by years", "Safe for delicate asphalt", "100% moss eradication"]
    },
    { 
      id: "deck", 
      name: "Deck & Wood Restoring", 
      icon: <Award className="w-5 h-5 text-emerald-600" />, 
      rate: 0.28,
      desc: "Gentle wood restoration reviving natural golden grains, removing gray weathering.",
      features: ["Brings back rich wood color", "Prepares for stain/sealing", "Splinter-safe detailing"]
    }
  ];

  const [selectedService, setSelectedService] = useState<string>("house");
  const [sqFt, setSqFt] = useState<number>(1800);

  // Compute estimate range
  const currentServiceObj = services.find(s => s.id === selectedService) || services[0];
  const calculatedBase = Math.round(sqFt * currentServiceObj.rate);
  const minEstimate = Math.max(99, Math.round(calculatedBase * 0.9));
  const maxEstimate = Math.round(calculatedBase * 1.15);

  // Booking Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    zip: "",
    preferredDate: "",
    preferredTime: "morning",
    addons: [] as string[],
    notes: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref for scrolling to sections
  const estimateSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);

  // Smooth scroll helper
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Drag handlers for the Before/After custom slider
  const handleMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1 || isSliding) {
      handleMove(e.clientX);
    }
  };

  // Form submission handler
  const handleBookEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please fill in your name and phone number so we can reach you!");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  // Quick select dynamic pre-fill
  const selectServiceAndEstimate = (serviceId: string) => {
    setSelectedService(serviceId);
    scrollTo(estimateSectionRef);
  };

  const lockPriceAndBook = () => {
    scrollTo(contactSectionRef);
  };

  const toggleAddon = (addon: string) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.includes(addon) 
        ? prev.addons.filter(a => a !== addon) 
        : [...prev.addons, addon]
    }));
  };

  return (
    <div className="min-h-screen bg-watercolor font-sans text-slate-800 antialiased selection:bg-teal-200 selection:text-teal-900">
      
      {/* Floating Sparkly Header */}
      <header className="sticky top-0 z-50 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav id="nav_main" className="glass-card flex items-center justify-between rounded-2xl px-6 py-3 shadow-lg transition-all hover:shadow-emerald-100/30">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-500/20 transition-transform group-hover:scale-105">
                <Droplets className="w-6 h-6 animate-pulse" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-emerald-300 animate-bounce" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xl font-bold tracking-tight text-slate-900">
                  Verdant<span className="text-emerald-600">Wash</span>
                </span>
                <span className="font-sans text-[10px] font-medium tracking-wider text-teal-600 uppercase">
                  Eco-Friendly Clean
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="font-sans text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Services</a>
              <a href="#transformations" className="font-sans text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Before & After</a>
              <a href="#pricing" className="font-sans text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Instant Calculator</a>
              <a href="#faq" className="font-sans text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">FAQs</a>
            </div>

            {/* CTA Button & Phone */}
            <div className="hidden sm:flex items-center gap-5">
              <a 
                href="tel:2545550199" 
                className="flex items-center gap-2 font-sans text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors"
                id="header_phone"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <Phone className="w-4 h-4" />
                </div>
                <span>(254) 555-0199</span>
              </a>
              <button 
                onClick={() => scrollTo(estimateSectionRef)}
                className="relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 font-sans text-sm font-semibold text-white shadow-md shadow-teal-600/10 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-600/20 active:scale-[0.98]"
                id="header_cta"
              >
                Get Free Quote
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
                id="mobile_menu_toggle"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile menu container */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-lg border-b border-slate-100 px-4 pb-6 pt-2 shadow-xl"
            >
              <div className="flex flex-col gap-4">
                <a 
                  href="#services" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-base font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  Our Services
                </a>
                <a 
                  href="#transformations" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-base font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  Before & After
                </a>
                <a 
                  href="#pricing" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-base font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  Instant Calculator
                </a>
                <a 
                  href="#faq" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-base font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  Common FAQs
                </a>
                
                <hr className="border-slate-100 my-1" />
                
                <div className="flex flex-col gap-3 px-4">
                  <a 
                    href="tel:2545550199" 
                    className="flex items-center gap-3 text-base font-bold text-slate-800"
                  >
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <span>(254) 555-0199</span>
                  </a>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      scrollTo(estimateSectionRef);
                    }}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-center text-base font-bold text-white shadow-md shadow-emerald-500/10"
                  >
                    Get Free Quote
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section - Immersive, Watercolor Flow with Floating Elements */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24">
        {/* Watercolor decorative blurs */}
        <div className="absolute top-1/4 left-1/10 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute bottom-1/10 right-1/10 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            
            {/* Hero Left Content Column */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-6 lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/75 px-4 py-1.5 text-sm font-semibold text-emerald-800 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Texas' Premier Eco-Wash Specialists</span>
              </div>
              
              <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl font-black tracking-tight text-slate-900 leading-tight text-balance w-full flex flex-col gap-2">
                <span className="flex items-center gap-4 w-full justify-center lg:justify-start overflow-hidden text-emerald-600 font-extrabold uppercase tracking-widest text-xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl">
                  <span className="h-1 bg-gradient-to-r from-transparent via-emerald-400 to-emerald-500 flex-grow rounded-full opacity-80"></span>
                  <span className="shrink-0 flex items-center gap-2">
                    <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 animate-bounce" />
                    High-Power
                  </span>
                  <span className="h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-transparent flex-grow rounded-full opacity-80"></span>
                </span>
                <span>
                  <span className="text-gradient-water">Pressure Washing</span> &amp; Soft Wash Experts
                </span>
              </h1>
              
              <p className="max-w-2xl font-inter text-sm sm:text-base md:text-lg text-slate-500 leading-relaxed text-balance w-full font-normal tracking-wide">
                Blast away stubborn dirt, mold, and grime instantly. Our professional team combines advanced high-pressure power washing with safe, gentle soft-washing to restore your property's original brilliance.
              </p>

              {/* High conversion review badge */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2">
                <div className="flex items-center gap-1 bg-white/70 rounded-full px-4 py-2 shadow-sm border border-slate-100">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1.5 font-sans text-sm font-extrabold text-slate-900">4.9/5</span>
                  <span className="text-slate-400 text-xs mx-1">•</span>
                  <span className="font-sans text-xs font-semibold text-slate-500">340+ Verified Jobs</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-emerald-600" />
                  <span className="font-sans text-sm font-bold text-slate-700">100% Satisfaction Guaranteed</span>
                </div>
              </div>

              {/* Conversion Actions */}
              <div className="flex flex-col sm:flex-row items-center sm:items-stretch lg:items-center justify-center lg:justify-start gap-4 pt-4 w-full sm:w-auto">
                <button 
                  onClick={() => scrollTo(estimateSectionRef)}
                  className="group flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 text-base font-bold text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]"
                  id="hero_primary_cta"
                >
                  <span>Instant Price Calculator</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                
                <a 
                  href="tel:2545550199"
                  className="flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-white px-8 text-base font-bold text-emerald-700 shadow-md shadow-emerald-500/5 border border-emerald-100 transition-all hover:bg-emerald-50/50 hover:scale-[1.02] active:scale-[0.98]"
                  id="hero_secondary_cta"
                >
                  <Phone className="w-5 h-5 text-emerald-600 animate-pulse" />
                  <span>Call Now: (254) 555-0199</span>
                </a>
              </div>

              {/* Fast Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-200/60 pt-8 w-full max-w-lg text-center lg:text-left">
                <div>
                  <p className="font-sans text-3xl font-extrabold text-teal-700">100%</p>
                  <p className="font-sans text-xs font-semibold text-slate-500 mt-1">Biodegradable</p>
                </div>
                <div>
                  <p className="font-sans text-3xl font-extrabold text-emerald-700">Licensed</p>
                  <p className="font-sans text-xs font-semibold text-slate-500 mt-1">&amp; Fully Insured</p>
                </div>
                <div>
                  <p className="font-sans text-3xl font-extrabold text-cyan-700">Same Day</p>
                  <p className="font-sans text-xs font-semibold text-slate-500 mt-1">Estimates Given</p>
                </div>
              </div>

            </motion.div>

            {/* Hero Right Column: Beautiful Layered Photo Design */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="relative lg:col-span-5 flex justify-center w-full"
            >
              <div className="relative w-full max-w-md lg:max-w-none">
                
                {/* Floating Teal Watercolor Waterdrop Circle decoration */}
                <div className="absolute -top-6 -left-6 -z-10 h-24 w-24 rounded-full bg-cyan-300/30 animate-pulse" />
                <div className="absolute -bottom-10 -right-4 -z-10 h-32 w-32 rounded-full bg-emerald-300/30 animate-bounce" />

                {/* Primary Premium Image Container with water ripple borders */}
                <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-2xl transition-all duration-500 hover:scale-[1.01] hover:shadow-emerald-500/5">
                  <img 
                    src="/src/assets/images/hero_pressure_washing_1782655364130.jpg" 
                    alt="Eco-friendly professional house pressure washing" 
                    className="aspect-square sm:aspect-video lg:aspect-square w-full object-cover rounded-2xl"
                    referrerPolicy="no-referrer"
                    id="hero_image_main"
                  />
                  
                  {/* Glowing watercolor banner mask overlay inside image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2 bg-slate-900/40 backdrop-blur-md rounded-xl p-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400">
                        <Check className="w-3.5 h-3.5 text-slate-900" />
                      </div>
                      <span className="font-sans text-xs font-bold">Safe Low-Pressure Soft Wash</span>
                    </div>
                    <span className="font-sans text-xs font-extrabold bg-emerald-500 px-3 py-1.5 rounded-lg shadow-sm">Certified</span>
                  </div>
                </div>

                {/* Overlapping Floating interactive widget - Instant Fast Estimation */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 w-[90%] sm:w-80 rounded-2xl glass-card p-4 shadow-xl border border-white/60">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-sans text-[11px] font-bold text-teal-600 uppercase tracking-wider">Fast Estimate</p>
                        <p className="font-sans text-sm font-extrabold text-slate-900">Average House Wash</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-sans text-lg font-black text-emerald-700">$249</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Eco-Chemicals</span>
                      <span className="text-emerald-600">Included</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Satisfaction Promise</span>
                      <span className="text-emerald-600">100% Guaranteed</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => selectServiceAndEstimate("house")}
                    className="w-full mt-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 py-1.5 text-center font-sans text-xs font-bold text-white shadow-sm hover:from-emerald-600 hover:to-teal-700"
                  >
                    Calculate Your Property Size
                  </button>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Trust Badges Bar / Auto-scroll Slider representation */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 border-y border-slate-200/50 py-8 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="font-sans text-sm font-bold tracking-wider text-slate-400 uppercase text-center md:text-left">
              OUR SERVICE ADVANTAGES &amp; QUALITY STANDARDS
            </p>
            <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-sans text-sm font-bold text-slate-700">Biodegradable Soap</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-sans text-sm font-bold text-slate-700">Plant &amp; Pet Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-sans text-sm font-bold text-slate-700">Commercial Grade Tech</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-sans text-sm font-bold text-slate-700">Licensed &amp; Bonded</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Services Showcase Section - Minimalist Cards with high hover styling */}
      <section id="services" className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-100/70 px-4 py-1.5 text-xs font-bold text-teal-800">
              <Droplets className="w-3.5 h-3.5 text-teal-600" />
              <span>Professional Services</span>
            </div>
            <h2 className="font-sans text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mt-3">
              We Wash Every Surface with Care
            </h2>
            <p className="font-sans text-base text-slate-500 mt-4">
              We pair advanced pressure washers with soft-wash regulators to cleanse every area of your property safely without damage.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                variants={staggerItem}
                whileHover={{ y: -6, scale: 1.01 }}
                className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-6 shadow-md shadow-slate-100/40 border border-slate-100 transition-shadow hover:shadow-xl hover:shadow-teal-100/20"
              >
                {/* Visual Accent Corner Water Wave */}
                <div className="absolute top-0 right-0 -mr-6 -mt-6 h-16 w-16 rounded-full bg-teal-50/70" />
                
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-5 mx-auto md:mx-0">
                    {service.icon}
                  </div>
                  <h3 className="font-sans text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
                  <p className="font-sans text-sm text-slate-500 mb-6 leading-relaxed">{service.desc}</p>
                  
                  <ul className="space-y-2 mb-6 w-full flex flex-col items-center md:items-start">
                    {service.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 font-sans text-xs text-slate-600 text-left">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={() => selectServiceAndEstimate(service.id)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors mt-4"
                >
                  <span>Check Cost</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Before & After Interactive Transformations Section */}
      <section id="transformations" className="py-16 lg:py-24 bg-teal-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Transformations Left: Simple Info, Big CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-6 lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-4 py-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Real Transformation Results</span>
              </div>
              <h2 className="font-sans text-4xl font-extrabold tracking-tight text-slate-900">
                Drag and See the Sparkling Clean Difference
              </h2>
              <p className="font-sans text-base text-slate-600 leading-relaxed">
                Weathering, moss, and dirt can ruin your property value and curb appeal. See how our low-pressure restorative washes clear mold and mildew instantly, returning shingles and wood siding to brand new condition.
              </p>
              
              <div className="space-y-3.5 w-full flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-3 text-left">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-sans text-sm font-bold text-slate-700">Prevents costly wood decay or paint peeling</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-sans text-sm font-bold text-slate-700">Increases property appraisal value overnight</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-sans text-sm font-bold text-slate-700">100% organic, botanical solutions safe for shrubs</span>
                </div>
              </div>

              <div className="pt-4 w-full flex justify-center lg:justify-start">
                <button 
                  onClick={() => scrollTo(estimateSectionRef)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 font-sans text-sm font-extrabold text-white shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  <span>Price Out Your Driveway</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Transformations Right: Custom Interactive Drag Slider Curtain */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7 space-y-4"
            >
              <p className="font-sans text-xs font-bold text-slate-400 tracking-wider text-center lg:text-left">
                INTERACTIVE DEMO: DRAG VERTICALLY OR SLIDE CURTAIN TO CLEAN
              </p>
              
              {/* Slider Component */}
              <div 
                ref={sliderContainerRef}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onMouseDown={() => setIsSliding(true)}
                onMouseUp={() => setIsSliding(false)}
                onMouseLeave={() => setIsSliding(false)}
                onTouchStart={() => setIsSliding(true)}
                onTouchEnd={() => setIsSliding(false)}
                className="relative h-[320px] sm:h-[420px] w-full overflow-hidden rounded-3xl border-4 border-white shadow-xl cursor-ew-resize select-none"
                id="before_after_interactive_slider"
              >
                {/* 1. After (Sparkling Clean Driveway) - Full Background Layer */}
                <img 
                  src="/src/assets/images/driveway_cleaning_1782655383113.jpg" 
                  alt="Sparkling clean driveway after pressure washing" 
                  className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay Text Right (Clean) */}
                <div className="absolute right-4 bottom-4 z-10 rounded-lg bg-emerald-600/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white shadow">
                  CLEAN (AFTER)
                </div>

                {/* 2. Before (Weathered & Dirty simulated with grayscale/sepia filters) */}
                <div 
                  className="absolute inset-0 h-full overflow-hidden pointer-events-none"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img 
                    src="/src/assets/images/driveway_cleaning_1782655383113.jpg" 
                    alt="Dirty mossy driveway before pressure washing" 
                    className="absolute inset-0 h-full w-full object-cover max-w-none pointer-events-none"
                    style={{ 
                      width: sliderContainerRef.current?.getBoundingClientRect().width || "100%",
                      filter: "brightness(0.4) saturate(1.4) sepia(0.55) hue-rotate(60deg) contrast(1.15)"
                    }}
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Overlay Text Left (Before) */}
                  <div className="absolute left-4 bottom-4 z-10 rounded-lg bg-slate-900/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white shadow">
                    WEATHERED (BEFORE)
                  </div>
                </div>

                {/* 3. Sliding Handle Line */}
                <div 
                  className="absolute bottom-0 top-0 w-1 bg-white cursor-ew-resize pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  {/* Center Handle Knob */}
                  <div className="absolute top-1/2 -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-teal-600 text-white shadow-lg animate-pulse">
                    <Droplets className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Sub-Showcase: Beautiful static Before/After Split */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="sm:col-span-1 text-center sm:text-left flex flex-col items-center sm:items-start">
                  <span className="font-sans text-[11px] font-extrabold text-emerald-600 uppercase tracking-widest block">DECK &amp; SIDING SPLIT</span>
                  <p className="font-sans text-sm font-bold text-slate-800 mt-1">Authentic Siding Restoration</p>
                  <p className="font-sans text-xs text-slate-500 mt-1 leading-relaxed">Genuine contrast from a single pass of our low-pressure soft wash wand.</p>
                </div>
                
                <div className="sm:col-span-2 relative rounded-xl overflow-hidden shadow-inner border border-slate-100">
                  <img 
                    src="/src/assets/images/before_after_wash_1782655404550.jpg" 
                    alt="Authentic wood siding before after pressure washing split" 
                    className="w-full h-44 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded font-bold">Weathered Moss</div>
                  <div className="absolute top-2 right-2 bg-emerald-600/90 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded font-bold">Pristine Cedar Wood</div>
                </div>
              </div>

            </motion.div>

          </div>
        </div>
      </section>      {/* Instant Estimator / Quote Calculator Section (Extremely High Conversion) */}
      <section id="pricing" ref={estimateSectionRef} className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100/70 px-4 py-1.5 text-xs font-bold text-cyan-800">
              <Zap className="w-3.5 h-3.5 text-cyan-600" />
              <span>Instant Cost Calculator</span>
            </div>
            <h2 className="font-sans text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mt-3">
              Get an Instant Estimate in 10 Seconds
            </h2>
            <p className="font-sans text-base text-slate-500 mt-4">
              Select your service type and estimate the square footage of your property below for a transparent, instant price range.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-4xl rounded-3xl bg-white p-6 sm:p-10 shadow-xl border border-slate-100/80"
          >
            <div className="grid gap-10 md:grid-cols-12 items-center">
              
              {/* Estimator Controls (7 Columns) */}
              <div className="md:col-span-7 space-y-8 text-center md:text-left">
                
                {/* Service Selection Buttons */}
                <div>
                  <label className="font-sans text-xs font-extrabold text-slate-400 uppercase tracking-widest block mb-4">
                    1. Select Cleaning Service
                  </label>
                  <div className="grid grid-cols-2 gap-3.5">
                    {services.map((serv) => (
                      <button
                        key={serv.id}
                        type="button"
                        onClick={() => setSelectedService(serv.id)}
                        className={`flex flex-col items-center md:items-start gap-2.5 rounded-2xl p-4 text-center md:text-left border-2 transition-all hover:scale-[1.01] ${
                          selectedService === serv.id 
                            ? "border-emerald-500 bg-emerald-50/40 shadow-sm" 
                            : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200"
                        }`}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm mx-auto md:mx-0">
                          {serv.icon}
                        </div>
                        <span className="font-sans text-sm font-bold text-slate-900 leading-tight w-full">{serv.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Size Range Slider */}
                <div>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3">
                    <label className="font-sans text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                      2. Estimate Property Size
                    </label>
                    <span className="font-mono text-sm font-extrabold bg-slate-950 text-white px-3 py-1 rounded-lg">
                      {sqFt.toLocaleString()} sq ft
                    </span>
                  </div>
                  
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={sqFt}
                    onChange={(e) => setSqFt(Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-slate-100 appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
                    id="estimator_size_slider"
                  />
                  
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-2">
                    <span>Small Cottage (500 sq ft)</span>
                    <span>Average Home (2,200 sq ft)</span>
                    <span>Estate (5,000 sq ft)</span>
                  </div>
                </div>

              </div>

              {/* Estimate Output Box (5 Columns) */}
              <div className="md:col-span-5 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-700 p-6 text-white shadow-xl flex flex-col justify-between h-full min-h-[340px] items-center md:items-stretch text-center md:text-left">
                
                <div className="space-y-4 flex flex-col items-center md:items-stretch w-full">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Calculated Range</span>
                  </div>
                  
                  <p className="font-sans text-sm font-medium text-emerald-100">
                    Estimated wash investment for your <span className="underline decoration-emerald-300 decoration-2">{sqFt.toLocaleString()} sq ft</span> property:
                  </p>

                  <div className="pt-2">
                    <div className="flex items-baseline justify-center md:justify-start gap-1">
                      <span className="font-sans text-5xl font-black tracking-tight" id="calc_price_output">
                        ${minEstimate} - ${maxEstimate}
                      </span>
                    </div>
                    <p className="font-sans text-[10px] text-emerald-200 mt-1">
                      *Includes premium biodegradeable foam cleaning &amp; full rinse.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10 mt-6 w-full flex flex-col items-center md:items-stretch">
                  <ul className="space-y-2 text-xs font-semibold text-emerald-100 text-left w-full max-w-xs md:max-w-none">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>100% Satisfaction Guarantee Included</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Shady Areas Deep-Treated</span>
                    </li>
                  </ul>

                  <button
                    onClick={lockPriceAndBook}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white py-3.5 font-sans text-sm font-extrabold text-teal-900 shadow-md transition-all hover:bg-teal-50 hover:scale-[1.02] active:scale-[0.98]"
                    id="calc_lock_cta"
                  >
                    <span>Claim Quote &amp; Select Time</span>
                    <ArrowRight className="w-4 h-4 text-teal-800" />
                  </button>
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* Simple 3-Step Process (Extremely Clean, Green, Elegant Layout) */}
      <section className="py-16 lg:py-24 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <span className="font-sans text-xs font-extrabold text-emerald-600 uppercase tracking-widest block">3 SIMPLE STEPS</span>
            <h2 className="font-sans text-4xl font-extrabold tracking-tight text-slate-900 mt-2">
              Working With Us Is Simple
            </h2>
            <p className="font-sans text-base text-slate-500 mt-3">
              We respect your busy schedule. Here's how we transform your home from dirty to dazzling:
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-10 md:grid-cols-3"
          >
            
            {/* Step 1 */}
            <motion.div variants={staggerItem} className="relative text-center space-y-3 px-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-sans text-xl font-black shadow-inner">
                01
              </div>
              <h3 className="font-sans text-lg font-bold text-slate-900">Select &amp; Estimate</h3>
              <p className="font-sans text-sm text-slate-500 leading-relaxed">
                Choose the service you need and get an instant transparent quote in seconds right here on our site.
              </p>
              <div className="hidden md:block absolute top-7 right-0 w-1/3 border-t-2 border-dashed border-emerald-100" />
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={staggerItem} className="relative text-center space-y-3 px-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 font-sans text-xl font-black shadow-inner">
                02
              </div>
              <h3 className="font-sans text-lg font-bold text-slate-900">Pick Date &amp; Time</h3>
              <p className="font-sans text-sm text-slate-500 leading-relaxed">
                Fill our secure booking form below, pick a preferred date slot, and our expert crew will show up fully equipped.
              </p>
              <div className="hidden md:block absolute top-7 right-0 w-1/3 border-t-2 border-dashed border-teal-100" />
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={staggerItem} className="relative text-center space-y-3 px-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 font-sans text-xl font-black shadow-inner">
                03
              </div>
              <h3 className="font-sans text-lg font-bold text-slate-900">Enjoy Pristine Shine</h3>
              <p className="font-sans text-sm text-slate-500 leading-relaxed">
                Watch moss and grime melt away! Pay securely only after you are 100% satisfied with our workmanship.
              </p>
            </motion.div>

          </motion.div>

          <div className="text-center mt-12 px-4">
            <button 
              onClick={() => scrollTo(contactSectionRef)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-8 py-4 font-sans text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.01]"
            >
              <span>Get Scheduled Today</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Common Questions / Accordion Section */}
      <section id="faq" className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <span className="font-sans text-xs font-extrabold text-teal-600 uppercase tracking-widest block">Got Questions?</span>
            <h2 className="font-sans text-4xl font-extrabold tracking-tight text-slate-900 mt-2">
              Common Questions Answered
            </h2>
            <p className="font-sans text-base text-slate-500 mt-3">
              Learn why professional soft-washing is the safest choice for residential siding, roofs, and decks.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-3xl space-y-4"
          >
            
            {[
              {
                q: "What is 'Soft Washing' and how is it different?",
                a: "Soft washing uses high-volume, low-pressure water (similar to a garden hose) paired with specialized, 100% biodegradable cleansers to safely melt away mold, algae, and dirt. Standard pressure washers can split wood siding, crack vinyl, or ruin shingle warranties. Soft washing cleans deeper and lasts 2-3x longer by killing organic spores at the roots."
              },
              {
                q: "Is pressure washing safe for my roof and shingle warranty?",
                a: "Never use high pressure on shingles! It strips off protective asphalt granules and instantly voids manufacturer warranties. We use a dedicated Soft Wash roof process approved by ARMA (Asphalt Roofing Manufacturers Association) that eliminates ugly black streaks safely using light misting pressure."
              },
              {
                q: "Are your cleaning solutions safe for my pets and plants?",
                a: "Absolutely. We are proud to be a green business. We use premium, eco-friendly, fully biodegradable cleansers that dissolve harmlessly. As an extra precaution, we pre-soak and post-rinse all surrounding shrubs, flowerbeds, and grassy areas to ensure your vegetation is perfectly safe and hydrated."
              },
              {
                q: "Do I need to be home during the pressure washing service?",
                a: "No, you don't need to be home! We only require that you keep your windows closed, clear any outdoor patio furniture or pet toys, and ensure we have access to an outdoor water spigot. We'll send you before/after photos via text as soon as the job is complete."
              },
              {
                q: "How often should I have my house and driveway cleaned?",
                a: "For most homes in Texas, we recommend a soft-wash treatment once every 12 to 18 months. Shadier locations prone to high moisture and tree canopy cover may require attention sooner to prevent slippery mildew buildup on walkways."
              }
            ].map((faq, idx) => (
              <div 
                key={idx}
                className="overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left font-sans text-base font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-teal-600 shrink-0 transition-transform duration-300 ${activeFaq === idx ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-50/50"
                    >
                      <div className="px-6 pb-5 pt-1 font-sans text-sm text-slate-500 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

          </motion.div>

        </div>
      </section>

      {/* Main Conversion Call / Contact & Fast Booking Form (Confetti State included) */}
      <section id="booking" ref={contactSectionRef} className="py-16 lg:py-24 bg-teal-900 text-white relative overflow-hidden">
        
        {/* Abstract water wave styling overlay */}
        <div className="absolute inset-0 bg-watercolor-dark opacity-40 pointer-events-none" />
        <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Contact text (5 Columns) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-emerald-300">
                <Percent className="w-3.5 h-3.5" />
                <span>Special Online Offer: Claim $50 Off</span>
              </div>
              
              <h2 className="font-sans text-4xl font-extrabold tracking-tight sm:text-5xl">
                Ready to Fall in Love with Your Home Again?
              </h2>
              
              <p className="font-sans text-base text-emerald-100/90 leading-relaxed">
                Book your cleaning date online today. Lock in your $50 first-time customer discount and secure your slot with zero upfront deposits!
              </p>

              <div className="space-y-4 pt-4 w-full flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-3 text-left w-full max-w-xs lg:max-w-none">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 shrink-0">
                    <Phone className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="font-sans text-xs text-emerald-200 uppercase tracking-wider">Fast Call/Text Quote</p>
                    <a href="tel:2545550199" className="font-sans text-lg font-bold hover:text-emerald-300 transition-colors">(254) 555-0199</a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left w-full max-w-xs lg:max-w-none">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 shrink-0">
                    <Mail className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="font-sans text-xs text-emerald-200 uppercase tracking-wider">Direct Business Email</p>
                    <a href="mailto:quotes@verdantwash.com" className="font-sans text-base font-bold hover:text-emerald-300 transition-colors">quotes@verdantwash.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left w-full max-w-xs lg:max-w-none">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="font-sans text-xs text-emerald-200 uppercase tracking-wider">Primary Service Location</p>
                    <p className="font-sans text-sm font-semibold">Central Texas &amp; Surrounding Areas</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mt-6 w-full text-center lg:text-left">
                <p className="font-sans text-xs font-bold text-emerald-200 tracking-wider">ORGANIZATIONS &amp; STANDARDS</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-3">
                  <span className="font-sans text-[11px] font-extrabold bg-white/5 px-2.5 py-1 rounded">PWNA Certified</span>
                  <span className="font-sans text-[11px] font-extrabold bg-white/5 px-2.5 py-1 rounded">EPA Green Soap Compliant</span>
                  <span className="font-sans text-[11px] font-extrabold bg-white/5 px-2.5 py-1 rounded">UAMCC Member</span>
                </div>
              </div>

            </motion.div>

            {/* High Converting Glassmorphic Form Card (7 Columns) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7"
            >
              <div className="glass-card-dark rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 relative overflow-hidden">
                
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form 
                      key="booking_form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleBookEstimate}
                      className="space-y-6"
                      id="online_quote_booking_form"
                    >
                      <div className="border-b border-white/10 pb-4 text-center sm:text-left">
                        <h3 className="font-sans text-xl font-bold">Secure Your Custom Cleaning Slot</h3>
                        <p className="font-sans text-xs text-emerald-200 mt-1">Pre-selected: <span className="font-bold underline">{currentServiceObj.name} (~{sqFt} sq ft)</span></p>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        {/* Name Input */}
                        <div className="space-y-2">
                          <label className="font-sans text-xs font-extrabold text-emerald-200 uppercase tracking-widest block text-center sm:text-left">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full h-12 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white placeholder-slate-400 border border-white/10 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-colors text-center sm:text-left"
                          />
                        </div>

                        {/* Phone Input */}
                        <div className="space-y-2">
                          <label className="font-sans text-xs font-extrabold text-emerald-200 uppercase tracking-widest block text-center sm:text-left">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="(254) 555-0100"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full h-12 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white placeholder-slate-400 border border-white/10 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-colors text-center sm:text-left"
                          />
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                          <label className="font-sans text-xs font-extrabold text-emerald-200 uppercase tracking-widest block text-center sm:text-left">
                            Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full h-12 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white placeholder-slate-400 border border-white/10 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-colors text-center sm:text-left"
                          />
                        </div>

                        {/* Zip Code Input */}
                        <div className="space-y-2">
                          <label className="font-sans text-xs font-extrabold text-emerald-200 uppercase tracking-widest block text-center sm:text-left">
                            Zip Code / City *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="76543"
                            value={formData.zip}
                            onChange={(e) => setFormData({...formData, zip: e.target.value})}
                            className="w-full h-12 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white placeholder-slate-400 border border-white/10 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-colors text-center sm:text-left"
                          />
                        </div>
                      </div>

                      {/* Date & Time Selectors */}
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="font-sans text-xs font-extrabold text-emerald-200 uppercase tracking-widest block text-center sm:text-left">
                            Preferred Date
                          </label>
                          <input
                            type="date"
                            value={formData.preferredDate}
                            onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                            className="w-full h-12 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white border border-white/10 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-colors [color-scheme:dark] text-center sm:text-left"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="font-sans text-xs font-extrabold text-emerald-200 uppercase tracking-widest block text-center sm:text-left">
                            Preferred Time Slot
                          </label>
                          <select
                            value={formData.preferredTime}
                            onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                            className="w-full h-12 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white border border-white/10 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-none transition-colors bg-slate-900 text-center sm:text-left"
                          >
                            <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                            <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                            <option value="evening">Late Afternoon (4:00 PM - 6:00 PM)</option>
                          </select>
                        </div>
                      </div>

                      {/* Add-ons Checklist */}
                      <div className="space-y-2">
                        <label className="font-sans text-xs font-extrabold text-emerald-200 uppercase tracking-widest block text-center sm:text-left">
                          Optional Add-on Cleanups
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: "window", label: "Exterior Window Spraying" },
                            { id: "gutter", label: "Gutter Cleanout & Flush" },
                            { id: "seal", label: "Concrete Stain Sealing" },
                            { id: "rust", label: "Rust & Oil Stain Treatment" }
                          ].map((addon) => (
                            <button
                              key={addon.id}
                              type="button"
                              onClick={() => toggleAddon(addon.id)}
                              className={`flex items-center gap-2 rounded-xl p-3 text-left text-xs font-bold border transition-all ${
                                formData.addons.includes(addon.id)
                                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                              }`}
                            >
                              <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border ${formData.addons.includes(addon.id) ? "bg-emerald-400 border-emerald-400 text-slate-900" : "border-white/30"}`}>
                                {formData.addons.includes(addon.id) && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span>{addon.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Special instructions */}
                      <div className="space-y-2">
                        <label className="font-sans text-xs font-extrabold text-emerald-200 uppercase tracking-widest block text-center sm:text-left">
                          Special Instructions or Surface Notes
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Tell us about brick types, wood deck conditions, delicate garden foliage, or gate lock codes..."
                          value={formData.notes}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          className="w-full rounded-xl bg-white/10 p-4 text-sm font-semibold text-white placeholder-slate-400 border border-white/10 focus:border-emerald-400 focus:outline-none transition-colors text-center sm:text-left"
                        />
                      </div>

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 font-sans text-base font-extrabold text-slate-950 shadow-lg shadow-cyan-400/10 transition-all hover:scale-[1.01] hover:shadow-cyan-400/20 active:scale-[0.99] disabled:opacity-50"
                        id="submit_booking_form"
                      >
                        {isSubmitting ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-slate-950" />
                            <span>Claim $50 Off Coupon &amp; Book Free Estimate</span>
                          </>
                        )}
                      </button>

                      <p className="text-center font-sans text-[11px] text-emerald-200/70">
                        🔒 Your info is fully secured. We do not sell or spam your numbers.
                      </p>
                    </motion.form>
                  ) : (
                    // Success state (Confetti / Elegant voucher receipt)
                    <motion.div
                      key="success_voucher"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 px-4 space-y-6 flex flex-col items-center"
                    >
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 text-slate-950 shadow-xl shadow-cyan-400/20">
                        <Check className="w-10 h-10 stroke-[3] animate-bounce" />
                      </div>

                      <div className="space-y-2 text-center">
                        <span className="font-sans text-xs font-extrabold text-cyan-300 uppercase tracking-widest bg-cyan-400/10 px-3.5 py-1.5 rounded-full inline-block">
                          Quote Locked &amp; Scheduled!
                        </span>
                        <h3 className="font-sans text-3xl font-black text-white">Thank You, {formData.name}!</h3>
                        <p className="font-sans text-sm text-emerald-100 max-w-md mx-auto">
                          Your quote request for <span className="font-bold underline">{currentServiceObj.name}</span> has been locked into our central calendar slot.
                        </p>
                      </div>

                      {/* Visual Voucher Ticket */}
                      <div className="w-full max-w-sm rounded-2xl bg-white text-slate-900 overflow-hidden shadow-inner border border-slate-100 text-left">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-white flex justify-between items-center">
                          <span className="font-sans text-xs font-bold tracking-wider uppercase">VerdantWash Voucher</span>
                          <span className="font-mono text-xs font-bold">#VW-{Math.floor(100000 + Math.random() * 900000)}</span>
                        </div>
                        <div className="p-5 space-y-3 font-sans text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Estimated Cost:</span>
                            <span className="font-extrabold text-slate-900">${minEstimate} - ${maxEstimate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Online Discount:</span>
                            <span className="font-bold text-emerald-600">-$50.00 SAVED</span>
                          </div>
                          <hr className="border-dashed border-slate-200" />
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium">Schedule Period:</span>
                            <span className="font-extrabold text-teal-700 bg-teal-50 px-2 py-1 rounded">
                              {formData.preferredDate || "Within 48 Hours"} ({formData.preferredTime})
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Phone Confirmed:</span>
                            <span className="font-bold text-slate-900">{formData.phone}</span>
                          </div>
                        </div>
                        <div className="bg-slate-50 px-5 py-3 text-center text-xs text-slate-400 border-t border-slate-100 font-medium">
                          Our estimator will text or call you shortly to finalize!
                        </div>
                      </div>

                      <p className="font-sans text-xs text-emerald-200/80 text-center">
                        Need immediate assistance? Speak to a washing specialist right now: <br />
                        <a href="tel:2545550199" className="font-bold underline hover:text-emerald-300">(254) 555-0199</a>
                      </p>

                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="font-sans text-xs font-bold text-slate-300 underline hover:text-white block"
                      >
                        Submit another estimate request
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer - Watercolor Branding with Quick Links */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid gap-10 md:grid-cols-4">
            
            {/* Branding Column */}
            <div className="space-y-4 text-center md:text-left flex flex-col items-center md:items-start">
              <a href="#" className="flex items-center gap-2 group">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white shadow-sm">
                  <Droplets className="w-5 h-5" />
                </div>
                <span className="font-sans text-lg font-bold tracking-tight text-white">
                  Verdant<span className="text-emerald-400">Wash</span>
                </span>
              </a>
              <p className="font-sans text-xs leading-relaxed text-slate-500">
                Pristine soft wash and pressure washing services reviving siding, concrete, brick, roofs, and timber. Protecting properties, preserving shrubbery.
              </p>
              <p className="font-sans text-xs text-slate-500">
                © {new Date().getFullYear()} VerdantWash LLC. <br />
                All Rights Reserved.
              </p>
            </div>

            {/* Services Links */}
            <div className="text-center md:text-left">
              <p className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4">Our Services</p>
              <ul className="space-y-2.5 font-sans text-xs">
                <li><a href="#services" onClick={() => selectServiceAndEstimate("house")} className="hover:text-emerald-400 transition-colors">Residential Soft Washing</a></li>
                <li><a href="#services" onClick={() => selectServiceAndEstimate("driveway")} className="hover:text-emerald-400 transition-colors">Driveway surface blasting</a></li>
                <li><a href="#services" onClick={() => selectServiceAndEstimate("roof")} className="hover:text-emerald-400 transition-colors">Safe Roof Moss Mitigation</a></li>
                <li><a href="#services" onClick={() => selectServiceAndEstimate("deck")} className="hover:text-emerald-400 transition-colors">Timber Deck Restoring</a></li>
                <li><a href="#services" onClick={() => selectServiceAndEstimate("driveway")} className="hover:text-emerald-400 transition-colors">Brick &amp; Stone Deep Cleans</a></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <p className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Links</p>
              <ul className="space-y-2.5 font-sans text-xs">
                <li><a href="#services" className="hover:text-emerald-400 transition-colors">Service Highlights</a></li>
                <li><a href="#transformations" className="hover:text-emerald-400 transition-colors">Transformation Gallery</a></li>
                <li><a href="#pricing" className="hover:text-emerald-400 transition-colors">Instant Estimate Calculator</a></li>
                <li><a href="#faq" className="hover:text-emerald-400 transition-colors">Frequently Asked FAQs</a></li>
                <li><a href="#booking" className="hover:text-emerald-400 transition-colors">Lock Your $50 Discount</a></li>
              </ul>
            </div>

            {/* Direct Contact */}
            <div className="space-y-3 font-sans text-xs text-center md:text-left flex flex-col items-center md:items-start">
              <p className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-1">Direct Contact</p>
              <p className="text-slate-400">
                Speak directly to an owner: <br />
                <a href="tel:2545550199" className="font-bold text-white hover:text-emerald-400 text-sm">(254) 555-0199</a>
              </p>
              <p className="text-slate-500">
                Mon - Sat: 8:00 AM - 6:00 PM <br />
                Sundays: Appointments Only
              </p>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 font-sans text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                <span>Monitors Dispatch Crews</span>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-sans text-[10px] text-slate-600 text-center sm:text-left">
              Professional pressure washing is a skill. Protect your investment by hiring licensed, EPA-compliant soft washers.
            </p>
            <div className="flex gap-4 font-sans text-[11px] text-slate-500">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
