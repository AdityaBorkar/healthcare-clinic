import { getProject, getStack, interpolate } from "@pulumi/pulumi";

export const GROUP_LABELS = [
  {
    label: "com.docker.compose.project",
    value: interpolate`${getProject()}-${getStack()}`,
  },
  { label: "managed-by", value: "pulumi" },
];
