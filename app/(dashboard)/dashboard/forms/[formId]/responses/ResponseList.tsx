import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Form, FormElementType } from "@/types/form";
import { EnrichedResponse } from "@/types/response";
import { formatDistanceToNow } from "date-fns";

interface ResponseListProps {
  responses: EnrichedResponse[];
  form: Form;
}

export function ResponseList({ responses, form }: ResponseListProps) {
  const displayableElements = form.elements.filter(
    (el) =>
      ![
        FormElementType.WELCOME_SCREEN,
        FormElementType.END_SCREEN,
        FormElementType.STATEMENT,
      ].includes(el.type)
  );

  return (
    <div className="border rounded-lg overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">Submitted</TableHead>
            {displayableElements.map((element) => (
              <TableHead
                key={element.id}
                className="min-w-[200px] max-w-[300px]"
              >
                {element.question}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {responses.map((response) => (
            <TableRow key={response.id}>
              <TableCell className="min-w-[150px]">
                {formatDistanceToNow(new Date(response.submittedAt), {
                  addSuffix: true,
                })}
              </TableCell>
              {displayableElements.map((element) => {
                // Find the corresponding enriched answer
                const enrichedAnswer = response.enrichedAnswers.find(
                  (ans) => ans.elementId === element.id
                );

                return (
                  <TableCell
                    key={element.id}
                    className="min-w-[200px] max-w-[300px]"
                  >
                    {enrichedAnswer?.readableAnswer || "-"}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
          {responses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={displayableElements.length + 1}
                className="text-center py-8 text-muted-foreground"
              >
                No responses yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
