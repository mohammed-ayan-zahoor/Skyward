"use client";

import { useState } from "react";

export function ConsultationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    projectLocation: "",
    email: "",
    phone: "",
    requirements: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In the future, this will connect to the Prisma /api/leads route
    console.log("Submitting B2B Lead Consultation:", formData);
    alert("Thank you! Your project consultation request has been submitted.");
    setFormData({
      firstName: "",
      lastName: "",
      companyName: "",
      projectLocation: "",
      email: "",
      phone: "",
      requirements: "",
    });
  };

  return (
    <section id="contact" className="bg-white border-t border-slate-muted/10 py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10 flex items-center justify-center">
        {/* Container Card */}
        <div className="px-6 py-10 md:px-16 md:py-12 rounded-[2px] w-full lg:w-[85%] bg-bg-warm border border-slate-muted/15 max-w-lg lg:max-w-[1024px]">
          
          {/* Header */}
          <div className="mb-8">
            <span className="text-xs font-bold text-accent uppercase tracking-widest mb-3 block">Consultation</span>
            <h3 className="text-2xl md:text-4xl font-heading tracking-tight text-slate-900 leading-none mb-4">
              REQUEST A PROJECT QUOTE
            </h3>
            <p className="text-slate-600 font-sans text-sm md:text-base max-w-[550px] leading-relaxed">
              Provide your site coordinates and canopy specifications. Our structural engineering team will review your parameters and get back to you with structural estimates.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold text-slate-800 text-sm font-sans">
                  First Name
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-2 block w-full h-12 rounded-[4px] border border-slate-muted/30 focus:border-accent bg-white text-slate-800 sm:text-sm md:text-base pl-3 shadow-none outline-none font-sans transition-all duration-150" 
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-800 text-sm font-sans">
                  Last Name
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-2 block w-full h-12 rounded-[4px] border border-slate-muted/30 focus:border-accent bg-white text-slate-800 sm:text-sm md:text-base pl-3 shadow-none outline-none font-sans transition-all duration-150" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block font-semibold text-slate-800 text-sm font-sans">
                  Company Name
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="mt-2 block w-full h-12 rounded-[4px] border border-slate-muted/30 focus:border-accent bg-white text-slate-800 sm:text-sm md:text-base pl-3 shadow-none outline-none font-sans transition-all duration-150" 
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-800 text-sm font-sans">
                  Project Site Location
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Bengaluru, Karnataka"
                  value={formData.projectLocation}
                  onChange={(e) => setFormData({ ...formData, projectLocation: e.target.value })}
                  className="mt-2 block w-full h-12 rounded-[4px] border border-slate-muted/30 focus:border-accent bg-white text-slate-800 sm:text-sm md:text-base pl-3 shadow-none outline-none font-sans transition-all duration-150" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block font-semibold text-slate-800 text-sm font-sans">
                  Business Email
                </label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2 block w-full h-12 rounded-[4px] border border-slate-muted/30 focus:border-accent bg-white text-slate-800 sm:text-sm md:text-base pl-3 shadow-none outline-none font-sans transition-all duration-150" 
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-800 text-sm font-sans">
                  Phone Number
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2 block w-full h-12 rounded-[4px] border border-slate-muted/30 focus:border-accent bg-white text-slate-800 sm:text-sm md:text-base pl-3 shadow-none outline-none font-sans transition-all duration-150" 
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block font-semibold text-slate-800 text-sm font-sans">
                Project Requirements & Canopy Type
              </label>
              <textarea 
                required
                rows={4}
                placeholder="Describe your canopy size, location wind load requirements, and desired style (e.g. flat-roof, cantilever)..."
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="mt-2 block w-full rounded-[4px] border border-slate-muted/30 focus:border-accent bg-white text-slate-800 sm:text-sm md:text-base p-3 shadow-none outline-none font-sans transition-all duration-150 resize-y min-h-[100px]" 
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-4 border-t border-slate-muted/10">
              <button 
                type="button" 
                onClick={() => setFormData({
                  firstName: "",
                  lastName: "",
                  companyName: "",
                  projectLocation: "",
                  email: "",
                  phone: "",
                  requirements: "",
                })}
                className="w-full sm:w-auto sm:px-12 py-3 border border-slate-muted/30 rounded-[4px] font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all duration-150 font-sans cursor-pointer shadow-2xs"
              >
                Clear
              </button>
              <button 
                type="submit" 
                className="w-full sm:w-auto sm:px-16 py-3 border border-transparent rounded-[4px] font-semibold text-white bg-accent hover:bg-amber-600 transition-all duration-150 font-sans cursor-pointer shadow-sm"
              >
                Submit Request
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </section>
  );
}
