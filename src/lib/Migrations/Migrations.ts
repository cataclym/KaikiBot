import chalk from "chalk";
import { execSync } from "child_process";
import { Collection } from "discord.js";
import * as fs from "fs";
import logger from "loglevel";
import { Pool } from "mysql2/promise";
import * as Path from "path";
import KaikiAkairoClient from "../Kaiki/KaikiAkairoClient";

export class Migrations {
    private readonly currentFolder: string;
    public migrationClasses: Collection<string, Migration>;
    public db: Pool;
    private readonly _client: KaikiAkairoClient<true>;
    private _count: number;

    constructor(db: Pool, client: KaikiAkairoClient<true>) {
        this.currentFolder = Path.join(__dirname, "./scripts");
        this.migrationClasses = new Collection();
        this.db = db;
        this._client = client;
        this._count = 0;
    }

    private async loadClasses() {
        const filePaths = this.getFilePaths();
        for await (const filePath of filePaths) {
            this.load(filePath);
        }
    }

    // Runs the actual DB migration
    private async runMigration(migration: Migration) {

        // Checks if migration exists
        const result = await this.db.query("SELECT migrationId FROM _Migrations WHERE VersionString = ?", [migration.version])
            .catch(e => logger.warn(e));

        if (result && (result[0] as []).length) {
            // Return when it exists
            return false;
        }

        // Executes the migration script
        logger.warn(`Migration running - [${chalk.hex("#ffa500")(`${migration.name} - ${migration.migrationId}`)}]`);
        await this.db.execute("INSERT INTO _Migrations (migrationId, versionString) VALUES (?, ?)", [migration.migrationId, migration.version]);
        const migrated = await new Migration(migration).migration(this._client);
        logger.info(`Migration finished - [${chalk.hex("#ffa500")(`${migration.name} - ${migration.migrationId}`)}]`);

        return migrated;
    }

    private getFilePaths(): string[] {
        const result = [];
        try {
            const files = fs.readdirSync(this.currentFolder);

            for (const file of files) {
                if (file.endsWith(".js")) result.push("./scripts/" + file);
            }

            return result;
        }
        catch {
            return result;
        }
    }

    private load(filePath: string) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = ((m: { default: typeof Migration } | null) => m)(require(filePath));

        if (!mod || !mod.default) {
            return;
        }

        const migration = new mod.default(undefined as unknown as MigrationConstructionData);

        if (this.migrationClasses.has(migration.migrationId)) throw new Error(`Class already loaded: ${migration.migrationId}`);

        this.migrationClasses.set(migration.migrationId, migration);
        return migration;
    }

    public async runAllMigrations() {
        await this.loadClasses();
        const promise = new Promise<void>((resolve) => this.migrationClasses.each(async (migration) => {
            const number = await this.runMigration(migration);
            if (number) {
                this._count += number;
                resolve();
            }
            return migration;
        }));
        return promise.then(() => {
            return this._count;
        });
    }
}

type MigrationConstructionData = {
    /**
     *  Git commit hash, short version
     * @param {string} hash git rev-parse --short HEAD
     */
    hash?: string;
    name: string,
    version: string,
    migration: (client: KaikiAkairoClient<true>) => Promise<number> | number;

}

export class Migration {
    public name: string;
    public version: string;
    public hash?: string;
    public migrationId: string;
    public migration: (client: KaikiAkairoClient<true>) => Promise<number> | number;

    constructor(data: MigrationConstructionData) {
        this.migration = data.migration;
        this.hash = data.hash;
        this.name = data.name;
        this.version = data.version;
        this.migrationId = this.hash || `${execSync("git rev-parse --short HEAD").toString().trim()}_${this.name}`;
    }
}
