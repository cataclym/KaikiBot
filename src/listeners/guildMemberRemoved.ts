import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import { GuildMember } from "discord.js";
import GreetHandler from "../lib/GreetHandler";
import KaikiListener from "../lib/Kaiki/KaikiListener";

@ApplyOptions<ListenerOptions>({
    event: "guildMemberRemove",
})
export default class GuildMemberRemoved extends KaikiListener {
    public async run(member: GuildMember): Promise<void> {

        await GreetHandler.handleGoodbyeMessage(member);

        const guildId = BigInt(member.guild.id);
        const memberId = BigInt(member.id);

        const leaveRoles = member.roles.cache.map(role => {
            return this.client.orm.leaveRoles.create({
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
        await this.client.orm.$transaction(leaveRoles);
    }
}
