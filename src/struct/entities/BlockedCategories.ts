import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Guilds } from "./Guilds";

@Entity({ collection: "BlockedCategories" })
export class BlockedCategories {

  @PrimaryKey({ columnType: "bigint", fieldName: "Id" })
      Id!: string;

  @ManyToOne({ entity: () => Guilds, fieldName: "GuildId", onUpdateIntegrity: "cascade", onDelete: "cascade", index: "GuildId" })
      GuildId!: Guilds;

  @Property({ columnType: "bigint", fieldName: "CategoryTarget" })
      CategoryTarget!: string;

}
