import { TCategoryRule } from "./Filter";
import { TBankTransaction, TBankTransactionKeys, TRVBankCSVExport } from "./IBankData";
import { TMonth } from "./TMonth";

export const getComumnKey = (columnStr: TRVBankCSVExport): TBankTransactionKeys => {
	switch (columnStr) {
		case "Bezeichnung Auftragskonto":
			return "BezeichnungAuftragskonto";
		case "IBAN Auftragskonto":
			return "IBANAuftragskonto";
		case "BIC Auftragskonto":
			return "BICAuftragskonto";
		case "Bankname Auftragskonto":
			return "BanknameAuftragskonto";
		case "Buchungstag":
			return "Buchungstag";
		case "Valutadatum":
			return "Valutadatum";
		case "Name Zahlungsbeteiligter":
			return "NameZahlungsbeteiligter";
		case "IBAN Zahlungsbeteiligter":
			return "IBANZahlungsbeteiligter";
		case "BIC (SWIFT-Code) Zahlungsbeteiligter":
			return "BICZahlungsbeteiligter";
		case "Buchungstext":
			return "Buchungstext";
		case "Verwendungszweck":
			return "Verwendungszweck";
		case "Betrag":
			return "Betrag";
		case "Waehrung":
			return "Waehrung";
		case "Saldo nach Buchung":
			return "SaldoNachBuchung";
		case "Bemerkung":
			return "Bemerkung";
		case "Gekennzeichneter Umsatz":
			return "GekennzeichneterUmsatz";
		case "Glaeubiger ID":
			return "GlaeubigerID";
		case "Mandatsreferenz":
			return "Mandatsreferenz";
	}
	throw new Error(`Unknown column string: ${columnStr}`);
}

export const getComumnKeyOld = (columnStr: TRVBankCSVExport): TBankTransactionKeys => {
	switch (columnStr) {
		case "Bezeichnung Auftragskonto":
			"BezeichnungAuftragskonto";
		case "IBAN Auftragskonto":
			"IBANAuftragskonto";
		case "BIC Auftragskonto":
			return "BICAuftragskonto";
		case "Bankname Auftragskonto":
			return "BanknameAuftragskonto";
		case "Buchungstag":
			return "Buchungstag";
		case "Valutadatum":
			return "Valutadatum";
		case "Name Zahlungsbeteiligter":
			return "NameZahlungsbeteiligter";
		case "IBAN Zahlungsbeteiligter":
			return "IBANZahlungsbeteiligter";
		case "BIC (SWIFT-Code) Zahlungsbeteiligter":
			return "BICZahlungsbeteiligter";
		case "Buchungstext":
			return "Buchungstext";
		case "Verwendungszweck":
			return "Verwendungszweck";
		case "Betrag":
			return "Betrag";
		case "Waehrung":
			return "Waehrung";
		case "Saldo nach Buchung":
			return "SaldoNachBuchung";
		case "Bemerkung":
			return "Bemerkung";
		case "Gekennzeichneter Umsatz":
			return "GekennzeichneterUmsatz";
		case "Glaeubiger ID":
			return "GlaeubigerID";
		case "Mandatsreferenz":
			return "Mandatsreferenz";
	}
	throw new Error(`Unknown column string: ${columnStr}`);
}

export type IExtendedBankTransaction = TBankTransaction & {
	month: TMonth;
	label: string;
	categoryRule?: TCategoryRule;
	comment?: string;
}

export interface IExtendedBankTransactionsPerMonth {
	[key: TMonth]: IExtendedBankTransaction[]
}