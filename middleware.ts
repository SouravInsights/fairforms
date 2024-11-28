import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/", // Landing page
  "/forms/(.*)/(public|submit)", // Public form access and submission
  "/api/forms/(.*)/(public|submit)", // Public form API routes
  "/sign-in*",
  "/sign-up*",
  // Add any other public routes your app needs
]);

export default clerkMiddleware(async (auth, request) => {
  // If it's a public route, allow access
  if (isPublicRoute(request)) {
    return;
  }

  // Protect all other routes
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
