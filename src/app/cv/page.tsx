import type { Metadata } from "next";
import { Header } from "@/components/header";
import { WorkExperience } from "./experience";

export const metadata: Metadata = {
  title: "CV",
  description: "Résumé — independent work, experience, and side projects.",
};

export default function CvPage() {
  return (
    <>
      <Header />
      <div className="pt-8">
        <WorkExperience />
      </div>
    </>
  );
}
