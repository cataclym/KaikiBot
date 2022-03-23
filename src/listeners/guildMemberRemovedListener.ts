import { GuildMember } from "discord.js";
import GreetHandler from "../lib/GreetHandler";
import KaikiListener from "../lib/Kaiki/KaikiListener";

export default class GuildMemberRemovedListener extends KaikiListener {
    constructor() {
        super("guildMemberRemove", {
            event: "guildMemberRemove",
            emitter: "client",
        });
    }

    public async exec(member: GuildMember): Promise<void> {

        await GreetHandler.handleGoodbyeMessage(member);

        const GuildId = BigInt(member.id),
            gUser = await this.client.db.getOrCreateGuildUser(member.id, GuildId);

        const leaveRoles = member.roles.cache.map(role => this.client.orm.leaveRoles.create({
            data: {
                RoleId: BigInt(role.id),
                GuildUsers: {
                    connect: {
                        Id_UserId: {
                            Id: gUser.Id,
                            UserId: gUser.UserId,
                        },
                    },
                },
            },
        }));
        await this.client.orm.$transaction(leaveRoles);
    }
}
