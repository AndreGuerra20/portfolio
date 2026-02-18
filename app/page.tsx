"use client";

import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import RecentProjects from "@/components/RecentProjects";
import Footer from "@/components/Footer";
import { FloatingNav } from "@/components/ui/FloatingNavBar";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/context/language-context";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        <LanguageToggle />
        <FloatingNav navItems={t.navItems} />
        <Hero />
        <Grid />
        <RecentProjects />
        <Footer />
      </div>
    </main>
  );
}
