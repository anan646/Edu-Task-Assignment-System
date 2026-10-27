'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Heart,
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Star,
  Scissors,
  ShieldCheck,
  Camera,
  X,
  ArrowRight,
  ChevronDown,
  AlertCircle,
  Award,
} from 'lucide-react';

interface ServicePackage {
  id: string;
  name: string;
  tagline: string;
  price: string;
  duration: string;
  popular?: boolean;
  color: string;
  emoji: string;
  features: string[];
}

const SERVICES: ServicePackage[] = [
  {
    id: 'bath',
    name: 'The Splash & Fluff',
    tagline: 'Quick freshen-up for adventurous pets',
    price: '$35',
    duration: '45 - 60 mins',
    color: 'from-sky-400 to-blue-500',
    emoji: '🫧',
    features: [
      'Warm aroma bubble bath with organic shampoo',
      'Gentle fluff blow-dry by hand (No cage dryers)',
      'Paw-pad hair trim & tidy',
      'Ear cleaning & nail clipping',
      'Complimentary spritz of lavender mist',
    ],
  },
  {
    id: 'full-groom',
    name: 'Head-to-Tail Royal Spa',
    tagline: 'Our signature cut & styling session',
    price: '$65',
    duration: '90 - 120 mins',
    popular: true,
    color: 'from-amber-400 to-orange-500',
    emoji: '✂️',
    features: [
      'Everything in The Splash & Fluff',
      'Breed-standard styling or custom Teddy-bear cut',
      'Soothing blueberry brightening facial',
      'De-shedding coat massage & undercoat blowout',
      'Teeth gel brush & fresh breath peppermint spray',
      'Choice of silk designer bowtie or floral bandana',
    ],
  },
  {
    id: 'deluxe',
    name: 'VIP Mud & Ozone Retreat',
    tagline: 'The ultimate luxury pampering package',
    price: '$95',
    duration: '2.5 - 3 hours',
    color: 'from-purple-400 to-pink-500',
    emoji: '👑',
    features: [
      'Everything in Head-to-Tail Royal Spa',
      'Dead Sea mineral mud bath or ozone hydrotherapy',
      'Deep paw-pad moisturizing balm & massage',
      'Blueberry eye & tear-stain brightening therapy',
      'Organic coconut oil coat leave-in shine polish',
      'Souvenir Polaroid photo & gourmet organic treat bag',
    ],
  },
];

const FAQS = [
  {
    q: 'Are your grooming sessions really 100% cage-free?',
    a: 'Absolutely! We never use cages or crate dryers. Pets hang out in our supervised, cozy indoor play pens with soft orthopedic beds, toys, and fresh water between gentle grooming steps.',
  },
  {
    q: 'My dog is super nervous or rescue-shy. How do you handle anxiety?',
    a: 'All our groomers are Fear-Free certified. We take things slow, use soothing pheromone diffusers, offer lick-mats with organic peanut butter, and give frequent cuddle breaks to keep tails wagging.',
  },
  {
    q: 'Do you groom cats and what are the requirements?',
    a: 'Yes, we adore feline friends! We host dedicated Quiet Cat Hours with zero barking dogs in the facility. Felines must have up-to-date rabies vaccinations.',
  },
  {
    q: 'How early should I book an appointment?',
    a: 'We recommend booking 3 to 5 days in advance, especially for weekend slots. However, we always keep a few same-day standby spots for grooming emergencies!',
  },
];

export default function PetGroomingLandingPage() {
  // Booking Dialog Ref (Native <dialog>)
  const bookingDialogRef = useRef<HTMLDialogElement>(null);

  // Form State
  const [selectedPackage, setSelectedPackage] = useState('full-groom');
  const [petType, setPetType] = useState<'dog' | 'cat' | 'other'>('dog');
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);

  // Set default minimum date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPreferredDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Sync aria-invalid with CSS :user-invalid state for accessibility
  useEffect(() => {
    const syncAria = (el: EventTarget | null) => {
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
        if (el.matches(':user-invalid')) {
          el.setAttribute('aria-invalid', 'true');
        } else if (el.matches(':user-valid')) {
          el.setAttribute('aria-invalid', 'false');
        }
      }
    };

    const handleBlur = (e: FocusEvent) => syncAria(e.target);
    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target?.hasAttribute('aria-invalid')) syncAria(target);
    };

    document.addEventListener('blur', handleBlur, true);
    document.addEventListener('input', handleInput);
    return () => {
      document.removeEventListener('blur', handleBlur, true);
      document.removeEventListener('input', handleInput);
    };
  }, []);

  // Light dismiss fallback for <dialog closedby="any">
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = bookingDialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isClickOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (isClickOutside) {
      dialog.close();
    }
  };

  const openBookingModal = (packageId?: string) => {
    if (packageId) setSelectedPackage(packageId);
    setIsBookedSuccess(false);
    bookingDialogRef.current?.showModal();
  };

  const closeBookingModal = () => {
    bookingDialogRef.current?.close();
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API reservation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsBookedSuccess(true);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-amber-50/30 text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-400 to-rose-400 text-white py-2 px-4 text-center text-xs sm:text-sm font-bold shadow-xs">
        <span className="inline-flex items-center gap-2">
          <span>🐾 First time fur-parent? Enjoy <strong>20% OFF</strong> your pet&apos;s first spa session with code:</span>
          <span className="bg-white/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-2xs font-extrabold ring-1 ring-white/40">
            SPAW20
          </span>
        </span>
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/pet-grooming" className="flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-2xl shadow-md shadow-amber-400/30 group-hover:scale-105 transition-transform">
              🐶
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Paws &amp; Bubbles
                </span>
                <Sparkles className="h-4 w-4 text-amber-500 fill-amber-400" />
              </div>
              <p className="text-2xs font-semibold text-amber-600 uppercase tracking-widest">
                Luxury Pet Spa &amp; Salon
              </p>
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-600">
            <a href="#services" className="hover:text-amber-600 transition-colors">
              Services &amp; Pricing
            </a>
            <a href="#why-us" className="hover:text-amber-600 transition-colors">
              Fear-Free Care
            </a>
            <a href="#gallery" className="hover:text-amber-600 transition-colors">
              Fluff Gallery
            </a>
            <a href="#reviews" className="hover:text-amber-600 transition-colors">
              Pawsome Reviews
            </a>
            <a href="#faqs" className="hover:text-amber-600 transition-colors">
              FAQs
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="tel:021234567"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-600 px-3 py-2 rounded-xl border border-slate-200 hover:border-amber-300 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-amber-500" />
              <span>(02) 123-4567</span>
            </a>
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-orange-500/25 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 active:scale-95 transition-all cursor-pointer"
            >
              <Heart className="h-4 w-4 fill-white text-white" />
              <span>Book a Spaw Day</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
          {/* Soft decorative background circles */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-200/40 via-orange-200/30 to-pink-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute -top-10 -right-20 w-80 h-80 bg-sky-200/30 rounded-full blur-2xl -z-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Copy & Value Proposition */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/90 border border-amber-300/60 px-4 py-1.5 text-xs font-extrabold text-amber-900 shadow-xs">
                  <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                  <span>100% Cage-Free &amp; Fear-Free Grooming Spa</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.12] tracking-tight">
                  Gentle hands, happy paws &amp; the{' '}
                  <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                    fluffiest hugs!
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                  Tailored styling, organic herbal bubble baths, and stress-free care for your beloved dogs &amp; cats.
                  Every pet is treated like royalty with zero cages, gentle handling, and endless belly rubs.
                </p>

                {/* Hero CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => openBookingModal()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Book Your Pet&apos;s Spaw Day</span>
                    <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                  </button>
                  <a
                    href="#services"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200/90 px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-amber-300 shadow-xs transition-all"
                  >
                    <span>View Menu &amp; Pricing</span>
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 border-t border-amber-200/60 grid grid-cols-3 gap-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌿</span>
                    <div>
                      <strong className="block text-xs font-bold text-slate-900">Organic &amp; Tearless</strong>
                      <span className="text-2xs text-slate-500">Hypoallergenic products</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏡</span>
                    <div>
                      <strong className="block text-xs font-bold text-slate-900">Zero Cages</strong>
                      <span className="text-2xs text-slate-500">Free-roam luxury suites</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <strong className="block text-xs font-bold text-slate-900">4.9 / 5.0 Rating</strong>
                      <span className="text-2xs text-slate-500">2,400+ happy pets</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Playful Pet Hero Card */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-md">
                  {/* Floating Bubble Badges */}
                  <div className="absolute -top-4 -left-4 z-20 bg-white/95 backdrop-blur-sm rounded-2xl p-3 border border-amber-200 shadow-lg flex items-center gap-2.5 animate-bounce [animation-duration:4s]">
                    <span className="text-2xl">🫧</span>
                    <div>
                      <p className="text-2xs font-extrabold text-slate-900">Warm Milk Bath</p>
                      <p className="text-3xs text-amber-600 font-bold">Silky soft fur guarantee</p>
                    </div>
                  </div>

                  <div className="absolute -bottom-5 -right-3 z-20 bg-white/95 backdrop-blur-sm rounded-2xl p-3.5 border border-orange-200 shadow-xl flex items-center gap-3">
                    <div className="flex -space-x-1.5">
                      <span className="inline-block h-6 w-6 rounded-full bg-amber-400 text-center text-xs leading-6">🐶</span>
                      <span className="inline-block h-6 w-6 rounded-full bg-pink-400 text-center text-xs leading-6">🐱</span>
                      <span className="inline-block h-6 w-6 rounded-full bg-blue-400 text-center text-xs leading-6">🐩</span>
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">50+ Pets Today</p>
                      <p className="text-3xs text-emerald-600 font-bold">All tails wagging happily!</p>
                    </div>
                  </div>

                  {/* Visual Pet Showcase Card */}
                  <div className="rounded-3xl bg-gradient-to-b from-amber-200/80 via-orange-100 to-white p-7 border-4 border-white shadow-2xl text-center space-y-5">
                    <div className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-300 flex items-center justify-center text-8xl shadow-inner overflow-hidden border-4 border-white">
                      <span className="animate-pulse">🐩</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-900">Meet &quot;Barnaby&quot; 🐾</h3>
                      <p className="text-xs text-amber-800 font-medium">
                        Teddy-bear styling &amp; Blueberry facial recipient
                      </p>
                      <div className="flex items-center justify-center gap-1 text-amber-500 pt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openBookingModal('full-groom')}
                      className="w-full rounded-2xl bg-slate-900 text-white font-extrabold text-xs py-3 hover:bg-slate-800 transition-colors shadow-md cursor-pointer"
                    >
                      Book Barnaby&apos;s Royal Cut →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES & PRICING SECTION */}
        <section id="services" className="py-20 bg-white border-y border-amber-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="rounded-full bg-amber-100 px-3.5 py-1 text-2xs font-extrabold text-amber-800 uppercase tracking-widest">
                Our Spaw Packages
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Pampering Packages For Every Pet
              </h2>
              <p className="text-sm text-slate-500 font-normal">
                All treatments include gentle ear cleaning, nail clipping, blueberry facial, and complimentary styling bandanas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SERVICES.map((service) => (
                <div
                  key={service.id}
                  className={`relative flex flex-col justify-between rounded-3xl border-2 transition-all p-7 bg-white shadow-sm hover:shadow-xl ${
                    service.popular
                      ? 'border-orange-400 ring-4 ring-orange-400/10'
                      : 'border-slate-200/80 hover:border-amber-300'
                  }`}
                >
                  {service.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-2xs font-black uppercase tracking-wider text-white shadow-md">
                      ⭐ Most Requested Spaw Day
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl border border-amber-200/60">
                        {service.emoji}
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-2xs font-bold text-slate-600">
                        <Clock className="h-3 w-3" /> {service.duration}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-black text-slate-900">{service.name}</h3>
                    <p className="mt-1 text-xs text-slate-500 font-normal">{service.tagline}</p>

                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-xs font-bold text-slate-400">from</span>
                      <span className="text-3xl font-black text-slate-900">{service.price}</span>
                      <span className="text-2xs text-slate-400">/ session</span>
                    </div>

                    {/* Features list */}
                    <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                      <p className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider">
                        Included In This Package:
                      </p>
                      <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                        {service.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openBookingModal(service.id)}
                    className={`mt-8 w-full rounded-2xl py-3.5 text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer ${
                      service.popular
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-orange-500/25 hover:from-amber-400 hover:to-orange-400'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    Select &amp; Book This Spaw Day
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Add-ons Strip */}
            <div className="mt-12 rounded-3xl bg-amber-50/70 border border-amber-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="text-base font-extrabold text-slate-900">
                  ✨ Need extra TLC? Add À La Carte treatments anytime!
                </h4>
                <p className="text-xs text-slate-600">
                  Flea &amp; Tick Dip (+$15) • Pawdicure Nail Polish (+$10) • De-shedding Furminator (+$20) • Pet Taxi Pick-up (+$15)
                </p>
              </div>
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="shrink-0 rounded-2xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-500 transition-colors cursor-pointer"
              >
                Customize Appointment
              </button>
            </div>
          </div>
        </section>

        {/* WHY US / FEAR-FREE PHILOSOPHY */}
        <section id="why-us" className="py-20 bg-amber-50/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-2xs font-extrabold text-emerald-800 uppercase tracking-widest">
                  Our Gentle Promise
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Designed from the paw up for zero anxiety &amp; maximum fun
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  Traditional groomers often rely on cold metal cages, noisy industrial blowers, and rushing through appointments.
                  At Paws &amp; Bubbles, we treat your pet like our own furry child.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-amber-100 shadow-2xs">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold">
                      🚫
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">100% Cage-Free Guarantee</h4>
                      <p className="text-2xs text-slate-500 mt-0.5">
                        Pets rest in open padded lounge rooms with calming music, aromatherapy, and cuddles.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-amber-100 shadow-2xs">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
                      🌿
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Botanical &amp; Hypoallergenic Products</h4>
                      <p className="text-2xs text-slate-500 mt-0.5">
                        Free from harsh parabens, sulfates, and synthetic perfumes that cause itchy skin.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-amber-100 shadow-2xs">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold">
                      📹
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Live Pet-Cam Streaming</h4>
                      <p className="text-2xs text-slate-500 mt-0.5">
                        Watch your furry companion get their bath and trim in real-time from your smartphone!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cute visual highlights */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-3xl bg-white p-6 border border-amber-200/80 shadow-md text-center space-y-2">
                    <span className="text-4xl block">🛁</span>
                    <strong className="text-2xl font-black text-slate-900">15,000+</strong>
                    <p className="text-xs text-slate-500 font-medium">Baths &amp; Spas Given</p>
                  </div>
                  <div className="rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-400 p-6 text-white text-center shadow-lg space-y-2">
                    <span className="text-4xl block">🏅</span>
                    <strong className="text-2xl font-black">10+ Years</strong>
                    <p className="text-xs text-amber-100 font-medium">Master Certified Groomers</p>
                  </div>
                </div>

                <div className="space-y-4 pt-8">
                  <div className="rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-500 p-6 text-white text-center shadow-lg space-y-2">
                    <span className="text-4xl block">💖</span>
                    <strong className="text-2xl font-black">100%</strong>
                    <p className="text-xs text-rose-100 font-medium">Love &amp; Belly Rubs</p>
                  </div>
                  <div className="rounded-3xl bg-white p-6 border border-amber-200/80 shadow-md text-center space-y-2">
                    <span className="text-4xl block">🚑</span>
                    <strong className="text-xl font-black text-slate-900">Pet First Aid</strong>
                    <p className="text-xs text-slate-500 font-medium">CPR Certified Team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEFORE & AFTER FLUFF GALLERY */}
        <section id="gallery" className="py-20 bg-white border-t border-amber-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="rounded-full bg-pink-100 px-3.5 py-1 text-2xs font-extrabold text-pink-800 uppercase tracking-widest">
                Real Fluff Transformations
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Before &amp; After The Magic Touch ✨
              </h2>
              <p className="text-sm text-slate-500 font-normal">
                Look at these dapper gentlemen and fabulous ladies after their royal treatment!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pet 1 */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 shadow-xs space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-2xl bg-amber-100 p-4 border border-amber-200/60">
                    <span className="text-4xl block mb-2">🐕</span>
                    <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-500">Before</span>
                    <p className="text-2xs text-slate-600 font-medium">Scruffy &amp; tangled</p>
                  </div>
                  <div className="rounded-2xl bg-orange-100 p-4 border border-orange-200/60 ring-2 ring-orange-400/30">
                    <span className="text-4xl block mb-2">🐩</span>
                    <span className="text-2xs font-extrabold uppercase tracking-wider text-orange-700">After</span>
                    <p className="text-2xs text-orange-900 font-bold">Fluffy Teddy Cut</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Winston (Golden Doodle)</h4>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    &quot;He smells like warm vanilla sugar and strutted around the house like a model!&quot;
                  </p>
                </div>
              </div>

              {/* Pet 2 */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 shadow-xs space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-2xl bg-amber-100 p-4 border border-amber-200/60">
                    <span className="text-4xl block mb-2">🐈‍⬛</span>
                    <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-500">Before</span>
                    <p className="text-2xs text-slate-600 font-medium">Heavy shedding mats</p>
                  </div>
                  <div className="rounded-2xl bg-orange-100 p-4 border border-orange-200/60 ring-2 ring-orange-400/30">
                    <span className="text-4xl block mb-2">🐈</span>
                    <span className="text-2xs font-extrabold uppercase tracking-wider text-orange-700">After</span>
                    <p className="text-2xs text-orange-900 font-bold">De-shed &amp; Lion Trim</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Cleo (Persian Kitty)</h4>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    &quot;Cleo usually hates baths, but the quiet cat hour made her purr the whole time.&quot;
                  </p>
                </div>
              </div>

              {/* Pet 3 */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-5 shadow-xs space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-2xl bg-amber-100 p-4 border border-amber-200/60">
                    <span className="text-4xl block mb-2">🐶</span>
                    <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-500">Before</span>
                    <p className="text-2xs text-slate-600 font-medium">Muddy park pup</p>
                  </div>
                  <div className="rounded-2xl bg-orange-100 p-4 border border-orange-200/60 ring-2 ring-orange-400/30">
                    <span className="text-4xl block mb-2">🐾</span>
                    <span className="text-2xs font-extrabold uppercase tracking-wider text-orange-700">After</span>
                    <p className="text-2xs text-orange-900 font-bold">Spa &amp; Silk Bandana</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Buster (French Bulldog)</h4>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    &quot;Wrinkle cleaning and paw balm worked miracles on his sensitive skin!&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS & TESTIMONIALS */}
        <section id="reviews" className="py-20 bg-amber-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="rounded-full bg-amber-100 px-3.5 py-1 text-2xs font-extrabold text-amber-800 uppercase tracking-widest">
                Happy Paw-Rents
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Over 2,400+ Five-Star Reviews ⭐
              </h2>
              <p className="text-sm text-slate-500 font-normal">
                See why Bangkok and pet parents everywhere trust us with their beloved fur babies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl bg-white p-6 border border-amber-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  &quot;I will never take my Pomeranian anywhere else. No scary cages, and they sent me video updates during her milk bath! She came home smelling divine with the cutest strawberry bandana.&quot;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <div className="h-9 w-9 rounded-full bg-amber-200 flex items-center justify-center font-bold text-xs text-amber-900">
                    PS
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">Ploypailin S.</strong>
                    <span className="text-2xs text-slate-400">Mom to Mochi (Pomeranian)</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 border border-amber-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  &quot;My Golden Retriever has severe hip dysplasia and gets stiff standing too long. The groomers were so patient, gave him massage breaks, and supported him gently. Truly compassionate professionals.&quot;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <div className="h-9 w-9 rounded-full bg-orange-200 flex items-center justify-center font-bold text-xs text-orange-900">
                    DW
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">David Walker</strong>
                    <span className="text-2xs text-slate-400">Dad to Cooper (Golden Retriever)</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 border border-amber-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  &quot;The booking was super fast, the place is sparkling clean without that pungent wet-dog smell, and the teddy bear cut was 100% on point. 10/10 recommend!&quot;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <div className="h-9 w-9 rounded-full bg-rose-200 flex items-center justify-center font-bold text-xs text-rose-900">
                    KT
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">Kamonwan T.</strong>
                    <span className="text-2xs text-slate-400">Mom to Coco (Toy Poodle)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section id="faqs" className="py-20 bg-white border-t border-amber-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 space-y-3">
              <span className="rounded-full bg-slate-100 px-3.5 py-1 text-2xs font-extrabold text-slate-700 uppercase tracking-widest">
                Common Inquiries
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/40 p-5 transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between text-xs sm:text-sm font-extrabold text-slate-900 list-none">
                    <span>{faq.q}</span>
                    <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed font-normal border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION STRIP */}
        <section className="py-16 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 relative z-10">
            <span className="text-4xl animate-bounce inline-block">🐾</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to give your pet the fluffiest day ever?
            </h2>
            <p className="text-sm text-amber-100 max-w-xl mx-auto font-normal">
              Appointments fill up fast! Reserve your spot online in less than 2 minutes and claim your 20% first-visit discount.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-black text-orange-600 shadow-2xl hover:bg-amber-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Book an Appointment Today</span>
                <Heart className="h-4 w-4 fill-orange-500 text-orange-500" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center text-lg font-bold">
                🐶
              </div>
              <span className="font-extrabold text-white text-base">Paws &amp; Bubbles</span>
            </div>
            <p className="text-2xs text-slate-400 leading-relaxed">
              Certified Fear-Free luxury pet grooming salon &amp; wellness retreat. Made with unconditional love for pets.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3">Location &amp; Hours</h4>
            <p className="text-2xs leading-relaxed">
              123 Sukhumvit Soi 55 (Thonglor)<br />
              Bangkok 10110, Thailand<br />
              Mon - Sun: 8:30 AM - 7:00 PM
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-1.5 text-2xs">
              <li><a href="#services" className="hover:text-white transition-colors">Pricing Packages</a></li>
              <li><a href="#why-us" className="hover:text-white transition-colors">Fear-Free Philosophy</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">Before &amp; After</a></li>
              <li><button type="button" onClick={() => openBookingModal()} className="hover:text-white transition-colors cursor-pointer text-left">Book Online</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3">Contact Directly</h4>
            <p className="text-2xs leading-relaxed space-y-1">
              <span>📞 Tel: (02) 123-4567</span><br />
              <span>💬 Line: @pawsbubbles</span><br />
              <span>✉️ woof@pawsbubbles.pet</span>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-slate-800/80 text-center text-2xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>&copy; 2026 Paws &amp; Bubbles Spa. All rights reserved.</span>
          <span className="flex items-center gap-1">Crafted with belly rubs &amp; gentle care 🐾</span>
        </div>
      </footer>

      {/* NATIVE ACCESSIBLE BOOKING <dialog> MODAL */}
      <dialog
        ref={bookingDialogRef}
        onClick={handleDialogClick}
        aria-labelledby="booking-dialog-title"
        className="fixed inset-0 m-auto z-50 w-full max-w-lg rounded-3xl bg-white p-0 shadow-2xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm border border-amber-200/80 overflow-hidden"
      >
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          {/* Dialog Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-xl shadow-md shadow-orange-500/25">
                🛁
              </div>
              <div>
                <h2 id="booking-dialog-title" className="text-base font-extrabold text-slate-900">
                  Book A Spaw Day Appointment
                </h2>
                <p className="text-2xs text-slate-500 font-normal">
                  Reserve your pet&apos;s luxury pampering session in 60 seconds
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeBookingModal}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Dialog Content: Success or Form */}
          {isBookedSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="h-16 w-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-inner animate-bounce">
                🎉
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Pawsome! Appointment Reserved!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{ownerName || 'Pet Parent'}</strong>! We are thrilled to welcome{' '}
                <strong>{petName || 'your fur-baby'}</strong> for their{' '}
                <span className="text-amber-700 font-bold">
                  {SERVICES.find((s) => s.id === selectedPackage)?.name}
                </span>{' '}
                on <strong>{preferredDate}</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 text-xs text-amber-900 border border-amber-200/80 text-left space-y-1">
                <p>📍 <strong>Location:</strong> 123 Sukhumvit Soi 55, Thonglor</p>
                <p>🎟️ <strong>First-Time Code:</strong> <span className="font-mono font-bold text-orange-600">SPAW20</span> (20% discount applied at checkout)</p>
                <p>📞 We sent a confirmation SMS to <strong>{ownerPhone || 'your phone'}</strong>.</p>
              </div>
              <button
                type="button"
                onClick={closeBookingModal}
                className="w-full rounded-2xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close &amp; Return to Page
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitBooking} className="mt-5 space-y-4 text-xs">
              {/* Pet Type Selector */}
              <div>
                <label className="block text-2xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                  1. What kind of fur-baby do you have?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPetType('dog')}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      petType === 'dog'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>🐶</span> Dog
                  </button>
                  <button
                    type="button"
                    onClick={() => setPetType('cat')}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      petType === 'cat'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>🐱</span> Cat
                  </button>
                  <button
                    type="button"
                    onClick={() => setPetType('other')}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      petType === 'other'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>🐰</span> Small Pet
                  </button>
                </div>
              </div>

              {/* Pet Info Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="pet-name" className="block text-2xs font-extrabold text-slate-700 mb-1">
                    Pet&apos;s Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="pet-name"
                    required
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="e.g. Milo, Mochi"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label htmlFor="pet-breed" className="block text-2xs font-extrabold text-slate-700 mb-1">
                    Breed &amp; Weight (Approx.)
                  </label>
                  <input
                    type="text"
                    id="pet-breed"
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    placeholder="e.g. Poodle (5kg)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label htmlFor="package-select" className="block text-2xs font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  2. Choose Spa Package <span className="text-rose-500">*</span>
                </label>
                <select
                  id="package-select"
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-semibold text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.emoji} {s.name} ({s.price} • {s.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Date */}
              <div>
                <label htmlFor="booking-date" className="block text-2xs font-extrabold text-slate-700 mb-1">
                  3. Preferred Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  id="booking-date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                />
              </div>

              {/* Parent Contact Details with Modern Form Validation */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <p className="text-2xs font-extrabold uppercase tracking-wider text-slate-600">
                  4. Paw-Parent Contact Details
                </p>

                <div>
                  <label htmlFor="owner-name" className="block text-2xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="owner-name"
                    required
                    autoComplete="name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="owner-phone" className="block text-2xs font-bold text-slate-700 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="owner-phone"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="081-234-5678"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <span id="email-hint" className="block text-2xs font-bold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </span>
                    <input
                      type="email"
                      id="owner-email"
                      required
                      autoComplete="email"
                      aria-describedby="email-hint"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="special-notes" className="block text-2xs font-bold text-slate-700 mb-1">
                    Special notes or personality quirks (Optional)
                  </label>
                  <textarea
                    id="special-notes"
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Scared of thunder, sensitive left ear, loves chicken treats"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-2.5 text-xs font-extrabold text-white shadow-md shadow-orange-500/25 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Heart className="h-4 w-4 fill-white text-white" />
                  <span>{isSubmitting ? 'Confirming with Groomers...' : 'Confirm Reservation'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </div>
  );
}
