"use client";

import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map";
import { Location, Phone, Envelope, Clock } from "reicon-react";

interface BusinessMapProps {
  /** Longitude for the map center and marker (defaults to Whitefield, Bengaluru: 77.7500) */
  longitude?: number;
  /** Latitude for the map center and marker (defaults to Whitefield, Bengaluru: 12.9698) */
  latitude?: number;
  /** Main title for the location popup (defaults to Skyward Canopies H.Q.) */
  title?: string;
  /** Business address text (defaults to Whitefield Main Road, Bengaluru, Karnataka 560066) */
  addressLine1?: string;
  addressLine2?: string;
  /** Contact phone number */
  phone?: string;
  /** Contact email address */
  email?: string;
  /** Operating hours */
  hoursLine1?: string;
  hoursLine2?: string;
}

export default function BusinessMap({
  longitude = 78.26218,
  latitude = 12.91685,
  title = "Skyward",
  addressLine1 = "#27, Krishnageri Lane, Marikuppam Post,",
  addressLine2 = "K.G.F., Kolar, Karnataka - 563 119.",
  phone = "+91 99163 39916 / +91 78920 18176",
  email = "skywardkgf@gmail.com",
  hoursLine1 = "Monday – Friday: 9:00 AM – 6:00 PM",
  hoursLine2 = "Saturday: By Appointment Only",
}: BusinessMapProps) {
  return (
    <section id="location" className="bg-bg-warm border-t border-slate-muted/10 py-16 md:py-24">
      {/* Heading - Centered */}
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10 text-center mb-12">
        <span className="text-xs font-bold text-accent uppercase tracking-widest mb-3 block">Our Location</span>
        <h2 className="text-3xl md:text-5xl font-heading tracking-tight text-slate-900 mb-4 leading-none">
          VISIT OUR DESIGN & ENGINEERING OFFICE
        </h2>
        <p className="text-slate-muted max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-sans">
          Have a custom structural canopy project? Drop by our headquarters to consult with our lead structural engineers and view material samples.
        </p>
      </div>

      {/* Map - Full width of container with side margins (padding) */}
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="h-[450px] w-full rounded-[2px] overflow-hidden border border-slate-muted/20 shadow-none relative bg-slate-50">
          <Map
            className="h-full w-full"
            center={[longitude, latitude]}
            zoom={13}
          >
            <MapControls showCompass showZoom />
            <MapMarker longitude={longitude} latitude={latitude}>
              <MarkerContent>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-md border-2 border-white cursor-pointer hover:scale-110 transition-transform duration-150">
                  <Location className="h-5 w-5" />
                </div>
              </MarkerContent>
              <MarkerPopup>
                <div className="p-3 bg-white text-slate-950 rounded-[2px] shadow-sm max-w-[260px]">
                  <h4 className="font-heading text-sm text-primary uppercase tracking-wide">{title}</h4>
                  <p className="text-xs text-slate-muted mt-1 leading-relaxed font-sans">
                    {addressLine1} {addressLine2}
                  </p>
                </div>
              </MarkerPopup>
            </MapMarker>
          </Map>
        </div>
      </div>

      {/* Contact Details Grid - Below the Map */}
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 border-t border-slate-muted/10 pt-12">
        {/* Address */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-[4px] bg-primary/5 border border-primary/10 text-primary">
            <Location className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading text-primary uppercase text-sm tracking-wider">Business Address</h4>
            <p className="text-slate-muted text-sm mt-1 leading-relaxed font-sans">
              {addressLine1}
              {addressLine2 && <><br />{addressLine2}</>}
            </p>
          </div>
        </div>

        {/* Hours */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-[4px] bg-primary/5 border border-primary/10 text-primary">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading text-primary uppercase text-sm tracking-wider">Operating Hours</h4>
            <p className="text-slate-muted text-sm mt-1 leading-relaxed font-sans">
              {hoursLine1}
              {hoursLine2 && <><br />{hoursLine2}</>}
            </p>
          </div>
        </div>

        {/* Contact info */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-[4px] bg-primary/5 border border-primary/10 text-primary">
            <Envelope className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading text-primary uppercase text-sm tracking-wider">Get in Touch</h4>
            <p className="text-slate-muted text-sm mt-1 leading-relaxed font-sans">
              Email: <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a><br />
              Phone: <a href="tel:+919916339916" className="text-blue-600 hover:underline">+91 99163 39916</a> / <a href="tel:+917892018176" className="text-blue-600 hover:underline">+91 78920 18176</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
