"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Trash } from "reicon-react";

const API = process.env.NEXT_PUBLIC_API_URL || "";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Photo {
  id: string;
  imageUrl: string;
  caption?: string;
  isCover: boolean;
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
  status: string;
  brand?: string;
  photos?: Photo[];
  coverImageId?: string | null;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  specifications?: string;
  status: string;
  photos?: Photo[];
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

type Tab = "works" | "products" | "leads";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  peb: "PEB",
  warehouse: "WAREHOUSE",
  other: "OTHER STRUCTURAL",
};

const BRANDS = ["INDIAN OIL", "BHARAT PETROLEUM", "HINDUSTAN PETROLEUM", "NAYARA", "RELIANCE"];

const normalizeCategory = (cat: string | undefined): string => {
  if (!cat) return "peb";
  const normalized = cat.toLowerCase();
  if (normalized.includes("peb")) return "peb";
  if (normalized.includes("warehouse") || normalized.includes("wherehouse")) return "warehouse";
  if (normalized.includes("flat-roof") || normalized.includes("flat")) return "peb";
  if (normalized.includes("cantilever") || normalized.includes("curved") || normalized.includes("other")) return "other";
  return "peb";
};

function statusBadge(status: string) {
  if (status === "published") {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-[2px] text-[10px] font-mono uppercase tracking-wider hover:bg-emerald-50 py-0.5 px-2">
        ● Live
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="rounded-[2px] text-[10px] font-mono uppercase tracking-wider text-slate-500 py-0.5 px-2 bg-slate-50">
      ○ Draft
    </Badge>
  );
}

function leadStatusBadge(status: string) {
  if (status === "new") {
    return (
      <Badge className="bg-amber-50 text-amber-700 border border-amber-200 rounded-[2px] text-[10px] font-mono uppercase tracking-wider hover:bg-amber-50 py-0.5 px-2">
        ● New
      </Badge>
    );
  }
  if (status === "contacted") {
    return (
      <Badge className="bg-blue-50 text-blue-700 border border-blue-200 rounded-[2px] text-[10px] font-mono uppercase tracking-wider hover:bg-blue-50 py-0.5 px-2">
        ◐ Contacted
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="rounded-[2px] text-[10px] font-mono uppercase tracking-wider text-slate-400 py-0.5 px-2 bg-slate-50">
      ✓ Closed
    </Badge>
  );
}

const emptyWork = (): Partial<Installation> => ({
  title: "",
  slug: "",
  location: "",
  canopyType: "peb",
  yearCompleted: new Date().getFullYear(),
  description: "",
  isFeatured: false,
  status: "published",
  brand: "INDIAN OIL",
  photos: [],
});

const emptyProduct = (): Partial<Product> => ({
  title: "",
  slug: "",
  category: "peb",
  description: "",
  specifications: "",
  status: "published",
  photos: [],
});

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("works");
  const [works, setWorks] = useState<Installation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  // Works States
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Installation>>(emptyWork());
  const [isNew, setIsNew] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingWorkId, setDeletingWorkId] = useState<string | null>(null);
  const [deletingWorkTitle, setDeletingWorkTitle] = useState<string | null>(null);

  // Products States
  const [productSheetOpen, setProductSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>(emptyProduct());
  const [isNewProduct, setIsNewProduct] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingProductPhoto, setUploadingProductPhoto] = useState(false);
  const [deleteProductConfirmOpen, setDeleteProductConfirmOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deletingProductTitle, setDeletingProductTitle] = useState<string | null>(null);

  // Lead Delete Confirmation States
  const [deleteLeadConfirmOpen, setDeleteLeadConfirmOpen] = useState(false);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [deletingLeadName, setDeletingLeadName] = useState<string | null>(null);

  // ── Auth check ────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) {
          router.replace("/admin");
          return null;
        }
        return r.json();
      })
      .then((d) => d && setUserEmail(d.user?.email || "admin"));
  }, [router]);

  // ── Fetch data ────────────────────────────────────────────────────────────
  const fetchWorks = useCallback(async () => {
    const r = await fetch(`${API}/api/admin/installations`, { credentials: "include" });
    if (r.ok) setWorks(await r.json());
  }, []);

  const fetchProducts = useCallback(async () => {
    const r = await fetch(`${API}/api/admin/products`, { credentials: "include" });
    if (r.ok) setProducts(await r.json());
  }, []);

  const fetchLeads = useCallback(async () => {
    const r = await fetch(`${API}/api/admin/leads`, { credentials: "include" });
    if (r.ok) setLeads(await r.json());
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchWorks(), fetchProducts(), fetchLeads()]).finally(() => setLoading(false));
  }, [fetchWorks, fetchProducts, fetchLeads]);

  // ── Works CRUD ────────────────────────────────────────────────────────────
  function openNew() {
    setEditing(emptyWork());
    setIsNew(true);
    setSheetOpen(true);
  }

  function openEdit(w: Installation) {
    setEditing({
      ...w,
      canopyType: normalizeCategory(w.canopyType),
    });
    setIsNew(false);
    setSheetOpen(true);
  }

  async function saveWork(keepOpen: boolean = false) {
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
        const saved = await r.json();
        await fetchWorks();
        if (isNew || keepOpen) {
          setEditing({
            ...saved,
            canopyType: normalizeCategory(saved.canopyType),
          });
          setIsNew(false);
        } else {
          setSheetOpen(false);
        }
      }
    } finally {
      setSaving(false);
    }
  }

  function triggerDelete(w: Installation) {
    setDeletingWorkId(w.id);
    setDeletingWorkTitle(w.title);
    setDeleteConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!deletingWorkId) return;
    await fetch(`${API}/api/admin/installations/${deletingWorkId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setDeleteConfirmOpen(false);
    setDeletingWorkId(null);
    setDeletingWorkTitle(null);
    await fetchWorks();
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing.id) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch(`${API}/api/admin/installations/${editing.id}/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        const newPhoto = await res.json();
        const updatedPhotos = editing.photos ? [...editing.photos, newPhoto] : [newPhoto];
        setEditing({
          ...editing,
          photos: updatedPhotos,
          coverImageId: editing.coverImageId || newPhoto.id,
        });
        await fetchWorks();
      }
    } finally {
      setUploading(false);
    }
  }

  async function setCoverPhoto(photoId: string) {
    if (!editing.id) return;
    try {
      const updatedPhotos = (editing.photos || []).map((p) => ({
        ...p,
        isCover: p.id === photoId,
      }));

      setEditing({
        ...editing,
        coverImageId: photoId,
        photos: updatedPhotos,
      });

      await fetch(`${API}/api/admin/installations/${editing.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverImageId: photoId }),
      });
      await fetchWorks();
    } catch (err) {
      console.error("Failed to update cover photo", err);
    }
  }

  async function deletePhoto(photoId: string) {
    try {
      const res = await fetch(`${API}/api/admin/photos/${photoId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        const updatedPhotos = (editing.photos || []).filter((p) => p.id !== photoId);
        setEditing({
          ...editing,
          photos: updatedPhotos,
          coverImageId: editing.coverImageId === photoId ? updatedPhotos[0]?.id || null : editing.coverImageId,
        });
        await fetchWorks();
      }
    } catch (err) {
      console.error("Failed to delete photo", err);
    }
  }

  // ── Products CRUD ─────────────────────────────────────────────────────────
  function openNewProduct() {
    setEditingProduct(emptyProduct());
    setIsNewProduct(true);
    setProductSheetOpen(true);
  }

  function openEditProduct(p: Product) {
    setEditingProduct({
      ...p,
      category: normalizeCategory(p.category),
    });
    setIsNewProduct(false);
    setProductSheetOpen(true);
  }

  async function saveProduct(keepOpen: boolean = false) {
    setSavingProduct(true);
    try {
      const url = isNewProduct
        ? `${API}/api/admin/products`
        : `${API}/api/admin/products/${editingProduct.id}`;
      const method = isNewProduct ? "POST" : "PUT";
      const r = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      if (r.ok) {
        const saved = await r.json();
        await fetchProducts();
        if (isNewProduct || keepOpen) {
          setEditingProduct({
            ...saved,
            category: normalizeCategory(saved.category),
          });
          setIsNewProduct(false);
        } else {
          setProductSheetOpen(false);
        }
      }
    } finally {
      setSavingProduct(false);
    }
  }

  function triggerDeleteProduct(p: Product) {
    setDeletingProductId(p.id);
    setDeletingProductTitle(p.title);
    setDeleteProductConfirmOpen(true);
  }

  async function confirmDeleteProduct() {
    if (!deletingProductId) return;
    await fetch(`${API}/api/admin/products/${deletingProductId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setDeleteProductConfirmOpen(false);
    setDeletingProductId(null);
    setDeletingProductTitle(null);
    await fetchProducts();
  }

  async function handleProductPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editingProduct.id) return;

    setUploadingProductPhoto(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch(`${API}/api/admin/products/${editingProduct.id}/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        const newPhoto = await res.json();
        const updatedPhotos = editingProduct.photos ? [...editingProduct.photos, newPhoto] : [newPhoto];
        setEditingProduct({
          ...editingProduct,
          photos: updatedPhotos,
        });
        await fetchProducts();
      }
    } finally {
      setUploadingProductPhoto(false);
    }
  }

  async function deleteProductPhoto(photoId: string) {
    try {
      const res = await fetch(`${API}/api/admin/products/photos/${photoId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        const updatedPhotos = (editingProduct.photos || []).filter((p) => p.id !== photoId);
        setEditingProduct({
          ...editingProduct,
          photos: updatedPhotos,
        });
        await fetchProducts();
      }
    } catch (err) {
      console.error("Failed to delete product photo", err);
    }
  }

  // ── Leads ─────────────────────────────────────────────────────────────────
  function triggerDeleteLead(l: Lead) {
    setDeletingLeadId(l.id);
    setDeletingLeadName(l.name);
    setDeleteLeadConfirmOpen(true);
  }

  async function confirmDeleteLead() {
    if (!deletingLeadId) return;
    try {
      const res = await fetch(`${API}/api/admin/leads/${deletingLeadId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setDeleteLeadConfirmOpen(false);
        setDeletingLeadId(null);
        setDeletingLeadName(null);
        await fetchLeads();
      }
    } catch {
      alert("Failed to delete inquiry");
    }
  }

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
    <div className="flex flex-col h-screen overflow-hidden bg-[#FAF9F6]">

      {/* ── Top Control Bar ── */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-[#1C2B36] text-white shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.2em] text-[#E8891C] font-bold uppercase">
            SKYWARD
          </span>
          <span className="text-white/25 text-xs">·</span>
          <span className="font-mono text-[11px] tracking-[0.15em] text-white/70 uppercase">
            CONTROL PORTAL
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-white/50 tracking-wider hidden sm:block">
            {userEmail}
          </span>
          <Separator orientation="vertical" className="h-4 bg-white/20" />
          <Link
            href="/"
            target="_blank"
            className="font-mono text-[10px] text-white/70 hover:text-white tracking-wider transition-colors uppercase"
          >
            → View Site
          </Link>
          <button
            onClick={logout}
            className="font-mono text-[10px] text-white/40 hover:text-red-400 tracking-wider transition-colors uppercase cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ── Tab Navigation ── */}
      <div className="flex items-center gap-0 px-6 border-b border-slate-200 bg-white shrink-0">
        {(["works", "products", "leads"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-4 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors border-b-2 -mb-px cursor-pointer ${
              tab === t
                ? "border-[#E8891C] text-[#1C2B36] font-bold"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {t === "works" ? "Works Registry" : t === "products" ? "Products & Services" : "Inquiry Docket"}
          </button>
        ))}
      </div>

      {/* ── Content Area ── */}
      <main className="flex-1 overflow-y-auto px-8 py-8">

        {loading ? (
          <div className="py-20 text-center font-mono text-sm text-slate-400 uppercase tracking-widest">
            Loading register...
          </div>
        ) : tab === "works" ? (

          /* ── WORKS REGISTRY ── */
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Works Registry
                </h1>
                <p className="text-xs text-slate-500 font-mono tracking-wider mt-1 uppercase">
                  ACTIVE DATABASE · {works.length} RECORDS REGISTERED
                </p>
              </div>
              <Button
                onClick={openNew}
                className="bg-[#1C2B36] hover:bg-[#1C2B36]/90 text-white font-mono text-[11px] uppercase tracking-widest rounded-[4px] px-5 h-10 font-bold shadow-sm cursor-pointer"
              >
                + Open New Job
              </Button>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2px] shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5 pl-6">Job Record / Title</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5">Category</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5">Brand</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5">Location</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5">Year</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5">Status</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5 pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {works.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16 font-mono text-xs text-slate-400 uppercase tracking-wider">
                        No installation records found. Click "+ Open New Job" above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    works.map((w) => {
                      const cover = w.photos?.find((p) => p.isCover) || w.photos?.[0];
                      const coverUrl = cover ? `${API}${cover.imageUrl}` : null;
                      const catLabel = CATEGORY_LABELS[normalizeCategory(w.canopyType)] || w.canopyType;

                      return (
                        <TableRow key={w.id} className="hover:bg-slate-50/60 transition-colors border-b border-slate-100">
                          <TableCell className="py-4 pl-6 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-10 bg-slate-100 rounded-[2px] border border-slate-200 overflow-hidden shrink-0">
                                {coverUrl ? (
                                  <img src={coverUrl} alt={w.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-mono text-[8px] text-slate-400">NO IMG</div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-sans font-bold text-sm text-slate-900 leading-snug">{w.title}</span>
                                <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase">{w.slug}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 align-middle font-mono text-xs uppercase text-slate-700 font-semibold">{catLabel}</TableCell>
                          <TableCell className="py-4 align-middle font-mono text-xs uppercase text-slate-700 font-semibold">{w.brand || "—"}</TableCell>
                          <TableCell className="py-4 align-middle font-mono text-xs uppercase text-slate-600">{w.location}</TableCell>
                          <TableCell className="py-4 align-middle font-mono text-xs text-slate-600">{w.yearCompleted}</TableCell>
                          <TableCell className="py-4 align-middle">{statusBadge(w.status)}</TableCell>
                          <TableCell className="py-4 align-middle pr-6 text-right space-x-2">
                            <button
                              onClick={() => openEdit(w)}
                              className="font-mono text-[10px] text-[#E8891C] hover:underline uppercase tracking-wider font-bold cursor-pointer"
                            >
                              Edit
                            </button>
                            <span className="text-slate-300">·</span>
                            <button
                              onClick={() => triggerDelete(w)}
                              className="font-mono text-[10px] text-red-650 hover:underline uppercase tracking-wider font-bold cursor-pointer"
                            >
                              Delete
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

        ) : tab === "products" ? (

          /* ── PRODUCTS CATALOG ── */
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Products & Services Catalog
                </h1>
                <p className="text-xs text-slate-500 font-mono tracking-wider mt-1 uppercase">
                  ACTIVE CATALOG · {products.length} PRODUCTS REGISTERED
                </p>
              </div>
              <Button
                onClick={openNewProduct}
                className="bg-[#1C2B36] hover:bg-[#1C2B36]/90 text-white font-mono text-[11px] uppercase tracking-widest rounded-[4px] px-5 h-10 font-bold shadow-sm cursor-pointer"
              >
                + Add New Product
              </Button>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2px] shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5 pl-6">Product / Service</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5">Category</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5">Specifications</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5">Status</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5 pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-16 font-mono text-xs text-slate-400 uppercase tracking-wider">
                        No product records found. Click "+ Add New Product" above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((p) => {
                      const cover = p.photos?.find((ph) => ph.isCover) || p.photos?.[0];
                      const coverUrl = cover ? `${API}${cover.imageUrl}` : null;
                      const catLabel = CATEGORY_LABELS[normalizeCategory(p.category)] || p.category;

                      return (
                        <TableRow key={p.id} className="hover:bg-slate-50/60 transition-colors border-b border-slate-100">
                          <TableCell className="py-4 pl-6 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-10 bg-slate-100 rounded-[2px] border border-slate-200 overflow-hidden shrink-0">
                                {coverUrl ? (
                                  <img src={coverUrl} alt={p.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-mono text-[8px] text-slate-400">NO IMG</div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-sans font-bold text-sm text-slate-900 leading-snug">{p.title}</span>
                                <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase">{p.slug}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 align-middle font-mono text-xs uppercase text-slate-700 font-semibold">{catLabel}</TableCell>
                          <TableCell className="py-4 align-middle font-mono text-xs text-slate-600 truncate max-w-xs">{p.specifications || "—"}</TableCell>
                          <TableCell className="py-4 align-middle">{statusBadge(p.status)}</TableCell>
                          <TableCell className="py-4 align-middle pr-6 text-right space-x-2">
                            <button
                              onClick={() => openEditProduct(p)}
                              className="font-mono text-[10px] text-[#E8891C] hover:underline uppercase tracking-wider font-bold cursor-pointer"
                            >
                              Edit
                            </button>
                            <span className="text-slate-300">·</span>
                            <button
                              onClick={() => triggerDeleteProduct(p)}
                              className="font-mono text-[10px] text-red-650 hover:underline uppercase tracking-wider font-bold cursor-pointer"
                            >
                              Delete
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

        ) : (

          /* ── LEADS / INQUIRY DOCKET ── */
          <div className="space-y-6 max-w-7xl mx-auto">
            <div>
              <h1 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Inquiry Docket
              </h1>
              <p className="text-xs text-slate-500 font-mono tracking-wider mt-1 uppercase">
                INCOMING LEADS & QUOTE REQUESTS · {leads.length} TOTAL INQUIRIES
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2px] shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5 pl-6">Client / Contact</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5">Message / Requirement</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5">Submitted Date</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5">Status</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3.5 pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-16 font-mono text-xs text-slate-400 uppercase tracking-wider">
                        No inquiries submitted yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((l) => (
                      <TableRow key={l.id} className="hover:bg-slate-50/60 transition-colors border-b border-slate-100">
                        <TableCell className="py-5 pl-6 align-top">
                          <div className="flex flex-col gap-1">
                            <span className="font-sans font-bold text-sm text-slate-900">{l.name}</span>
                            <span className="font-mono text-xs text-[#E8891C] font-medium">{l.email}</span>
                            <span className="font-mono text-xs text-slate-500">{l.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 align-top max-w-md">
                          <p className="font-sans text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{l.message}</p>
                        </TableCell>
                        <TableCell className="py-5 align-top font-mono text-xs text-slate-500">
                          {new Date(l.submittedAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="py-5 align-top">
                          <Select
                            value={l.status}
                            onValueChange={(v) => { if (v) updateLeadStatus(l.id, v); }}
                          >
                            <SelectTrigger className="w-full h-8 rounded-[4px] font-mono text-[10px] uppercase tracking-wider border-slate-200 bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-[4px] font-mono text-[10px] bg-white border border-slate-200 shadow-md">
                              <SelectItem value="new" className="uppercase tracking-wider cursor-pointer focus:bg-slate-50 py-1">New</SelectItem>
                              <SelectItem value="contacted" className="uppercase tracking-wider cursor-pointer focus:bg-slate-50 py-1">Contacted</SelectItem>
                              <SelectItem value="closed" className="uppercase tracking-wider cursor-pointer focus:bg-slate-50 py-1">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="mt-2">{leadStatusBadge(l.status)}</div>
                        </TableCell>
                        <TableCell className="py-5 align-top pr-6 text-right">
                          <button
                            onClick={() => triggerDeleteLead(l)}
                            className="p-1.5 rounded-[4px] hover:bg-red-50 text-red-650 hover:text-red-750 transition-colors cursor-pointer border-none bg-transparent inline-flex items-center justify-center"
                            title="Delete Inquiry"
                          >
                            <Trash className="w-4 h-4 text-slate-400 hover:text-red-600" weight="Filled" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </main>

      {/* ── Works Editor Sheet ── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-8 bg-white border-l border-slate-200 shadow-2xl flex flex-col gap-6">
          <SheetHeader className="mb-2 p-0 flex flex-col gap-1">
            <SheetTitle className="font-mono text-[11px] uppercase tracking-widest text-[#E8891C] font-bold">
              {isNew ? "Open New Job" : "Edit Job Record"}
            </SheetTitle>
            <SheetDescription className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-medium">
              {isNew ? "Create a new fabrication or installation record." : `Editing: ${editing.title}`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 flex flex-col gap-5">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Title</Label>
              <Input
                value={editing.title || ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="rounded-[4px] font-sans text-sm border-slate-250 focus:border-[#E8891C] focus:ring-1 focus:ring-[#E8891C] h-9 px-3"
                placeholder="e.g. IOCL Whitefield Bengaluru"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Slug</Label>
              <Input
                value={editing.slug || ""}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className="rounded-[4px] font-mono text-sm border-slate-250 focus:border-[#E8891C] focus:ring-1 focus:ring-[#E8891C] h-9 px-3"
                placeholder="iocl-whitefield-bengaluru"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Location</Label>
                <Input
                  value={editing.location || ""}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  className="rounded-[4px] font-sans text-sm border-slate-250 focus:border-[#E8891C] focus:ring-1 focus:ring-[#E8891C] h-9 px-3"
                  placeholder="Bengaluru, KA"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Year</Label>
                <Input
                  type="number"
                  value={editing.yearCompleted || ""}
                  onChange={(e) => setEditing({ ...editing, yearCompleted: Number(e.target.value) })}
                  className="rounded-[4px] font-mono text-sm border-slate-250 focus:border-[#E8891C] focus:ring-1 focus:ring-[#E8891C] h-9 px-3"
                  placeholder="2024"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Category</Label>
                <Select
                  value={editing.canopyType || "peb"}
                  onValueChange={(v) => setEditing({ ...editing, canopyType: v || undefined })}
                >
                  <SelectTrigger className="w-full rounded-[4px] font-mono text-xs uppercase tracking-wider border-slate-250 h-9 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-[4px] font-mono text-xs bg-white border border-slate-200 shadow-md">
                    <SelectItem value="peb" className="uppercase tracking-wider cursor-pointer focus:bg-slate-50 py-1">PEB</SelectItem>
                    <SelectItem value="warehouse" className="uppercase tracking-wider cursor-pointer focus:bg-slate-50 py-1">Warehouse</SelectItem>
                    <SelectItem value="other" className="uppercase tracking-wider cursor-pointer focus:bg-slate-50 py-1">Other Structural Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Brand</Label>
                <Select
                  value={editing.brand || "INDIAN OIL"}
                  onValueChange={(v) => setEditing({ ...editing, brand: v || undefined })}
                >
                  <SelectTrigger className="w-full rounded-[4px] font-mono text-xs uppercase tracking-wider border-slate-250 h-9 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-[4px] font-mono text-xs bg-white border border-slate-200 shadow-md">
                    {BRANDS.map((b) => (
                      <SelectItem key={b} value={b} className="uppercase tracking-wider cursor-pointer focus:bg-slate-50 py-1">{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Description</Label>
              <Textarea
                value={editing.description || ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="rounded-[4px] font-sans text-sm min-h-28 border-slate-250 focus:border-[#E8891C] focus:ring-1 focus:ring-[#E8891C] p-3 leading-relaxed"
                placeholder="Short project description — span, materials, notable details..."
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Status</Label>
              <Select
                value={editing.status || "draft"}
                onValueChange={(v) => setEditing({ ...editing, status: v || undefined })}
              >
                <SelectTrigger className="w-full rounded-[4px] font-mono text-xs uppercase tracking-wider border-slate-250 h-9 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-[4px] font-mono text-xs bg-white border border-slate-200 shadow-md">
                  <SelectItem value="draft" className="uppercase tracking-wider cursor-pointer focus:bg-slate-50 py-1">Draft</SelectItem>
                  <SelectItem value="published" className="uppercase tracking-wider cursor-pointer focus:bg-slate-50 py-1">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <Checkbox
                id="featured"
                checked={editing.isFeatured || false}
                onCheckedChange={(v) => setEditing({ ...editing, isFeatured: Boolean(v) })}
                className="rounded-[2px] border-slate-350 data-[state=checked]:bg-[#E8891C] data-[state=checked]:border-[#E8891C] h-4 w-4"
              />
              <Label htmlFor="featured" className="font-mono text-[10px] uppercase tracking-widest text-slate-500 cursor-pointer font-bold select-none">
                Feature on homepage
              </Label>
            </div>

            {/* ── Photo Management Section ── */}
            {isNew ? (
              <>
                <Separator className="my-2 bg-slate-100" />
                <div className="space-y-3 border border-dashed border-amber-300/80 bg-amber-50/60 p-4 rounded-[4px]">
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-amber-900 font-bold">
                    Site Photo Registry
                  </h3>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-slate-600 leading-relaxed">
                    Photos can be uploaded immediately after saving the job record. Click <strong>"Create & Add Photos"</strong> below to save this job and unlock image uploads.
                  </p>
                </div>
              </>
            ) : (
              editing.id && (
                <>
                  <Separator className="my-2 bg-slate-100" />
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#E8891C] font-bold">
                        Site Photo Registry
                      </h3>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">
                        Upload site images to disk. First photo becomes cover.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                        Add site Photo
                      </Label>
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handlePhotoUpload}
                          disabled={uploading}
                          className="rounded-[4px] font-mono text-xs cursor-pointer border-dashed border-slate-300 py-1 file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#1C2B36] file:text-white hover:border-[#E8891C] transition-colors h-11"
                        />
                      </div>
                      {uploading && (
                        <p className="font-mono text-[9px] text-[#E8891C] animate-pulse uppercase tracking-wider font-semibold">
                          Uploading file payload...
                        </p>
                      )}
                    </div>

                    {editing.photos && editing.photos.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {editing.photos.map((p) => {
                          const isCover = editing.coverImageId === p.id;
                          return (
                            <div key={p.id} className="relative group aspect-video border border-slate-200 rounded-[2px] overflow-hidden bg-slate-50">
                              <img
                                src={`${API}${p.imageUrl}`}
                                alt={editing.title}
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Overlay Controls */}
                              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setCoverPhoto(p.id)}
                                  className={`p-1.5 rounded-[2px] bg-white transition-colors cursor-pointer border-none ${
                                    isCover ? "text-amber-500" : "text-slate-450 hover:text-amber-500"
                                  }`}
                                  title={isCover ? "Cover Image" : "Make Cover"}
                                >
                                  <Star className="w-3.5 h-3.5" weight={isCover ? "Filled" : "Outline"} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deletePhoto(p.id)}
                                  className="p-1.5 rounded-[2px] bg-white text-red-650 hover:text-red-750 transition-colors cursor-pointer border-none"
                                  title="Remove Photo"
                                >
                                  <Trash className="w-3.5 h-3.5" weight="Filled" />
                                </button>
                              </div>
                              
                              {/* Cover Badge indicator */}
                              {isCover && (
                                <div className="absolute top-1 left-1 bg-amber-500 text-white font-mono text-[7px] font-bold uppercase tracking-wider px-1 py-0.5 rounded-[2px]">
                                  COVER
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400 py-4 text-center border border-dashed border-slate-200">
                        No site images registered.
                      </p>
                    )}
                  </div>
                </>
              )
            )}
          </div>

          <div className="flex gap-3 pt-6 border-t border-slate-100 mt-auto">
            <Button
              onClick={() => saveWork(isNew)}
              disabled={saving}
              className="flex-1 rounded-[4px] font-mono text-[11px] uppercase tracking-widest bg-[#1C2B36] hover:bg-[#1C2B36]/90 text-white h-10 font-bold cursor-pointer"
            >
              {saving ? "Saving..." : isNew ? "Create & Add Photos" : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setSheetOpen(false)}
              className="rounded-[4px] font-mono text-[11px] uppercase tracking-widest border-slate-250 hover:bg-slate-50 h-10 font-bold cursor-pointer"
            >
              Discard
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Product Editor Sheet ── */}
      <Sheet open={productSheetOpen} onOpenChange={setProductSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-8 bg-white border-l border-slate-200 shadow-2xl flex flex-col gap-6">
          <SheetHeader className="mb-2 p-0 flex flex-col gap-1">
            <SheetTitle className="font-mono text-[11px] uppercase tracking-widest text-[#E8891C] font-bold">
              {isNewProduct ? "Add New Product / Service" : "Edit Product Record"}
            </SheetTitle>
            <SheetDescription className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-medium">
              {isNewProduct ? "Register a new product or structural service offering." : `Editing: ${editingProduct.title}`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 flex flex-col gap-5">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Product Title</Label>
              <Input
                value={editingProduct.title || ""}
                onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                className="rounded-[4px] font-sans text-sm border-slate-250 focus:border-[#E8891C] focus:ring-1 focus:ring-[#E8891C] h-9 px-3"
                placeholder="e.g. Heavy Span Pre-Engineered Building"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Slug</Label>
              <Input
                value={editingProduct.slug || ""}
                onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                className="rounded-[4px] font-mono text-sm border-slate-250 focus:border-[#E8891C] focus:ring-1 focus:ring-[#E8891C] h-9 px-3"
                placeholder="peb-industrial-building"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Category</Label>
                <Select
                  value={editingProduct.category || "peb"}
                  onValueChange={(v) => setEditingProduct({ ...editingProduct, category: v || undefined })}
                >
                  <SelectTrigger className="w-full rounded-[4px] font-mono text-xs uppercase tracking-wider border-slate-250 h-9 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-[4px] font-mono text-xs bg-white border border-slate-200 shadow-md">
                    <SelectItem value="peb" className="uppercase tracking-wider cursor-pointer focus:bg-slate-50 py-1">PEB</SelectItem>
                    <SelectItem value="warehouse" className="uppercase tracking-wider cursor-pointer focus:bg-slate-50 py-1">Warehouse</SelectItem>
                    <SelectItem value="other" className="uppercase tracking-wider cursor-pointer focus:bg-slate-50 py-1">Other Structural Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Status</Label>
                <Select
                  value={editingProduct.status || "published"}
                  onValueChange={(v) => setEditingProduct({ ...editingProduct, status: v || undefined })}
                >
                  <SelectTrigger className="w-full rounded-[4px] font-mono text-xs uppercase tracking-wider border-slate-250 h-9 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-[4px] font-mono text-xs bg-white border border-slate-200 shadow-md">
                    <SelectItem value="draft" className="uppercase tracking-wider cursor-pointer focus:bg-slate-50 py-1">Draft</SelectItem>
                    <SelectItem value="published" className="uppercase tracking-wider cursor-pointer focus:bg-slate-50 py-1">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Description</Label>
              <Textarea
                value={editingProduct.description || ""}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="rounded-[4px] font-sans text-sm min-h-24 border-slate-250 focus:border-[#E8891C] focus:ring-1 focus:ring-[#E8891C] p-3 leading-relaxed"
                placeholder="Product description and core features..."
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">Technical Specifications</Label>
              <Input
                value={editingProduct.specifications || ""}
                onChange={(e) => setEditingProduct({ ...editingProduct, specifications: e.target.value })}
                className="rounded-[4px] font-mono text-xs border-slate-250 focus:border-[#E8891C] focus:ring-1 focus:ring-[#E8891C] h-9 px-3"
                placeholder="e.g. Grade 350 Steel, 160km/h Wind Rating"
              />
            </div>

            {/* Product Photo Registry Section */}
            {isNewProduct ? (
              <>
                <Separator className="my-2 bg-slate-100" />
                <div className="space-y-3 border border-dashed border-amber-300/80 bg-amber-50/60 p-4 rounded-[4px]">
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-amber-900 font-bold">
                    Product Photo Registry
                  </h3>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-slate-600 leading-relaxed">
                    Photos can be uploaded immediately after saving the product record. Click <strong>"Create & Add Photos"</strong> below to unlock image uploads.
                  </p>
                </div>
              </>
            ) : (
              editingProduct.id && (
                <>
                  <Separator className="my-2 bg-slate-100" />
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#E8891C] font-bold">
                        Product Photo Registry
                      </h3>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">
                        Upload product images or renders.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold block">
                        Add Product Photo
                      </Label>
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleProductPhotoUpload}
                          disabled={uploadingProductPhoto}
                          className="rounded-[4px] font-mono text-xs cursor-pointer border-dashed border-slate-300 py-1 file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#1C2B36] file:text-white hover:border-[#E8891C] transition-colors h-11"
                        />
                      </div>
                      {uploadingProductPhoto && (
                        <p className="font-mono text-[9px] text-[#E8891C] animate-pulse uppercase tracking-wider font-semibold">
                          Uploading image payload...
                        </p>
                      )}
                    </div>

                    {editingProduct.photos && editingProduct.photos.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {editingProduct.photos.map((p) => (
                          <div key={p.id} className="relative group aspect-video border border-slate-200 rounded-[2px] overflow-hidden bg-slate-50">
                            <img
                              src={`${API}${p.imageUrl}`}
                              alt={editingProduct.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => deleteProductPhoto(p.id)}
                                className="p-1.5 rounded-[2px] bg-white text-red-650 hover:text-red-750 transition-colors cursor-pointer border-none"
                                title="Remove Photo"
                              >
                                <Trash className="w-3.5 h-3.5" weight="Filled" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400 py-4 text-center border border-dashed border-slate-200">
                        No product images registered.
                      </p>
                    )}
                  </div>
                </>
              )
            )}
          </div>

          <div className="flex gap-3 pt-6 border-t border-slate-100 mt-auto">
            <Button
              onClick={() => saveProduct(isNewProduct)}
              disabled={savingProduct}
              className="flex-1 rounded-[4px] font-mono text-[11px] uppercase tracking-widest bg-[#1C2B36] hover:bg-[#1C2B36]/90 text-white h-10 font-bold cursor-pointer"
            >
              {savingProduct ? "Saving..." : isNewProduct ? "Create & Add Photos" : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setProductSheetOpen(false)}
              className="rounded-[4px] font-mono text-[11px] uppercase tracking-widest border-slate-250 hover:bg-slate-50 h-10 font-bold cursor-pointer"
            >
              Discard
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-white border border-slate-200 shadow-2xl p-6 sm:max-w-md w-full max-w-[calc(100%-2rem)] flex flex-col gap-4">
          <DialogHeader className="p-0 flex flex-col gap-1">
            <DialogTitle className="font-mono text-[11px] uppercase tracking-widest text-red-650 font-bold">
              Confirm Delete Action
            </DialogTitle>
            <DialogDescription className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-medium">
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 text-sm text-slate-750 font-sans leading-relaxed">
            Are you sure you want to permanently delete the job record for <strong className="text-slate-900">{deletingWorkTitle}</strong>? This will cascade-delete all of its associated photos.
          </div>
          <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              className="rounded-md font-mono text-[11px] uppercase tracking-widest border-slate-250 hover:bg-slate-50 cursor-pointer h-9 px-4 font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="rounded-md font-mono text-[11px] uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white h-9 px-4 font-bold cursor-pointer border-none"
            >
              Delete Job
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Product Confirmation Dialog ── */}
      <Dialog open={deleteProductConfirmOpen} onOpenChange={setDeleteProductConfirmOpen}>
        <DialogContent className="bg-white border border-slate-200 shadow-2xl p-6 sm:max-w-md w-full max-w-[calc(100%-2rem)] flex flex-col gap-4">
          <DialogHeader className="p-0 flex flex-col gap-1">
            <DialogTitle className="font-mono text-[11px] uppercase tracking-widest text-red-650 font-bold">
              Confirm Delete Product
            </DialogTitle>
            <DialogDescription className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-medium">
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 text-sm text-slate-750 font-sans leading-relaxed">
            Are you sure you want to permanently delete <strong className="text-slate-900">{deletingProductTitle}</strong> from the products catalog?
          </div>
          <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setDeleteProductConfirmOpen(false)}
              className="rounded-md font-mono text-[11px] uppercase tracking-widest border-slate-250 hover:bg-slate-50 cursor-pointer h-9 px-4 font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteProduct}
              className="rounded-md font-mono text-[11px] uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white h-9 px-4 font-bold cursor-pointer border-none"
            >
              Delete Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Lead Confirmation Dialog ── */}
      <Dialog open={deleteLeadConfirmOpen} onOpenChange={setDeleteLeadConfirmOpen}>
        <DialogContent className="bg-white border border-slate-200 shadow-2xl p-6 sm:max-w-md w-full max-w-[calc(100%-2rem)] flex flex-col gap-4">
          <DialogHeader className="p-0 flex flex-col gap-1">
            <DialogTitle className="font-mono text-[11px] uppercase tracking-widest text-red-650 font-bold">
              Confirm Delete Inquiry
            </DialogTitle>
            <DialogDescription className="font-mono text-[10px] uppercase tracking-widest text-slate-400 font-medium">
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 text-sm text-slate-750 font-sans leading-relaxed">
            Are you sure you want to permanently delete the quote inquiry from <strong className="text-slate-900">{deletingLeadName}</strong>?
          </div>
          <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setDeleteLeadConfirmOpen(false)}
              className="rounded-md font-mono text-[11px] uppercase tracking-widest border-slate-250 hover:bg-slate-50 cursor-pointer h-9 px-4 font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteLead}
              className="rounded-md font-mono text-[11px] uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white h-9 px-4 font-bold cursor-pointer border-none"
            >
              Delete Inquiry
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
