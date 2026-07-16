export type UserRole = "admin" | "student" | "teacher" | "learn_manager";

export type BridgeUser = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
};

export type CmsResource = "pages" | "programs" | "projects" | "courses" | "media" | "careers";

export type CmsItem = {
  id: number;
  resource: CmsResource;
  slug: string;
  language: string;
  title: string;
  summary: string | null;
  body: string | null;
  status: "draft" | "published";
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type CourseApplication = {
  id: number;
  course_id: number | null;
  course_title: string | null;
  applicant_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: "submitted" | "reviewing" | "accepted" | "rejected";
  manager_notes: string | null;
  created_at: string;
};

type LoginResponse = { token: string; user: BridgeUser };

const DEFAULT_API_BASE = "https://www.pyecso.org.af/pyecso-api";
const API_BASE = (import.meta.env.VITE_PYECSO_API_BASE_URL || DEFAULT_API_BASE).replace(/\/$/, "");
const TOKEN_KEY = "pyecso.bridge.token";

export function getBridgeApiBase() {
  return API_BASE;
}

export function getBridgeToken() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function setBridgeToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.sessionStorage.setItem(TOKEN_KEY, token);
  else window.sessionStorage.removeItem(TOKEN_KEY);
}

async function bridgeRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getBridgeToken();
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(payload?.error || `Bridge request failed with status ${response.status}`);
  }
  return payload as T;
}

export type BridgeHealth = {
  ok: boolean;
  status: "healthy" | "unhealthy";
  message: string;
  database: string;
  server_version?: string | null;
  latency_ms?: number;
  time: string;
};

export async function checkBridgeHealth(): Promise<BridgeHealth> {
  try {
    return await bridgeRequest<BridgeHealth>("/health");
  } catch (error) {
    return {
      ok: false,
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Unable to reach PHP bridge",
      database: "unknown",
      time: new Date().toISOString(),
    };
  }
}

export async function loginToBridge(identifier: string, password: string) {
  const result = await bridgeRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
  setBridgeToken(result.token);
  return result.user;
}

export async function loginToBridgeWithGoogle(idToken: string) {
  const result = await bridgeRequest<LoginResponse>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ id_token: idToken }),
  });
  setBridgeToken(result.token);
  return result.user;
}

export async function getCurrentBridgeUser() {
  return bridgeRequest<{ user: BridgeUser }>("/auth/me").then((result) => result.user);
}

export async function listContent(resource: CmsResource, language = "en") {
  const params = new URLSearchParams({ resource, language });
  return bridgeRequest<{ items: CmsItem[] }>(`/content?${params.toString()}`).then((result) => result.items);
}

export async function saveContent(
  resource: CmsResource,
  item: Partial<CmsItem> & { title: string; slug: string; language: string },
) {
  const params = new URLSearchParams({ resource });
  if (item.id) params.set("id", String(item.id));
  return bridgeRequest<{ item: CmsItem }>(`/content?${params.toString()}`, {
    method: item.id ? "PUT" : "POST",
    body: JSON.stringify(item),
  }).then((result) => result.item);
}

export async function deleteContent(resource: CmsResource, id: number) {
  const params = new URLSearchParams({ resource, id: String(id) });
  return bridgeRequest<{ ok: boolean }>(`/content?${params.toString()}`, { method: "DELETE" });
}

export async function submitCourseApplication(input: {
  course_id: number | null;
  applicant_name: string;
  email: string;
  phone?: string;
  message?: string;
}) {
  return bridgeRequest<{ application: CourseApplication }>("/applications", {
    method: "POST",
    body: JSON.stringify(input),
  }).then((result) => result.application);
}

export async function listApplications() {
  return bridgeRequest<{ applications: CourseApplication[] }>("/applications").then(
    (result) => result.applications,
  );
}

export async function updateApplicationStatus(id: number, status: CourseApplication["status"], manager_notes = "") {
  return bridgeRequest<{ application: CourseApplication }>(`/applications?id=${id}`, {
    method: "PUT",
    body: JSON.stringify({ status, manager_notes }),
  }).then((result) => result.application);
}

export type CourseMaterial = {
  id: number;
  course_id: number;
  title: string;
  description: string | null;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  visibility: "enrolled" | "public";
  uploaded_by: number | null;
  created_at: string;
};

export async function listCourseMaterials(courseId: number) {
  return bridgeRequest<{ materials: CourseMaterial[] }>(`/materials?course_id=${courseId}`).then(
    (r) => r.materials,
  );
}

export async function uploadCourseMaterial(input: {
  course_id: number;
  title: string;
  description?: string;
  visibility?: "enrolled" | "public";
  file: File;
}) {
  const token = getBridgeToken();
  const form = new FormData();
  form.append("course_id", String(input.course_id));
  form.append("title", input.title);
  if (input.description) form.append("description", input.description);
  form.append("visibility", input.visibility ?? "enrolled");
  form.append("file", input.file);

  const response = await fetch(`${API_BASE}/materials`, {
    method: "POST",
    body: form,
    headers: token ? { Authorization: `Bearer ${token}`, Accept: "application/json" } : { Accept: "application/json" },
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(payload?.error || `Upload failed with status ${response.status}`);
  return (payload as { material: CourseMaterial }).material;
}

export async function deleteCourseMaterial(id: number) {
  return bridgeRequest<{ ok: boolean }>(`/materials?id=${id}`, { method: "DELETE" });
}

export function courseMaterialDownloadUrl(id: number) {
  return `${API_BASE}/materials/download?id=${id}`;
}

/**
 * Downloads a material through fetch so the JWT can be sent as an Authorization
 * header, then triggers a browser save via a blob URL.
 */
export async function downloadCourseMaterial(material: CourseMaterial) {
  const token = getBridgeToken();
  const response = await fetch(courseMaterialDownloadUrl(material.id), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Download failed with status ${response.status}`);
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = material.original_name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
