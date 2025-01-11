"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { BarChart2, Loader2, Star } from "lucide-react";
import { EnrichedResponse } from "@/types/response";
import { Form } from "@/types/form";
import { PublicResponseList } from "@/app/components/forms/PublicResponseList";
import { ColorSchemeName, colorSchemes } from "@/lib/responses-theme-options";
import { ColorSchemeToggle } from "@/app/components/shared/ColorSchemeToggle";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useStarredResponses } from "@/hooks/use-starred-responses";
import { ResponseFilters, DEFAULT_FILTERS } from "@/types/response-filters";
import { filterResponses } from "@/lib/response-filters";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PublicResponseStats } from "@/app/components/forms/PublicResponseStats";

interface PublicResponsesPageProps {
  params: {
    formId: string;
    token: string;
  };
}

export default function PublicResponsesPage({
  params,
}: PublicResponsesPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [responses, setResponses] = useState<EnrichedResponse[]>([]);
  const [form, setForm] = useState<Form | null>(null);
  // const [activeTab, setActiveTab] = useState<"all" | "starred">("all");
  const [filters, setFilters] = useState<ResponseFilters>(DEFAULT_FILTERS);
  const { toast } = useToast();
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>("neonNight");
  const {
    starredResponses,
    toggleStar,
    isLoading: starredLoading,
  } = useStarredResponses(params.formId, params.token);

  useEffect(() => {
    const loadResponses = async () => {
      try {
        const response = await fetch(
          `/api/forms/${params.formId}/public/${params.token}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        setResponses(data.responses);
        setForm(data.form);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to load responses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadResponses();
  }, [params.formId, params.token, toast]);

  // Get filtered responses
  const filteredResponses = filterResponses(
    responses.sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    ),
    filters
  );

  if (isLoading || starredLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-2">
            Invalid or Expired Link
          </h2>
          <p className="text-muted-foreground">
            This link might be invalid or has expired. Please request a new link
            from the form owner.
          </p>
        </Card>
      </div>
    );
  }

  console.log("filters:", filters);
  // console.log(
  //   "filters.demographics.ageGroups[0]:",
  //   filters.demographics.ageGroups[0]
  // );

  return (
    <div className={`min-h-screen ${colorSchemes[colorScheme].bg}`}>
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1
                className={`text-3xl font-bold ${colorSchemes[colorScheme].text}`}
              >
                {form.title} - Responses
              </h1>
              <p className={colorSchemes[colorScheme].muted}>
                {filteredResponses.length} total{" "}
                {filteredResponses.length === 1 ? "response" : "responses"}
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className={`p-6 ${colorSchemes[colorScheme].card}`}>
            <div className="space-y-6">
              {/* Feedback & Outfit Design Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="feedbackFilter"
                      className={colorSchemes[colorScheme].text}
                    >
                      Filter Long Feedback
                    </Label>
                    <Switch
                      id="feedbackFilter"
                      checked={filters.feedbackFilter.enabled}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          feedbackFilter: {
                            ...prev.feedbackFilter,
                            enabled: checked,
                          },
                        }))
                      }
                    />
                  </div>
                  {filters.feedbackFilter.enabled && (
                    <Select
                      value={String(filters.feedbackFilter.minLength)}
                      onValueChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          feedbackFilter: {
                            ...prev.feedbackFilter,
                            minLength: Number(value),
                          },
                        }))
                      }
                    >
                      <SelectTrigger
                        className={`${colorSchemes[colorScheme].text} ${colorSchemes[colorScheme].bg}`}
                      >
                        <SelectValue placeholder="Select minimum length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50+ characters</SelectItem>
                        <SelectItem value="100">100+ characters</SelectItem>
                        <SelectItem value="200">200+ characters</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="outfitDesignFilter"
                      className={colorSchemes[colorScheme].text}
                    >
                      Filter Outfit Design Responses
                    </Label>
                    <Switch
                      id="outfitDesignFilter"
                      checked={filters.outfitDesignFilter.enabled}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          outfitDesignFilter: {
                            ...prev.outfitDesignFilter,
                            enabled: checked,
                          },
                        }))
                      }
                    />
                  </div>
                  {filters.outfitDesignFilter.enabled && (
                    <Select
                      value={String(filters.outfitDesignFilter.minLength)}
                      onValueChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          outfitDesignFilter: {
                            ...prev.outfitDesignFilter,
                            minLength: Number(value),
                          },
                        }))
                      }
                    >
                      <SelectTrigger
                        className={`${colorSchemes[colorScheme].text} ${colorSchemes[colorScheme].bg}`}
                      >
                        <SelectValue placeholder="Select minimum length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50+ characters</SelectItem>
                        <SelectItem value="100">100+ characters</SelectItem>
                        <SelectItem value="200">200+ characters</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Demographics Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  value={filters.demographics.ageGroups ?? "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      demographics: {
                        ...prev.demographics,
                        ageGroups: value === "all" ? null : value,
                      },
                    }))
                  }
                >
                  <SelectTrigger
                    className={`${colorSchemes[colorScheme].text} ${colorSchemes[colorScheme].bg}`}
                  >
                    <SelectValue placeholder="Filter by age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ages</SelectItem>
                    <SelectItem value="18 - 25">18 - 25</SelectItem>
                    <SelectItem value="26 - 35">26 - 35</SelectItem>
                    <SelectItem value="36 - 45">36 - 45</SelectItem>
                    <SelectItem value="Above 45">Above 45</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.demographics.gender ?? "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      demographics: {
                        ...prev.demographics,
                        gender: value === "all" ? null : value,
                      },
                    }))
                  }
                >
                  <SelectTrigger
                    className={`${colorSchemes[colorScheme].text} ${colorSchemes[colorScheme].bg}`}
                  >
                    <SelectValue placeholder="Filter by gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All genders</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Filters Button */}
              <Button
                variant="outline"
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className={`w-full sm:w-auto ${colorSchemes[colorScheme].text} ${colorSchemes[colorScheme].bg} hover:${colorSchemes[colorScheme].rowHover}`}
              >
                Reset Filters
              </Button>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className={`${colorSchemes[colorScheme].card}`}>
              <TabsTrigger
                value="all"
                className={`data-[state=active]:bg-[#F472B6]`}
              >
                All Responses
              </TabsTrigger>
              <TabsTrigger
                value="starred"
                className={`data-[state=active]:bg-[#F472B6]`}
              >
                <Star className="h-4 w-4 mr-2" />
                Starred
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className={`data-[state=active]:bg-[#F472B6]`}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <PublicResponseList
                responses={filteredResponses}
                form={form}
                colorScheme={colorScheme}
                onToggleStar={toggleStar}
                starredResponses={starredResponses}
              />
            </TabsContent>

            <TabsContent value="starred" className="mt-6">
              <PublicResponseList
                responses={filteredResponses.filter(
                  (r) => starredResponses.has(r.id.toString()) // Convert to string here
                )}
                form={form}
                colorScheme={colorScheme}
                onToggleStar={toggleStar}
                starredResponses={starredResponses}
              />
            </TabsContent>

            <TabsContent value="stats" className="mt-6">
              <PublicResponseStats
                formId={params.formId}
                token={params.token}
                colorScheme={colorScheme}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ColorSchemeToggle activeScheme={colorScheme} onChange={setColorScheme} />
    </div>
  );
}
