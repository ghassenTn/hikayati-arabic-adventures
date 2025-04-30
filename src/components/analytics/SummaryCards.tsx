
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Story } from "@/lib/db";

type SummaryCardsProps = {
  stories: Story[];
  totalActivities: number;
  completionRate: number;
};

const SummaryCards = ({ stories, totalActivities, completionRate }: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">إجمالي القصص</CardTitle>
          <CardDescription>مجموع القصص المضافة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{stories.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">الأنشطة المكتملة</CardTitle>
          <CardDescription>مجموع الأنشطة المنجزة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{totalActivities}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">معدل الإكمال</CardTitle>
          <CardDescription>نسبة إكمال الأنشطة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{completionRate}%</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
