import { _MigrationsModel } from "../struct/models";
import { IMigration } from "../interfaces/IDocuments";
import { Model } from "mongoose";
import logger from "loglevel";
import * as Path from "path";
import fs from "fs";
import { Collection } from "discord.js";
import chalk from "chalk";

export class Migrations {
	migrationModels: Model<IMigration, unknown, Record<any, any>>;
	private readonly currentFolder: string;
	public migrationClasses: Collection<string, Migration>;
	constructor() {
		this.migrationModels = _MigrationsModel;
		this.currentFolder = Path.join(__dirname, ".");
		this.migrationClasses = new Collection();
	}

	public async loadClasses() {
		const filePaths = this.getFilePaths();
		for await (const filePath of filePaths) {
			this.load(filePath);
		}
	}

	// Runs the actual DB migration
	public async runMigration(migration: Migration) {

		// Checks if migration exists
		const result = await this.migrationModels.findOne({
			migrationId: migration.migrationId,
		});

		if (result) {
			// Return when it exists
			return false;
		}

		// Executes the migration script
		logger.warn(`Migration running - "${migration.migrationId}" [${chalk.hex("#ffa500")(migration.version)}]`);
		await migration.migrate();

		// Creates a document in the migration collection
		new this.migrationModels({
			migrationId: migration.migrationId,
			versionString: migration.version,
		})
			.save()
			.catch(err => logger.error(err));

		logger.info(`Migration finished - "${migration.migrationId}" [${chalk.hex("#ffa500")(migration.version)}]`);

		return true;
	}

	public getFilePaths(): string[] {
		const result = [];
		const files = fs.readdirSync(this.currentFolder);

		for (const file of files) {
			if (file.endsWith(".js")) result.push("./" + file);
		}

		return result;
	}

	private load(filePath: string) {
		const mod = ((m: { default: Migration } | null) => {
			if (!m) return null;
			if (m.default instanceof Migration) return m;
			return null;
			// eslint-disable-next-line @typescript-eslint/no-var-requires
		})(require(filePath));

		if (!mod) {
			return;
		}

		if (this.migrationClasses.has(mod.default.migrationId)) throw new Error("Class already loaded: " + mod.default.migrationId);

		this.migrationClasses.set(mod.default.migrationId, mod.default);
		return mod;
	}

	public async runAllMigrations() {
		let count = 0;
		await this.loadClasses();
		const promise = new Promise<void>((resolve, reject) => this.migrationClasses.each(async (migration) => {
			const bool = await this.runMigration(migration);
			if (bool) {
				count++;
				resolve();
			}
			return migration;
		}));
		return promise.then(() => {
			return count;
		});
	}
}

export class Migration {
	readonly name: string;
	readonly version: string;
	readonly hash: string;
	public migrate: () => any | Promise<any>;
	public migrationId: string;
	constructor(data: {
		/**
		 *	Git commit hash, short version
		* @param {string} hash git rev-parse --short HEAD
		*/
		hash: string;
		name: string,
		version: string,
		migration: () => any,
	}) {
		this.hash = data.hash;
		this.name = data.name;
		this.version = data.version;
		this.migrate = data.migration;
		this.migrationId = `${this.hash}_${this.name}`;
	}
}
