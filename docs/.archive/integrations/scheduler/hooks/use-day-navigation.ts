import { useCallback, useMemo, useState } from "react";

import type { EngineConfig } from "../types";
import { getDayLabel, getDaysRange, getToday } from "../utils/date";

export function useDayNavigation(config: EngineConfig<any>) {
	const today = getToday();
	const [selectedDate, setSelectedDate] = useState(today);

	const dayStrings = useMemo(
		() => getDaysRange(today, config.daysAhead + 1),
		[today, config.daysAhead],
	);

	const isToday = useCallback((d: string) => d === today, [today]);

	const dayLabel = useCallback((d: string) => getDayLabel(d, today), [today]);

	const goToToday = useCallback(() => setSelectedDate(today), [today]);

	const goNext = useCallback(() => {
		const idx = dayStrings.indexOf(selectedDate);
		if (idx < dayStrings.length - 1) {
			setSelectedDate(dayStrings[idx + 1]);
		}
	}, [selectedDate, dayStrings]);

	const goPrev = useCallback(() => {
		const idx = dayStrings.indexOf(selectedDate);
		if (idx > 0) {
			setSelectedDate(dayStrings[idx - 1]);
		}
	}, [selectedDate, dayStrings]);

	return useMemo(
		() => ({
			dayLabel,
			dayStrings,
			goNext,
			goPrev,
			goToToday,
			isToday,
			selectedDate,
			setSelectedDate,
			today,
		}),
		[
			dayLabel,
			dayStrings,
			goNext,
			goPrev,
			goToToday,
			isToday,
			selectedDate,
			today,
		],
	);
}
