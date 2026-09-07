import { useCallback, useMemo, useRef, useState } from "react";

import { cn } from "#/lib/utils";

const OTP_SLOT_IDS = [
	"first",
	"second",
	"third",
	"fourth",
	"fifth",
	"sixth",
	"seventh",
	"eighth",
];

interface OTPSlotProps {
	disabled: boolean;
	error: boolean;
	index: number;
	isFocused: boolean;
	onBlur: () => void;
	onChange: (index: number, digit: string) => void;
	onFocus: (index: number) => void;
	onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
	onPaste: (e: React.ClipboardEvent) => void;
	setRef: (index: number, el: HTMLInputElement | null) => void;
	value: string;
}

function OTPSlot({
	disabled,
	error,
	index,
	isFocused,
	onBlur,
	onChange,
	onFocus,
	onKeyDown,
	onPaste,
	setRef,
	value,
}: OTPSlotProps) {
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const digit = e.target.value.replace(/\D/g, "").slice(-1);
			onChange(index, digit);
		},
		[onChange, index],
	);

	const handleFocus = useCallback(() => {
		onFocus(index);
	}, [onFocus, index]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			onKeyDown(index, e);
		},
		[onKeyDown, index],
	);

	const refCallback = useCallback(
		(el: HTMLInputElement | null) => {
			setRef(index, el);
		},
		[setRef, index],
	);

	return (
		<input
			className={cn(
				"h-12 w-10 rounded-lg border text-center font-semibold text-lg outline-none transition-all duration-200",
				"focus:border-primary focus:ring-2 focus:ring-primary/20",
				"disabled:cursor-not-allowed disabled:opacity-50",
				error &&
					"border-destructive focus:border-destructive focus:ring-destructive/20",
				!error && isFocused && "border-primary",
				!error && !isFocused && value && "border-primary/50 bg-primary/5",
				!error && !isFocused && !value && "border-input",
			)}
			disabled={disabled}
			inputMode="numeric"
			maxLength={1}
			onBlur={onBlur}
			onChange={handleChange}
			onFocus={handleFocus}
			onKeyDown={handleKeyDown}
			onPaste={onPaste}
			pattern="[0-9]*"
			ref={refCallback}
			type="text"
			value={value}
		/>
	);
}

interface OTPInputProps {
	className?: string;
	disabled?: boolean;
	error?: boolean;
	length?: number;
	onChange: (value: string) => void;
	onComplete?: (value: string) => void;
	value: string;
}

function OTPInput({
	length = 6,
	value,
	onChange,
	onComplete,
	disabled = false,
	error = false,
	className,
}: OTPInputProps) {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

	const otpValues = value
		.split("")
		.concat(Array(length - value.length).fill(""));

	const focusInput = useCallback((index: number) => {
		const input = inputRefs.current[index];
		if (input) {
			input.focus();
			input.select();
		}
	}, []);

	const handleChange = useCallback(
		(index: number, digit: string) => {
			if (disabled) return;

			const newValue = otpValues
				.map((v, i) => (i === index ? digit : v))
				.join("");
			const filteredValue = newValue.slice(0, length);
			onChange(filteredValue);

			if (digit && index < length - 1) {
				focusInput(index + 1);
			}

			if (filteredValue.length === length && onComplete) {
				onComplete(filteredValue);
			}
		},
		[disabled, otpValues, length, onChange, focusInput, onComplete],
	);

	const handleKeyDown = useCallback(
		(index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
			if (disabled) return;

			if (e.key === "Backspace") {
				e.preventDefault();
				if (otpValues[index]) {
					handleChange(index, "");
				} else if (index > 0) {
					focusInput(index - 1);
					handleChange(index - 1, "");
				}
			} else if (e.key === "Delete") {
				e.preventDefault();
				handleChange(index, "");
			} else if (e.key === "ArrowLeft" && index > 0) {
				e.preventDefault();
				focusInput(index - 1);
			} else if (e.key === "ArrowRight" && index < length - 1) {
				e.preventDefault();
				focusInput(index + 1);
			} else if (e.key === "Home") {
				e.preventDefault();
				focusInput(0);
			} else if (e.key === "End") {
				e.preventDefault();
				focusInput(length - 1);
			}
		},
		[disabled, otpValues, handleChange, focusInput, length],
	);

	const handlePaste = useCallback(
		(e: React.ClipboardEvent) => {
			if (disabled) return;

			e.preventDefault();
			const pastedData = e.clipboardData
				.getData("text")
				.replace(/\D/g, "")
				.slice(0, length);
			onChange(pastedData);

			if (pastedData.length === length && onComplete) {
				onComplete(pastedData);
			}

			const nextEmptyIndex = pastedData.length;
			focusInput(Math.min(nextEmptyIndex, length - 1));
		},
		[disabled, length, onChange, onComplete, focusInput],
	);

	const handleFocus = useCallback((index: number) => {
		setFocusedIndex(index);
	}, []);

	const handleBlur = useCallback(() => {
		setFocusedIndex(null);
	}, []);

	const setRef = useCallback((index: number, el: HTMLInputElement | null) => {
		inputRefs.current[index] = el;
	}, []);

	const slotKeys = useMemo(() => OTP_SLOT_IDS.slice(0, length), [length]);

	return (
		<div className={cn("flex gap-2", className)}>
			{otpValues.map((v, index) => (
				<OTPSlot
					disabled={disabled}
					error={error}
					index={index}
					isFocused={focusedIndex === index}
					key={slotKeys[index]}
					onBlur={handleBlur}
					onChange={handleChange}
					onFocus={handleFocus}
					onKeyDown={handleKeyDown}
					onPaste={handlePaste}
					setRef={setRef}
					value={v}
				/>
			))}
		</div>
	);
}

export { OTPInput };
