import logger from "loglevel";
import * as Path from "path";
import fs from "fs";
import { Collection } from "discord.js";
import chalk from "chalk";
import { Connection } from "mysql2/promise";
import { execSync } from "child_process";

export class Migrations {
  private readonly currentFolder: string;
  public migrationClasses: Collection<string, Migration>;
  public db: Connection;

  constructor(db: Connection) {
      this.currentFolder = Path.join(__dirname, ".");
      this.migrationClasses = new Collection();
      this.db = db;
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
      const result = await this.db.query("SELECT migrationId FROM _Migrations WHERE MigrationId = ?", [migration.migrationId])
          .catch(e => logger.warn(e));

      if (result && (result[0] as []).length) {
      // Return when it exists
          return false;
      }

      // Executes the migration script
      logger.warn(`Migration running - [${chalk.hex("#ffa500")(migration.migrationId)}]`);
      await this.db.execute("INSERT INTO _Migrations (migrationId, versionString) VALUES (?, ?)", [migration.migrationId, migration.version]);
      const migrated = await migration.migrate(this.db);
      logger.info(`Migration finished - [${chalk.hex("#ffa500")(migration.migrationId)}]`);

      return migrated;
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
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = ((m: { default: Migration } | null) => m)(require(filePath));

      if (!mod?.default) {
          return;
      }

      if (this.migrationClasses.has(mod.default.migrationId)) throw new Error(`Class already loaded: ${mod.default.migrationId}`);

      this.migrationClasses.set(mod.default.migrationId, mod.default);
      return mod;
  }

  public async runAllMigrations() {
      let count = 0;
      await this.loadClasses();
      const promise = new Promise<void>((resolve) => this.migrationClasses.each(async (migration) => {
          const number = await this.runMigration(migration);
          if (number) {
              count += number;
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
  readonly hash?: string;
  public migrate: (db: Connection) => number | Promise<number>;
  public migrationId: string;

  constructor(data: {
    /**
     *  Git commit hash, short version
     * @param {string} hash git rev-parse --short HEAD
     */
    hash?: string;
    name: string,
    version: string,
    migration: (db: Connection) => any,
  }) {
      this.hash = data.hash;
      this.name = data.name;
      this.version = data.version;
      this.migrate = data.migration;
      this.migrationId = `${this.hash || execSync("git rev-parse --short HEAD").toString().trim()}_${this.name}`;
  }
}
