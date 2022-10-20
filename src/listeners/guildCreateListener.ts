import { Guild } from "discord.js";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";

export default class GuildCreateListener extends KaikiListener {
    constructor() {
        super("guildCreate", {
            event: "guildCreate",
            emitter: "client",
        });
    }

    public async exec(guild: Guild) {
        logger.info(`\nBot was added to ${guild.name}!! ${guild.members.cache.size} members!\n`);
        await this.client.anniversaryService.checkBirthdayOnAdd(guild);
    }
}
