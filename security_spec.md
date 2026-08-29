# Firebase Security Specification — PYECSO Website

## 1. Data Invariants
1. **Public Content (`content_items`)**:
   - Anyone may read published CMS items (`status == "published"`).
   - Only authenticated users with administrative or content roles may create, update, or delete content items.
   - All text fields must be bounded by strict size limits (`title <= 500`, `slug <= 256`, etc.).

2. **Public Inquiries & Intake (`contact_messages`, `applications`)**:
   - Unauthenticated/Public visitors may submit contact messages and job/program applications.
   - Submissions must contain valid non-empty fields, valid emails, and strictly enforced character limits.
   - Read, update, and delete access is restricted exclusively to authenticated administrative staff.

3. **User Profiles & Role Permissions (`users`, `user_roles`)**:
   - Users may only read and edit their own profile (`users/{userId}` where `userId == request.auth.uid`).
   - Role assignments in `user_roles` can only be read or modified by verified administrators. Users cannot grant or escalate their own roles.

4. **Site Settings (`site_settings`)**:
   - Public visitors may read general site settings (branding, public contact, donation preset values).
   - Only verified administrators may write or modify settings documents.

5. **Audit Logs (`audit_logs`)**:
   - Append-only or admin-restricted logs. No updates or deletions allowed to ensure audit trail immutability.

---

## 2. The Dirty Dozen Attack Payloads (Must Return PERMISSION_DENIED)

1. **Privilege Escalation in Profile**:
   `{ "id": "victim123", "email": "user@test.com", "role": "super_admin", "isAdmin": true }` -> Rejected (users cannot grant themselves super_admin).
2. **Ghost Field Injection in Content Item**:
   `{ "id": "item1", "type": "news", "status": "published", "extraBackdoor": "<script>..." }` -> Rejected via strict key validation.
3. **Identity Spoofing on Application Submission**:
   Authenticated user A trying to read or delete Application of user B -> Rejected.
4. **Massive Denial-of-Wallet Payload**:
   Contact message with a 10MB message string -> Rejected (maximum size 5,000 characters).
5. **ID Poisoning Attack**:
   Document creation targeting `/content_items/../../system_config` with junk ID characters -> Rejected via `isValidId()`.
6. **Unauthorized Update to Contact Messages**:
   Unauthenticated actor attempting to mark a message as `status: "replied"` -> Rejected.
7. **Direct Mutation of System Audit Log**:
   Actor attempting to `UPDATE` or `DELETE` an existing document in `/audit_logs/{logId}` -> Rejected.
8. **Unverified Admin Role Spoofing**:
   User attempting to modify `/site_settings/branding` without admin existence check -> Rejected.
9. **Tampering with Immutable Timestamps**:
   Actor attempting to alter `createdAt` on an existing content item -> Rejected (`incoming().createdAt == existing().createdAt`).
10. **State Shortcutting on Applications**:
    Anonymous actor attempting to update `status` from `new` to `accepted` -> Rejected.
11. **Malicious Regex Bypass in Path Variables**:
    Path variable with invalid UTF-8 or path traversal chars -> Rejected.
12. **Blanket Collection Scraping**:
    Client executing unbounded queries on `/applications` or `/contact_messages` without authentication -> Rejected.
