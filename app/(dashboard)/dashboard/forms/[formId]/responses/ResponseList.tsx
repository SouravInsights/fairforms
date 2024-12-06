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
import { formatResponseValue } from "./format-response";

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
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Submitted</TableHead>
            {displayableElements.map((element) => (
              <TableHead key={element.id}>{element.question}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {responses.map((response) => (
            <TableRow key={response.id}>
              <TableCell>
                {formatDistanceToNow(new Date(response.submittedAt), {
                  addSuffix: true,
                })}
              </TableCell>
              {displayableElements.map((element) => (
                <TableCell key={element.id}>
                  {formatResponseValue(element, response.answers[element.id])}
                </TableCell>
              ))}
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
