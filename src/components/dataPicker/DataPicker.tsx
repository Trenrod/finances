import React from "react"
import { Card } from "../base/Card";
import { getComumnKey } from "~/interfaces/ICSVData";
import { TBankTransaction, TRVBankCSVExport } from "~/interfaces/IBankData";
import csvParser from "csv-parser";
import { Readable } from "stream";
import { createUUIDFromObject } from "~/lib/hash";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { Button } from "../ui/button";

enum EDataPickerStepState {
	SELECT_BANK_TRANSACTION_CSV = "SELECT_BANK_TRANSACTION_CSV",
	VALIDATING_BANK_TRANSACTION_CSV = "VALIDATING_BANK_TRANSACTION_CSV",
	BANK_TRANSACTION_CSV_VALID = "BANK_TRANSACTION_CSV_VALID",
}

const parseCSV = createServerFn({
	method: 'POST',
})
	.validator(z.string())
	.handler(async ({ data }): Promise<TBankTransaction[]> => {
		// Placeholder for server function
		const parsedCSV = csvParser({
			separator: ';',
			mapHeaders: ({ header }) => {
				const mappedHeader = getComumnKey(header as TRVBankCSVExport);
				return mappedHeader;
			}
		});

		const bankTransactions: TBankTransaction[] = [];
		const readableStream = Readable.from(data);
		const stream = readableStream.pipe(parsedCSV);
		for await (const bankTranaction of stream) {
			bankTranaction.Betrag = parseFloat(bankTranaction.Betrag.toString().replace(',', '.'));
			bankTranaction.SaldoNachBuchung = parseFloat(bankTranaction.SaldoNachBuchung.toString().replace(',', '.'));
			bankTranaction.UUID = await createUUIDFromObject(bankTranaction);
			bankTransactions.push(bankTranaction);
			// try {
			// 	zsBankTransaction.parse(bankTranaction);
			// } catch (error) {
			// 	console.log("Parsed bank failed", { bankTranaction, error });
			// }
		}
		return bankTransactions;
	});

interface IDataPickerProps {
	onValidCSV: (data: TBankTransaction[]) => void;
}

export function DataPicker({ onValidCSV }: IDataPickerProps) {

	const [stepState, setStepState] = React.useState<EDataPickerStepState>(
		EDataPickerStepState.SELECT_BANK_TRANSACTION_CSV
	);

	// // Start validating bank transaction CSV
	// if (stepState.state === EDataPickerStepState.VALIDATING_BANK_TRANSACTION_CSV && stepState.bankTransactionCSVData != null) {
	// }

	// Ref for file input
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	function handleButtonClick(): void {
		fileInputRef.current?.click();
	}

	let stateUI: React.ReactNode = null;
	switch (stepState) {
		case EDataPickerStepState.SELECT_BANK_TRANSACTION_CSV:
			stateUI = (
				<Card>
					<h1 className="text-2xl mb-4 text-text-primary ">Daten auswaehlen</h1>
					<p className="mb-4 text-text-base">
						Bitte waehlen Sie die Banktransaktionsdatei im CSV format aus.
					</p>
					<p className="w-full">
						<label className="cursor-pointer w-full block">
							<input
								ref={fileInputRef}
								type="file"
								accept=".csv"
								hidden
								onChange={async (e) => {
									if (e.target.files && e.target.files.length > 0) {
										setStepState(EDataPickerStepState.VALIDATING_BANK_TRANSACTION_CSV);
										parseCSV({
											data: await e.target.files[0].text()
										}).then((bankTransactions) => {
											// CSV is valid
											console.log("Valid CSV parsed:", bankTransactions);
											onValidCSV(bankTransactions);
										}).catch((error) => {
											// CSV is invalid
											console.log("Invalid CSV:", error);
											setStepState(EDataPickerStepState.SELECT_BANK_TRANSACTION_CSV);
											alert("Die ausgewählte Banktransaktionsdatei ist ungültig. Bitte wählen Sie eine gültige Datei aus.");
										});
									}
								}}
							/>
							<Button onClick={handleButtonClick} className="w-full">
								Banktransaktionsdatei waehlen
							</Button>
						</label>
					</p>
				</Card>
			);
			break;
		case EDataPickerStepState.VALIDATING_BANK_TRANSACTION_CSV:
			stateUI = (
				<Card>
					<h1 className="text-2xl mb-4 text-text-primary ">Validierung der Banktransaktionsdatei</h1>
					<p className="mb-4 text-text-base">
						Die Banktransaktionsdatei wird validiert. Bitte warten...
					</p>
				</Card>
			);
			break;
		default:
			stateUI = <div>Unbekannter Zustand</div>;
	}


	return (
		<div className="flex justify-center items-center h-screen w-screen">
			{stateUI}
		</div>
	);
}