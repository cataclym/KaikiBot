import { AllFlowsPrecondition } from "@sapphire/framework";
import { CommandInteraction, ContextMenuCommandInteraction, Message } from "discord.js";
import KaikiAkairoClient from "../lib/Kaiki/KaikiAkairoClient";

export class OwnerOnly extends AllFlowsPrecondition {
    public override messageRun(message: Message) {
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
