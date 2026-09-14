import { useSyncExternalStore } from "react";

import { Button } from "#/components/ui/button";

export type SlipLanguage = "en" | "ta";

const STORAGE_KEY = "clinic.slipLang";

let current: SlipLanguage =
	typeof localStorage !== "undefined" &&
	localStorage.getItem(STORAGE_KEY) === "ta"
		? "ta"
		: "en";
const listeners = new Set<() => void>();

function subscribe(l: () => void): () => void {
	listeners.add(l);
	return () => {
		listeners.delete(l);
	};
}

export function getSlipLanguage(): SlipLanguage {
	return current;
}

export function setSlipLanguage(lang: SlipLanguage): void {
	if (lang === current) return;
	current = lang;
	try {
		localStorage.setItem(STORAGE_KEY, lang);
	} catch {
		// ignore
	}
	for (const l of listeners) l();
}

export function useSlipLanguage(): [SlipLanguage, (l: SlipLanguage) => void] {
	const lang = useSyncExternalStore(
		subscribe,
		() => current,
		getServerSnapshot,
	);
	return [lang, setSlipLanguage];
}

function getServerSnapshot(): SlipLanguage {
	return "en";
}

const STRINGS: Record<string, { en: string; ta: string }> = {
	bookAppointment: { en: "Book appointment", ta: "நேரம் பதிவு செய்க" },
	dosageAfterFood: { en: "After food", ta: "சாப்பாட்டிற்குப் பிறகு" },
	dosageBeforeFood: { en: "Before food", ta: "சாப்பாட்டிற்கு முன்" },
	followUp: { en: "Follow-up", ta: "மறு பரிசோதனை" },
	nextToken: { en: "Next token", ta: "அடுத்த டோக்கன்" },
	print: { en: "Print", ta: "அச்சிடுக" },
	queue: { en: "Queue", ta: "வரிசை" },
	takeTwiceDaily: { en: "Twice daily", ta: "தினமும் இரண்டு முறை" },
};

/** Tamil toggle for slips/instructions (P0-7). */
export function LanguageToggle() {
	const [lang, setLang] = useSlipLanguage();
	return (
		<div
			aria-label="Slip language"
			className="inline-flex items-center rounded-md border border-border"
			role="group"
		>
			<Button
				aria-pressed={lang === "en"}
				className="h-7 rounded-r-none"
				onClick={() => setLang("en")}
				size="sm"
				variant={lang === "en" ? "default" : "ghost"}
			>
				EN
			</Button>
			<Button
				aria-pressed={lang === "ta"}
				className="h-7 rounded-l-none"
				onClick={() => setLang("ta")}
				size="sm"
				variant={lang === "ta" ? "default" : "ghost"}
			>
				தமிழ்
			</Button>
		</div>
	);
}

/** Translate a slip/instruction key to the active language. */
export function tSlip(key: keyof typeof STRINGS): string {
	const entry = STRINGS[key];
	if (!entry) return key;
	return current === "ta" ? entry.ta : entry.en;
}

export function useSlipText(key: keyof typeof STRINGS): string {
	const [lang] = useSlipLanguage();
	const entry = STRINGS[key];
	if (!entry) return key;
	return lang === "ta" ? entry.ta : entry.en;
}
