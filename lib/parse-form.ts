import { NextRequest } from "next/server";
// Parses multipart/form-data from  separating files and fields into structured objects.

export async function parseFormData(req: NextRequest) {
  const formData = await req.formData();
  const files: File[] = [];
  const fields: Record<string, string> = {};
  Array.from(formData.entries()).forEach(([key, value]) => {
    if (value instanceof File) {
      files.push(value);
    } else {
      fields[key] = value.toString();
    }
  });
  console.log(files, fields);
  return { files, fields };
}
