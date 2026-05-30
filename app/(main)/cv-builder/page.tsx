// app/(main)/cv-builder/page.tsx
import { Suspense } from "react";
import CvBuilderClient from "@/src/components/CVBuilder/CvBuilderClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CvBuilderClient />
    </Suspense>
  );
}
