import { TBankTransaction } from "~/interfaces/IBankData";
import { TCategoryRule } from "~/interfaces/Filter";
import { TConfig } from "~/interfaces/Config";

/**
 * Get color from config by label name 
 * @param config 
 * @param label 
 */
export function getColorByLabel(config: TConfig, label: string): import("chart.js").Color {
	for (const labelConfig of config.labels) {
		if (labelConfig.name === label) {
			return labelConfig.color;
		}
	}

	throw new Error("Label not found in config colors: " + label);
}

export const getLabelByItem = (item: TBankTransaction, categoryRules: TCategoryRule[]): { label: string, categoryRule: TCategoryRule | undefined } => {

	for (const rule of categoryRules) {
		let fieldToCheck = "";
		if (rule.appliedField === "UUID") {
			fieldToCheck = item.UUID;
		} else if (rule.appliedField === "NameZahlungsbeteiligter") {
			fieldToCheck = item.NameZahlungsbeteiligter;
		} else if (rule.appliedField === "Verwendungszweck") {
			fieldToCheck = item.Verwendungszweck;
		}

		if (rule.compareType === "equals" && fieldToCheck === rule.text) {
			return { label: rule.label, categoryRule: rule };
		} else if (rule.compareType === "startsWith" && fieldToCheck.startsWith(rule.text)) {
			return { label: rule.label, categoryRule: rule };
		} else if (rule.compareType === "endsWith" && fieldToCheck.endsWith(rule.text)) {
			return { label: rule.label, categoryRule: rule };
		} else if (rule.compareType === "contains" && fieldToCheck.includes(rule.text)) {
			return { label: rule.label, categoryRule: rule };
		}
	}

	// Sonstige Einnahmen
	if (item.Betrag > 0) return { label: "Sonstige Einnahmen", categoryRule: undefined };
	return { label: "Sonstige Ausgaben", categoryRule: undefined };
};
