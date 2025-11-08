import { readFile, writeFile } from "fs/promises";
import path from "path";
import { TTransactionCommentFromDB, zsTransactionCommentFromDB } from "~/interfaces/Comment";
import { TCategoryRule, TCategoryRulesFromDB, zsCategoryRulesFromDB } from "~/interfaces/Filter";

export class PersistanceClient {
	private static instance: PersistanceClient;

	private constructor() {
		// Initialize your client here (e.g., set up connections, configurations, etc.)
	}

	public static getInstance(): PersistanceClient {
		if (!PersistanceClient.instance) {
			PersistanceClient.instance = new PersistanceClient();
		}
		return PersistanceClient.instance;
	}

	public async getAllCategoryRules(rootConfigPath: string): Promise<TCategoryRulesFromDB> {
		// Logic to retrieve all category rules from the persistance layer
		const categoryRulesFromDBRaw = await readFile(path.join(rootConfigPath, 'categoryRulesFromDB.json'), 'utf-8');
		const categoryRulesFromDB = zsCategoryRulesFromDB.parse(JSON.parse(categoryRulesFromDBRaw));
		return categoryRulesFromDB;
	}

	public async getAllTransactionComments(rootConfigPath: string): Promise<TTransactionCommentFromDB> {
		// Logic to retrieve all transaction comments from the persistance layer
		const transactionCommentsFromDBRaw = await readFile(path.join(rootConfigPath, 'transactionCommentsFromDB.json'), "utf-8");
		const transactionCommentsFromDB = zsTransactionCommentFromDB.parse(JSON.parse(transactionCommentsFromDBRaw));
		return transactionCommentsFromDB;
	}

	public async setAllTransactionComments(comments: TTransactionCommentFromDB) {
		// Logic to save all transaction comments to the persistance layer
		const rootConfigPath = process.env.CONFIG_PATH || './';
		await writeFile(path.join(rootConfigPath, 'transactionCommentsFromDB.json'), JSON.stringify(comments, null, 2), 'utf-8');
	}

	public async setTransactionComments(uuid: string, text: string) {
		// Read env for config path
		const rootConfigPath = process.env.CONFIG_PATH || './';
		const allComments = await this.getAllTransactionComments(rootConfigPath);
		if (text === "") {
			delete allComments[uuid];
			await this.setAllTransactionComments(allComments);
			return;
		}
		allComments[uuid] = text;
		await this.setAllTransactionComments(allComments);
	}

	async saveCategoryRule(data: TCategoryRule) {
		// Logic to save a category rule to the persistance layer
		const rootConfigPath = process.env.CONFIG_PATH || './';
		const categoryRulesFromDB = await this.getAllCategoryRules(rootConfigPath);
		if (!data.uuid) {
			throw new Error("Category rule must have a uuid to be saved");
		}
		categoryRulesFromDB[data.uuid] = data;
		await writeFile(path.join(rootConfigPath, 'categoryRulesFromDB.json'), JSON.stringify(categoryRulesFromDB, null, 2), 'utf-8');
	}

	async deleteCategoryRule(uuid: string) {
		// Logic to delete a category rule from the persistance layer
		const rootConfigPath = process.env.CONFIG_PATH || './';
		const categoryRulesFromDB = await this.getAllCategoryRules(rootConfigPath);
		delete categoryRulesFromDB[uuid];
		await writeFile(path.join(rootConfigPath, 'categoryRulesFromDB.json'), JSON.stringify(categoryRulesFromDB, null, 2), 'utf-8');
	}
}