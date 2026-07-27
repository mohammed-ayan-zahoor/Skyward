"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Installation {
  id: string;
  title: string;
  slug: string;
  location: string;
  canopyType: string;
  yearCompleted: number;
  description: string;
  isFeatured: boolean;
  status: string;
  brand?: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: string;
  submittedAt: string;
}

type Tab = "works" | "leads";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  peb: "PEB",
  warehouse: "WAREHOUSE",
  other: "OTHER STRUCTURAL",
};

const BRANDS = ["INDIAN OIL", "BHARAT PETROLEUM", "HINDUSTAN PETROLEUM", "NAYARA", "RELIANCE"];

function statusBadge(status: string) {
  if (status === "published") return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-[2px] text-[10px] font-mono uppercase tracking-wider hover:bg-emerald-50">● Live</Badge>;
  return <Badge variant="outline" className="rounded-[2px] text-[10px] font-mono uppercase tracking-wider text-slate-500">○ Draft</Badge>;
}

function leadStatusBadge(status: string) {
  const map: Record<string, string> = {
    new: "bg-amber-50 text-amber-700 border border-amber-200",
    contacted: "bg-blue-50 text-blue-700 border border-blue-200",
    closed: "bg-slate-50 text-slate-500 border border-slate-200",
  };
  return (
    <Badge className={`${map[status] || map.new} rounded-[2px] text-[10px] font-mono uppercase tracking-wider hover:opacity-80`}>
      {status}
    </Badge>
  );
}

// ─── Empty Work form ──────────────────────────────────────────────────────────
const emptyWork = (): Partial<Installation> => ({
  title: "", slug: "", location: "", canopyType: "peb",
  yearCompleted: new Date().getFullYear(), description: "",
  isFeatured: false, status: "draft", brand: "INDIAN OIL",
});

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("works");
  const [works, setWorks] = useState<Installation[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Installation>>(emptyWork());
  const [isNew, setIsNew] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // ── Auth check ────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) { router.replace("/admin"); return null; }
        return r.json();
      })
      .then((d) => d && setUserEmail(d.user?.email || "admin"));
  }, [router]);

  // ── Fetch data ────────────────────────────────────────────────────────────
  const fetchWorks = useCallback(async () => {
    const r = await fetch(`${API}/api/admin/installations`, { credentials: "include" });
    if (r.ok) setWorks(await r.json());
  }, []);

  const fetchLeads = useCallback(async () => {
    const r = await fetch(`${API}/api/admin/leads`, { credentials: "include" });
    if (r.ok) setLeads(await r.json());
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchWorks(), fetchLeads()]).finally(() => setLoading(false));
  }, [fetchWorks, fetchLeads]);

  // ── Works CRUD ────────────────────────────────────────────────────────────
  function openNew() {
    setEditing(emptyWork());
    setIsNew(true);
    setSheetOpen(true);
  }

  function openEdit(w: Installation) {
    setEditing({ ...w });
    setIsNew(false);
    setSheetOpen(true);
  }

  async function saveWork() {
    setSaving(true);
    try {
      const url = isNew
        ? `${API}/api/admin/installations`
        : `${API}/api/admin/installations/${editing.id}`;
      const method = isNew ? "POST" : "PUT";
      const r = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (r.ok) {
        setSheetOpen(false);
        await fetchWorks();
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteWork(id: string) {
    if (!confirm("Delete this installation permanently?")) return;
    await fetch(`${API}/api/admin/installations/${id}`, {
      method: "DELETE", credentials: "include",
    });
    await fetchWorks();
  }

  async function toggleFeatured(w: Installation) {
    await fetch(`${API}/api/admin/installations/${w.id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !w.isFeatured }),
    });
    await fetchWorks();
  }

  // ── Leads ─────────────────────────────────────────────────────────────────
  async function updateLeadStatus(id: string, status: string) {
    await fetch(`${API}/api/admin/leads/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchLeads();
  }

  async function logout() {
    await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" });
    router.replace("/admin");
  }

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">

      {/* ── Top Control Bar ── */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#1C2B36] text-white shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.2em] text-[#E8891C] font-bold uppercase">
            SKYWARD
          </span>
          <span className="text-white/20 text-xs">·</span>
          <span className="font-mono text-[11px] tracking-[0.15em] text-white/60 uppercase">
            JOB REGISTER
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-white/40 tracking-wider hidden sm:block">
            {userEmail}
          </span>
          <Separator orientation="vertical" className="h-4 bg-white/20" />
          <Link
            href="/"
            target="_blank"
            className="font-mono text-[10px] text-white/50 hover:text-white/80 tracking-wider transition-colors uppercase"
          >
            → View Site
          </Link>
          <button
            onClick={logout}
            className="font-mono text-[10px] text-white/40 hover:text-red-400 tracking-wider transition-colors uppercase"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ── Tab Navigation ── */}
      <div className="flex items-center gap-0 px-6 border-b border-slate-200 bg-white shrink-0">
        {(["works", "leads"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-[#E8891C] text-[#1C2B36] font-bold"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {t === "works" ? "Works Registry" : "Inquiry Docket"}
          </button>
        ))}
      </div>

      {/* ── Content Area ── */}
      <main className="flex-1 overflow-y-auto px-6 py-6">

        {loading ? (
          <div className="py-20 text-center font-mono text-sm text-slate-400 uppercase tracking-widest">
            Loading register...
          </div>
        ) : tab === "works" ? (

          /* ── WORKS REGISTRY ── */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Works Registry
                <span className="ml-3 font-mono text-[11px] text-slate-400 font-normal normal-case tracking-widest">
                  {works.length} jobs
                </span>
              </h1>
              <Button
                onClick={openNew}
                variant="outline"
                className="rounded-[4px] font-mono text-[11px] uppercase tracking-widest border-slate-300 hover:bg-slate-50 hover:border-[#E8891C] hover:text-[#E8891C] transition-colors"
              >
                + Open New Job
              </Button>
            </div>

            <div className="border border-slate-200 rounded-[2px] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-400 w-32">Job ID</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Project</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-400 w-28">Category</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-400 w-36">Brand</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-400 w-20">Year</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-400 w-24">Status</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-400 w-10 text-right">⭐</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {works.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 font-mono text-sm text-slate-400 uppercase tracking-widest">
                        No jobs in register. Open a new job to get started.
                      </TableCell>
                    </TableRow>
                  ) : works.map((w, i) => (
                    <TableRow
                      key={w.id}
                      className="group border-l-2 hover:bg-slate-50/50 transition-colors"
                      style={{
                        borderLeftColor: w.canopyType === "peb"
                          ? "#E8891C"
                          : w.canopyType === "warehouse"
                            ? "#4A5A63"
                            : "#94a3b8",
                      }}
                    >
                      <TableCell className="font-mono text-[11px] text-slate-500 py-3">
                        SKY-{w.canopyType?.toUpperCase().slice(0, 3)}-{String(i + 1).padStart(3, "0")}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="text-sm font-medium text-slate-900">{w.title}</div>
                        <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">{w.location}</div>
                      </TableCell>
                      <TableCell className="py-3 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                        {CATEGORY_LABELS[w.canopyType] || w.canopyType}
                      </TableCell>
                      <TableCell className="py-3 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                        {w.brand || "—"}
                      </TableCell>
                      <TableCell className="py-3 font-mono text-[11px] text-slate-500">
                        {w.yearCompleted}
                      </TableCell>
                      <TableCell className="py-3">{statusBadge(w.status)}</TableCell>
                      <TableCell className="py-3 text-right">
                        <button
                          onClick={() => toggleFeatured(w)}
                          className={`text-lg transition-opacity ${w.isFeatured ? "opacity-100" : "opacity-20 hover:opacity-60"}`}
                          title={w.isFeatured ? "Featured" : "Set as featured"}
                        >
                          ⭐
                        </button>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-[4px] hover:bg-slate-100 flex items-center justify-center font-mono font-bold text-sm cursor-pointer select-none">
                            ···
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-[4px] font-mono text-[11px] w-36">
                            <DropdownMenuItem onClick={() => openEdit(w)} className="uppercase tracking-wider cursor-pointer">
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => deleteWork(w.id)}
                              className="uppercase tracking-wider text-red-600 focus:text-red-600 cursor-pointer"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

        ) : (

          /* ── INQUIRY DOCKET ── */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Inquiry Docket
                <span className="ml-3 font-mono text-[11px] text-slate-400 font-normal normal-case tracking-widest">
                  {leads.filter((l) => l.status === "new").length} new
                </span>
              </h1>
            </div>

            <div className="border border-slate-200 rounded-[2px] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Received</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Contact</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Message</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-400 w-32">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 font-mono text-sm text-slate-400 uppercase tracking-widest">
                        No inquiries received yet.
                      </TableCell>
                    </TableRow>
                  ) : leads.map((l) => (
                    <TableRow key={l.id} className="group hover:bg-slate-50/50 transition-colors">
                      <TableCell className="py-4 align-top">
                        <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider whitespace-nowrap">
                          {new Date(l.submittedAt).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                          }).toUpperCase()}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                          {new Date(l.submittedAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 align-top">
                        <div className="text-sm font-medium text-slate-900">{l.name}</div>
                        <div className="font-mono text-[10px] text-slate-400 mt-0.5">{l.email}</div>
                        <div className="font-mono text-[10px] text-slate-400">{l.phone}</div>
                      </TableCell>
                      <TableCell className="py-4 align-top max-w-sm">
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{l.message}</p>
                      </TableCell>
                      <TableCell className="py-4 align-top">
                        <Select
                          value={l.status}
                          onValueChange={(v) => { if (v) updateLeadStatus(l.id, v); }}
                        >
                          <SelectTrigger className="h-7 rounded-[4px] font-mono text-[10px] uppercase tracking-wider w-32 border-slate-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-[4px] font-mono text-[10px]">
                            <SelectItem value="new" className="uppercase tracking-wider">New</SelectItem>
                            <SelectItem value="contacted" className="uppercase tracking-wider">Contacted</SelectItem>
                            <SelectItem value="closed" className="uppercase tracking-wider">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="mt-1.5">{leadStatusBadge(l.status)}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </main>

      {/* ── Work Editor Sheet ── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
              {isNew ? "Open New Job" : "Edit Job Record"}
            </SheetTitle>
            <SheetDescription className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
              {isNew ? "Create a new fabrication or installation record." : `Editing: ${editing.title}`}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Title</Label>
              <Input
                value={editing.title || ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="rounded-[4px] font-sans text-sm"
                placeholder="e.g. IOCL Whitefield Bengaluru"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Slug</Label>
              <Input
                value={editing.slug || ""}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className="rounded-[4px] font-mono text-sm"
                placeholder="iocl-whitefield-bengaluru"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Location</Label>
                <Input
                  value={editing.location || ""}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  className="rounded-[4px] font-sans text-sm"
                  placeholder="Bengaluru, KA"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Year</Label>
                <Input
                  type="number"
                  value={editing.yearCompleted || ""}
                  onChange={(e) => setEditing({ ...editing, yearCompleted: Number(e.target.value) })}
                  className="rounded-[4px] font-mono text-sm"
                  placeholder="2024"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Category</Label>
                <Select
                  value={editing.canopyType || "peb"}
                  onValueChange={(v) => setEditing({ ...editing, canopyType: v || undefined })}
                >
                  <SelectTrigger className="rounded-[4px] font-mono text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-[4px] font-mono text-sm">
                    <SelectItem value="peb">PEB</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="other">Other Structural Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Brand</Label>
                <Select
                  value={editing.brand || "INDIAN OIL"}
                  onValueChange={(v) => setEditing({ ...editing, brand: v || undefined })}
                >
                  <SelectTrigger className="rounded-[4px] font-mono text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-[4px] font-mono text-sm">
                    {BRANDS.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Description</Label>
              <Textarea
                value={editing.description || ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="rounded-[4px] font-sans text-sm min-h-24"
                placeholder="Short project description — span, materials, notable details..."
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Status</Label>
              <Select
                value={editing.status || "draft"}
                onValueChange={(v) => setEditing({ ...editing, status: v || undefined })}
              >
                <SelectTrigger className="rounded-[4px] font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-[4px] font-mono text-sm">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <Checkbox
                id="featured"
                checked={editing.isFeatured || false}
                onCheckedChange={(v) => setEditing({ ...editing, isFeatured: Boolean(v) })}
                className="rounded-[2px]"
              />
              <Label htmlFor="featured" className="font-mono text-[10px] uppercase tracking-widest text-slate-500 cursor-pointer">
                Feature on homepage
              </Label>
            </div>

            <Separator />

            <div className="flex gap-3 pt-1">
              <Button
                onClick={saveWork}
                disabled={saving}
                className="flex-1 rounded-[4px] font-mono text-[11px] uppercase tracking-widest bg-[#1C2B36] hover:bg-[#1C2B36]/90 text-white"
              >
                {saving ? "Saving..." : isNew ? "Create Record" : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSheetOpen(false)}
                className="rounded-[4px] font-mono text-[11px] uppercase tracking-widest border-slate-200"
              >
                Discard
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
