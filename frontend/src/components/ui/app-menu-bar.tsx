"use client";

import Link from "next/link";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Folder,
  Information,
  Envelope,
  FileText,
  Location,
  ShieldAlert,
  ArrowRight,
} from "reicon-react";

export default function AppMenuBar() {
  return (
    <Menubar className="bg-white border border-slate-200 shadow-sm rounded-full px-3 py-1.5 text-slate-900 font-sans">
      {/* Services Menu */}
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors duration-150 rounded-full">
          <Folder className="w-4 h-4 text-blue-600" weight="Filled" />
          Services
        </MenubarTrigger>
        <MenubarContent className="w-64 rounded-[2px]">
          {/* Section: Fabrications & Installations */}
          <div className="px-2 py-1.5 text-xs font-mono font-bold text-slate-450 uppercase tracking-widest">
            Fabrication & Installation
          </div>
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/work" className="flex items-center gap-2">
              <FileText className="w-4 h-4" weight="Filled" />
              All Work
            </Link>
          </MenubarItem>
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/work?category=peb" className="flex items-center gap-2 pl-4">
              <span className="text-[10px] font-bold text-accent font-mono w-4">01</span>
              PEB
            </Link>
          </MenubarItem>
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/work?category=warehouse" className="flex items-center gap-2 pl-4">
              <span className="text-[10px] font-bold text-accent font-mono w-4">02</span>
              Warehouse
            </Link>
          </MenubarItem>
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/work?category=other" className="flex items-center gap-2 pl-4">
              <span className="text-[10px] font-bold text-accent font-mono w-4">03</span>
              Other Structural Work
            </Link>
          </MenubarItem>
          
          <MenubarSeparator />

          {/* Section: Products */}
          <div className="px-2 py-1.5 text-xs font-mono font-bold text-slate-450 uppercase tracking-widest">
            Products
          </div>
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/work?tab=products" className="flex items-center gap-2">
              <Folder className="w-4 h-4" weight="Filled" />
              Materials & Products
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Company Menu */}
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors duration-150 rounded-full">
          <Information className="w-4 h-4 text-blue-600" weight="Filled" />
          Company
        </MenubarTrigger>
        <MenubarContent className="w-52 rounded-[2px]">
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/about" className="flex items-center gap-2">
              <Information className="w-4 h-4" weight="Filled" />
              About Skyward
            </Link>
          </MenubarItem>
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/about#capabilities" className="flex items-center gap-2">
              <FileText className="w-4 h-4" weight="Filled" />
              Our Capabilities
            </Link>
          </MenubarItem>
          
          <MenubarSeparator />
          
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/admin" className="flex items-center gap-2 text-slate-500 hover:text-slate-900">
              <ShieldAlert className="w-4 h-4" weight="Filled" />
              Admin Portal
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Contact Menu */}
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors duration-150 rounded-full">
          <Envelope className="w-4 h-4 text-blue-600" weight="Filled" />
          Contact
        </MenubarTrigger>
        <MenubarContent className="w-52 rounded-[2px]">
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/#contact" className="flex items-center gap-2">
              <Envelope className="w-4 h-4" weight="Filled" />
              Request a Quote
            </Link>
          </MenubarItem>
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/#location" className="flex items-center gap-2">
              <Location className="w-4 h-4" weight="Filled" />
              Office Location
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
