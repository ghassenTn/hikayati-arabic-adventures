import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookPlus, Sparkles, Palette, Gamepad, BookOpen, Users, Share2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import FreeActivities from "@/components/activities/FreeActivities";

// Animation components
const FadeIn = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-secondary/10">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 bg-gradient-to-r from-primary/5 to-secondary/20 overflow-hidden">
          <div className="container mx-auto px-6 text-center relative">
            <FadeIn>
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary font-arabic">
                  حكايتي - مغامرات باللغة العربية
                </h1>
              </motion.div>
              <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
                منصة تفاعلية للمعلمين لإنشاء قصص تعليمية مخصصة للأطفال باللغة العربية
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 rtl:space-x-reverse">
                <Link to="/create">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 shadow-lg hover:shadow-accent/40 transition-all">
                    <Sparkles className="mr-2 rtl:ml-2 rtl:mr-0" /> ابدأ قصة جديدة
                  </Button>
                </Link>
                <Link to="/stories">
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 shadow hover:shadow-md transition-all">
                    <BookOpen className="mr-2 rtl:ml-2 rtl:mr-0" /> استكشف المكتبة
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
       
        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full mb-4 font-medium">
                  مميزاتنا
                </span>
                <h2 className="text-3xl md:text-4xl font-bold">أدوات قوية لتعليم متميز</h2>
              </div>
            </FadeIn>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FadeIn delay={0.2}>
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-primary/20">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                    <BookPlus size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">توليد القصص بالذكاء الاصطناعي</h3>
                  <p className="text-gray-600 leading-relaxed">
                    أنشئ قصصًا تفاعلية بسرعة باستخدام تقنية الذكاء الاصطناعي من خلال تحديد الموضوع واسم البطل والعناصر التعليمية
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.4}>
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-primary/20">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                    <Palette size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">صور وتلوين تفاعلي</h3>
                  <p className="text-gray-600 leading-relaxed">
                    أنشئ صورًا مخصصة للقصة مع أنشطة تلوين تفاعلية لجعل التعلم ممتعًا وجذابًا للطلاب
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.6}>
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-primary/20">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                    <Gamepad size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">ألعاب تعليمية</h3>
                  <p className="text-gray-600 leading-relaxed">
                    أنشئ ألعابًا تعليمية مبنية على محتوى القصة لتعزيز المفاهيم بطريقة ممتعة وتفاعلية
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-primary/20">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                    <Users size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">تخصيص متعدد المستويات</h3>
                  <p className="text-gray-600 leading-relaxed">
                    خصص القصص حسب عمر الطالب، مستوى اللغة، والاحتياجات التعليمية المختلفة
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.4}>
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-primary/20">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                    <BookOpen size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">مكتبة متكاملة</h3>
                  <p className="text-gray-600 leading-relaxed">
                    احفظ قصصك في مكتبة شخصية أو استكشف القصص الجاهزة من معلمين آخرين
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.6}>
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-primary/20">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                    <Share2 size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">مشاركة سهلة</h3>
                  <p className="text-gray-600 leading-relaxed">
                    شارك قصصك مع الطلاب عبر الروابط أو وسائل التواصل الاجتماعي بضغطة زر
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
        
        {/* How it Works Section */}
        <section className="py-20 bg-gradient-to-b from-secondary/10 to-white">
          <div className="container mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full mb-4 font-medium">
                  كيف تعمل؟
                </span>
                <h2 className="text-3xl md:text-4xl font-bold">ابدأ في 4 خطوات بسيطة</h2>
              </div>
            </FadeIn>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8">
                <FadeIn delay={0.2}>
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      1
                    </div>
                    <h3 className="font-bold text-xl mb-3">أنشئ قصة جديدة</h3>
                    <p className="text-gray-600">
                      حدد موضوع القصة واسم البطل، وسيقوم الذكاء الاصطناعي بإنشاء قصة مخصصة
                    </p>
                  </div>
                </FadeIn>
                
                <FadeIn delay={0.4}>
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      2
                    </div>
                    <h3 className="font-bold text-xl mb-3">حرر القصة</h3>
                    <p className="text-gray-600">
                      قم بتخصيص وتحرير القصة حسب احتياجاتك التعليمية قبل حفظها
                    </p>
                  </div>
                </FadeIn>
                
                <FadeIn delay={0.6}>
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      3
                    </div>
                    <h3 className="font-bold text-xl mb-3">أضف الأنشطة</h3>
                    <p className="text-gray-600">
                      أنشئ صورًا للقصة، أنشطة تلوين، وألعابًا تعليمية مرتبطة بالمحتوى
                    </p>
                  </div>
                </FadeIn>
                
                <FadeIn delay={0.8}>
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      4
                    </div>
                    <h3 className="font-bold text-xl mb-3">شارك مع الطلاب</h3>
                    <p className="text-gray-600">
                      استخدم القصة والأنشطة في الفصل الدراسي أو كواجب منزلي تفاعلي
                    </p>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full mb-4 font-medium">
                  آراء المعلمين
                </span>
                <h2 className="text-3xl md:text-4xl font-bold">ماذا يقولون عنا</h2>
              </div>
            </FadeIn>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <FadeIn delay={0.2}>
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4">
                      م
                    </div>
                    <div>
                      <h4 className="font-bold">منى أحمد</h4>
                      <p className="text-sm text-gray-500">معلمة لغة عربية</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "حكايتي غيرت طريقة تدريس اللغة العربية لطلابي. القصص المخصصة جعلت التعلم أكثر متعة وفعالية!"
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.4}>
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4">
                      خ
                    </div>
                    <div>
                      <h4 className="font-bold">خالد سعيد</h4>
                      <p className="text-sm text-gray-500">معلم صف أول</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "المنصة وفرت لي ساعات من التحضير. أستطيع الآن إنشاء قصص تعليمية تفاعلية في دقائق!"
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.6}>
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4">
                      س
                    </div>
                    <div>
                      <h4 className="font-bold">سارة محمد</h4>
                      <p className="text-sm text-gray-500">أخصائية تعليمية</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "أداة رائعة لتعليم اللغة العربية للأطفال. الأنشطة التفاعلية تساعد الطلاب على فهم المفاهيم بسهولة."
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-white">
          <div className="container mx-auto px-6 text-center">
            <FadeIn>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white/10 backdrop-blur-sm p-12 rounded-2xl border border-white/20">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">جاهز لبدء رحلتك الإبداعية؟</h2>
                  <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                    أنشئ قصصًا تفاعلية مخصصة لمساعدة طلابك على التعلم والاستمتاع باللغة العربية
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/create">
                      <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all">
                        <Sparkles className="mr-2 rtl:ml-2 rtl:mr-0" /> أنشئ قصتك الأولى
                      </Button>
                    </Link>
                    <Link to="/demo">
                      <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                        شاهد عرضًا توضيحيًا
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;