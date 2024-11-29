export interface Waitlist {
  id: number;
  email: string;
  referralCode: string;
  position: number;
  referredBy: string | null;
  createdAt: Date;
}

export type CreateWaitlistEntry = Omit<Waitlist, "id" | "createdAt">;
