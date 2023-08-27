import { ApplyOptions } from "@sapphire/decorators";
import { Args, MessageCommand } from "@sapphire/framework";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Message, PermissionsBitField } from "discord.js";
import GreetHandler from "../../lib/GreetHandler";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "updateembed",
    aliases: ["embedupdate", "upemb", "embup"],
    preconditions: ["GuildOnly"],
    requiredUserPermissions: PermissionsBitField.Flags.ManageGuild,
})
export class UpdateEmbed extends KaikiCommand {
    public async messageRun(message: Message<true>, args: Args, context: MessageCommand.RunContext) {

        const { currentTime, buttonArray } = this.createButtonArray();

        const embed = await this.client.orm.guilds.findUnique({
            where: {
                Id: BigInt(message.guildId),
            },
            select: {
                WelcomeMessage: true,
            },
        });

        if (!embed?.WelcomeMessage) return;

        const greetHandler = new GreetHandler(message.member!);

        const embedMessage = await greetHandler.createAndParseGreetMsg({
            message: embed.WelcomeMessage,
            channel: null,
            timeout: null,
        });

        const buttonsRow = this.createButtons(buttonArray);

        const sentEmbedMsg = await message.reply({ ...embedMessage, components: [buttonsRow] });

        const collector = sentEmbedMsg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: (i) => {

                if (buttonArray.includes(i.customId) && message.author.id === i.user.id) {
                    return true;
                }

                else {
                    i.deferUpdate();
                    return false;
                }
            },
            time: 120000,
        });

    }

    private createButtons(buttonArray: string[]) {

        const title = new ButtonBuilder()
            .setCustomId(buttonArray[0])
            .setLabel("Title")
            .setStyle(ButtonStyle.Primary);

        const description = new ButtonBuilder()
            .setCustomId(buttonArray[1])
            .setLabel("Description")
            .setStyle(ButtonStyle.Secondary);

        const author = new ButtonBuilder()
            .setCustomId(buttonArray[2])
            .setLabel("Author")
            .setStyle(ButtonStyle.Secondary);

        const color = new ButtonBuilder()
            .setCustomId(buttonArray[3])
            .setLabel("Color")
            .setStyle(ButtonStyle.Secondary);

        const image = new ButtonBuilder()
            .setCustomId(buttonArray[4])
            .setLabel("Image")
            .setStyle(ButtonStyle.Secondary);

        const thumbnail = new ButtonBuilder()
            .setCustomId(buttonArray[5])
            .setLabel("Thumbnail")
            .setStyle(ButtonStyle.Secondary);

        const url = new ButtonBuilder()
            .setCustomId(buttonArray[6])
            .setLabel("URL")
            .setStyle(ButtonStyle.Secondary);

        const apply = new ButtonBuilder()
            .setCustomId(buttonArray[7])
            .setLabel("Apply")
            .setStyle(ButtonStyle.Success);

        return new ActionRowBuilder<ButtonBuilder>()
            .addComponents(title,
                description,
                author,
                color,
                image,
                thumbnail,
                url,
                apply);
    }

    private createButtonArray() {
        const currentTime = new Date().getTime();
        const buttonArray = [
            `title${currentTime}`,
            `description${currentTime}`,
            `author${currentTime}`,
            `color${currentTime}`,
            `image${currentTime}`,
            `thumbnail${currentTime}`,
            `url${currentTime}`,
            `apply${currentTime}`,
        ];

        return {
            currentTime,
            buttonArray,
        };
    }
}
