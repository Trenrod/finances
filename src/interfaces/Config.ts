import * as z from "zod";

const zsLabelConfig = z.object({
	name: z.string(),
	color: z.string()
});

export const zsConfig = z.object({
	fixedIncome: z.number().min(0),
	labels: z.array(zsLabelConfig).min(1)
});

export type TConfig = z.infer<typeof zsConfig>;
