import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IExtendedBankTransaction } from "~/interfaces/ICSVData"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

import { EAppliedField, ECompareType, TAppliedField, TCompareType, TCategoryRule, zsCategoryRule } from "~/interfaces/Filter"
import React from "react"
import { createServerFn } from "@tanstack/react-start"
import { createUUIDFromObject } from "~/lib/hash"
import * as z from "zod";
import { PersistanceClient } from "~/lib/persistance"
import { Group } from "lucide-react"
import { TConfig } from "~/interfaces/Config"

const deleteCategoryRule = createServerFn({
	method: 'POST',
	response: "data"
})
	.validator((data: unknown) => z.string().parse(data))
	.handler(async ({ data }) => {
		try {
			await PersistanceClient.getInstance().deleteCategoryRule(data);
			return { data };
		} catch (error) {
			return { error };
		}
	});

/**
 * Creates a new Filter entry
 */
const createNewFilter = createServerFn({
	method: 'POST',
	response: "data"
})
	.validator((data: unknown) => zsCategoryRule.parse(data))
	.handler(async ({ data }) => {
		// Create new filter uuid
		const categoryRuleUUID = await createUUIDFromObject(data);
		data.uuid = categoryRuleUUID;
		try {
			await PersistanceClient.getInstance().saveCategoryRule(data);
			return { data };
		} catch (error) {
			return { error };
		}
	});

export function FilterDialog({ bankTransaction, refreshAll, config }: { bankTransaction: IExtendedBankTransaction, config: TConfig, refreshAll: () => Promise<void> }) {

	const [categoryRuleUUID, setcategoryRuleUUID] = React.useState<string | undefined>(bankTransaction.categoryRule?.uuid);
	const [appliedField, setAppliedField] = React.useState<TAppliedField>(bankTransaction.categoryRule?.appliedField ?? EAppliedField.UUID);
	const [compareType, setCompareType] = React.useState<TCompareType>(bankTransaction.categoryRule?.compareType ?? ECompareType.equals);
	const [text, setText] = React.useState<string>(bankTransaction.categoryRule?.text ?? bankTransaction.UUID);
	const [label, setLabel] = React.useState<string>(bankTransaction.categoryRule?.label ?? "Sonstige Ausgaben");
	const [open, setOpen] = React.useState<boolean>(false);

	const changedAppliedField = (value: string) => {
		setAppliedField(value as TAppliedField);
		if (value === EAppliedField.UUID) {
			setText(bankTransaction.UUID);
			setCompareType(ECompareType.equals);
		} else if (value === EAppliedField.NameZahlungsbeteiligter) {
			setText(bankTransaction.NameZahlungsbeteiligter);
			setCompareType(ECompareType.equals);
		} else if (value === EAppliedField.Verwendungszweck) {
			setText(bankTransaction.Verwendungszweck);
			setCompareType(ECompareType.contains);
		}
		console.log("Changed applied field to", value, "and text to", text);
	}

	const selectAppliedField =
		(
			<Select name="appliedField" defaultValue={appliedField} onValueChange={changedAppliedField}>
				<SelectTrigger id="appliedField-1" className="w-full">
					<SelectValue placeholder={EAppliedField.UUID} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup id="appliedField">
						<SelectLabel>Applied field</SelectLabel>
						{
							Object.keys(EAppliedField).map((key) => (
								<SelectItem key={key} value={key}>{key}</SelectItem>
							))
						}
					</SelectGroup>
				</SelectContent>
			</Select>
		);

	const displayCompareTypeText = (compareType: TCompareType) => {
		switch (compareType) {
			case ECompareType.equals:
				return "identisch";
			case ECompareType.startsWith:
				return "fangt an mit";
			case ECompareType.endsWith:
				return "endet mit";
			case ECompareType.contains:
				return "beinhaltet";
			default:
				return compareType;
		}
	}

	const selectCompareType =
		(
			<Select name="compareType" defaultValue={compareType} onValueChange={(value) => setCompareType(value as TCompareType)}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={compareType} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Vergleichstyp</SelectLabel>
						{
							Object.keys(ECompareType).map((key) => (
								<SelectItem key={key} value={key as TCompareType}>{displayCompareTypeText(key as TCompareType)}</SelectItem>
							))
						}
					</SelectGroup>
				</SelectContent>
			</Select>
		);

	const selectLabel =
		(
			<Select name="appliedField" defaultValue={label} onValueChange={(value) => setLabel(value)}>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Sonstige Ausgaben" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Labels</SelectLabel>
						{
							config.labels.map((labelConfig) => (
								<SelectItem key={labelConfig.name} value={labelConfig.name}>{labelConfig.name}</SelectItem>
							))
						}
					</SelectGroup>
				</SelectContent>
			</Select>
		);


	const dialog = <Dialog open={open} onOpenChange={setOpen}>
		<form>
			<DialogTrigger asChild>
				<Button variant="outline"><Group />Kategorie</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Kategorie zuweisungs Regel</DialogTitle>
					<DialogDescription className="text-xs">Erstellt oder loescht eine vorhandene Kategorie Zuweisung</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4">
					<div className="grid gap-3">
						<Label htmlFor="appliedField-1">Angewendetes Feld</Label>
						{selectAppliedField}
					</div>
					<div className="grid gap-3">
						<Label htmlFor="filterType-1">Vergleichstyp</Label>
						{selectCompareType}
					</div>
					<div className="grid gap-3">
						<Label htmlFor="text-1">Text</Label>
						<Input id="text-1" name="Text" value={text} onChange={(event) => {
							setText(event.target.value);
						}} />
					</div>
					<div className="grid gap-3">
						<Label htmlFor="label-1">Label</Label>
						{selectLabel}
					</div>
				</div>
				<DialogFooter >
					<div className="flex flex-row gap-2 justify-between w-full">
						<Button variant="destructive" disabled={!categoryRuleUUID} onClick={
							async () => {
								await deleteCategoryRule({
									data: categoryRuleUUID
								});
								setOpen(false);
								refreshAll();
							}} >Loeschen</Button>

						<div className="flex flex-row gap-2 justify-end w-full">
							<DialogClose asChild>
								<Button variant="outline">Abbrechen</Button>
							</DialogClose>
							<Button variant="default" onClick={
								async () => {
									const newCategoryRule: TCategoryRule = {
										appliedField: appliedField,
										compareType: compareType,
										text: text,
										label: label
									};
									await createNewFilter({
										data: newCategoryRule
									});
									setOpen(false);
									refreshAll();
								}
							}>Erstellen</Button>
						</div>
					</div>
				</DialogFooter>
			</DialogContent>
		</form>
	</Dialog >

	return dialog;
}
