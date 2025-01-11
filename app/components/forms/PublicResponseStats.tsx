import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ColorSchemeName, colorSchemes } from "@/lib/responses-theme-options";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Heart, ShoppingBag, Users2 } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  percentage: number;
}

interface StatsData {
  demographics: {
    age: Array<{ name: string; value: number; percentage: number }>;
    gender: Array<{ name: string; value: number; percentage: number }>;
  };
  shoppingBehavior: {
    frequency: Array<{ name: string; value: number; percentage: number }>;
    channels: Array<{ name: string; value: number; percentage: number }>;
    priceRanges: Array<{ name: string; value: number; percentage: number }>;
  };
  preferences: {
    ethnicWearTypes: Array<{ name: string; value: number; percentage: number }>;
    occasions: Array<{ name: string; value: number; percentage: number }>;
  };
  totalResponses: number;
}

interface PublicResponseStatsProps {
  formId: string;
  token: string;
  colorScheme: ColorSchemeName;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function PublicResponseStats({
  formId,
  token,
  colorScheme,
}: PublicResponseStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const scheme = colorSchemes[colorScheme];

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(
          `/api/forms/${formId}/public/${token}/stats`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [formId, token]);

  if (isLoading || !stats) {
    return (
      <div className="p-8 text-center text-white">Loading statistics...</div>
    );
  }

  console.log("stats:", stats);

  const renderPieChart = (data: ChartData[], title: string) => (
    <Card className={`p-4 ${scheme.card}`}>
      <h3 className={`text-lg font-semibold mb-4 ${scheme.text}`}>{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={!isMobile}
              label={!isMobile}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );

  const renderBarChart = (data: ChartData[], title: string) => (
    <Card className={`p-4 ${scheme.card}`}>
      <h3 className={`text-lg font-semibold mb-4 ${scheme.text}`}>{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={isMobile ? "vertical" : "horizontal"}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            {isMobile ? (
              <>
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="name"
                  height={60}
                  interval={0}
                  tickMargin={10}
                />
                <YAxis />
              </>
            )}
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );

  function getTabName(name: string, isMobile: boolean) {
    switch (name) {
      case "Demographics":
        return isMobile ? "Age & Gender" : "Demographics";
      case "Shopping Behavior":
        return isMobile ? "Shopping" : "Shopping Behavior";
      case "Preferences":
        return name; // This is already short
      default:
        return name;
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="demographics" className="w-full">
        <TabsList
          className={`w-full justify-start ${colorSchemes[colorScheme].bg}`}
        >
          <TabsTrigger
            value="demographics"
            className={`${colorSchemes[colorScheme].text} data-[state=active]:bg-[#F472B6] gap-2`}
          >
            {!isMobile && <Users2 className="h-4 w-4" />}
            {getTabName("Demographics", isMobile)}
          </TabsTrigger>
          <TabsTrigger
            value="shopping"
            className={`${colorSchemes[colorScheme].text} data-[state=active]:bg-[#F472B6] gap-2`}
          >
            {!isMobile && <ShoppingBag className="h-4 w-4" />}
            {getTabName("Shopping Behavior", isMobile)}
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className={`${colorSchemes[colorScheme].text} data-[state=active]:bg-[#F472B6] gap-2`}
          >
            {!isMobile && <Heart className="h-4 w-4" />}
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderPieChart(stats.demographics.age, "Age Distribution")}
            {renderPieChart(stats.demographics.gender, "Gender Distribution")}
          </div>
        </TabsContent>

        <TabsContent value="shopping" className="space-y-6">
          {renderBarChart(
            stats.shoppingBehavior.frequency,
            "Shopping Frequency"
          )}
          {renderBarChart(stats.shoppingBehavior.channels, "Shopping Channels")}
          {renderBarChart(
            stats.shoppingBehavior.priceRanges,
            "Price Range Preferences"
          )}
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          {renderBarChart(
            stats.preferences.ethnicWearTypes,
            "Preferred Ethnic Wear Types"
          )}
          {renderBarChart(stats.preferences.occasions, "Usage Occasions")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
