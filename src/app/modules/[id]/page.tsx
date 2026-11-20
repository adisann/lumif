"use client";

import { useParams } from "next/navigation";
import ModuleReader from "@/components/ModuleReader";

export default function ModuleDetailScreen() {
  const params = useParams<{ id: string }>();
  return <ModuleReader moduleId={params?.id ?? ""} />;
}
