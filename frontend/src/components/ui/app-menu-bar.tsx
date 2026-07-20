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
  Info,
  Mail,
  FileText,
  MapPin,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export default function AppMenuBar() {
  return (
    <Menubar className="bg-white border border-slate-200 shadow-sm rounded-full px-3 py-1.5 text-slate-900 font-sans">
      {/* Works Menu */}
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors duration-150 rounded-full">
          <Folder className="w-4 h-4 text-blue-600" />
          Installations
        </MenubarTrigger>
        <MenubarContent className="w-56 rounded-[2px]">
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/work" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              All Installations
            </Link>
          </MenubarItem>
          
          <MenubarSeparator />
          
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/work?type=cantilever" className="flex items-center gap-2">
              <span className="w-4 text-center font-mono text-xs font-semibold text-slate-400">C</span>
              Cantilever Canopies
            </Link>
          </MenubarItem>
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/work?type=flat-roof" className="flex items-center gap-2">
              <span className="w-4 text-center font-mono text-xs font-semibold text-slate-400">F</span>
              Flat-Roof Canopies
            </Link>
          </MenubarItem>
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/work?type=curved" className="flex items-center gap-2">
              <span className="w-4 text-center font-mono text-xs font-semibold text-slate-400">R</span>
              Curved Fascia Canopies
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Company Menu */}
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors duration-150 rounded-full">
          <Info className="w-4 h-4 text-blue-600" />
          Company
        </MenubarTrigger>
        <MenubarContent className="w-52 rounded-[2px]">
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/about" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              About Skyward
            </Link>
          </MenubarItem>
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/about#capabilities" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Our Capabilities
            </Link>
          </MenubarItem>
          
          <MenubarSeparator />
          
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/admin" className="flex items-center gap-2 text-slate-500 hover:text-slate-900">
              <ShieldAlert className="w-4 h-4" />
              Admin Portal
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Contact Menu */}
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors duration-150 rounded-full">
          <Mail className="w-4 h-4 text-blue-600" />
          Contact
        </MenubarTrigger>
        <MenubarContent className="w-52 rounded-[2px]">
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/#contact" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Request a Quote
            </Link>
          </MenubarItem>
          <MenubarItem asChild className="rounded-[4px] cursor-pointer">
            <Link href="/#location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Office Location
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
