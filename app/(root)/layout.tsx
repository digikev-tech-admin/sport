import AuthMiddleware from "@/components/AuthMiddleware";
import { Sidebar } from "@/components/Sidebar";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
    <AuthMiddleware>
       <div className="flex-1 flex">
       <Sidebar/>
       <div className=" h-[calc(100vh-3.5rem)] flex-1 overflow-x-auto">
       {children}
       </div>
    </div>
    </AuthMiddleware>
  );
}
