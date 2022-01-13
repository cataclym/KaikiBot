import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { GuildUsers } from "./GuildUsers";

@Entity({ collection: "UserNicknames" })
export class UserNicknames {

  @PrimaryKey({ columnType: "bigint", fieldName: "Id" })
      Id!: string;

  @Property({ fieldName: "Nickname", length: 255 })
      Nickname!: string;

  @ManyToOne({ entity: () => GuildUsers, fieldName: "GuildUserId", onUpdateIntegrity: "cascade", onDelete: "cascade", nullable: true, defaultRaw: "NULL", index: "GuildUserId" })
      GuildUserId?: GuildUsers;

}
