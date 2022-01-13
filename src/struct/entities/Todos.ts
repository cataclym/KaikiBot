import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { DiscordUsers } from "./DiscordUsers";

@Entity({ collection: "Todos" })
export class Todos {

  @PrimaryKey({ columnType: "bigint", fieldName: "Id" })
      Id!: string;

  @ManyToOne({ entity: () => DiscordUsers, fieldName: "UserId", onUpdateIntegrity: "cascade", onDelete: "cascade", nullable: true, defaultRaw: "NULL", index: "UserId" })
      UserId?: DiscordUsers;

  @Property({ fieldName: "String", length: 255 })
      String!: string;

}
