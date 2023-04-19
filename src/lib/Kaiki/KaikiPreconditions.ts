import { AllFlowsPrecondition, Precondition } from "@sapphire/framework";
import { CommandInteraction, ContextMenuCommandInteraction, Message } from "discord.js";
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

                if (match.length && match.length <= parseInt(process.env.DADBOT_NICKNAME_LENGTH || String(Constants.MAGIC_NUMBERS.CMDS.ETC.DAD_BOT.DADBOT_NICK_LENGTH))) {
                    if (!DadBot.nickname.has(message.member.id)) DadBot.nickname.set(message.member.id, match);
                }
            }
        }

        if (DadBot.nickname.has(message.member.id)) return this.ok();
        return this.error();
    }
}

export class UserPrecondition extends AllFlowsPrecondition {
    public override async messageRun(message: Message) {
        return this.checkOwner(message.author.id);
    }

    public override chatInputRun(interaction: CommandInteraction) {
        return this.checkOwner(interaction.user.id);
    }

    public override contextMenuRun(interaction: ContextMenuCommandInteraction) {
        return this.checkOwner(interaction.user.id);
    }

    private async checkOwner(id: string) {
        return (this.container.client as KaikiAkairoClient<true>).owner.id === id
            ? this.ok()
            : this.error({ message: "Only the bot owner can use this command!" });
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        DadBot: never;
        OwnerOnly: never;
    }
}
