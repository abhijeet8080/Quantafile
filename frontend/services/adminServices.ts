// services/adminService.ts
import { api } from "@/lib/axios";

// ========== USER MANAGEMENT ==========

export async function getAllUsers(token: string | null) {
  return await api.get("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function banUser(userId: string, token: string | null) {
  return await api.put(
    `/admin/users/${userId}/ban`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function unbanUser(userId: string, token: string | null) {
  return await api.put(
    `/admin/users/${userId}/unban`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function changeUserRole(
  userId: string,
  role: "user" | "moderator" | "admin",
  token: string | null
) {
  return await api.put(
    `/admin/users/${userId}/role`,
    { role },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

// ========== QUESTION MANAGEMENT ==========
// No getAllQuestions — backend route not defined!
export async function deleteQuestionAdmin(
  questionId: string,
  reason: string,
  token: string | null
) {
  return await api.delete(`/admin/questions/${questionId}`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { reason },
  });
}

export async function toggleQuestionStatus(
  questionId: string,
  status: string,
  token: string | null
) {
  return await api.put(
    `/admin/questions/${questionId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

// ========== ANSWER MANAGEMENT ==========
// No getAllAnswers — backend route not defined!
export async function deleteAnswerAdmin(
  answerId: string,
  reason: string,
  token: string | null
) {
  return await api.delete(`/admin/answers/${answerId}`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { reason },
  });
}

// ========== TAG MANAGEMENT ==========

export interface TagData {
  name: string;
  description?: string;
}

export async function createTag(tag: TagData, token: string | null) {
  return await api.post("/admin/tags", tag, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateTag(
  tagId: string,
  tag: TagData,
  token: string | null
) {
  return await api.put(`/admin/tags/${tagId}`, tag, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteTag(tagId: string, token: string | null) {
  return await api.delete(`/admin/tags/${tagId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ========== LOG MANAGEMENT ==========

export async function getAdminLogs(token: string | null) {
  return await api.get("/admin/logs", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
