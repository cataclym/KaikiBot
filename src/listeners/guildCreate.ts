import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import { Guild } from "discord.js";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";

@ApplyOptions<ListenerOptions>({
    event: "guildCreate",
})
export default class GuildCreate extends KaikiListener {
    public async run(guild: Guild) {
        logger.info(`\nBot was added to ${guild.name}!! ${guild.members.cache.size} members!\n`);
        await this.client.anniversaryService.checkBirthdayOnAdd(guild);
    }
}
