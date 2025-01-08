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
import { useMediaQuery } from "@/hooks/use-media-query";

interface PublicResponseListProps {
  responses: EnrichedResponse[];
  form: Form;
}

export function PublicResponseList({
  responses,
  form,
}: PublicResponseListProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const displayableElements = form.elements.filter(
    (el) =>
      ![
        FormElementType.WELCOME_SCREEN,
        FormElementType.END_SCREEN,
        FormElementType.STATEMENT,
      ].includes(el.type)
  );

  if (responses.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No responses yet
      </div>
    );
  }

  // Mobile View
  if (isMobile) {
    return (
      <div className="space-y-6">
        {responses.map((response, responseIdx) => (
          <div key={response.id} className="rounded-lg border bg-card">
            {/* Response metadata */}
            <div className="p-4 flex items-center justify-between border-b text-sm text-muted-foreground">
              <span>Response #{responses.length - responseIdx}</span>
              <span>
                {formatDistanceToNow(new Date(response.submittedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {/* Questions and Answers */}
            <div className="divide-y">
              {displayableElements.map((element) => {
                const enrichedAnswer = response.enrichedAnswers.find(
                  (ans) => ans.elementId === element.id
                );

                return (
                  <div key={element.id} className="p-4">
                    <div className="font-medium mb-1.5 text-sm">
                      {element.question}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {enrichedAnswer?.readableAnswer || "-"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop View
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">#</TableHead>
            <TableHead className="w-[150px]">When</TableHead>
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
          {responses.map((response, idx) => (
            <TableRow key={response.id}>
              <TableCell className="text-center font-medium">
                {responses.length - idx}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDistanceToNow(new Date(response.submittedAt), {
                  addSuffix: true,
                })}
              </TableCell>
              {displayableElements.map((element) => {
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
        </TableBody>
      </Table>
    </div>
  );
}
