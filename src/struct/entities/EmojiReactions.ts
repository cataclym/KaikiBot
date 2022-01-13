import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Guilds } from "./Guilds";

@Entity({ collection: "EmojiReactions" })
export class EmojiReactions {

  @PrimaryKey({ columnType: "bigint", fieldName: "Id" })
      Id!: string;

  @Property({ columnType: "bigint", fieldName: "EmojiId" })
      EmojiId!: string;

  @Property({ fieldName: "TriggerString", length: 255 })
      TriggerString!: string;

  @ManyToOne({ entity: () => Guilds, fieldName: "GuildId", onUpdateIntegrity: "cascade", onDelete: "cascade", index: "GuildId" })
      GuildId!: Guilds;

}
