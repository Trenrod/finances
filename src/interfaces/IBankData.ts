import z from "zod";
import { TMonth } from "./TMonth";

export enum BankExport {
	RVBankCSVExport = "RVBankCSVExport"
}

// Reiffeisen Bank CSV Export
export const zsRVBankCSVExport = z.enum([
	"Bezeichnung Auftragskonto",
	"IBAN Auftragskonto",
	"BIC Auftragskonto",
	"Bankname Auftragskonto",
	"Buchungstag",
	"Valutadatum",
	"Name Zahlungsbeteiligter",
	"IBAN Zahlungsbeteiligter",
	"BIC (SWIFT-Code) Zahlungsbeteiligter",
	"Buchungstext",
	"Verwendungszweck",
	"Betrag",
	"Waehrung",
	"Saldo nach Buchung",
	"Bemerkung",
	"Gekennzeichneter Umsatz",
	"Glaeubiger ID",
	"Mandatsreferenz"
])
export const ERVBankCSVExport = zsRVBankCSVExport.enum;
export type TRVBankCSVExport = z.infer<typeof zsRVBankCSVExport>;

// General CSV Columns
export const zsBankTransaction = z.object({
	UUID: z.string(),
	BezeichnungAuftragskonto: z.string(), // Bezeichnung Auftragskonto
	IBANAuftragskonto: z.string(), // IBAN Auftragskonto
	BICAuftragskonto: z.string(), // BIC Auftragskonto
	BanknameAuftragskonto: z.string(), // Bankname Auftragskonto
	Buchungstag: z.string(), // Buchungstag
	Valutadatum: z.string(), // Valutadatum
	NameZahlungsbeteiligter: z.string(), // Name Zahlungsbeteiligter
	IBANZahlungsbeteiligter: z.string(), // IBAN Zahlungsbeteiligter
	BICZahlungsbeteiligter: z.string(), // BIC (SWIFT-Code) Zahlungsbeteiligter
	Buchungstext: z.string(), // Buchungstext
	Verwendungszweck: z.string(), // Verwendungszweck
	Betrag: z.number(), // Betrag
	Waehrung: z.string(), // Waehrung
	SaldoNachBuchung: z.number(), // Saldo nach Buchung
	Bemerkung: z.string(), // Bemerkung
	GekennzeichneterUmsatz: z.string(), // Gekennzeichneter Umsatz
	GlaeubigerID: z.string(), // Glaeubiger ID
	Mandatsreferenz: z.string(), // Mandatsreferenz
});
export type TBankTransaction = z.infer<typeof zsBankTransaction>;
export type TBankTransactionKeys = keyof TBankTransaction;

export interface IBankTransactionsPerMonth {
	[key: TMonth]: TBankTransaction[]
}