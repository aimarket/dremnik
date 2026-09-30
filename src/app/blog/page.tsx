import { Header } from "@/components/header";
import { Marquee, WordArt } from "@/components/geocities";
import Blog from "./blog";

export default function BlogPage() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-[820px] px-3">
        <WordArt text="~ My Web Log ~" />
        <Marquee>★ THOUGHTS FROM THE FRONTIER ★ UPDATED WHENEVER GENIUS STRIKES (OFTEN) ★ TELL YOUR FRIENDS ★</Marquee>
      </div>
      <Blog />
    </>
  );
}
