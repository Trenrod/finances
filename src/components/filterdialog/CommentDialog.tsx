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

import React from "react"
import { createServerFn } from "@tanstack/react-start"
import { TTransactionComment, zsTransactionComment } from "~/interfaces/Comment"
import { PersistanceClient } from "~/lib/persistance"
import { NotebookPen } from "lucide-react"

/**
 * Update existing Filter entry
 */
const setComment = createServerFn({
	method: 'POST',
})
	.inputValidator((data: unknown) => zsTransactionComment.parse(data))
	.handler(async ({ data }) => {
		try {
			await PersistanceClient.getInstance().setTransactionComments(data.uuid, data.text);
			return { data };
		} catch (error) {
			console.error("Error setting comment:", error);
			return { error };
		}
	});

export function CommentDialog({ bankTransaction, refreshAll }: { bankTransaction: IExtendedBankTransaction, refreshAll: () => Promise<void> }) {

	const [text, setText] = React.useState<string>(bankTransaction.comment ?? "");
	const [open, setOpen] = React.useState<boolean>(false);

	const dialog = <Dialog open={open} onOpenChange={setOpen}>
		<form>
			<DialogTrigger asChild>
				<Button variant="outline"><NotebookPen />Kommentar</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Kommentiere transaktion</DialogTitle>
					<DialogDescription className="text-xs">Erstelle, aendere oder loesche Kommentar</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4">
					<div className="grid gap-3">
						<Label htmlFor="text-1">Text</Label>
						<Input id="text-1" name="Text" value={text} onChange={(event) => {
							setText(event.target.value);
						}} />
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Abbrechen</Button>
					</DialogClose>
					<Button variant="default" onClick={
						async () => {
							const newComment: TTransactionComment = {
								uuid: bankTransaction.UUID,
								text: text,
							};
							await setComment({
								data: newComment
							});
							setOpen(false);
							refreshAll();
						}
					}>Kommentieren</Button>
				</DialogFooter>
			</DialogContent>
		</form>
	</Dialog >

	return dialog;
}
