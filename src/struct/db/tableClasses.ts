// import { connection } from "../../index";
// import { blockedCategories } from "../constants";
// import { FieldPacket, OkPacket } from "mysql2/promise";
//
// interface Repository<T> {
//     add(): Promise<T>
// }
//
// type BaseRepository<T> = Repository<T>
//
// interface _Migrations {
//     MigrationId: string,
//     VersionString: string,
// }
//
// class Repository<T> implements BaseRepository<T> {
//     public static tableName: string;
//     public static connection = connection;
//
//     public static async add(columns: string[] | any, values: string[] | any, ...rest: any) {
//         return await this.connection.query(`INSERT INTO ${this.tableName} (${columns.join(", ")}) VALUES ()`, values);
//     }
//     public static async deleteAll() {
//         return await this.connection.query(`DELETE FROM ${this.tableName}`);
//     }
//     public static async deleteWhere(columns: string[], value: string) {
//         const columnsString = columns.map((c, i) => {
//             return i === columns.length-1 ? `${c} = ?` : `${c} = ?,`;
//         });
//         return await this.connection.query(`DELETE FROM ${this.tableName} WHERE ${columnsString}`, [value]);
//     }
//     public static async update(column: string, values: string[]) {
//         await this.connection.query(`UPDATE ${this.tableName} SET ${column} = ?`, values);
//     }
//     public static async updateMany(columns: string[], values: string[]) {
//         const columnsString = columns.map((c, i) => {
//             return i === columns.length-1 ? `${c} = ?` : `${c} = ?,`;
//         });
//         await this.connection.query(`UPDATE BotSettings SET ${columnsString}`, values);
//     }
// }
//
// export class _MigrationsRepository extends Repository<_Migrations> {
//     static override async add(MigrationId: string, VersionString: string): Promise<[OkPacket, FieldPacket[]]> {
//         return await this.connection.query("INSERT INTO _Migrations (MigrationId, VersionString) VALUES (?, ?)", [MigrationId, VersionString]);
//     }
//     static async delete(MigrationId: string) {
//         await this.connection.query("DELETE FROM _Migrations WHERE MigrationId = ?", [MigrationId]);
//     }
// }
//
// export class BlockedCategoriesRepository extends Repository {
//     static async add(GuildId: string, CategoryTarget: blockedCategories): Promise<[OkPacket, FieldPacket[]]> {
//         return await this.connection.query("INSERT INTO BlockedCategories (GuildId, CategoryTarget) VALUES (?, ?)", [GuildId, CategoryTarget]);
//     }
//     static async delete(GuildId: string, CategoryTarget: blockedCategories) {
//         return await this.connection.query("DELETE FROM BlockedCategories WHERE GuildId = ? AND CategoryTarget = ?", [GuildId, CategoryTarget]);
//     }
// }
//
// export class BotSettingsRepository extends Repository {
//     static tableName = "BotSettings";
// }
// export class CommandStatsRepository extends Repository {
//     static tableName = "CommandStats";
// }
// export class CurrencyTransactionsRepository extends Repository {
//     static tableName = "CurrencyTransactions";
// }
// export class DadBotChannelsRepository extends Repository {
//     static tableName = "DadBotChannels";
// }
// export class DiscordUsersRepository extends Repository {
//     static tableName = "DiscordUsers";
// }
// export class EmojiReactionsRepository extends Repository {
//     static tableName = "EmojiReactions";
// }
// export class EmojiStatsRepository extends Repository {
//     static tableName = "EmojiStats";
// }
// export class GuildsRepository extends Repository {
//     static tableName = "Guilds";
// }
// export class LeaveRolesRepository extends Repository {
//     static tableName = "LeaveRoles";
// }
// export class TodosRepository extends Repository {
//     static tableName = "Todos";
// }
// export class UserNicknamesRepository extends Repository {
//     static tableName = "UserNicknames";
// }
