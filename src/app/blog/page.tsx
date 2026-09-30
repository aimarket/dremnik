import { Header } from "@/components/header";
import { ResearchBanner } from "@/components/terminal/research-banner";
import Blog from "./blog";

export default function BlogPage() {
  return (
    <>
      <ResearchBanner note="ALL COVERAGE" />
      <Header />
      <Blog />
    </>
  );
}
