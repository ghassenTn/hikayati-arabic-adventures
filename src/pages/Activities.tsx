
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import FreeActivities from "@/components/activities/FreeActivities";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Activities = () => {
  const { domain } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ageRange = searchParams.get("age") || "all";
  const [selectedAge, setSelectedAge] = useState(ageRange);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [domain, ageRange]);

  const handleAgeChange = (value: string) => {
    setSelectedAge(value);
    navigate(`/activities?age=${value}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-center">أنشطة تعليمية مجانية</CardTitle>
              <CardDescription className="text-center">
                اختر الفئة العمرية المناسبة للحصول على أنشطة مخصصة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="w-full max-w-xs">
                  <Select value={selectedAge} onValueChange={handleAgeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة العمرية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-6">3-6 سنوات</SelectItem>
                      <SelectItem value="7-9">7-9 سنوات</SelectItem>
                      <SelectItem value="10-12">10-12 سنة</SelectItem>
                      <SelectItem value="13-15">13-15 سنة</SelectItem>
                      <SelectItem value="all">جميع الأعمار</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          <FreeActivities ageRange={selectedAge} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Activities;
