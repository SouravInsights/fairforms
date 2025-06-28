/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center">
              <FileQuestion className="w-16 h-16 text-slate-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">!</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">404</h1>
          <h2 className="text-xl font-semibold text-slate-700">
            Oops! Page not found
          </h2>
          <p className="text-slate-600 leading-relaxed">
            The page you're looking for doesn't exist or might have been moved.
            This could happen if the form is unpublished or the URL is
            incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button asChild className="w-full" size="lg">
            <Link href="/dashboard">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full" size="lg">
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Need help?{" "}
            <Link
              href="mailto:fairformsxyz@gmail.com"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
