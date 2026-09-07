import { useEffect, useRef, useState } from "react";

import { cn } from "#/lib/utils";

interface TocSection {
	id: string;
	label: string;
}

interface TableOfContentsProps {
	sectionRefs: React.RefObject<Record<string, HTMLElement | null>>;
	sections: readonly TocSection[];
}

export default function TableOfContents({
	sectionRefs,
	sections,
}: TableOfContentsProps) {
	const [activeSection, setActiveSection] = useState<string>(
		sections[0]?.id ?? "",
	);

	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		observerRef.current = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				}
			},
			{ rootMargin: "-80px 0px -60% 0px" },
		);

		for (const section of sections) {
			const el = sectionRefs.current?.[section.id];
			if (el) observerRef.current.observe(el);
		}

		return () => observerRef.current?.disconnect();
	}, [sections, sectionRefs]);

	const scrollToSection = (id: string) => {
		sectionRefs.current?.[id]?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<nav className="hidden lg:block lg:w-52 lg:shrink-0">
			<div className="sticky top-24 space-y-1">
				<p className="mb-3 font-semibold text-sm">Contents</p>
				{sections.map((section) => (
					<button
						className={cn(
							"block w-full cursor-pointer rounded-md px-3 py-1.5 text-left text-sm transition-colors",
							activeSection === section.id
								? "bg-primary/10 font-medium text-primary"
								: "text-muted-foreground hover:bg-muted hover:text-foreground",
						)}
						key={section.id}
						onClick={() => scrollToSection(section.id)}
						type="button"
					>
						{section.label}
					</button>
				))}
			</div>
		</nav>
	);
}
