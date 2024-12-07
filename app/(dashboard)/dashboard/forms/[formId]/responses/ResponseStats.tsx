import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormElement, FormElementType } from "@/types/form";
import { EnrichedResponse } from "@/types/response";

interface ResponseStatsProps {
  responses: EnrichedResponse[];
  form: Form;
}

// Type guard for elements with options
function hasOptions(element: FormElement): element is FormElement & {
  type:
    | FormElementType.MULTIPLE_CHOICE
    | FormElementType.DROPDOWN
    | FormElementType.PICTURE_CHOICE;
  properties: {
    options: Array<{ id: string; text?: string; caption?: string }>;
  };
} {
  return [
    FormElementType.MULTIPLE_CHOICE,
    FormElementType.DROPDOWN,
    FormElementType.PICTURE_CHOICE,
  ].includes(element.type);
}

export function ResponseStats({ responses, form }: ResponseStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{responses.length}</p>
        </CardContent>
      </Card>

      {form.elements.filter(hasOptions).map((element) => (
        <Card key={element.id}>
          <CardHeader>
            <CardTitle className="text-sm">{element.question}</CardTitle>
          </CardHeader>
          <CardContent>
            {element.properties.options.map((option) => {
              const count = responses.filter((r) => {
                const answer = r.answers[element.id];
                return Array.isArray(answer)
                  ? answer.includes(option.id)
                  : answer === option.id;
              }).length;

              const percentage =
                responses.length > 0
                  ? Math.round((count / responses.length) * 100)
                  : 0;

              return (
                <div key={option.id} className="flex justify-between mb-2">
                  <span>{option.text || option.caption}</span>
                  <span>
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
