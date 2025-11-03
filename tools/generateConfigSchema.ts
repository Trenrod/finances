// Loads Config and generates JSON Schema for it
import { z } from "zod";
import { writeFileSync } from "fs";
import { TConfig, zsConfig } from "~/interfaces/Config";

const configSchema = z.toJSONSchema(zsConfig);
writeFileSync("./schemas/configSchema.json", JSON.stringify(configSchema, null, 2));
console.log("Config schema generated at ./configSchema.json");

// Optionally, validate a sample config
const sampleConfig: TConfig = {
	fixedIncome: 2985,
	labels: [
		{ name: "Miete", color: "#FF0000" },
		{ name: "Lebensmittel", color: "#00FF00" },
		{ name: "Kinder", color: "#0000FF" }
	]
};

const parseResult = zsConfig.safeParse(sampleConfig);
if (!parseResult.success) {
	console.error("Sample config is invalid:", parseResult.error.format());
} else {
	console.log("Sample config is valid.");
}
