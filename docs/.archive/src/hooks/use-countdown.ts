import { useCallback, useEffect, useState } from "react";

export function useCountdown(initialSeconds = 0) {
	const [seconds, setSeconds] = useState(initialSeconds);
	const isActive = seconds > 0;

	useEffect(() => {
		if (seconds <= 0) return;
		const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
		return () => clearTimeout(timer);
	}, [seconds]);

	const start = useCallback(
		(from = initialSeconds) => {
			setSeconds(from);
		},
		[initialSeconds],
	);

	const reset = useCallback(() => {
		setSeconds(0);
	}, []);

	return { isActive, reset, seconds, start };
}
