import type { Metadata } from "next";
import { BootScreen } from "@/components/intro/BootScreen";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function IntroPage() {
  return <BootScreen />;
}
