"use client";

import { Users, ClockArrowUp, Landmark, Package } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { MetricCardProps } from "@/types/types";
import UserPieChart from "@/components/dashboard/UserPieChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import SubscribersChart from "@/components/dashboard/SubscribersChart";
import TopCountriesChart from "@/components/dashboard/TopCountriesChart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/api/user/user";
import { getUserStats } from "@/api/chartData";
import { getAllPackages } from "@/api/package";
import PackageChart from "@/components/dashboard/PackageChart";
// Dummy data

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const MotionCard = motion(Card);

export default function Page() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [userLastLogin, setUserLastLogin] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);









  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getAllPackages();
        setPackages(response);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUserData(users?.data);

        setTotalUsers(users?.data?.length || 0);
        const lastLogin = users?.data?.map((user: any) => user?.lastLogin);
        setUserLastLogin(lastLogin || 0);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);



  useEffect(() => {
    const fetchUserOrderData = async () => {
      try {
        const stats  = await getUserStats();
        console.log({stats})
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };
    fetchUserOrderData(); 
  }, []);

  return (
    <div className=" min-h-screen bg-gray-50 p-2 sm:p-4 xl:p-8">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Analytics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <motion.h1
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Analytics
      </motion.h1>

      {/* Metrics Cards */}
      <motion.div
        className="grid grid-cols-2 gap-3 xl:gap-10 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: "Total Users",
            value: totalUsers,
            icon: <Users className="h-5 w-5 text-[#742193]" />,
          },
          // {
          //   title: "Total Hours",
          //   value: "100",
          //   icon: <ClockArrowUp className="h-5 w-5 text-[#742193]" />,
          // },
          {
            title: "Total Revenue",
            value: "100",
            icon: <Landmark className="h-5 w-5 text-[#742193]" />,
          },
        ].map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </motion.div>

      {/* Middle Section */}
      <motion.div
        className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionCard className="p-6" variants={cardVariants} whileHover="hover">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl">Users</h2>
            <h2 className="font-bold text-xl">Total Users : {totalUsers}</h2>
          </div>
          <motion.div className="flex justify-center items-center">
            <UserPieChart userLastLogin={userLastLogin} />
          </motion.div>
        </MotionCard>

        <MotionCard className="p-4" variants={cardVariants} whileHover="hover">
          <RevenueChart />
        </MotionCard>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionCard className="p-4 " variants={cardVariants} whileHover="hover">
          <TopCountriesChart userData={userData} />
          <motion.div
            className="relative w-48 h-4 mx-auto"
            initial={{ rotate: -90 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.div>
        </MotionCard>

        <MotionCard className=" p-4" variants={cardVariants} whileHover="hover">
          <SubscribersChart packages={packages}  />
        </MotionCard>
      </motion.div>
      <motion.div
        className="grid grid-cols-1  gap-6 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionCard className="p-4 " variants={cardVariants} whileHover="hover">
          <PackageChart packages={packages}  />
          <motion.div
            className="relative w-48 h-4 mx-auto"
            initial={{ rotate: -90 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.div>
        </MotionCard>
      </motion.div>
    </div>
  );
}

function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <MotionCard className="p-4" variants={cardVariants} whileHover="hover">
      <motion.div
        className="flex flex-col justify-between "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between ">
          <p className="text-xl font-bold">{title}</p>
          <motion.div
            className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center border border-[#742193]"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
        </div>
        <div>
          <motion.h3
            className="text-2xl font-bold "
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
          >
            {value}
          </motion.h3>
        </div>
      </motion.div>
    </MotionCard>
  );
}
