'use client'
import React, { useEffect, useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { getCoachById } from '@/api/coach';
import { Edit, MapPin, Phone, Star, Calendar, Users, DollarSign, Award, Target } from 'lucide-react';
import Image from 'next/image';

interface CoachData {
  _id: string;
  name: string;
  image: string;
  aboutMe: string;
  phoneNumber: string;
  emergencyContact: string;
  sports: string[];
  averageRating: number;
  stats: {
    yearsOfExperience: number;
    certifications: Array<{
      name: string;
      image: string;
    }>;
    specializations: string[];
  };
  locationIds: Array<{
    _id: string;
    address: string;
    city: string;
    state: string;
    image: string;
    about: string;
  }>;
  packageIds: Array<{
    _id: string;
    title: string;
    sport: string;
    ageGroup: string;
    level: string;
    duration: number;
    seatsCount: number;
    enrolledCount: number;
    price: {
      base: number;
      tax: number;
      discount: number;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

const Page = ({ params }: { params: Promise<{ id: string }> }) => { 

  const { id } = React.use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [coach, setCoach] = useState<CoachData | null>(null);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const coachData = await getCoachById(id);
        console.log({coachData});
        setCoach(coachData);
      } catch (error) {
        console.error("Error fetching coach:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoach();
  }, [id]);

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen p-2 sm:p-4 xl:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#742193] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading coach details...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!coach) {
    return (
      <section className="bg-[#f9f9f9] min-h-screen p-2 sm:p-4 xl:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600">Coach not found</p>
            <Button 
              onClick={() => router.push('/coaches')}
              className="mt-4"
            >
              Back to Coaches
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const calculateTotalPrice = (price: { base: number; tax: number; discount: number }) => {
    const total = price.base + price.tax;
    const discounted = total - (total * price.discount / 100);
    return discounted;
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <section className="bg-[#f9f9f9] min-h-screen p-2 sm:p-4 xl:p-8">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/coaches">Coaches</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Coach Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-start gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Coach Details</h1>
          </div>
          <Button
            onClick={() => router.push(`/coaches/${id}`)}
            className="flex items-center gap-2 bg-[#742193] hover:bg-[#581770]"
          >
            <Edit className="w-4 h-4" />
            Edit Coach
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coach Profile Card */}
          <div className="lg:col-span-1">
            <Card className="h-fit bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-lg">
              <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <div className="relative mx-auto w-32 h-32 mb-4">
                  <Image
                    src={coach.image}
                    alt={coach.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white shadow-md"></div>
                </div>
                <CardTitle className="text-xl text-white">{coach.name}</CardTitle>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-yellow-300 fill-current" />
                  <span className="text-sm text-purple-100">
                    {coach.averageRating > 0 ? `${coach.averageRating}/5` : 'No ratings yet'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">{coach.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    {coach.stats.yearsOfExperience} years experience
                  </span>
                </div>
                <div className="pt-4 border-t border-purple-200">
                  <h4 className="font-semibold mb-2 text-purple-800">About</h4>
                  <p className="text-sm text-gray-700 bg-purple-50 p-3 rounded-lg">{coach.aboutMe}</p>
                </div>
                <div className="pt-4 border-t border-purple-200">
                  <h4 className="font-semibold mb-2 text-purple-800">Sports</h4>
                  <div className="flex flex-wrap gap-1">
                    {coach.sports.map((sport) => (
                      <Badge key={sport} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-purple-200">
                  <h4 className="font-semibold mb-2 text-purple-800">Specializations</h4>
                  <div className="flex flex-wrap gap-1">
                    {coach.stats.specializations.map((spec) => (
                      <Badge key={spec} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Certifications */}
            <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg">
              <CardHeader className="border border-[#c858BA] bg-[#7421931A] text-[#742193] rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  {coach.stats.certifications.length > 0 ? (
                    coach.stats.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-white border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <Image
                        src={cert.image}
                        alt={cert.name}
                        width={128}
                        height={128}
                        className="w-12 h-12 object-cover rounded-lg border-2 border-blue-200"
                      />
                      <div>
                        <h4 className="font-medium text-blue-900">{cert.name}</h4>
                        <p className="text-sm text-blue-600">Certification</p>
                      </div>
                    </div>
                  ))
                  ) : (
                    <p className="text-sm text-gray-600">No certifications found for this coach yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Locations */}
            <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-lg">
              <CardHeader className="border border-[#c858BA] bg-[#7421931A] text-[#742193] rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Training Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {coach.locationIds.length > 0 ? (
                    coach.locationIds.map((location) => (
                    <div key={location._id} className="flex gap-4 p-4 bg-white border border-green-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <Image
                        src={location.image}
                        alt={location.address}
                        width={128}
                        height={128}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-green-200"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-900">{location.address}</h4>
                        <p className="text-sm text-green-700">
                          {location.city}, {location.state}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {location.about}
                        </p>
                      </div>
                    </div>
                  ))
                  ) : (
                    <p className="text-sm text-gray-600">No locations found for this coach yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Packages */}
            <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-lg">
              <CardHeader className="border border-[#c858BA] bg-[#7421931A] text-[#742193] rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Training Packages
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  {coach.packageIds.length > 0 ? (
                    coach.packageIds.map((pkg) => (
                    <div key={pkg._id} className="border border-orange-200 rounded-lg p-4 bg-white hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-orange-900">{pkg.title}</h4>
                          <p className="text-sm text-orange-700">{pkg.sport}</p>
                        </div>
                        <Badge className={`text-xs border ${getLevelColor(pkg.level)}`}>
                          {pkg.level}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-800">{pkg.duration} months</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                          <Users className="w-4 h-4 text-green-600" />
                          <span className="text-green-800">{pkg.enrolledCount}/{pkg.seatsCount}</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                          <Target className="w-4 h-4 text-purple-600" />
                          <span className="text-purple-800">{pkg.ageGroup}</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                          <DollarSign className="w-4 h-4 text-yellow-600" />
                          <span className="text-yellow-800 font-semibold">${calculateTotalPrice(pkg.price).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <p>Base: ${pkg.price.base} | Tax: ${pkg.price.tax}</p>
                        {pkg.price.discount > 0 && (
                          <p className="text-green-600 font-medium">Discount: {pkg.price.discount}%</p>
                        )}
                      </div>
                    </div>
                  ))
                  ) : (
                    <p className="text-sm text-gray-600">No packages found for this coach yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page; 