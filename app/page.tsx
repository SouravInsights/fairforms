import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FairFormsLanding from "./components/landing/FairFormLandingContent";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return <FairFormsLanding />;
}
