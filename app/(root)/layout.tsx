"use client";

import AuthMiddleware from "@/components/AuthMiddleware";
import { Sidebar } from "@/components/Sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LayoutProvider, useLayout } from "@/contexts/LayoutContext";

function DashboardLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isMobileMenuOpen, isMobile, toggleMobileMenu, closeMobileMenu } = useLayout();

  return (
    <AuthMiddleware>
      <div className="flex-1 flex relative">
        {/* Mobile Hamburger Button */}
        {isMobile && (
          <Button
            variant="outline"
            size="icon"
             className="fixed top-3 left-4 z-50 bg-white shadow-md"
            // className="fixed top-3 right-4 z-50 bg-white shadow-md"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        )}

        {/* Mobile Overlay */}
        {isMobile && isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar */}
        <div className={`
          ${isMobile 
            ? `fixed top-0 left-0 z-50 h-full transform transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                //  ? `fixed top-0 right-0 z-50 h-full transform transition-transform duration-300 ease-in-out ${
                // isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }` 
            : 'relative'
          }
        `}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-x-auto">
          {children}
        </div>
      </div>
    </AuthMiddleware>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutProvider>
      <DashboardLayoutContent>
        {children}
      </DashboardLayoutContent>
    </LayoutProvider>
  );
}
