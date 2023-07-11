import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { GuildMember } from "discord.js";
import GreetHandler from "../lib/GreetHandler";

@ApplyOptions<ListenerOptions>({
    event: "guildMemberRemove",
})
export default class GuildMemberRemoved extends Listener {
    public async run(member: GuildMember): Promise<void> {

        const greetHandler = new GreetHandler(member);
        await greetHandler.handleGoodbyeMessage();

        const guildId = BigInt(member.guild.id);
        const memberId = BigInt(member.id);

        const { client } = this.container;

        const leaveRoles = member.roles.cache.map(role => {
            return client.orm.leaveRoles.create({
                data: {
                    RoleId: BigInt(role.id),
                    GuildUsers: {
                        connectOrCreate: {
                            create: {
                                UserId: memberId,
                                GuildId: guildId,
                            },
                            where: {
                                UserId_GuildId: {
                                    UserId: memberId,
                                    GuildId: guildId,
                                },
                            },
                        },
                    },
                },
            });
        });
        await client.orm.$transaction(leaveRoles);
    }
}
