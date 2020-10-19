import { sql } from "./functions";


export async function digestJSONDeruloDB(): Promise<void> {
	// Table preparation
	{
		const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'ReminderList';").get();
		if (!table["count(*)"]) {
			// If the table isn't there, create it and setup the database correctly.
			sql.prepare("CREATE TABLE ReminderList (ID TEXT, json TEXT);").run();
			// Ensure that the "id" row is always unique and indexed.
			sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (ID);").run();
			sql.pragma("synchronous = 1");
			sql.pragma("journal_mode = wal");
		}
	}
	{
		const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'Emotes';").get();
		if (!table["count(*)"]) {
			// If the table isn't there, create it and setup the database correctly.
			sql.prepare("CREATE TABLE ReminderList (ID TEXT, json TEXT);").run();
			// Ensure that the "id" row is always unique and indexed.
			sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (ID);").run();
			sql.pragma("synchronous = 1");
			sql.pragma("journal_mode = wal");
		}
	}
	{
		const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'Tinder';").get();
		if (!table["count(*)"]) {
			// If the table isn't there, create it and setup the database correctly.
			sql.prepare("CREATE TABLE ReminderList (ID TEXT, json TEXT);").run();
			// Ensure that the "id" row is always unique and indexed.
			sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (ID);").run();
			sql.pragma("synchronous = 1");
			sql.pragma("journal_mode = wal");
		}
	}
	{
		const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'UserNickTable';").get();
		if (!table["count(*)"]) {
			// If the table isn't there, create it and setup the database correctly.
			sql.prepare("CREATE TABLE ReminderList (ID TEXT, json TEXT);").run();
			// Ensure that the "id" row is always unique and indexed.
			sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (ID);").run();
			sql.pragma("synchronous = 1");
			sql.pragma("journal_mode = wal");
		}
	}
	{
		const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guildConfig';").get();
		if (!table["count(*)"]) {
			// If the table isn't there, create it and setup the database correctly.
			sql.prepare("CREATE TABLE ReminderList (ID TEXT, json TEXT);").run();
			// Ensure that the "id" row is always unique and indexed.
			sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (ID);").run();
			sql.pragma("synchronous = 1");
			sql.pragma("journal_mode = wal");
		}
	}
}
