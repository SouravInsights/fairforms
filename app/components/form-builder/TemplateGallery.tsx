import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import type { FormTemplate, TemplateCategory } from "@/db/schema";

interface TemplateGalleryProps {
  onSelectTemplate: (template: FormTemplate) => void;
  onCreateBlank: () => void;
}

export function TemplateGallery({
  onSelectTemplate,
  onCreateBlank,
}: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const [templatesRes, categoriesRes] = await Promise.all([
          fetch("/api/templates"),
          fetch("/api/templates/categories"),
        ]);

        if (templatesRes.ok && categoriesRes.ok) {
          const [templatesData, categoriesData] = await Promise.all([
            templatesRes.json(),
            categoriesRes.json(),
          ]);

          setTemplates(templatesData);
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Failed to load templates:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  if (loading) {
    return <TemplateGallerySkeleton />;
  }

  return (
    <div className="h-[80vh] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-2xl font-bold">Create New Form</h2>
        <Button onClick={onCreateBlank} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Blank Form
        </Button>
      </div>

      <div className="flex-1 flex gap-4 p-4">
        <ScrollArea className="flex-1">
          <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
            <TabsList>
              <TabsTrigger value="all">All Templates</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.slug} value={category.slug}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => onSelectTemplate(template)}
                  >
                    {template.thumbnail && (
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </div>
  );
}

function TemplateGallerySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <Skeleton className="w-full h-32" />
          <CardHeader>
            <Skeleton className="h-6 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
