
import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import FreeActivities from "@/components/activities/FreeActivities";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Activities = () => {
  const { domain } = useParams<{ domain?: string }>();
  const [searchParams] = useSearchParams();
  const ageRange = searchParams.get("age") || "all";

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [domain, ageRange]);

  return (
    <>
      <Helmet>
        <title>الأنشطة التعليمية | حكايتي</title>
        <meta name="description" content="أنشطة تعليمية متنوعة ومجانية لجميع الفئات العمرية في مختلف المجالات" />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <FreeActivities />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Activities;
