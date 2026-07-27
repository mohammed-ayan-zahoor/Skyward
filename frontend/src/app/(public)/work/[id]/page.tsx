import Link from "next/link";
import { ArrowLeft, Location, Setting, Calendar, Star } from "reicon-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface Photo {
  id: string;
  imageUrl: string;
  caption?: string;
  isCover: boolean;
  sortOrder: number;
}

interface Installation {
  id: string;
  title: string;
  slug: string;
  location: string;
  canopyType: string;
  yearCompleted: number;
  description: string;
  isFeatured: boolean;
  brand?: string;
  photos: Photo[];
  coverImageId?: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const CATEGORY_LABELS: Record<string, string> = {
  peb: "PEB Structure",
  warehouse: "Warehouse",
  other: "Other Structural Work",
};

// Server Component fetching the project details by slug (id parameter)
export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  let project: Installation | null = null;
  let errorMsg = "";

  try {
    const res = await fetch(`${API}/api/installations/${id}`, {
      cache: "no-store", // SSR loading
    });

    if (res.ok) {
      project = await res.json();
    } else {
      errorMsg = "Project not found in registry.";
    }
  } catch {
    errorMsg = "Unable to connect to the registry database.";
  }

  if (!project) {
    return (
      <div className="flex-1 bg-[#F5F3EE] py-24 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h1 className="text-4xl font-bold font-heading text-slate-900 uppercase tracking-tight mb-4">
            Record Not Found
          </h1>
          <p className="text-slate-600 text-sm font-sans mb-8">
            {errorMsg || "The structural installation record you are trying to view does not exist or has been archived."}
          </p>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-[10px] uppercase tracking-widest rounded-[4px] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" weight="Filled" />
            Back to Registry
          </Link>
        </div>
      </div>
    );
  }

  // Determine active cover photo
  const coverPhoto = project.photos.find((p) => p.isCover) || project.photos[0];
  const coverUrl = coverPhoto ? `${API}${coverPhoto.imageUrl}` : "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&h=800&q=80";

  return (
    <div className="flex-1 bg-[#F5F3EE] py-12 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10 flex flex-col gap-8">
        
        {/* Navigation Breadcrumb */}
        <div className="self-start">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#E8891C] transition-colors font-sans"
          >
            <ArrowLeft className="w-4 h-4" weight="Filled" />
            Back to Project Gallery
          </Link>
        </div>

        {/* Project Main Details Title Header */}
        <div className="max-w-4xl border-b border-slate-300 pb-6">
          <span className="text-[10px] font-bold text-[#E8891C] font-mono uppercase tracking-[0.2em] mb-2 block">
            {project.brand || "SKYWARD STEEL"} // RECORD ID #{project.id.slice(0, 8).toUpperCase()}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading tracking-tight text-slate-900 leading-none uppercase">
            {project.title}
          </h1>
        </div>

        {/* Grid: Photo Viewer & Spec Plate */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Photo Gallery Column (Left - 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Primary Main Image Frame */}
            <div className="relative aspect-video border border-slate-300 bg-slate-200 rounded-[2px] overflow-hidden shadow-sm">
              <img
                src={coverUrl}
                alt={project.title}
                className="w-full h-full object-cover rounded-[2px]"
              />
              {project.isFeatured && (
                <div className="absolute top-4 left-4 bg-slate-900/95 text-[#E8891C] border border-[#E8891C]/35 px-3 py-1 font-mono text-[9px] uppercase tracking-widest rounded-[2px] flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-[#E8891C]" weight="Filled" />
                  <span>Featured Case Study</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery (Rendered only if more than 1 image) */}
            {project.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {project.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`aspect-video border rounded-[2px] overflow-hidden bg-slate-100 cursor-pointer transition-colors ${
                      photo.isCover ? "border-[#E8891C]" : "border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <img
                      src={`${API}${photo.imageUrl}`}
                      alt={photo.caption || project?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specifications Spec Plate & Copy (Right - 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* ── MANDATORY SIGNATURE ELEMENT: B2B SPECIFICATION PLATE ── */}
            <div className="border border-slate-300 bg-[#EFECE6] p-6 relative rounded-[2px] shadow-sm flex flex-col gap-4">
              
              {/* Double border simulation for industrial metal plaque style */}
              <div className="absolute inset-1 border border-slate-300/40 pointer-events-none rounded-[2px]" />

              <div className="flex justify-between items-center border-b border-slate-300 pb-2 z-10">
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                  B2B CANOPY SPECIFICATION PLATE
                </span>
                <span className="font-mono text-[9px] text-[#E8891C] font-semibold">
                  REV // 02
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 font-mono z-10">
                <div className="space-y-1">
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 block">01 / CLIENT BRAND</span>
                  <span className="text-xs font-bold text-slate-900 uppercase">{project.brand || "—"}</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 block">02 / STRUCTURE TYPE</span>
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    {CATEGORY_LABELS[project.canopyType] || project.canopyType || "Structural Canopies"}
                  </span>
                </div>

                <div className="space-y-1 border-t border-slate-200/60 pt-3">
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 block">03 / COMMISSIONED</span>
                  <span className="text-xs font-bold text-slate-900">{project.yearCompleted}</span>
                </div>

                <div className="space-y-1 border-t border-slate-200/60 pt-3">
                  <span className="text-[8px] uppercase tracking-wider text-slate-500 block">04 / DISPATCH SITE</span>
                  <span className="text-xs font-bold text-slate-900 uppercase">{project.location}</span>
                </div>
              </div>

              <div className="border-t border-slate-300 pt-3 flex justify-between items-center text-[9px] font-mono text-slate-450 z-10 font-medium">
                <span>CERTIFICATE // ISO 9001:2015</span>
                <span>GRADE 350 STRUCTURAL STEEL</span>
              </div>
            </div>

            {/* Project description copy */}
            <div className="space-y-3">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                ENGINEERING STATEMENT & SCOPE
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-sans">
                {project.description}
              </p>
            </div>

            {/* Bottom CTA Block */}
            <div className="pt-4 border-t border-slate-300">
              <Link
                href="/#contact"
                className="w-full text-center inline-block py-3 bg-[#1C2B36] hover:bg-[#1C2B36]/90 text-white font-mono text-[10px] uppercase tracking-widest font-bold rounded-[4px] transition-colors shadow-sm"
              >
                REQUEST CONSULTATION FOR SIMILAR PLAN
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
