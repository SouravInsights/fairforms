import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Welcome to MyForms</h1>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          Create beautiful forms with our simple and powerful form builder.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SignInButton mode="modal">
          <Button variant="outline" size="lg">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button size="lg">Get Started</Button>
        </SignUpButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Easy to Use</h2>
          <p className="text-muted-foreground">
            Drag and drop elements to create your perfect form in minutes.
          </p>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Powerful Features</h2>
          <p className="text-muted-foreground">
            From simple contact forms to complex surveys, we&apos;ve got you
            covered.
          </p>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Real-time Responses</h2>
          <p className="text-muted-foreground">
            Collect and analyze responses as they come in.
          </p>
        </div>
      </div>
    </div>
  );
}
