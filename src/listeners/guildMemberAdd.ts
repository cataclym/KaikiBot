import { Listener } from "@cataclym/discord-akairo";
import { GuildMember } from "discord.js";
import { MemberOnAddBirthday } from "../nsb/AnniversaryRoles";

export const greetLeaveCache: {
	[guildID: string]: {
		welcome: boolean,
		goodbye: boolean,
	}
} = {};

export default class GuildMemberAddListener extends Listener {
	constructor() {
		super("guildMemberAdd", {
			event: "guildMemberAdd",
			emitter: "client",
		});
	}
	public async exec(member: GuildMember): Promise<void> {

		MemberOnAddBirthday(member);

		export async function checkGreetLeave(guildMember: GuildMember) {

		}
	}
}

