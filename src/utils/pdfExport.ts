import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { getBestArabicFont } from "./fonts";

// Create PDF with analytics data
export const exportAnalyticsToPDF = async (
  stories: any[],
  activityData: any[],
  storyCompletionData: any[],
  learningData: any[],
  quizPerformance: any[],
  totalActivities: number,
  completionRate: number,
) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add RTL support for Arabic
    doc.setR2L(true);

    // Use a system font that supports Arabic
    const arabicFont = getBestArabicFont();
    doc.setFont(arabicFont);

    // Title
    doc.setFontSize(24);
    doc.text("تقرير تحليلات التعلم", doc.internal.pageSize.width / 2, 20, { align: "center" });
    
    // Date
    const currentDate = format(new Date(), "PPP", { locale: ar });
    doc.setFontSize(12);
    doc.text(`تاريخ التقرير: ${currentDate}`, doc.internal.pageSize.width / 2, 30, { align: "center" });

    // Summary section
    doc.setFontSize(16);
    doc.text("ملخص التعلم", 20, 45);

    // Summary data
    const summaryData = [
      ["عدد القصص", stories.length.toString()],
      ["إجمالي الأنشطة", totalActivities.toString()],
      ["معدل الإكمال", `${completionRate.toFixed(0)}%`],
    ];

    autoTable(doc, {
      startY: 50,
      head: [["الإحصائية", "القيمة"]],
      body: summaryData,
      theme: "grid",
      headStyles: { fillColor: [155, 135, 245], textColor: [255, 255, 255] },
      styles: { 
        halign: "center", 
        font: arabicFont
      },
    });

    // Story completion data table
    doc.addPage();
    doc.setFontSize(16);
    doc.text("إكمال القصص", 20, 20);
    
    const storyCompletionTableData = storyCompletionData.map(item => [
      item.name,
      `${item.completedSessions}`,
      `${item.totalSessions}`,
      `${Math.round((item.completedSessions / item.totalSessions) * 100)}%`
    ]);
    
    autoTable(doc, {
      startY: 25,
      head: [["اسم القصة", "الجلسات المكتملة", "إجمالي الجلسات", "نسبة الإكمال"]],
      body: storyCompletionTableData,
      theme: "grid",
      headStyles: { fillColor: [155, 135, 245], textColor: [255, 255, 255] },
      styles: { 
        halign: "center", 
        font: arabicFont
      },
    });

    // Activity data table
    doc.addPage();
    doc.setFontSize(16);
    doc.text("أنشطة التعلم", 20, 20);
    
    const activityTableData = activityData.map(item => [
      item.name,
      // item.count.toString()
    ]);
    
    autoTable(doc, {
      startY: 25,
      head: [["نوع النشاط", "العدد"]],
      body: activityTableData,
      theme: "grid",
      headStyles: { fillColor: [155, 135, 245], textColor: [255, 255, 255] },
      styles: { 
        halign: "center", 
        font: arabicFont
      },
    });

    // Learning progress data table
    doc.addPage();
    doc.setFontSize(16);
    doc.text("تقدم التعلم", 20, 20);
    
    const learningTableData = learningData.map(item => [
      item.skill,
      // item.progress.toString() + "%"
    ]);
    
    autoTable(doc, {
      startY: 25,
      head: [["المهارة", "التقدم"]],
      body: learningTableData,
      theme: "grid",
      headStyles: { fillColor: [155, 135, 245], textColor: [255, 255, 255] },
      styles: { 
        halign: "center", 
        font: arabicFont
      },
    });

    // Quiz performance data table
    doc.addPage();
    doc.setFontSize(16);
    doc.text("أداء الاختبارات", 20, 20);
    
    const quizTableData = quizPerformance.map(item => [
      item.quiz,
      // item.score.toString() + "%",
      // item.attempts.toString()
    ]);
    
    autoTable(doc, {
      startY: 25,
      head: [["الاختبار", "النتيجة", "المحاولات"]],
      body: quizTableData,
      theme: "grid",
      headStyles: { fillColor: [155, 135, 245], textColor: [255, 255, 255] },
      styles: { 
        halign: "center", 
        font: arabicFont
      },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(10);
    
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`صفحة ${i} من ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: "center" });
      doc.text("تم إنشاء هذا التقرير بواسطة منصة حكايتي", doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 5, { align: "center" });
    }

    // Generate a filename with the current date and time
    const fileName = `تقرير_تحليلات_التعلم_${format(new Date(), "yyyy-MM-dd_HH-mm")}.pdf`;
    
    // Save the PDF
    doc.save(fileName);
    return fileName;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF report");
  }
};
