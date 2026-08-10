"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "reicon-react";

const API = process.env.NEXT_PUBLIC_API_URL || "";

interface ApiInstallation {
  id: string;
  title: string;
  slug: string;
  location: string;
  canopyType: string;
  yearCompleted: number;
  description?: string;
  brand?: string;
  isFeatured: boolean;
  photos: { imageUrl: string }[];
}

const CATEGORY_LABELS: Record<string, string> = {
  peb: "PEB Structure",
  warehouse: "Warehouse",
  other: "Other Structural Work",
};

export function ProjectsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [projects, setProjects] = useState<ApiInstallation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/installations?featured=true`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setProjects(data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || projects.length === 0) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);

      const containerRect = el.getBoundingClientRect();
      const children = Array.from(el.children) as HTMLElement[];

      let closestIndex = 0;
      let minDifference = Infinity;

      children.forEach((child, index) => {
        if (index < projects.length) {
          const childRect = child.getBoundingClientRect();
          const diff = Math.abs(childRect.left - containerRect.left);
          if (diff < minDifference) {
            minDifference = diff;
            closestIndex = index;
          }
        }
      });

      setActiveIndex(closestIndex);
    };

    el.addEventListener("scroll", handleScroll);
    handleScroll();

    const observer = new ResizeObserver(handleScroll);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [projects]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const children = Array.from(container.children) as HTMLElement[];

      let targetIndex = activeIndex;
      if (direction === "left") {
        targetIndex = Math.max(0, activeIndex - 1);
      } else {
        targetIndex = Math.min(projects.length - 1, activeIndex + 1);
      }

      const card = children[targetIndex];
      if (card) {
        const containerRect = container.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const targetScrollLeft = container.scrollLeft + (cardRect.left - containerRect.left);

        container.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });
      }
    }
  };

  const goToIndex = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const children = Array.from(container.children) as HTMLElement[];
      const card = children[index];
      if (card) {
        const containerRect = container.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const targetScrollLeft = container.scrollLeft + (cardRect.left - containerRect.left);

        container.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <section className="bg-bg-warm border-t border-slate-muted/10 py-16 md:py-24 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        {/* Header section with arrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-accent uppercase tracking-widest mb-3 block">
              Portfolio
            </span>
            <h2 className="text-3xl md:text-5xl font-heading tracking-tight text-slate-900 mb-4 leading-none">
              FEATURED INSTALLATIONS
            </h2>
            <p className="text-slate-650 font-sans leading-relaxed text-sm md:text-base">
              Discover how leading oil companies and independent petrol outlets leverage our structural engineering expertise to build resilient, eye-catching forecourt canopies.
            </p>
          </div>

          {/* Scroll Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-3 rounded-[4px] border border-slate-muted/20 bg-white transition-all duration-150 ${
                canScrollLeft
                  ? "text-slate-700 hover:bg-slate-50 cursor-pointer active:scale-95 shadow-xs"
                  : "text-slate-300 bg-slate-50 cursor-not-allowed"
              }`}
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-5 h-5" weight="Filled" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-3 rounded-[4px] border border-slate-muted/20 bg-white transition-all duration-150 ${
                canScrollRight
                  ? "text-slate-700 hover:bg-slate-50 cursor-pointer active:scale-95 shadow-xs"
                  : "text-slate-350 bg-slate-50 cursor-not-allowed"
              }`}
              aria-label="Next slide"
            >
              <ArrowRight className="w-5 h-5" weight="Filled" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        {loading ? (
          <div className="py-16 text-center font-mono text-sm text-slate-400 uppercase tracking-widest">
            Loading featured installations...
          </div>
        ) : projects.length === 0 ? (
          <div className="py-16 text-center font-mono text-sm text-slate-400 uppercase tracking-widest">
            No featured installations found.
          </div>
        ) : (
          <>
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              {projects.map((project) => {
                const coverUrl = project.photos && project.photos[0]?.imageUrl
                  ? (project.photos[0].imageUrl.startsWith("http")
                      ? project.photos[0].imageUrl
                      : `${API}${project.photos[0].imageUrl}`)
                  : "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=600&h=800&q=80";

                const brandName = project.brand || "SKYWARD";
                const catLabel = CATEGORY_LABELS[project.canopyType] || project.canopyType;

                return (
                  <div
                    key={project.id}
                    className="w-[310px] md:w-[320px] h-[420px] flex-shrink-0 snap-start rounded-[2px] overflow-hidden relative group border border-slate-muted/10"
                  >
                    {/* Technical Spec Plate / Badge */}
                    <div className="absolute top-4 left-4 bg-primary/95 text-white border border-slate-muted/30 px-3 py-1 font-mono text-[9px] uppercase tracking-widest rounded-[2px] flex items-center gap-1.5 z-20">
                      <span className="font-semibold">{brandName}</span>
                      <span className="w-px h-2.5 bg-slate-muted/50" />
                      <span>{project.location}</span>
                      <span className="w-px h-2.5 bg-slate-muted/50" />
                      <span className="text-accent font-semibold">{catLabel}</span>
                    </div>

                    {/* Background Image */}
                    <Image
                      src={coverUrl}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-102 transition-transform duration-300 rounded-[2px]"
                      sizes="(max-width: 768px) 310px, 320px"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

                    {/* Text content card details */}
                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white h-2/3 z-10">
                      <h3 className="text-lg md:text-xl font-heading mb-2 leading-none group-hover:text-accent transition-colors duration-150">
                        {project.title.toUpperCase()}
                      </h3>
                      {project.description && (
                        <p className="text-slate-200 text-xs md:text-sm line-clamp-3 mb-4 font-sans font-normal leading-relaxed">
                          {project.description}
                        </p>
                      )}
                      <Link
                        href={`/work/${project.slug}`}
                        className="inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-accent group-hover:underline transition-all duration-150 font-sans"
                      >
                        Read more
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" weight="Filled" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center items-center gap-2 mt-6">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`h-2 rounded-[2px] transition-all duration-150 cursor-pointer ${
                    activeIndex === index ? "w-6 bg-accent" : "w-2 bg-slate-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
