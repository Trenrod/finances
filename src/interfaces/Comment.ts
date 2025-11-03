import z from "zod";

export const zsTransactionComment = z.object({
	uuid: z.string(),
	text: z.string(),
});
export type TTransactionComment = z.infer<typeof zsTransactionComment>;

export const zsTransactionCommentFromDB = z.record(z.string(), z.string());
export type TTransactionCommentFromDB = z.infer<typeof zsTransactionCommentFromDB>;
