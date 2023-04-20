import { Precondition } from "@sapphire/framework";
import { Message } from "discord.js";
import dadBotCmd from "../commands/Etc/dadBot";
import Constants from "../struct/Constants";

export class DadBot extends Precondition {
    public override async messageRun(message: Message<true>) {

        if (!message.member) return this.error();

        if (!message.guild.isDadBotEnabled()) return this.error();

        if (message.member.hasExcludedRole()) return this.error();

        if (message.content.includes("||")) return this.error();

        for (const item of Constants.dadBotArray) {

            const r = new RegExp(`(^|\\s|$)(?<statement>(?<prefix>${item})\\s*(?<nickname>.*)$)`, "mi");
            if (r.test(message.content)) {

                let match = message.content.match(r)?.groups?.nickname;
                if (!match) continue;

                const splits = match.split(new RegExp(`${item}`, "mig"));
                if (splits.length > 1) match = splits.reduce((a, b) => a.length <= b.length && a.length > 0 ? a : b);

                if (match.length && match.length <= parseInt(process.env.DADBOT_NICKNAME_LENGTH || String(Constants.MAGIC_NUMBERS.CMDS.ETC.DAD_BOT.DADBOT_NICK_LENGTH))) {
                    if (!dadBotCmd.nickname.has(message.member.id)) dadBotCmd.nickname.set(message.member.id, match);
                }
            }
        }

        if (dadBotCmd.nickname.has(message.member.id)) return this.ok();
        return this.error();
    }
}
