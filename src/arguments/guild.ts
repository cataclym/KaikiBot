import { Argument } from "@sapphire/framework";
import { Guild } from "discord.js";

export class GuildArgument extends Argument<Guild> {
    public async run(parameter: string, context: Argument.Context<Guild>) {
        const guild = context.message.client.guilds.cache.find(
            (g) =>
                g.name.toLowerCase() === parameter.toLowerCase() ||
				g.id === parameter
        );

        if (guild) return this.ok(guild);

        return this.error({ parameter });
    }
}
