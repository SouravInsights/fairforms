import { FormElement, FormElementType } from "@/types/form";

function isStatementElement(element: FormElement): element is FormElement & {
  type: FormElementType.STATEMENT;
  properties: {
    statement: string;
    alignment: "left" | "center" | "right";
  };
} {
  return element.type === FormElementType.STATEMENT;
}

interface StatementProps {
  element: FormElement;
}

export function Statement({ element }: StatementProps) {
  if (!isStatementElement(element)) {
    return null;
  }

  return (
    <div
      className={`text-${element.properties.alignment} text-lg font-medium py-4`}
    >
      {element.properties.statement}
    </div>
  );
}
