import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Guild } from "discord.js";
import logger from "loglevel";
import type KaikiAkairoClient from "../lib/Kaiki/KaikiAkairoClient";

@ApplyOptions<ListenerOptions>({
    event: "guildCreate",
})
export default class GuildCreate extends Listener {
    public async run(guild: Guild) {
        logger.info(`\nBot was added to ${guild.name}!! ${guild.members.cache.size} members!\n`);
        await (this.container.client as KaikiAkairoClient<true>).anniversaryService.checkBirthdayOnAdd(guild);
    }
}
