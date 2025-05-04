import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Story } from "@/lib/db";
import { BookOpen, CheckSquare, BarChart3, TrendingUp } from "lucide-react";

type SummaryCardsProps = {
  stories: Story[];
  totalActivities: number;
  completionRate: number;
};

const SummaryCards = ({ stories, totalActivities, completionRate }: SummaryCardsProps) => {
  // Calculate week-over-week change (mock data)
  const weeklyChange = 12;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">إجمالي القصص</p>
              <div className="flex items-baseline space-x-2 space-x-reverse">
                <p className="text-3xl font-bold">{stories.length}</p>
                <span className="text-sm text-green-500">+3</span>
              </div>
            </div>
            <div className="rounded-full bg-primary/10 p-2">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">الأنشطة المكتملة</p>
              <div className="flex items-baseline space-x-2 space-x-reverse">
                <p className="text-3xl font-bold">{totalActivities}</p>
                <span className="text-sm text-green-500">+{weeklyChange}</span>
              </div>
            </div>
            <div className="rounded-full bg-orange-100 p-2">
              <CheckSquare className="h-4 w-4 text-orange-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">معدل الإكمال</p>
              <div className="flex items-baseline space-x-2 space-x-reverse">
                <p className="text-3xl font-bold">{completionRate}%</p>
                <span className="text-sm text-green-500">+5%</span>
              </div>
            </div>
            <div className="rounded-full bg-green-100 p-2">
              <BarChart3 className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">معدل النمو الشهري</p>
              <div className="flex items-baseline space-x-2 space-x-reverse">
                <p className="text-3xl font-bold">23%</p>
                <span className="text-sm text-green-500">+2%</span>
              </div>
            </div>
            <div className="rounded-full bg-blue-100 p-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
