import { maxLength, minLength, pipe, regex, string } from "valibot";

export const SlugSchema = pipe(
  string(),
  minLength(3, "Must be at least 3 characters"),
  maxLength(63, "Must be at most 63 characters"),
  regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be URL-safe alphanumeric with hyphens"),
);

export const NameSchema = pipe(
  string(),
  minLength(1, "Name is required"),
  maxLength(255, "Must be at most 255 characters"),
);
