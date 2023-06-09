import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import * as colorette from "colorette";
import { Guild } from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: "guildCreate",
})
export default class GuildCreate extends Listener {
    public async run(guild: Guild) {
        this.container.logger.info(`\nBot was added to ${colorette.green(guild.name)}!! Size: ${guild.members.cache.size} members!\n`);
        await this.container.client.anniversaryService.checkBirthdayOnAdd(guild);
    }
}
