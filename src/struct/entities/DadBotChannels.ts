import { Entity, ManyToOne, PrimaryKey } from "@mikro-orm/core";
import { Guilds } from "./Guilds";

@Entity({ collection: "DadBotChannels" })
export class DadBotChannels {

  @PrimaryKey({ columnType: "bigint", fieldName: "ChannelId" })
      ChannelId!: string;

  @ManyToOne({ entity: () => Guilds, fieldName: "GuildId", onUpdateIntegrity: "cascade", onDelete: "cascade", index: "GuildId" })
      GuildId!: Guilds;

}
