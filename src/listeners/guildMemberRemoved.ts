import { GuildMember } from "discord.js";
import GreetHandler from "../lib/GreetHandler";
import { KaikiListener } from "kaiki";

export default class GuildMemberRemovedListener extends KaikiListener {
    constructor() {
        super("guildMemberRemove", {
            event: "guildMemberRemove",
            emitter: "client",
        });
    }
    public async exec(member: GuildMember): Promise<void> {

        await GreetHandler.handleGoodbyeMessage(member);

        const leaveRoles = member.roles.cache.map(role => ({
            RoleId: BigInt(role.id),
            UserId: {
                G,
            },
        }));

        await this.client.orm.leaveRoles.createMany({
            skipDuplicates: true,
            data: [{
                RoleId: BigInt(1232),
                UserId: {

                },
            }],
        });
    }
}
