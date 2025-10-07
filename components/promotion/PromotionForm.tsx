'use client'

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Link2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getAllEvents } from "@/api/event";
import { Event } from "@/app/(root)/events/page";
import EventSelectModal from "./EventSelectModal";
import PackageSelectModal from "./PackageSelectModal";
import { getAllPackages } from "@/api/package";
import { Package } from "@/types/types";
import { createPromotion, getPromotionById, updatePromotion } from "@/api/promotion";

type DiscountType = "percentage" | "flatAmount";

const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // avoid ambiguous chars
  let code = "";
  for (let i = 0; i < 12; i += 1) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

const oneHourFromNowLocalISODate = () => {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  return d.toISOString().split("T")[0];
};

const oneHourFromNowLocalISOTime = () => {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  return d.toTimeString().slice(0, 5); // HH:MM
};

const PromotionForm = ( {id, isEditing, setIsEditing}: {id: string, isEditing: boolean, setIsEditing?: (isEditing: boolean) => void} ) => {
  const router = useRouter();
// console.log({id, isEditing, setIsEditing});


  const [loading, setLoading] = useState(false);
  const readOnly = !isEditing;

  // UI state mapped to existing coupon API fields
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");
  const [discountValue, setDiscountValue] = useState<number | "">("");

  const [limitUsersUnlimited, setLimitUsersUnlimited] = useState(true);
  const [userLimit, setUserLimit] = useState<number | "">("");

  const [repeatUnlimited, setRepeatUnlimited] = useState(false);
  const [repeatLimit, setRepeatLimit] = useState<number>(1);

  const [expiryDate, setExpiryDate] = useState(oneHourFromNowLocalISODate());
  const [expiryTime, setExpiryTime] = useState(oneHourFromNowLocalISOTime());
  const [timeZone, setTimeZone] = useState<'Europe/London'>('Europe/London');
  const [allowedModule, setAllowedModule] = useState<'event' | 'package'>('event');
  const [events, setEvents] = useState<Event[]>([]);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  // modal UI internal state lives inside EventSelectModal
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  // modal UI internal state lives inside PackageSelectModal
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);


  const validUntil: Date | undefined = useMemo(() => {
    if (!expiryDate || !expiryTime) return undefined;
    const [hh, mm] = expiryTime.split(":");
    const year = Number(expiryDate.slice(0, 4));
    const month = Number(expiryDate.slice(5, 7));
    const day = Number(expiryDate.slice(8, 10));
    // Create a UTC instant from the desired London wall time using the zone's offset (BST/GMT)
    const testUtc = new Date(Date.UTC(year, month - 1, day, Number(hh), Number(mm), 0));
    const tzName = new Intl.DateTimeFormat('en-GB', { timeZone: timeZone, timeZoneName: 'short' }).format(testUtc);
    const offsetMinutes = tzName.includes('BST') ? 60 : 0; // Europe/London: BST=UTC+1, GMT=UTC+0
    const utcMs = Date.UTC(year, month - 1, day, Number(hh), Number(mm), 0) - offsetMinutes * 60 * 1000;
    return new Date(utcMs);
  }, [expiryDate, expiryTime, timeZone]);


//   const reset = () => {
//     setCode("");
//     setDiscountType("percentage");
//     setDiscountValue("");
//     setLimitUsersUnlimited(true);
//     setUserLimit("");
//     setRepeatUnlimited(false);
//     setRepeatLimit(1);
//     setExpiryDate(oneHourFromNowLocalISODate());
//     setExpiryTime(oneHourFromNowLocalISOTime());
//   };

  const validate = () => {
    const trimmed = code.trim();
    if (!trimmed) return toast.error("Coupon code is required"), false;
    if (trimmed.length < 4 || trimmed.length > 12)
      return toast.error("Code must be 4-12 characters"), false;

    const amount = Number(discountValue);
    if (discountType === "percentage") {
      if (Number.isNaN(amount) || amount <= 0 || amount > 100)
        return toast.error("Enter percentage between 1 and 100"), false;
    } else {
      if (Number.isNaN(amount) || amount <= 0)
        return toast.error("Enter a positive amount in £"), false;
    }

    if (!repeatUnlimited && (repeatLimit as number) < 1)
      return toast.error("Repeat usage must be at least 1"), false;

    if (validUntil && validUntil.getTime() < Date.now() + 60 * 60 * 1000)
      return toast.error("Expiry must be at least 1 hour from now"), false;

    if (!limitUsersUnlimited) {
      const ul = Number(userLimit);
      if (Number.isNaN(ul) || ul < 1)
        return toast.error("User limit must be at least 1 or set Unlimited"), false;
    }
    return true;
  };

  useEffect(() => {
    const fetchPromotion = async () => {
        try{
        setLoading(true);
      const response = await getPromotionById(id);
    //   console.log("Response:", response);
      // Populate state when editing
      if (response) {
        // Basic fields
        setCode(response.code ?? "");
        setDiscountType((response.discountType as DiscountType) ?? "percentage");
        setDiscountValue(typeof response.discountValue === 'number' ? response.discountValue : "");

        // User limit (maxUses null => unlimited)
        if (response.maxUses === null || response.maxUses === undefined) {
          setLimitUsersUnlimited(true);
          setUserLimit("");
        } else {
          setLimitUsersUnlimited(false);
          setUserLimit(Number(response.maxUses));
        }

        // Repeat usage (undefined/null => unlimited)
        if (response.useFrequency === null || response.useFrequency === undefined || response.useFrequency === Number.POSITIVE_INFINITY || response.useFrequency > 1e12) {
          setRepeatUnlimited(true);
          setRepeatLimit(1);
        } else {
          setRepeatUnlimited(false);
          setRepeatLimit(Number(response.useFrequency));
        }

        // validUntil -> UK date/time fields
        const toLondonDateTime = (isoStr: string | undefined) => {
          if (!isoStr) return { date: oneHourFromNowLocalISODate(), time: oneHourFromNowLocalISOTime() };
          const d = new Date(isoStr);
          const parts = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Europe/London',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: false,
          }).formatToParts(d);
          const grab = (type: string) => parts.find(p => p.type === type)?.value ?? '';
          const year = grab('year');
          const month = grab('month');
          const day = grab('day');
          const hour = grab('hour');
          const minute = grab('minute');
          return { date: `${year}-${month}-${day}`, time: `${hour}:${minute}` };
        };
        const { date, time } = toLondonDateTime(response.validUntil);
        setExpiryDate(date);
        setExpiryTime(time);
        setTimeZone('Europe/London');

        // Preselect events/packages
        const eventIdsFromApi: string[] = Array.isArray(response.eventIds)
          ? response.eventIds.map((e: any) => e?._id || e?.id).filter(Boolean)
          : [];
        const packageIdsFromApi: string[] = Array.isArray(response.packageIds)
          ? response.packageIds.map((p: any) => p?._id || p?.id).filter(Boolean)
          : [];
        setSelectedEventIds(eventIdsFromApi);
        setSelectedPackageIds(packageIdsFromApi);

        // Determine active module view if any selected
        if (eventIdsFromApi.length > 0) setAllowedModule('event');
        else if (packageIdsFromApi.length > 0) setAllowedModule('package');
      }
        } catch (error) {
            console.error("Error fetching promotion:", error);
        } finally {
            setLoading(false);
        }
    }
      fetchPromotion();
    
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const rawPayload: any = {
      code: code.trim().toUpperCase(),
      discountType: discountType,
      discountValue: Number(discountValue),
      useFrequency: repeatUnlimited ? undefined: repeatLimit,
      validFrom: new Date(),
      validUntil: validUntil,
      isActive: "active",
      maxUses: limitUsersUnlimited ? undefined : Number(userLimit),
      eventIds: selectedEventIds,
      packageIds: selectedPackageIds,
    };
    const removeEmpty = (obj: Record<string, unknown>) => {
      const cleaned: Record<string, unknown> = {};
      Object.entries(obj).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (typeof value === 'string' && value.trim() === '') return;
        if (Array.isArray(value) && value.length === 0) return;
        cleaned[key] = value;
      });
      return cleaned;
    };
    const payload = removeEmpty(rawPayload);
    try {
        if (id) {
          const resp = await updatePromotion(id, payload);
          if (resp) {
            toast.success('Promotion updated successfully');
            if (setIsEditing) {
              setIsEditing(false);
            }
            router.push(`/promotion/editPromotion/${id}/#promotion`);
          }
        } else {
          const response = await createPromotion(payload);
          if (response) {
            toast.success('Promotion created successfully');
            // router.push("/promotion");
          }
        }
    } catch (error: any) {
        console.error(isEditing ? "Error updating promotion:" : "Error creating promotion:", error);
        toast.error(error || (isEditing ? "Failed to update promotion" : "Failed to create promotion"));
    } finally {
        setLoading(false);
        
    }
//   console.log(payload);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const eventsData = await getAllEvents();
        // console.log({ eventsData });
        const formattedEvents = eventsData?.map((event: any) => ({
          id: event?._id,
          title: event?.title,
          imageUrl: event?.image ? event?.image : "https://github.com/shadcn.png",
          toDate: event?.toDate,
          fromDate: event?.fromDate,
          location:event?.locationId?.title ? event?.locationId?.title : "N/A",
        //   sport: event?.sport,
          ageGroup: event?.ageGroup,
        }));
        // console.log({ formattedEvents });
        setEvents(formattedEvents);
      } catch (error) {
        console.error("err", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getAllPackages();
        // console.log("Packages fetched:", response);
        const formattedPackages = response?.map((item: any) => ({
          id: item?._id,
          title: item?.title,
          imageUrl: item?.image ? item?.image : "https://github.com/shadcn.png",
          sport: item?.sport,
          level: item?.level,
          ageGroup: item?.ageGroup,
          duration: item?.duration,
          startDate: item?.sessionDates?.[0],
          endDate: item?.sessionDates?.[1],
          coachName: item?.coachId?.name || "unknown",
        
          price: item?.price?.base,
          seats: item?.seatsCount,
          enrolled: item?.enrolledCount,
          locationId: item?.locationId?._id,
          clubs:item?.locationId?.title
        }));
        // console.log("Formatted packages:", formattedPackages);
        setPackages(formattedPackages);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div id="promotion" className="flex items-center justify-center py-4">
      <form onSubmit={onSubmit} className="w-full min-w-xl bg-white rounded-xl border px-8 py-6 space-y-8">
        <div>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Coupon Code <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={code}
                  maxLength={12}
                  
                  onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12))}
                  disabled={readOnly}
                />
                <Button type="button" variant="outline" onClick={() => setCode(generateCode())} disabled={readOnly}>
                  <Link2 />
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">3-12 characters, alphanumeric only</p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Discount Type <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={discountType === 'percentage'}
                    onChange={() => setDiscountType('percentage')}
                    disabled={readOnly}
                  />
                  <span>% Percentage</span>
                </label>
                 <label className="flex items-center gap-2">
                  <input
                     type="radio"
                     checked={discountType === 'flatAmount'}
                     onChange={() => setDiscountType('flatAmount')}
                     disabled={readOnly}
                  />
                   <span>£ Flat Amount</span>
                </label>
              </div>
            </div>

            <div className="grid gap-2">
               <label className="text-sm font-medium">Discount Value <span className="text-red-500">*</span></label>
              <div className="relative">
                 <Input
                   type="number"
                   min={1}
                   {...(discountType === 'percentage' ? { max: 100 } : {})}
                   placeholder="Enter value"
                   value={discountValue}
                   onChange={(e) => {
                     const raw = e.target.value;
                     if (raw === '') return setDiscountValue('');
                     let num = Number(raw);
                     if (Number.isNaN(num)) return;
                     if (discountType === 'percentage') {
                       if (num > 100) num = 100;
                       if (num < 1) num = 1;
                     } else {
                       if (num < 1) num = 1;
                     }
                     setDiscountValue(num);
                   }}
                   disabled={readOnly}
                 />
                 <span className="absolute inset-y-0 right-10 flex items-center text-sm text-muted-foreground">{discountType === 'percentage' ? '%' : '£'}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold">Usage Limits & Restrictions</h3>
          <div className="mt-4 grid gap-6">
            <div className="flex items-center gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">User Limit</label>
                <Input
                  type="number"
                  min={1}
                  placeholder="100"
                  className="w-40 sm:w-56"
                  value={limitUsersUnlimited ? "" : userLimit}
                  onChange={(e) => setUserLimit(e.target.value === '' ? '' : Number(e.target.value))}
                  disabled={limitUsersUnlimited || readOnly}
                />
                <p className="text-xs text-muted-foreground">Max unique customers who can use this code</p>
              </div>
              <label className="flex items-center gap-2 whitespace-nowrap select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={limitUsersUnlimited}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setLimitUsersUnlimited(checked);
                    if (!checked && (userLimit === '' || Number(userLimit) < 1)) {
                      setUserLimit(100);
                    }
                  }}
                  disabled={readOnly}
                />
                <span className="text-primary font-medium">Unlimited</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Repeat Usage Limit</label>
                <Input
                  type="number"
                  min={1}
                  placeholder="1"
                  className="w-40 sm:w-56"
                  value={repeatUnlimited ? "" : repeatLimit}
                  onChange={(e) => setRepeatLimit(Number(e.target.value))}
                  disabled={repeatUnlimited || readOnly}
                />
                <p className="text-xs text-muted-foreground">Max times each customer can reuse this code</p>
              </div>
              <label className="flex items-center gap-2 whitespace-nowrap select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={repeatUnlimited}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setRepeatUnlimited(checked);
                    if (!checked && (!repeatLimit || repeatLimit < 1)) {
                      setRepeatLimit(1);
                    }
                  }}
                  disabled={readOnly}
                />
                <span className="text-primary font-medium">Unlimited</span>
              </label>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Expiry Date & Time <span className="text-red-500">*</span> </label>
              <div className="flex gap-3 max-sm:flex-col">
                <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} disabled={readOnly} />
                <Input type="time" value={expiryTime} onChange={(e) => setExpiryTime(e.target.value)} disabled={readOnly} />
                <Select value={timeZone} onValueChange={(v) => { if (!readOnly) setTimeZone(v as 'Europe/London') }}>
                  <SelectTrigger className="w-32" disabled={readOnly}>
                    <SelectValue placeholder="Time Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/London">UK (BST/GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">Time interpreted in UK (Europe/London). Minimum 1 hour from now.</p>
            </div>
          </div>
        </div>


        <div className="grid gap-2">
          <label className="text-sm font-medium">Apply To</label>
          <div className="flex gap-3">
            <Button
              type="button"
              className="commonDarkBG hover:bg-[#581770] hover:text-white transition-all duration-300 text-white"
              variant={allowedModule === 'event' ? 'default' : 'outline'}
              onClick={() => { if (!readOnly) { setAllowedModule('event'); setEventModalOpen(true); } }}
              disabled={readOnly}
            >
              Set Events
            </Button>
            <Button
              type="button"
              className="commonDarkBG hover:bg-[#581770] hover:text-white transition-all duration-300 text-white"
              variant={allowedModule === 'package' ? 'default' : 'outline'}
              onClick={() => { if (!readOnly) { setAllowedModule('package'); setPackageModalOpen(true); } }}
              disabled={readOnly}
            >
              Set Packages
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Choose which area this promotional code applies to.</p>
        </div>

        {selectedEventIds.length > 0 && (
          <div className="border rounded-md p-3 bg-accent/30">
            <div className="text-sm font-medium mb-2">Selected Events</div>
            <div className="flex flex-wrap gap-2">
              {events.filter(e => selectedEventIds.includes(e.id)).map(e => (
                <span key={e.id} className="text-xs px-2 py-1 rounded-full bg-[#7421931A] text-[#742193]">
                  {e.title}
                </span>
              ))}
            </div>
          </div>
        )}
        {selectedPackageIds.length > 0 && (
          <div className="border rounded-md p-3 bg-accent/30">
            <div className="text-sm font-medium mb-2">Selected Packages</div>
            <div className="flex flex-wrap gap-2">
              {packages.filter(p => selectedPackageIds.includes(p.id)).map(p => (
                <span key={p.id} className="text-xs px-2 py-1 rounded-full bg-[#7421931A] text-[#742193]">
                  {p.title}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button 
          type="submit" 
          disabled={!isEditing || loading} 
          className="flex-1 commonDarkBG text-white hover:bg-[#581770] transition-all duration-300"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isEditing ? "Update Promotion" : "Create Promotional Code")}
          </Button>
          <Button 
          type="button" 
          variant="outline" 
          className="flex-1 hover:bg-orange-50 border-orange-200 text-orange-500 transition-all duration-300"
          onClick={
                () => {
              if (isEditing && id) {
                if (setIsEditing) {
                  setIsEditing(false);
                  router.push(`/promotion/editPromotion/${id}/#promotion`);
                }
              } else {
                router.push("/promotion");
              }
            }}
            >Cancel</Button>
        </div>
      </form>

      <EventSelectModal
        open={eventModalOpen}
        onOpenChange={setEventModalOpen}
        events={events}
        selectedIds={selectedEventIds}
        setSelectedIds={setSelectedEventIds}
      />
      <PackageSelectModal
        open={packageModalOpen}
        onOpenChange={setPackageModalOpen}
        packages={packages as any}
        selectedIds={selectedPackageIds}
        setSelectedIds={setSelectedPackageIds}
      />
    </div>
  );
};

export default PromotionForm;


