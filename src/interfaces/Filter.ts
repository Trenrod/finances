import * as z from "zod";

export const zsCompareType = z.enum([
	"equals", "startsWith", "endsWith", "contains"
]);
export const ECompareType = zsCompareType.enum;
export type TCompareType = z.infer<typeof zsCompareType>;

export const zsAppliedField = z.enum([
	"UUID", "NameZahlungsbeteiligter", "Verwendungszweck"
]);
export const EAppliedField = zsAppliedField.enum;
export type TAppliedField = z.infer<typeof zsAppliedField>;

export const zsCategoryRule = z.object({
	uuid: z.optional(z.string()),
	appliedField: zsAppliedField,
	compareType: zsCompareType,
	text: z.string(),
	label: z.string()
});
export type TCategoryRule = z.infer<typeof zsCategoryRule>;

export const zsCategoryRulesFromDB = z.record(z.string(), zsCategoryRule);
export type TCategoryRulesFromDB = z.infer<typeof zsCategoryRulesFromDB>;
