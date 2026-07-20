import { Hero } from "@/components/ui/hero";
import { LogoCloud } from "@/components/ui/logo-cloud";
import { HowItWorks } from "@/components/ui/how-it-works";
import { ProjectsCarousel } from "@/components/ui/projects-carousel";
import { Testimonials } from "@/components/ui/testimonials";
import { ConsultationForm } from "@/components/ui/consultation-form";
import BusinessMap from "@/components/ui/business-map";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ShieldCheck, Flash, Activity } from "reicon-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Integrated Tailspark Hero (entry animation inside) */}
      <Hero />

      {/* Integrated Tailspark Logo Cloud */}
      <ScrollReveal direction="none" duration={0.8}>
        <LogoCloud />
      </ScrollReveal>

      {/* Integrated Tailspark How It Works */}
      <ScrollReveal direction="up" duration={0.7} delay={0.05}>
        <HowItWorks />
      </ScrollReveal>

      {/* Feature Grid */}
      <ScrollReveal direction="up" duration={0.7} delay={0.05}>
        <section className="bg-white border-t border-slate-100 py-16 md:py-24 px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Feature 1 */}
              <div className="flex flex-col items-start text-left gap-4">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
                  <Flash className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Rapid Construction</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-sans">
                  Prefabricated structural steel components engineered for quick assembly and minimal station downtime.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-start text-left gap-4">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Wind & Seismic Rated</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-sans">
                  Each structure is fully calculated and stamp-certified to exceed regional wind load and seismic codes.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-start text-left gap-4">
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-amber-600">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Integrated Utilities</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-sans">
                  Pre-routed column guides for electric fuel dispensers, high-output LED fixtures, and storm drainage.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Projects Carousel Showcase */}
      <ScrollReveal direction="up" duration={0.7} delay={0.05}>
        <ProjectsCarousel />
      </ScrollReveal>

      {/* Testimonials Showcase */}
      <ScrollReveal direction="up" duration={0.7} delay={0.05}>
        <Testimonials />
      </ScrollReveal>

      {/* B2B Request Quote Form */}
      <ScrollReveal direction="up" duration={0.7} delay={0.05}>
        <ConsultationForm />
      </ScrollReveal>

      {/* Business Location Map (mapcn) */}
      <ScrollReveal direction="up" duration={0.7} delay={0.05}>
        <BusinessMap />
      </ScrollReveal>
    </div>
  );
}
