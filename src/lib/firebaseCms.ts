import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db, auth } from "@/integrations/firebase/client";
import { handleFirestoreError, OperationType } from "@/integrations/firebase/errors";
import { SEED_CONTENT_ITEMS } from "@/data/seedWebsiteData";
import { IMPLEMENTED_PROJECTS } from "@/data/implementedProjectsData";

export type ContentStatus = "draft" | "published" | "archived" | "deleted";

export interface FirebaseContentItem {
  id: string;
  type: string;
  slug?: string;
  status: ContentStatus;
  position?: number;
  coverUrl?: string | null;
  data: Record<string, any>;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  createdBy?: string;
  updatedBy?: string;
}

export interface ContactMessageItem {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  province?: string;
  status: "new" | "read" | "replied" | "archived" | "spam";
  createdAt: string;
  repliedAt?: string;
  notes?: string;
}

export interface JobApplicationItem {
  id: string;
  kind: "job" | "training" | "volunteer" | "internship";
  referenceId?: string;
  referenceTitle?: string;
  fullName: string;
  email: string;
  phone?: string;
  province?: string;
  status: "new" | "pending" | "reviewing" | "shortlisted" | "accepted" | "rejected" | "waitlist";
  data: Record<string, any>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettingDoc {
  key: string;
  value: Record<string, any>;
  updatedAt: string;
  updatedBy?: string;
}

export interface AuditLogItem {
  id: string;
  actorId?: string;
  actorEmail?: string;
  action: string;
  targetTable: string;
  entityId?: string;
  details?: Record<string, any>;
  createdAt: string;
}

export interface AdminUserRole {
  userId: string;
  email: string;
  role: "super_admin" | "admin" | "content_manager" | "editor" | "media_manager" | "hr_manager" | "project_manager" | "viewer";
  name?: string;
  createdAt: string;
  updatedAt?: string;
}

// -----------------------------------------------------------------------------
// AUDIT LOGGING HELPER
// -----------------------------------------------------------------------------
export async function logAuditEvent(
  action: string,
  targetTable: string,
  entityId?: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    const user = auth.currentUser;
    const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const logRef = doc(db, "audit_logs", logId);
    await setDoc(logRef, {
      id: logId,
      actorId: user?.uid ?? "system",
      actorEmail: user?.email ?? "system@pyecso.org.af",
      action,
      targetTable,
      entityId: entityId ?? "",
      details: details ?? {},
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Audit log notice:", err);
  }
}

// -----------------------------------------------------------------------------
// CONTENT ITEMS CRUD (Programs, Projects, News, Events, Publications, Careers, Team, Partners, etc.)
// -----------------------------------------------------------------------------

export async function fetchContentItemsByType(
  type: string,
  includeAllStatus: boolean = false
): Promise<FirebaseContentItem[]> {
  const path = "content_items";
  try {
    const colRef = collection(db, path);
    const q = query(colRef, where("type", "==", type));
    
    const snap = await getDocs(q);
    let items: FirebaseContentItem[] = [];
    snap.forEach((d) => {
      const data = d.data() as FirebaseContentItem;
      if (!data.id) data.id = d.id;
      if (!includeAllStatus && (data.status !== "published" || data.deletedAt)) {
        return;
      }
      if (includeAllStatus && data.deletedAt && data.status !== "deleted") {
        return;
      }
      items.push(data);
    });

    // Auto-migrate projects if the database has fewer than 30 projects or contains outdated items not from PDF
    if (type === "project" && (items.length < 30 || items.some((i) => !IMPLEMENTED_PROJECTS.some((p) => p.slug === i.slug)))) {
      console.log("Migrating and synchronizing 30 official implemented projects from PDF to Firestore...");
      await syncImplementedProjectsToFirestore({ purgeExisting: true });
      const refreshedSnap = await getDocs(q);
      items = [];
      refreshedSnap.forEach((d) => {
        const data = d.data() as FirebaseContentItem;
        if (!data.id) data.id = d.id;
        if (!includeAllStatus && (data.status !== "published" || data.deletedAt)) {
          return;
        }
        items.push(data);
      });
    }

    items.sort((a, b) => {
      if (a.position != null && b.position != null) return a.position - b.position;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return items;
  } catch (error) {
    console.error(`Error fetching content items for type: ${type}`, error);
    if (type === "project") {
      return IMPLEMENTED_PROJECTS.map((item, idx) => ({
        id: `project_${item.slug}`,
        type: "project",
        slug: item.slug,
        status: "published",
        position: item.position ?? idx + 1,
        coverUrl: item.cover_url || null,
        data: item.data,
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }
    return [];
  }
}

export function subscribeContentItemsByType(
  type: string,
  onUpdate: (items: FirebaseContentItem[]) => void,
  includeAllStatus: boolean = false
): Unsubscribe {
  const path = "content_items";
  try {
    const colRef = collection(db, path);
    const q = query(colRef, where("type", "==", type));
    return onSnapshot(
      q,
      (snap) => {
        const items: FirebaseContentItem[] = [];
        snap.forEach((d) => {
          const data = d.data() as FirebaseContentItem;
          if (!data.id) data.id = d.id;
          if (!includeAllStatus && (data.status !== "published" || data.deletedAt)) {
            return;
          }
          items.push(data);
        });
        items.sort((a, b) => {
          if (a.position != null && b.position != null) return a.position - b.position;
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
        onUpdate(items);
      },
      (error) => {
        console.warn(`Firestore snapshot error for ${type}:`, error);
      }
    );
  } catch (e) {
    console.warn("Could not attach onSnapshot listener:", e);
    return () => {};
  }
}

export async function fetchContentItemBySlug(
  type: string,
  slug: string
): Promise<FirebaseContentItem | null> {
  const path = "content_items";
  try {
    const colRef = collection(db, path);
    const q = query(colRef, where("type", "==", type), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      const data = d.data() as FirebaseContentItem;
      data.id = d.id;
      return data;
    }
    return null;
  } catch (error) {
    console.warn(`Error fetching item by slug ${slug}:`, error);
    return null;
  }
}

export async function saveContentItem(
  item: Partial<FirebaseContentItem> & { type: string; data: Record<string, any> }
): Promise<{ success: boolean; id: string; error?: string }> {
  const path = "content_items";
  try {
    const isNew = !item.id || item.id.startsWith("new-") || item.id.startsWith("seed-");
    const id = isNew ? `${item.type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` : item.id!;
    const docRef = doc(db, path, id);
    const now = new Date().toISOString();
    const user = auth.currentUser;

    const payload: FirebaseContentItem = {
      id,
      type: item.type,
      slug: item.slug || item.data?.slug || `${item.type}-${Date.now()}`,
      status: item.status || "published",
      position: item.position ?? 0,
      coverUrl: item.coverUrl || item.data?.cover_url || item.data?.coverUrl || null,
      data: item.data,
      publishedAt: item.status === "published" ? (item.publishedAt || now) : null,
      createdAt: item.createdAt || now,
      updatedAt: now,
      deletedAt: null,
      createdBy: item.createdBy || user?.email || "admin",
      updatedBy: user?.email || "admin",
    };

    await setDoc(docRef, payload, { merge: true });
    await logAuditEvent(isNew ? "CONTENT_CREATED" : "CONTENT_UPDATED", "content_items", id, {
      type: item.type,
      slug: payload.slug,
      status: payload.status,
    });

    return { success: true, id };
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return { success: false, id: "", error: error?.message };
  }
}

export async function softDeleteContentItem(id: string): Promise<boolean> {
  const path = "content_items";
  try {
    const docRef = doc(db, path, id);
    await setDoc(
      docRef,
      {
        id,
        status: "deleted",
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.email || "admin",
      },
      { merge: true }
    );
    await logAuditEvent("CONTENT_DELETED", "content_items", id);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return false;
  }
}

export async function restoreContentItem(id: string): Promise<boolean> {
  const path = "content_items";
  try {
    const docRef = doc(db, path, id);
    await setDoc(
      docRef,
      {
        id,
        status: "published",
        deletedAt: null,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.email || "admin",
      },
      { merge: true }
    );
    await logAuditEvent("CONTENT_RESTORED", "content_items", id);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return false;
  }
}

export async function hardDeleteContentItem(id: string): Promise<boolean> {
  const path = "content_items";
  try {
    const docRef = doc(db, path, id);
    await deleteDoc(docRef);
    await logAuditEvent("CONTENT_HARD_DELETED", "content_items", id);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return false;
  }
}

// -----------------------------------------------------------------------------
// SITE SETTINGS (General, Contact, SEO, HesabPay, Bank, Navigation, Footer, Learn)
// -----------------------------------------------------------------------------

export async function fetchSiteSetting<T = Record<string, any>>(key: string): Promise<T | null> {
  const path = "site_settings";
  try {
    const docRef = doc(db, path, key);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as SiteSettingDoc;
      return (data.value as T) ?? null;
    }
    return null;
  } catch (error) {
    console.warn(`Error fetching site setting ${key}:`, error);
    return null;
  }
}

export async function saveSiteSetting(
  key: string,
  value: Record<string, any>
): Promise<boolean> {
  const path = "site_settings";
  try {
    const docRef = doc(db, path, key);
    const now = new Date().toISOString();
    await setDoc(
      docRef,
      {
        key,
        value,
        updatedAt: now,
        updatedBy: auth.currentUser?.email || "admin",
      },
      { merge: true }
    );
    await logAuditEvent("SETTINGS_UPDATED", "site_settings", key);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

// -----------------------------------------------------------------------------
// CONTACT MESSAGES & INTAKE
// -----------------------------------------------------------------------------

export async function fetchContactMessages(): Promise<ContactMessageItem[]> {
  const path = "contact_messages";
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    const list: ContactMessageItem[] = [];
    snap.forEach((d) => {
      const data = d.data() as ContactMessageItem;
      data.id = d.id;
      list.push(data);
    });
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return list;
  } catch (error) {
    console.warn("Error fetching contact messages:", error);
    return [];
  }
}

export async function updateContactMessageStatus(
  id: string,
  status: ContactMessageItem["status"],
  notes?: string
): Promise<boolean> {
  const path = "contact_messages";
  try {
    const docRef = doc(db, path, id);
    const updateData: any = { status };
    if (notes !== undefined) updateData.notes = notes;
    if (status === "replied") updateData.repliedAt = new Date().toISOString();
    await updateDoc(docRef, updateData);
    await logAuditEvent("MESSAGE_STATUS_CHANGED", "contact_messages", id, { status });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return false;
  }
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const path = "contact_messages";
  try {
    const docRef = doc(db, path, id);
    await deleteDoc(docRef);
    await logAuditEvent("MESSAGE_DELETED", "contact_messages", id);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return false;
  }
}

export async function createPublicContactMessage(
  msg: Omit<ContactMessageItem, "id" | "status" | "createdAt">
): Promise<{ success: boolean; id: string }> {
  const path = "contact_messages";
  try {
    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const docRef = doc(db, path, id);
    const payload: ContactMessageItem = {
      ...msg,
      id,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload);
    return { success: true, id };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return { success: false, id: "" };
  }
}

// -----------------------------------------------------------------------------
// APPLICATIONS (Jobs, Internships, Volunteer, Training)
// -----------------------------------------------------------------------------

export async function fetchApplications(): Promise<JobApplicationItem[]> {
  const path = "applications";
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    const list: JobApplicationItem[] = [];
    snap.forEach((d) => {
      const data = d.data() as JobApplicationItem;
      data.id = d.id;
      list.push(data);
    });
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return list;
  } catch (error) {
    console.warn("Error fetching applications:", error);
    return [];
  }
}

export async function updateApplicationStatus(
  id: string,
  status: JobApplicationItem["status"],
  notes?: string
): Promise<boolean> {
  const path = "applications";
  try {
    const docRef = doc(db, path, id);
    const updateData: any = { status, updatedAt: new Date().toISOString() };
    if (notes !== undefined) updateData.notes = notes;
    await updateDoc(docRef, updateData);
    await logAuditEvent("APPLICATION_STATUS_CHANGED", "applications", id, { status });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return false;
  }
}

export async function deleteApplication(id: string): Promise<boolean> {
  const path = "applications";
  try {
    const docRef = doc(db, path, id);
    await deleteDoc(docRef);
    await logAuditEvent("APPLICATION_DELETED", "applications", id);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return false;
  }
}

export async function submitApplication(
  appData: Omit<JobApplicationItem, "id" | "status" | "createdAt" | "updatedAt">
): Promise<{ success: boolean; id: string }> {
  const path = "applications";
  try {
    const id = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const docRef = doc(db, path, id);
    const now = new Date().toISOString();
    const payload: JobApplicationItem = {
      ...appData,
      id,
      status: "new",
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(docRef, payload);
    return { success: true, id };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return { success: false, id: "" };
  }
}

export type UserRole = "super_admin" | "editor" | "reviewer" | "viewer";

export interface UserRoleItem {
  id: string;
  userId?: string;
  email: string;
  role: UserRole;
  displayName?: string;
  grantedAt: string;
}

export async function fetchDeletedContentItems(): Promise<FirebaseContentItem[]> {
  const path = "content_items";
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    const items: FirebaseContentItem[] = [];
    snap.forEach((d) => {
      const data = d.data() as FirebaseContentItem;
      if (!data.id) data.id = d.id;
      if (data.status === "deleted" || data.deletedAt) {
        items.push(data);
      }
    });
    return items;
  } catch (error) {
    console.warn("Error fetching deleted content items:", error);
    return [];
  }
}

export async function fetchUserRoles(): Promise<UserRoleItem[]> {
  const path = "user_roles";
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    const list: UserRoleItem[] = [];
    snap.forEach((d) => {
      const data = d.data() as any;
      list.push({
        id: d.id,
        userId: data.userId || d.id,
        email: data.email || "",
        role: data.role || "editor",
        displayName: data.name || data.displayName || data.email?.split("@")[0] || "User",
        grantedAt: data.createdAt || data.updatedAt || new Date().toISOString(),
      });
    });
    return list;
  } catch (error) {
    console.warn("Error fetching user roles:", error);
    return [];
  }
}

export async function setUserRole(
  email: string,
  role: UserRole,
  displayName?: string
): Promise<boolean> {
  const userId = email.replace(/[^a-zA-Z0-9]/g, "_");
  return saveUserRole(userId, email, role, displayName);
}

// -----------------------------------------------------------------------------
// USER ROLES & RBAC
// -----------------------------------------------------------------------------

export async function fetchAdminUserRoles(): Promise<AdminUserRole[]> {
  const path = "user_roles";
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    const list: AdminUserRole[] = [];
    snap.forEach((d) => {
      const data = d.data() as AdminUserRole;
      data.userId = d.id;
      list.push(data);
    });
    return list;
  } catch (error) {
    console.warn("Error fetching user roles:", error);
    return [];
  }
}

export async function saveUserRole(
  userId: string,
  email: string,
  role: AdminUserRole["role"],
  name?: string
): Promise<boolean> {
  const path = "user_roles";
  try {
    const docRef = doc(db, path, userId);
    const payload: AdminUserRole = {
      userId,
      email,
      role,
      name: name || email.split("@")[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
    await logAuditEvent("USER_ROLE_ASSIGNED", "user_roles", userId, { email, role });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

export async function removeUserRole(userId: string): Promise<boolean> {
  const path = "user_roles";
  try {
    const docRef = doc(db, path, userId);
    await deleteDoc(docRef);
    await logAuditEvent("USER_ROLE_REMOVED", "user_roles", userId);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    return false;
  }
}

// -----------------------------------------------------------------------------
// AUDIT LOGS
// -----------------------------------------------------------------------------

export async function fetchAuditLogs(maxCount: number = 100): Promise<AuditLogItem[]> {
  const path = "audit_logs";
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    const list: AuditLogItem[] = [];
    snap.forEach((d) => {
      const data = d.data() as AuditLogItem;
      data.id = d.id;
      list.push(data);
    });
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return list.slice(0, maxCount);
  } catch (error) {
    console.warn("Error fetching audit logs:", error);
    return [];
  }
}

// -----------------------------------------------------------------------------
// 1-CLICK DATABASE SEEDER & SYNC (Firebase Firestore)
// -----------------------------------------------------------------------------

export async function seedFirebaseFirestore(): Promise<{
  success: boolean;
  insertedCount: number;
  message: string;
}> {
  try {
    let count = 0;
    const now = new Date().toISOString();

    // 1. Seed Content Items (Programs, Projects, News, Events, Publications, Careers, Team, Partners, Testimonials, Sectors)
    for (const item of SEED_CONTENT_ITEMS) {
      const slug = item.slug || `${item.type}-${count + 1}`;
      const id = `${item.type}_${slug.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
      const docRef = doc(db, "content_items", id);

      const payload: FirebaseContentItem = {
        id,
        type: item.type,
        slug,
        status: (item.status as ContentStatus) || "published",
        position: item.position ?? count,
        coverUrl: item.cover_url || null,
        data: item.data || {},
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        createdBy: "seeder@pyecso.org.af",
      };

      await setDoc(docRef, payload, { merge: true });
      count++;
    }

    // 2. Seed Default Site Settings
    const defaultSettings: Record<string, Record<string, any>> = {
      general: {
        orgName: "Patriotic Youths Education, Cultural & Social Organization (PYECSO)",
        shortName: "PYECSO",
        establishedYear: "2006",
        moecRegNumber: "1201",
        primaryEmail: "info@pyecso.org.af",
        primaryPhone: "+93 78 888 1201",
        defaultLanguage: "en",
        supportedLanguages: ["en", "dr", "ps"],
      },
      contact: {
        hqAddress: {
          en: "House #14, Street 3, Karte Se, District 6, Kabul, Afghanistan",
          dr: "خانه شماره ۱۴، سرک سوم، کارته سه، ناحیه ۶، کابل، افغانستان",
          ps: "۱۴مه کور، ۳یمه کوڅه، ۳مه کارته، ۶مه ناحیه، کابل، افغانستان",
        },
        phone1: "+93 78 888 1201",
        phone2: "+93 70 123 4567",
        email: "info@pyecso.org.af",
        partnershipEmail: "partnerships@pyecso.org.af",
        workingHours: {
          en: "Saturday – Thursday: 8:00 AM – 4:30 PM",
          dr: "شنبه الی پنج‌شنبه: ۸:۰۰ صبح الی ۴:۳۰ بعد از ظهر",
          ps: "شنبه تر پنجشنبې: ۸:۰۰ سهار تر ۴:۳۰ مازدیګر",
        },
        socialLinks: {
          facebook: "https://facebook.com/pyecso",
          twitter: "https://twitter.com/pyecso_org",
          linkedin: "https://linkedin.com/company/pyecso",
          youtube: "https://youtube.com/@pyecso",
        },
      },
      seo: {
        metaTitle: "PYECSO — Youth-Led Humanitarian & Educational Organization",
        metaDescription: "PYECSO empowers vulnerable Afghan communities through education, emergency cash, TVET vocational skills, food security, and youth leadership.",
        keywords: "PYECSO, Afghanistan NGO, Kabul, Education, TVET, Cash Assistance, Youth Development",
        ogImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
      },
      hesabpay: {
        enabled: true,
        merchantName: "PYECSO Humanitarian Fund",
        merchantId: "HP-PYECSO-KBL-2006",
        presetsAfn: [500, 1500, 3500, 7500, 15000],
        presetsUsd: [10, 25, 50, 100, 250],
        instructions: {
          en: "Scan QR code via HesabPay mobile app or select instant payment preset in AFN/USD.",
          dr: "کد QR را از طریق برنامه موبایل حساب‌پی اسکن نمایید یا مبلغ مورد نظر را انتخاب کنید.",
          ps: "د حساب‌پي موبایل اپلیکیشن له لارې QR کوډ سکین کړئ یا د مرستې ټاکلې اندازه وټاکئ.",
        },
      },
      bank: {
        bankName: "Azizi Bank",
        accountName: "Patriotic Youths Education, Cultural & Social Organization",
        accountNumber: "000101201948201",
        swiftCode: "AZBKAFKA",
        branchName: "Karte Se Main Branch, Kabul",
        branchAddress: "Karte Se Square, Kabul, Afghanistan",
        currency: "USD & AFN",
        instructions: "Please include donor name and project reference in the wire transfer memo/notes.",
      },
    };

    for (const [key, val] of Object.entries(defaultSettings)) {
      const setRef = doc(db, "site_settings", key);
      await setDoc(setRef, { key, value: val, updatedAt: now }, { merge: true });
    }

    // 3. Set default Super Admin role for bootstrapped email
    const adminRef = doc(db, "user_roles", "admin_bootstrap");
    await setDoc(
      adminRef,
      {
        userId: "admin_bootstrap",
        email: "ziarahmanabid14@gmail.com",
        role: "super_admin",
        name: "Ziarahman Abid (Super Admin)",
        createdAt: now,
      },
      { merge: true }
    );

    await logAuditEvent("DATABASE_SEEDED", "system", "all", { count });

    return {
      success: true,
      insertedCount: count,
      message: `Successfully synchronized ${count} content records and core site configurations with Firebase Firestore!`,
    };
  } catch (error: any) {
    console.error("Error seeding Firebase Firestore:", error);
    return {
      success: false,
      insertedCount: 0,
      message: error?.message || "Failed to seed Firebase Firestore database.",
    };
  }
}

/**
 * Remove existing projects from Firestore and write all 30 official implemented projects from PDF
 */
export async function syncImplementedProjectsToFirestore(options: { purgeExisting?: boolean } = { purgeExisting: true }): Promise<{
  success: boolean;
  insertedCount: number;
  deletedCount: number;
  message: string;
}> {
  try {
    let deletedCount = 0;
    let count = 0;
    const now = new Date().toISOString();

    // 1. Purge existing projects if requested (default: true)
    if (options.purgeExisting) {
      try {
        const q = query(collection(db, "content_items"), where("type", "==", "project"));
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map((d) => {
          deletedCount++;
          return deleteDoc(d.ref);
        });
        await Promise.all(deletePromises);
      } catch (err) {
        console.warn("Notice: Could not query existing projects to purge:", err);
      }
    }

    // 2. Insert all 30 official implemented projects from PDF
    for (const item of IMPLEMENTED_PROJECTS) {
      const slug = item.slug;
      const id = `project_${slug.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
      const docRef = doc(db, "content_items", id);

      const payload: FirebaseContentItem = {
        id,
        type: "project",
        slug,
        status: "published",
        position: item.position ?? count + 1,
        coverUrl: item.cover_url || null,
        data: item.data || {},
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        createdBy: "seeder@pyecso.org.af",
      };

      await setDoc(docRef, payload);
      count++;
    }

    await logAuditEvent("PROJECTS_SYNCED", "system", "projects", {
      count,
      deletedCount,
    });

    return {
      success: true,
      insertedCount: count,
      deletedCount,
      message: `Successfully removed previous projects (${deletedCount}) and added all ${count} official projects from PDF to Firebase Firestore!`,
    };
  } catch (error: any) {
    console.error("Error syncing implemented projects to Firebase Firestore:", error);
    return {
      success: false,
      insertedCount: 0,
      deletedCount: 0,
      message: error?.message || "Failed to sync implemented projects to Firestore.",
    };
  }
}

export const resetAndReplaceProjectsInFirestore = syncImplementedProjectsToFirestore;
