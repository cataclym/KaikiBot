import { ApplyOptions } from "@sapphire/decorators";
import { ListenerOptions } from "@sapphire/framework";
import { GuildMember } from "discord.js";
import GreetHandler from "../lib/GreetHandler";
import KaikiListener from "../lib/Kaiki/KaikiListener";

@ApplyOptions<ListenerOptions>({
    event: "guildMemberRemove",
})
export default class GuildMemberRemovedListener extends KaikiListener {
    public async run(member: GuildMember): Promise<void> {

        await GreetHandler.handleGoodbyeMessage(member);

        const GuildId = BigInt(member.guild.id);
        const MemberId = BigInt(member.id);

        const leaveRoles = member.roles.cache.map(role => {
            return this.client.orm.leaveRoles.create({
                data: {
                    RoleId: BigInt(role.id),
                    GuildUsers: {
                        connectOrCreate: {
                            create: {
                                UserId: MemberId,
                                GuildId: GuildId,
                            },
                            where: {
                                UserId_GuildId: {
                                    UserId: MemberId,
                                    GuildId: GuildId,
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
