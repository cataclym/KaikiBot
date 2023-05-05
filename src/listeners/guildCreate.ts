import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Guild } from "discord.js";
import type KaikiSapphireClient from "../lib/Kaiki/KaikiSapphireClient";

@ApplyOptions<ListenerOptions>({
    event: "guildCreate",
})
export default class GuildCreate extends Listener {
    public async run(guild: Guild) {
        this.container.logger.info(`\nBot was added to ${guild.name}!! ${guild.members.cache.size} members!\n`);
        await (this.container.client as KaikiSapphireClient<true>).anniversaryService.checkBirthdayOnAdd(guild);
    }
}
