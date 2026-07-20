import { Quote, Star } from "lucide-react";

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  avatarUrl: string;
  imageUrl: string;
  content: string;
  rating: number;
}

export function Testimonials() {
  const testimonials: TestimonialItem[] = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "HPCL Retailer & Site Owner",
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100&q=80",
      imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=500&h=300&q=80",
      content: "Skyward's double-cantilever canopy design transformed our highway retail outlet layout. The stamped engineering calculations passed state fire and municipal clearances on the first run, and modular assembly cut down-time to just 48 hours.",
      rating: 5,
    },
    {
      id: 2,
      name: "Amara Nwosu",
      role: "Retail Engineering Lead, Shell Division",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80",
      imageUrl: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=500&h=300&q=80",
      content: "Excellent utility integration. Having dedicated internal guides inside steel columns for electrical lines, storm drainage, and fuel dispenser conduits saved our site technicians immense effort. A highly engineered structural product.",
      rating: 5,
    },
    {
      id: 3,
      name: "Siddharth Mehta",
      role: "Director, Independent Fuel Stations",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80",
      imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=500&h=300&q=80",
      content: "Living in a high-velocity coastal storm zone makes structural canopy integrity paramount. Skyward's heavy-duty wind-rated steel trusses have successfully withstood multiple severe weather cycles without a single structural compromise.",
      rating: 5,
    },
  ];

  return (
    <section className="bg-white border-t border-slate-muted/10 py-16 md:py-24">
      {/* Container */}
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        {/* Heading Container */}
        <div className="mb-12 text-center md:mb-16">
          <span className="text-xs font-bold text-accent uppercase tracking-widest mb-3 block">Testimonials</span>
          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-heading tracking-tight text-slate-900 mb-4 leading-none">
            WHAT OUR CLIENTS ARE SAYING
          </h2>
          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-slate-600 font-sans text-sm md:text-base leading-relaxed">
            Read how our stamped structural engineering drawings, rapid steel fabrication, and on-site assembly guides help fuel retailers launch successfully.
          </p>
        </div>

        {/* Grid Contents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div 
              key={item.id}
              className="w-full rounded-[2px] bg-bg-warm border border-slate-muted/15 p-6 flex flex-col justify-between"
            >
              {/* Card Header (Client Profile) */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={item.avatarUrl} 
                    alt={item.name} 
                    className="mr-3 inline-block h-10 w-10 rounded-full object-cover border border-slate-muted/20" 
                  />
                  <div>
                    <h6 className="text-sm font-bold text-slate-900 font-sans">{item.name}</h6>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{item.role}</p>
                  </div>
                </div>
                {/* Clean quote vector representation */}
                <Quote className="w-5 h-5 text-accent/40 flex-none" />
              </div>

              {/* Large Card Image */}
              <img 
                src={item.imageUrl} 
                alt={`${item.name}'s installation`} 
                className="mb-4 inline-block h-48 w-full rounded-[2px] object-cover border border-slate-muted/10" 
              />

              {/* Testimonial Text & Rating */}
              <div className="flex w-full flex-col items-start gap-4 p-0">
                <p className="text-xs text-slate-750 font-sans leading-relaxed">
                  "{item.content}"
                </p>
                <div className="h-px w-full bg-slate-muted/20"></div>
                
                {/* Star Ratings */}
                <div className="flex gap-0.5">
                  {Array.from({ length: item.rating }).map((_, idx) => (
                    <Star 
                      key={idx} 
                      className="w-3.5 h-3.5 fill-accent text-accent flex-none" 
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
