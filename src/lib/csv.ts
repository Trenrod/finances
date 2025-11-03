import { IExtendedBankTransaction, IExtendedBankTransactionsPerMonth } from "~/interfaces/ICSVData";
import { TBankTransaction } from "~/interfaces/IBankData";
import { TMonth } from "~/interfaces/TMonth";
import { TAppliedField, TCategoryRule } from "~/interfaces/Filter";
import { getLabelByItem } from "./label";
import { TTransactionCommentFromDB } from "~/interfaces/Comment";

function parseDate(dateString: string): Date {
	// Remove quotes if present
	const cleanDateStr = dateString.replace(/['"]/g, '');

	// Split by dots to get day, month, year
	const [day, month, year] = cleanDateStr.split('.').map(Number);

	// JavaScript months are 0-indexed, so subtract 1 from month
	return new Date(year, month - 1, day);
}

export async function parseCSV(data: TBankTransaction[], categoryRules: TCategoryRule[], transactionCommentsFromDB: TTransactionCommentFromDB): Promise<IExtendedBankTransactionsPerMonth> {

	// Sort category rules by prioriy (desc)
	categoryRules.sort((a, b) => {
		const fieldPriority: TAppliedField[] = ["UUID", "Verwendungszweck", "NameZahlungsbeteiligter"];
		return fieldPriority.indexOf(a.appliedField) - fieldPriority.indexOf(b.appliedField);
	});

	const unappliedCategoryRules: Map<string, TCategoryRule> = new Map();
	for (const rule of categoryRules) {
		if (rule.uuid) {
			unappliedCategoryRules.set(rule.uuid, rule);
		}
	}

	const bankTransactionsPerMonth: IExtendedBankTransactionsPerMonth = {};
	for (const bankTranaction of data) {
		const year = parseDate(bankTranaction.Buchungstag).getFullYear();
		const month = (parseDate(bankTranaction.Buchungstag).getMonth() + 1); // Months are 0-indexed in JS Date
		const tMonth = `${year}-${month.toString().padStart(2, '0')}` as TMonth;

		const comment = transactionCommentsFromDB[bankTranaction.UUID];
		const { label, categoryRule } = getLabelByItem(bankTranaction, categoryRules);
		if (categoryRule?.uuid)
			unappliedCategoryRules.delete(categoryRule?.uuid);

		const extendedBankTransaction: IExtendedBankTransaction = {
			...bankTranaction,
			month: tMonth,
			label: label,
			categoryRule: categoryRule,
			comment: comment
		};

		if (bankTransactionsPerMonth[tMonth]) {
			bankTransactionsPerMonth[tMonth].push(extendedBankTransaction);
		} else {
			bankTransactionsPerMonth[tMonth] = [extendedBankTransaction];
		}
	}

	return bankTransactionsPerMonth;
}
