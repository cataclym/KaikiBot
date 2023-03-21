import { MessageCommand, Precondition } from "@sapphire/framework";
import { Message } from "discord.js";
import DadBot from "../../commands/Etc/dadBot";
import Constants from "../../struct/Constants";
import KaikiAkairoClient from "./KaikiAkairoClient";

export class DadBotPrecondition extends Precondition {
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

                if (match.length && match.length <= (process.env.DADBOT_MAX_LENGTH || Constants.MAGIC_NUMBERS.CMDS.ETC.DAD_BOT.DADBOT_MAX_LENGTH)) {
                    if (!DadBot.nickname.has(message.member.id)) DadBot.nickname.set(message.member.id, match);
                }
            }
        }

        if (DadBot.nickname.has(message.member.id)) return this.ok();
        return this.error();
    }
}

export class OwnerOnlyPrecondition extends Precondition {
    public override async messageRun(message: Message, command: MessageCommand, context: Precondition.Context) {
        return this.checkOwner(message.author.id);
    }

    private async checkOwner(id: string) {
        return (this.container.client as KaikiAkairoClient<true>).owner.id === id
            ? this.ok()
            : this.error({ message: "Only the bot owner can use this command!" });
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        OwnerOnly: never;
    }
}
