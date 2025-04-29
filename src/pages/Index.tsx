
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookPlus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-secondary py-20 bg-hero-pattern">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">حكايتي - مغامرات باللغة العربية</h1>
              <p className="text-xl mb-8">منصة تفاعلية للمعلمين لإنشاء قصص تعليمية مخصصة للأطفال باللغة العربية</p>
              <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                <Link to="/create">
                  <Button size="lg" className="bg-accent hover:bg-accent/90">
                    <BookPlus className="mr-2 rtl:ml-2 rtl:mr-0" /> ابدأ قصة جديدة
                  </Button>
                </Link>
                <Link to="/stories">
                  <Button variant="outline" size="lg">
                    استكشف المكتبة
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">ميزات المنصة</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">توليد القصص</h3>
                <p>أنشئ قصصًا تفاعلية بسرعة باستخدام تقنية الذكاء الاصطناعي من خلال تحديد الموضوع واسم البطل</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">صور تفاعلية</h3>
                <p>قم بإنشاء صور مخصصة لقصتك وأنشطة تلوين تفاعلية لجعل التعلم ممتعًا</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">ألعاب تعليمية</h3>
                <p>استمتع بألعاب تعليمية مبنية على محتوى القصة لمساعدة الأطفال على تعزيز المفاهيم</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How it Works Section */}
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">كيف تعمل المنصة؟</h2>
            <div className="max-w-3xl mx-auto">
              <ol className="relative border-r-2 border-primary">
                <li className="mb-10 ms-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -start-4 ring-4 ring-white">
                    1
                  </span>
                  <h3 className="font-bold text-xl mb-1">أنشئ قصة جديدة</h3>
                  <p className="text-lg">حدد موضوع القصة واسم البطل، وسيقوم الذكاء الاصطناعي بإنشاء قصة مخصصة</p>
                </li>
                <li className="mb-10 ms-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -start-4 ring-4 ring-white">
                    2
                  </span>
                  <h3 className="font-bold text-xl mb-1">حرر القصة</h3>
                  <p className="text-lg">قم بتخصيص وتحرير القصة حسب احتياجاتك التعليمية قبل حفظها</p>
                </li>
                <li className="mb-10 ms-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -start-4 ring-4 ring-white">
                    3
                  </span>
                  <h3 className="font-bold text-xl mb-1">أضف الصور والأنشطة</h3>
                  <p className="text-lg">قم بإنشاء صور للقصة، وأنشطة تلوين، وألعاب تعليمية مرتبطة بالمحتوى</p>
                </li>
                <li className="ms-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -start-4 ring-4 ring-white">
                    4
                  </span>
                  <h3 className="font-bold text-xl mb-1">شارك مع الطلاب</h3>
                  <p className="text-lg">استخدم القصة والأنشطة في الفصل الدراسي لتعزيز التعلم بطريقة ممتعة وتفاعلية</p>
                </li>
              </ol>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">ابدأ رحلتك في إنشاء القصص اليوم</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">أنشئ قصصًا تفاعلية مخصصة لمساعدة طلابك على التعلم والاستمتاع باللغة العربية</p>
            <Link to="/create">
              <Button size="lg" variant="secondary" className="text-primary">
                <BookPlus className="mr-2 rtl:ml-2 rtl:mr-0" /> أنشئ قصتك الأولى
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
