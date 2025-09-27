"use client";
import Image from "next/image";
import React from "react";
import { LogOut } from "lucide-react";
import { getToken, removeAdminData, removeToken } from "@/config/token";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const Navbar = () => {
  const router = useRouter();
  const token = getToken();

  const logoutHandler = () => {
    removeToken();
    removeAdminData();
    toast.success("Logout successfully");
    router.push("/");
  };
  return (
    <>
      <nav className="w-full bg-[#7421931A]  h-16 flex  ">
        <div className=" w-full h-full flex justify-end md:justify-between items-center px-[50px] ">
          <div className="flex justify-center items-center gap-2">
            <div>
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            <h2 className="text-[#742193] text-[17.06px] font-semibold leading-[14.62px]">
              Sports & Fitness
            </h2>
          </div>
          <div className="hidden md:flex justify-center items-center gap-6 ">
            {/* <Settings /> */}
            {token && (
              <Button
                variant="outline"
                type="button"
                onClick={logoutHandler}
                className="flex items-center gap-2 border-none bg-[#742193] text-white hover:bg-[#5e176e] hover:text-white"
              >
                <LogOut size={20} className="text-white" />
                <span className="font-sm font-semibold">Logout</span>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
