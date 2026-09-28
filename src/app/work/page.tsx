import type { Metadata } from "next";
import { Header } from "@/components/header";
import WorkIndex from "./work-index";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected product and design work.",
};

export default function WorkPage() {
  return (
    <>
      <Header />
      <div className="max-w-[var(--content-width)] mx-auto px-6 md:px-10 pt-8 mb-10">
        <h1 className="text-[22pt] md:text-[20pt] font-medium tracking-[-0.035em] text-ink">
          Portfolio
        </h1>
      </div>
      <WorkIndex />
    </>
  );
}
