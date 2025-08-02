'use client'
import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";


const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] p-4">
      <div className="w-full max-w-2xl text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8 border border-gray-100 backdrop-blur-sm">
          {/* 404 Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-[#742193] to-[#57176e] rounded-full flex items-center justify-center">
                <Search className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">4</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">4</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#742193] hover:bg-[#57176e] text-white rounded-md font-medium transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md font-medium transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>

          {/* Additional Help */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team or check our{" "}
              <Link href="/help" className="text-[#742193] hover:text-[#57176e] font-medium">
                help center
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default NotFound;