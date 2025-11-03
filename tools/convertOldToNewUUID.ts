import csvParser, { CsvParser } from "csv-parser";
import { readFileSync, writeFileSync } from "fs";
import { Readable } from "stream";
import { TTransactionCommentFromDB, zsTransactionComment, zsTransactionCommentFromDB } from "~/interfaces/Comment";
import { zsCategoryRule, zsCategoryRulesFromDB } from "~/interfaces/Filter";
import { TBankTransaction, TRVBankCSVExport } from "~/interfaces/IBankData";
import { getComumnKey, getComumnKeyOld } from "~/interfaces/ICSVData";
import { createUUIDFromObject } from "~/lib/hash";

// Import data/csv file for testing
const data = readFileSync('./data/2025-latest.csv', 'utf-8');

// Import data/csv file for testing
const parsedCSVNew = csvParser({
	separator: ';',
	mapHeaders: ({ header }) => {
		const mappedHeader = getComumnKey(header as TRVBankCSVExport);
		return mappedHeader;
	}
});

const parsedCSVOld = csvParser({
	separator: ';',
	mapHeaders: ({ header }) => {
		const mappedHeader = getComumnKeyOld(header as TRVBankCSVExport);
		return mappedHeader;
	}
});


const getBankTransactions = async function(csvParser: CsvParser): Promise<TBankTransaction[]> {
	const readableStream = Readable.from(data);
	const stream = readableStream.pipe(csvParser);
	const bankTransactions: TBankTransaction[] = [];
	for await (const bankTranaction of stream) {
		bankTranaction.Betrag = parseFloat(bankTranaction.Betrag.toString().replace(',', '.'));
		bankTranaction.SaldoNachBuchung = parseFloat(bankTranaction.SaldoNachBuchung.toString().replace(',', '.'));
		bankTranaction.UUID = await createUUIDFromObject(bankTranaction);
		bankTransactions.push(bankTranaction);
	}
	return bankTransactions
}

const run = async () => {
	const bankTransactionsNew: TBankTransaction[] = await getBankTransactions(parsedCSVNew);
	const bankTransactionsOld: TBankTransaction[] = await getBankTransactions(parsedCSVOld);

	const uuimapOldToNew: Map<string, string> = new Map();

	for (let idx = 0; idx < bankTransactionsOld.length; idx++) {
		const transactionNew = bankTransactionsNew[idx];
		const transactionOld = bankTransactionsOld[idx];

		uuimapOldToNew.set(transactionOld.UUID, transactionNew.UUID);
	}

	// Update UUIDs in category rules
	const category = readFileSync('./categoryRulesFromDB.json', 'utf-8');
	const categoryRules = zsCategoryRulesFromDB.parse(JSON.parse(category));
	for (const [key, rule] of Object.entries(categoryRules)) {
		if (rule.appliedField === "UUID") {
			rule.text = uuimapOldToNew.get(rule.text) || rule.text;
		}
	}
	writeFileSync('./NEW_.json', JSON.stringify(categoryRules, null, 2));


	// Update UUIDs in transaction comments
	const comments = readFileSync('./transactionCommentsFromDB.json', 'utf-8');
	const transactionComments = zsTransactionCommentFromDB.parse(JSON.parse(comments));
	const updatedTransactionComments: TTransactionCommentFromDB = {};
	for (const [key, comment] of Object.entries(transactionComments)) {
		const newKey = uuimapOldToNew.get(key) || key;
		updatedTransactionComments[newKey] = comment;
	}
	writeFileSync('./updatedTransactionCommentsFromDB.json', JSON.stringify(updatedTransactionComments, null, 2));
}

void run();

