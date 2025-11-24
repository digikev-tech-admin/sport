"use client";

import {
  Heart,
  Users,
  // Eye,
  // UserRoundPlus,
  Calendar,
  Package,
  UsersRound,
  Trophy,
  MapPin,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Coach, MetricCardProps } from "@/types/types";
import AdminPieChart from "@/components/dashboard/PieChart";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { RootState } from "@/redux/store";
import { useCallback, useEffect, useMemo, useState } from "react";
// import { fetchUsers } from "@/redux/features/userSlice";
import { getAllEvents } from "@/api/event";
import Link from "next/link";
import { getAllCoaches } from "@/api/coach";
import { getAllPackages } from "@/api/package";
import { formatDateTime } from "@/lib/utils";
import { getAllUsers } from "@/api/user/user";
import UserPieChart from "@/components/dashboard/UserPieChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

interface Event {
  id: string;
  title: string;
  location: string;
  sport: string;
  interested: number;
}

interface Package {
  id: string;
  sport: string;
  startDate: string;
  duration: string;
  price: number;
  clubs: string;
}

type StatusFilter = "all" | "active" | "inactive";
type DateFilterOption =
  | "all"
  | "today"
  | "thisWeek"
  | "thisMonth"
  | "thisYear"
  | "custom";

interface CustomDateRange {
  start: string;
  end: string;
}

interface DateBoundary {
  start?: Date;
  end?: Date;
}

const ACTIVE_STATUS_MATCHERS = ["active", "published", "enabled", "approved"];
const INACTIVE_STATUS_MATCHERS = [
  "inactive",
  "disabled",
  "blocked",
  "archived",
  "draft",
];
const WEEK_OPTIONS = { weekStartsOn: 1 as 0 | 1 | 2 | 3 | 4 | 5 | 6 };
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const normalizeArrayResponse = (payload: any): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data;
  }

  return [];
};

const resolveEntityStatus = (entity: any) => {
  if (typeof entity?.isActive === "boolean") {
    return entity.isActive;
  }

  if (typeof entity?.status === "boolean") {
    return entity.status;
  }

  if (typeof entity?.status === "string") {
    const normalizedStatus = entity.status.toLowerCase();
    if (ACTIVE_STATUS_MATCHERS.includes(normalizedStatus)) {
      return true;
    }
    if (INACTIVE_STATUS_MATCHERS.includes(normalizedStatus)) {
      return false;
    }
  }

  return true;
};

const resolveEntityDate = (entity: any) => {
  const candidateDate =
    entity?.createdAt ||
    entity?.created_at ||
    entity?.createdDate ||
    entity?.date ||
    entity?.lastLogin ||
    entity?.fromDate ||
    entity?.startDate ||
    entity?.sessionDates?.[0] ||
    entity?.toDate ||
    entity?.updatedAt;
  if (!candidateDate) {
    return null;
  }

  const parsedDate = new Date(candidateDate);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const parseDateValue = (value: any) => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isUserActiveByLastLogin = (user: any) => {
  const lastLogin = user?.lastLogin;

  if (lastLogin) {
    const loginDate = new Date(lastLogin);
    if (!Number.isNaN(loginDate.getTime())) {
      return Date.now() - loginDate.getTime() <= THIRTY_DAYS_MS;
    }
  }

  return resolveEntityStatus(user);
};

const isPackageActiveBySessions = (pkg: any) => {
  const now = new Date();
  const sessionDates = Array.isArray(pkg?.sessionDates) ? pkg.sessionDates : [];

  const candidateDates = [
    ...sessionDates,
    pkg?.startDate,
    pkg?.fromDate,
    pkg?.date,
  ]
    .map(parseDateValue)
    .filter((date): date is Date => Boolean(date));

  if (!candidateDates.length) {
    return resolveEntityStatus(pkg);
  }

  return candidateDates.some((date) => date >= now);
};

const isEventActiveByRange = (event: any) => {
  const now = new Date();
  const startDate =
    parseDateValue(event?.fromDate) ??
    parseDateValue(event?.startDate) ??
    parseDateValue(event?.date);
  const endDate =
    parseDateValue(event?.toDate) ??
    parseDateValue(event?.endDate) ??
    startDate;

  if (!startDate && !endDate) {
    return resolveEntityStatus(event);
  }

  const boundaryEnd = endDate ?? startDate;

  return boundaryEnd ? boundaryEnd >= now : resolveEntityStatus(event);
};

// Dummy data
// const topViewedCategories = [
//   { name: "Circulatory System", modules: 10, quizzes: 5, students: 15 },
//   { name: "Circulatory System", modules: 8, quizzes: 4, students: 12 },
//   { name: "Circulatory System", modules: 6, quizzes: 3, students: 10 },
// ];

// const topRatedModules = [
//   { name: "Circulatory System A-Z", rating: 4.8, students: 120, reviews: 45 },
//   { name: "Circulatory System A-Z", rating: 4.4, students: 98, reviews: 32 },
//   { name: "Circulatory System A-Z", rating: 4.2, students: 85, reviews: 28 },
// ];

// const topAnatomy = [
//   { name: "Circulatory System", views: 1200 },
//   { name: "Circulatory System", views: 980 },
//   { name: "Circulatory System", views: 850 },
//   { name: "Circulatory System", views: 800 },
//   { name: "Circulatory System", views: 840 },
// ];

// const mostAttemptedQuizzes = [
//   { name: "Circulatory System Chapter 1", attempts: 450 },
//   { name: "Circulatory System Chapter 1", attempts: 380 },
//   { name: "Circulatory System Chapter 1", attempts: 320 },
// ];

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

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [packagesData, setPackagesData] = useState<any[]>([]);
  const [coachesData, setCoachesData] = useState<any[]>([]);
  const [userLastLogin, setUserLastLogin] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("all");
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange>({
    start: "",
    end: "",
  });
  const { start: customStartDate, end: customEndDate } = customDateRange;

  const metricDateRange = useMemo<DateBoundary | null>(() => {
    const now = new Date();

    switch (dateFilter) {
      case "today":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "thisWeek":
        return {
          start: startOfWeek(now, WEEK_OPTIONS),
          end: endOfWeek(now, WEEK_OPTIONS),
        };
      case "thisMonth":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "thisYear":
        return { start: startOfYear(now), end: endOfYear(now) };
      case "custom": {
        const parsedStart = customStartDate ? new Date(customStartDate) : null;
        const parsedEnd = customEndDate ? new Date(customEndDate) : null;
        const start =
          parsedStart && !Number.isNaN(parsedStart.getTime())
            ? startOfDay(parsedStart)
            : undefined;
        const end =
          parsedEnd && !Number.isNaN(parsedEnd.getTime())
            ? endOfDay(parsedEnd)
            : undefined;

        if (!start && !end) {
          return null;
        }

        return { start, end };
      }
      default:
        return null;
    }
  }, [customStartDate, customEndDate, dateFilter]);

  const getFilteredCount = useCallback(
    (items: any[], statusResolver?: (item: any) => boolean) => {
      if (!items?.length) {
        return 0;
      }

      return items.reduce((count: number, item: any) => {
        const entityStatus = statusResolver
          ? statusResolver(item)
          : resolveEntityStatus(item);

        if (
          (statusFilter === "active" && !entityStatus) ||
          (statusFilter === "inactive" && entityStatus)
        ) {
          return count;
        }

        if (!metricDateRange) {
          return count + 1;
        }

        const entityDate = resolveEntityDate(item);

        if (!entityDate) {
          return count;
        }

        if (
          (metricDateRange.start && entityDate < metricDateRange.start) ||
          (metricDateRange.end && entityDate > metricDateRange.end)
        ) {
          return count;
        }

        return count + 1;
      }, 0);
    },
    [metricDateRange, statusFilter]
  );

  const getStatusBreakdown = useCallback(
    (items: any[], statusResolver: (item: any) => boolean) => {
      if (!items?.length) {
        return { active: 0, inactive: 0 };
      }

      return items.reduce(
        (acc: { active: number; inactive: number }, item: any) => {
          const entityStatus = statusResolver(item);

          if (
            (statusFilter === "active" && !entityStatus) ||
            (statusFilter === "inactive" && entityStatus)
          ) {
            return acc;
          }

          if (metricDateRange) {
            const entityDate = resolveEntityDate(item);
            if (
              !entityDate ||
              (metricDateRange.start && entityDate < metricDateRange.start) ||
              (metricDateRange.end && entityDate > metricDateRange.end)
            ) {
              return acc;
            }
          }

          if (entityStatus) {
            acc.active += 1;
          } else {
            acc.inactive += 1;
          }

          return acc;
        },
        { active: 0, inactive: 0 }
      );
    },
    [metricDateRange, statusFilter]
  );

  const filteredCounts = useMemo(
    () => ({
      users: getFilteredCount(usersData, isUserActiveByLastLogin),
      events: getFilteredCount(eventsData, isEventActiveByRange),
      packages: getFilteredCount(packagesData, isPackageActiveBySessions),
      coaches: getFilteredCount(coachesData),
    }),
    [coachesData, eventsData, getFilteredCount, packagesData, usersData]
  );

  const filteredUserLastLogins = useMemo(() => {
    if (!usersData.length) {
      return userLastLogin;
    }

    return usersData.reduce((acc: string[], user: any) => {
      const entityStatus = isUserActiveByLastLogin(user);

      if (
        (statusFilter === "active" && !entityStatus) ||
        (statusFilter === "inactive" && entityStatus)
      ) {
        return acc;
      }

      if (metricDateRange) {
        const entityDate = resolveEntityDate(user);
        if (
          !entityDate ||
          (metricDateRange.start && entityDate < metricDateRange.start) ||
          (metricDateRange.end && entityDate > metricDateRange.end)
        ) {
          return acc;
        }
      }

      if (user?.lastLogin) {
        acc.push(user.lastLogin);
      }

      return acc;
    }, []);
  }, [metricDateRange, statusFilter, userLastLogin, usersData]);

  const eventStatusBreakdown = useMemo(
    () => getStatusBreakdown(eventsData, isEventActiveByRange),
    [eventsData, getStatusBreakdown]
  );

  const packageStatusBreakdown = useMemo(
    () => getStatusBreakdown(packagesData, isPackageActiveBySessions),
    [getStatusBreakdown, packagesData]
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await getAllUsers();
        const userRecords = normalizeArrayResponse(usersResponse);
        setUsersData(userRecords);
        const lastLogin = userRecords
          .map((user: any) => user?.lastLogin)
          .filter((date: string | undefined | null): date is string =>
            Boolean(date)
          );
        setUserLastLogin(lastLogin);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsResponse = await getAllEvents();
        // console.log({ eventsResponse });
        const normalizedEvents = normalizeArrayResponse(eventsResponse);
        setEventsData(normalizedEvents);
        const formattedEvents = normalizedEvents
          .map((event: any) => ({
            id: event?._id,
            title: event?.title,
            location: event?.locationId ? event?.locationId?.title : "N/A",
            sport: event?.sport,
            interested: event?.enrolledCount,
          }))
          .sort(
            (a: { interested: number }, b: { interested: number }) =>
              b?.interested - a?.interested
          ) // Sort by enrolledCount in descending order
          .slice(0, 5); // Take only top 5 events
        setEvents(formattedEvents);
      } catch (error) {
        console.error("err", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const packagesResponse = await getAllPackages();
        // console.log({ packagesResponse });
        const normalizedPackages = normalizeArrayResponse(packagesResponse);
        setPackagesData(normalizedPackages);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today

        const formattedPackages = normalizedPackages
          .map((item: any) => ({
            id: item?._id || item?.id,
            sport: item?.sport || "N/A",
            startDate: item?.sessionDates?.[0] || "N/A",
            duration: item?.duration || "N/A",
            price: item?.price?.base || "N/A",
            clubs: item?.locationId ? item?.locationId?.title : "N/A",
          }))
          .filter(
            (pkg: { startDate: string }) => new Date(pkg.startDate) >= today
          ) // Filter out past dates
          .sort(
            (a: { startDate: string }, b: { startDate: string }) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          ) // Sort by startDate ascending (today to future)
          .slice(0, 5); // Take only top 5 packages
        setPackages(formattedPackages);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const coachesResponse = await getAllCoaches();
        const normalizedCoaches = normalizeArrayResponse(coachesResponse);
        setCoachesData(normalizedCoaches);
        const formattedCoaches = normalizedCoaches
          .map((coach: any) => ({
            id: coach?._id,
            name: coach?.name,
            imageUrl: coach?.image,
            sports: coach?.sports,
            clubs: coach?.locationIds
              ? coach?.locationIds?.map((location: any) => location?.title)
              : [],
            specializations: coach?.specializations || [],
            isFavorite: coach?.isFavorite ?? false,
            rating: 3,
            // averageRating: coach.averageRating,
            reviews: 20,
          }))
          .sort(
            (a: { rating: number }, b: { rating: number }) =>
              b.rating - a.rating
          ) // Sort by rating in descending order
          .slice(0, 5); // Take only top 3 coaches
        // console.log(formattedCoaches);
        setCoaches(formattedCoaches);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };
    fetchCoaches();
  }, []);

  return (
    <div className=" min-h-screen bg-gray-50 p-2 sm:p-4 xl:p-8">
      <motion.h1
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h1>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="status-filter"
              className="text-sm font-semibold text-gray-600"
            >
              Status filter
            </Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger id="status-filter" className="bg-gray-50">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="date-filter"
              className="text-sm font-semibold text-gray-600"
            >
              Date range
            </Label>
            <Select
              value={dateFilter}
              onValueChange={(value) =>
                setDateFilter(value as DateFilterOption)
              }
            >
              <SelectTrigger id="date-filter" className="bg-gray-50">
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisWeek">This week</SelectItem>
                <SelectItem value="thisMonth">This month</SelectItem>
                <SelectItem value="thisYear">This year</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {dateFilter === "custom" && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="custom-start"
                className="text-sm font-semibold text-gray-600"
              >
                Start date
              </Label>
              <Input
                id="custom-start"
                type="date"
                value={customStartDate}
                onChange={(event) =>
                  setCustomDateRange((prev) => ({
                    ...prev,
                    start: event.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="custom-end"
                className="text-sm font-semibold text-gray-600"
              >
                End date
              </Label>
              <Input
                id="custom-end"
                type="date"
                value={customEndDate}
                onChange={(event) =>
                  setCustomDateRange((prev) => ({
                    ...prev,
                    end: event.target.value,
                  }))
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Metrics Cards */}
      <motion.div
        className="grid  grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: "Total Users",
            value: filteredCounts.users,
            icon: <Users className="h-5 w-5 text-[#742193]" />,
          },
          {
            title: "Total Events",
            value: filteredCounts.events,
            icon: <Calendar className="h-5 w-5 text-[#742193]" />,
          },
          {
            title: "Total Packages",
            value: filteredCounts.packages,
            icon: <Package className="h-5 w-5 text-[#742193]" />,
          },
          {
            title: "Total Coaches",
            value: filteredCounts.coaches,
            icon: <UsersRound className="h-5 w-5 text-[#742193]" />,
          },
        ].map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </motion.div>

      <motion.div
        className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionCard className="p-6" variants={cardVariants} whileHover="hover">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl">Users</h2>
            <h2 className="font-bold text-xl">
              Total Users : {filteredCounts.users}
            </h2>
          </div>
          <motion.div className="flex justify-center items-center">
            <UserPieChart userLastLogin={filteredUserLastLogins} />
          </motion.div>
        </MotionCard>
        <MotionCard className="p-6" variants={cardVariants} whileHover="hover">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl">Coach Performance</h2>
            <h2 className="font-bold text-xl">
              Total Coaches : {filteredCounts.coaches}
            </h2>
          </div>
          <motion.div className="flex justify-center items-center -mt-7 ">
            {/* <div className="flex justify-center items-center  bg-gray-100"> */}
            <AdminPieChart data={coaches} />
            {/* </div> */}
          </motion.div>
        </MotionCard>

        {/* <MotionCard className="p-6" variants={cardVariants} whileHover="hover">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl">Top Interested Events</h2>
            <Link href="/events" className="text-sm text-[#742193]">
              See all
            </Link>
          </div>
          <motion.div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#742193]">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{event.title}</h3>
                    <span className="flex items-center gap-1 font-semibold">
                      {" "}
                      <span className="text-[#742193]">
                        <Trophy className="w-4 h-4" />
                      </span>
                      {event.sport}
                    </span>
                  </div>
                  <div className="flex space-x-4  mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      {" "}
                      <MapPin className="w-4 h-4" /> {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      {" "}
                      <Heart className="w-4 h-4 text-red-500" />{" "}
                      {event.interested} Interested
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </MotionCard> */}

        {/* <MotionCard className="p-6" variants={cardVariants} whileHover="hover">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold  text-xl">Top New Packages</h2>
            <Link href="/packages" className="text-sm text-[#742193]">
              See all
            </Link>
          </div>
          <div className="space-y-4">
            {packages.map((pack, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#742193]">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{pack.sport}</h3>

                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-500 fill-current" />
                      <span className="ml-1 text-sm font-semibold">
                        {pack.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500  mt-2">
                      <span className="font-bold">Start Date:</span>{" "}
                      {formatDateTime(pack.startDate)} •{" "}
                      <span className="font-bold">Duration:</span>{" "}
                      {pack.duration} months
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MotionCard> */}
      </motion.div>

      <motion.div
        className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionCard className="p-6" variants={cardVariants} whileHover="hover">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl">Event Status</h2>
            <span className="text-sm text-gray-600">
              Total: {filteredCounts.events}
            </span>
          </div>
          <motion.div className="flex justify-center items-center">
            <UserPieChart statusBreakdown={eventStatusBreakdown} />
          </motion.div>
        </MotionCard>

        <MotionCard className="p-6" variants={cardVariants} whileHover="hover">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl">Package Status</h2>
            <span className="text-sm text-gray-600">
              Total: {filteredCounts.packages}
            </span>
          </div>
          <motion.div className="flex justify-center items-center">
            <UserPieChart statusBreakdown={packageStatusBreakdown} />
          </motion.div>
        </MotionCard>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        className="grid grid-cols-1mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MotionCard className="p-4" variants={cardVariants} whileHover="hover">
          <RevenueChart />
        </MotionCard>
        {/* <MotionCard className="p-6" variants={cardVariants} whileHover="hover">
          <h2 className="font-bold text-xl">Quizzes</h2>
          <motion.div className="space-y-4 ">
         
              <div className="  flex   items-center   ">
              <h2 className="flex flex-col font-semibold gap-3 items-center">Total Quizzes <span>100</span></h2>
                <div className="">
                  <AdminPieChart />
                </div>
                
              </div>
          </motion.div>

          
          <div className=" flex  justify-between">
                   <p className="text-purple-700">Pre Added: 340</p>
                  <p className="text-yellow-600">AI Generated: 4500</p>
                </div> 
        </MotionCard>{" "} */}

        {/* <MotionCard className="p-6" variants={cardVariants} whileHover="hover">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Top Rated Coaches</h2>
            <Link href="/coaches" className="text-sm text-[#742193]">
              See all
            </Link>
          </div>
          <div className="space-y-4">
            {coaches.map((coach, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#742193]">
                  {index + 1}
                </div>
                <Image
                  src={coach.imageUrl || "/images/Heart.png"}
                  alt={coach.name}
                  width={48}
                  height={48}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{coach.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm">{coach.rating}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-bold">Clubs:</span> {coach.clubs} •{" "}
                    <span className="font-bold">Reviews:</span> {coach.reviews}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </MotionCard> */}
      </motion.div>

      {/* Most Attempted Quizzes */}
      {/* <MotionCard
        className="p-6"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Most Attempted Quizzes</h2>
          <button className="text-sm text-[#742193]">See all</button>
        </div>
        <div className="space-y-4">
          {mostAttemptedQuizzes.map((quiz, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full mt-4 bg-purple-100 flex items-center justify-center text-[#742193]">
                {index + 1}
              </div>
              <Image
                src="/images/module.png"
                alt={quiz.name}
                width={100}
                height={100}
                className="rounded-md object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{quiz.name}</h3>
                    <span className="text-sm text-gray-500  mt-2">
                      10 Question • 35 min
                    </span>
                  </div>
                  <button className="text-sm text-[#742193] hover:underline flex justify-center items-center gap-1">
                    <span>
                      <Eye className="text-[#742193] h-4 w-4" />
                    </span>{" "}
                    View
                  </button>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {quiz.attempts} Attempts
                </div>
              </div>
            </div>
          ))}
        </div>
      </MotionCard> */}
    </div>
  );
}

function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <MotionCard className="p-2" variants={cardVariants} whileHover="hover">
      <motion.div
        className="flex flex-col justify-between "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between ">
          <p className="text-xl font-bold">{title}</p>
          <motion.div
            className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center border border-[#742193]"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
        </div>
        <div>
          <motion.h3
            className="text-lg font-bold "
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

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
