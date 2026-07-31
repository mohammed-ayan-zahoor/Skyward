import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "reicon-react";
import { ProjectDetailClient } from "./project-detail-client";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API}/api/installations/${id}`, { cache: "no-store" });
    if (res.ok) {
      const project: Installation = await res.json();
      return {
        title: `${project.title} — Skyward Canopies`,
        description: project.description || "Structural canopy installation by Skyward.",
      };
    }
  } catch {}
  return { title: "Installation Detail — Skyward Canopies" };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  let project: Installation | null = null;
  let relatedProjects: Installation[] = [];
  let errorMsg = "";

  try {
    const res = await fetch(`${API}/api/installations/${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      project = await res.json();

      // Fetch related installations for the bottom portfolio showcase
      const allRes = await fetch(`${API}/api/installations`, { cache: "no-store" });
      if (allRes.ok) {
        const allInstallations: Installation[] = await allRes.json();
        relatedProjects = allInstallations
          .filter((item) => item.id !== project?.id && item.slug !== project?.slug)
          .slice(0, 3);
      }
    } else {
      errorMsg = "Project record not found in registry.";
    }
  } catch {
    errorMsg = "Unable to connect to the registry database.";
  }

  if (!project) {
    return (
      <div className="flex-1 bg-bg-warm py-24 flex items-center justify-center font-sans">
        <div className="text-center max-w-md px-6">
          <h1 className="text-4xl font-extrabold font-heading text-slate-900 uppercase tracking-tight mb-4">
            Record Not Found
          </h1>
          <p className="text-slate-650 text-sm font-sans mb-8">
            {errorMsg || "The structural installation record you are trying to view does not exist or has been archived."}
          </p>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-mono text-xs uppercase tracking-widest rounded-[4px] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" weight="Filled" />
            Back to Registry
          </Link>
        </div>
      </div>
    );
  }

  return <ProjectDetailClient project={project} relatedProjects={relatedProjects} />;
}
