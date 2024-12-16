export type CollaboratorRole = "editor" | "viewer";
export type CollaboratorStatus = "pending" | "accepted";

export interface Collaborator {
  id: number;
  formId: number;
  userId: string;
  email: string;
  role: CollaboratorRole;
  status: CollaboratorStatus;
  addedBy: string;
  addedAt: string;
  acceptedAt: string | null;
}

export interface CollaboratorInvitation {
  email: string;
  role: CollaboratorRole;
}
