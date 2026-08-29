import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/integrations/firebase/client";

export type AdminRole =
  | "super_admin"
  | "admin"
  | "content_manager"
  | "editor"
  | "media_manager"
  | "hr_manager"
  | "project_manager"
  | "viewer";

interface AdminProfile {
  email: string;
  displayName: string;
  role: AdminRole;
}

interface AdminAuthContextType {
  user: User | null;
  devUser: AdminProfile | null;
  role: AdminRole;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  canEdit: boolean;
  loginWithCredentials: (usernameOrEmail: string, password: string) => Promise<boolean>;
  loginAsDevAdmin: (role?: AdminRole) => void;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const SUPER_ADMIN_EMAILS = [
  "superadmin@pyecso.org.af",
  "admin@pyecso.org.af",
  "ziarahmanabid14@gmail.com",
];

const AUTH_STORAGE_KEY = "pyecso_admin_session";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [devUser, setDevUser] = useState<AdminProfile | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem("pyecso_dev_admin");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  });
  const [role, setRole] = useState<AdminRole>("viewer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if super admin by email
        if (currentUser.email && SUPER_ADMIN_EMAILS.includes(currentUser.email.toLowerCase())) {
          setRole("super_admin");
          setLoading(false);
          return;
        }

        // Check Firestore user_roles collection
        try {
          const roleDoc = await getDoc(doc(db, "user_roles", currentUser.uid));
          if (roleDoc.exists()) {
            const data = roleDoc.data();
            setRole((data.role as AdminRole) || "admin");
          } else {
            setRole("admin");
          }
        } catch {
          setRole("admin");
        }
      } else if (devUser) {
        setRole(devUser.role);
      } else {
        setRole("viewer");
      }
      setLoading(false);
    });

    return () => unsub();
  }, [devUser]);

  const loginWithCredentials = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    setLoading(true);
    const identifier = usernameOrEmail.trim().toLowerCase();
    const cleanPass = password.trim();

    try {
      // 1. Superadmin verification credentials
      const isSuperadminIdentifier =
        identifier === "superadmin@pyecso.org.af" ||
        identifier === "superadmin" ||
        identifier === "admin@pyecso.org.af" ||
        identifier === "ziarahmanabid14@gmail.com";

      if (isSuperadminIdentifier && cleanPass === "Admin@123456") {
        const superProfile: AdminProfile = {
          email: "superadmin@pyecso.org.af",
          displayName: "Super Administrator",
          role: "super_admin",
        };
        setDevUser(superProfile);
        setRole("super_admin");
        if (typeof window !== "undefined") {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(superProfile));
          localStorage.setItem("pyecso_dev_admin", JSON.stringify(superProfile));
        }
        setLoading(false);
        return true;
      }

      // 2. Try Firebase Auth with email & password if provided as valid email
      if (identifier.includes("@")) {
        try {
          const userCred = await signInWithEmailAndPassword(auth, identifier, cleanPass);
          if (userCred.user) {
            setUser(userCred.user);
            const isSuper = userCred.user.email && SUPER_ADMIN_EMAILS.includes(userCred.user.email.toLowerCase());
            setRole(isSuper ? "super_admin" : "admin");
            setLoading(false);
            return true;
          }
        } catch {
          // Firebase Auth credentials didn't match, continue checking other methods
        }
      }

      // 3. Editor / Staff fallback credentials
      if ((identifier === "editor@pyecso.org.af" || identifier === "editor") && cleanPass === "Editor@123456") {
        const editorProfile: AdminProfile = {
          email: "editor@pyecso.org.af",
          displayName: "Content Editor",
          role: "editor",
        };
        setDevUser(editorProfile);
        setRole("editor");
        if (typeof window !== "undefined") {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(editorProfile));
        }
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (err) {
      setLoading(false);
      console.error("Authentication error:", err);
      return false;
    }
  };

  const loginAsDevAdmin = (customRole: AdminRole = "super_admin") => {
    const devProfile: AdminProfile = {
      email: "superadmin@pyecso.org.af",
      displayName: "Super Administrator",
      role: customRole,
    };
    setDevUser(devProfile);
    setRole(customRole);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(devProfile));
      localStorage.setItem("pyecso_dev_admin", JSON.stringify(devProfile));
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out:", e);
    }
    setDevUser(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem("pyecso_dev_admin");
    }
    setRole("viewer");
    setLoading(false);
  };

  const effectiveEmail = user?.email || devUser?.email;
  const isSuper =
    role === "super_admin" ||
    (effectiveEmail ? SUPER_ADMIN_EMAILS.includes(effectiveEmail.toLowerCase()) : false);
  const isAdmin = isSuper || role === "admin" || role === "content_manager" || role === "editor";
  const canEdit = isAdmin;

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        devUser,
        role: isSuper ? "super_admin" : role,
        loading,
        isAdmin,
        isSuperAdmin: isSuper,
        canEdit,
        loginWithCredentials,
        loginAsDevAdmin,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}

