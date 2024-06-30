import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import * as colorette from "colorette";
import { Guild } from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: Events.GuildCreate,
})
export default class GuildCreate extends Listener {
    public async run(guild: Guild) {
        guild.client.logger.info(
            `\nBot was added to ${colorette.green(guild.name)} | Size: ${guild.memberCount} members!\n`
        );
        await guild.client.anniversaryService.checkBirthdayOnAdd(guild);
    }
}
