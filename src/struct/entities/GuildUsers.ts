import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Guilds } from "./Guilds";

@Entity({ collection: "GuildUsers" })
export class GuildUsers {

  @PrimaryKey({ columnType: "bigint", fieldName: "Id" })
      Id!: string;

  @PrimaryKey({ columnType: "bigint", fieldName: "UserId" })
      UserId!: string;

  @Property({ columnType: "bigint", fieldName: "UserRole", nullable: true, defaultRaw: "NULL" })
      UserRole?: string;

  @ManyToOne({ entity: () => Guilds, fieldName: "GuildId", onUpdateIntegrity: "cascade", onDelete: "cascade", index: "GuildId" })
      GuildId!: Guilds;

  @Property({ columnType: "timestamp", fieldName: "CreatedAt", defaultRaw: "current_timestamp()" })
      CreatedAt!: Date;

}
