"use client";

import { useState } from "react";
import { ANIMATION_REGISTRY, type AnimationDef } from "@/lib/animations";
import type { AnimConfig } from "@/components/configurator";
import { DocsSidebar } from "@/components/docs-sidebar";
import { DocsToc } from "@/components/docs-toc";
import { IntroductionContent } from "@/components/content-introduction";
import { InstallationContent } from "@/components/content-installation";
import { ContentAnimation } from "@/components/content-animation";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, BookOpen } from "lucide-react";

type NavSection = "introduction" | "installation" | "animations";

const DEFAULT_CONFIG: AnimConfig = {
  duration: "0.5",
  delay: "0",
  ease: "ease-out",
  offset: "",
  trigger: "viewport",
  stagger: "0.08",
  repeat: "0",
  direction: "normal",
};

export function Showcase() {
  const [activeSection, setActiveSection] =
    useState<NavSection>("introduction");
  const [selectedAnimation, setSelectedAnimation] =
    useState<AnimationDef | null>(null);
  const [config, setConfig] = useState<AnimConfig>(DEFAULT_CONFIG);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const handleSectionChange = (section: NavSection) => {
    setActiveSection(section);
    if (section !== "animations") {
      setSelectedAnimation(null);
    }
    setMobileNavOpen(false);
  };

  const handleSelectAnimation = (anim: AnimationDef) => {
    setActiveSection("animations");
    setSelectedAnimation(anim);
    setConfig(DEFAULT_CONFIG);
    setMobileNavOpen(false);
  };

  // Render center content
  const renderContent = () => {
    if (activeSection === "introduction") {
      return <IntroductionContent />;
    }
    if (activeSection === "installation") {
      return <InstallationContent />;
    }
    if (selectedAnimation) {
      return (
        <ContentAnimation
          animation={selectedAnimation}
          config={config}
          onConfigChange={setConfig}
        />
      );
    }
    // Animations section with no specific animation selected — show the first
    const first = ANIMATION_REGISTRY[0]!;
    return (
      <ContentAnimation
        animation={first}
        config={config}
        onConfigChange={setConfig}
      />
    );
  };

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* Left Sidebar — Desktop */}
      <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 border-r border-border bg-card/50">
        <DocsSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          selectedAnimation={selectedAnimation}
          onSelectAnimation={handleSelectAnimation}
        />
      </aside>

      {/* Center Content */}
      <main className="flex-1 min-w-0">
        <ScrollArea className="h-full">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 lg:pb-10">
            {renderContent()}
          </div>
        </ScrollArea>
      </main>

      {/* Right TOC — Desktop */}
      <aside className="hidden xl:flex w-56 shrink-0 border-l border-border bg-card/50">
        <DocsToc
          activeSection={activeSection}
          selectedAnimation={selectedAnimation}
        />
      </aside>

      {/* Mobile: Top bar buttons (FABs) */}
      <div className="lg:hidden fixed bottom-4 left-4 z-50">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full shadow-lg size-12">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="px-4 pt-4 pb-0">
              <SheetTitle className="text-left">Navigation</SheetTitle>
            </SheetHeader>
            <DocsSidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              selectedAnimation={selectedAnimation}
              onSelectAnimation={handleSelectAnimation}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="xl:hidden fixed bottom-4 right-4 z-50">
        <Sheet open={mobileTocOpen} onOpenChange={setMobileTocOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full shadow-lg size-12">
              <BookOpen className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-0">
            <SheetHeader className="px-4 pt-4 pb-0">
              <SheetTitle className="text-left">On this page</SheetTitle>
            </SheetHeader>
            <DocsToc
              activeSection={activeSection}
              selectedAnimation={selectedAnimation}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
