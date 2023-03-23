import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, GuildPremiumTier, Message } from "discord.js";
import { KaikiSubCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiSubCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Roles, { rolePermissionCheck } from "../../lib/Roles";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiSubCommandOptions>({
    name: "myrole",
    aliases: ["mr"],
    description: "Checks your assigned user role. Can set role color, name and icon.",
    usage: ["color FF0000", "name Dreb", "icon :someEmoji:", "icon reset"],
    requiredClientPermissions: ["ManageRoles"],
    preconditions: ["GuildOnly"],
    subcommands: [
        {
            name: "name",
            messageRun: "nameRun",
        },
        {
            name: "color",
            messageRun: "colorRun",
        },
        {
            name: "colour",
            messageRun: "colorRun",
        },
        {
            name: "clr",
            messageRun: "colorRun",
        },
        {
            name: "icon",
            messageRun: "iconRun",
        },
        {
            name: "image",
            messageRun: "iconRun",
        },
    ],
})
export default class MyRoleCommand extends KaikiCommand {
    public async messageRun(message: Message<true>): Promise<Message> {

        const myRole = await Roles.getRole(message);

        if (!myRole) return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `Current role assigned to ${message.author.username}`,
                        iconURL: message.guild.iconURL({ size: 2048 })
                            || message.author.displayAvatarURL({ size: 2048 }),
                    })
                    .setColor(myRole.hexColor)
                    .addFields({
                        name: "Name", value: myRole.name, inline: true,
                    },
                    {
                        name: "Colour", value: myRole.hexColor, inline: true,
                    }),
            ],
        });
    }

    public async nameRun(message: Message<true>, args: Args) {

        const name = await args.rest("string");

        const myRole = await Roles.getRole(message);

        if (!myRole) return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });

        const botRole = message.guild?.members.me?.roles.highest,
            isPosition = botRole?.comparePositionTo(myRole);

        if (isPosition && isPosition <= 0) {
            return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message, "This role is higher than me, I cannot edit this role!")] });
        }

        const oldName = myRole.name;
        await myRole.setName(Utility.trim(name, Constants.MAGIC_NUMBERS.COMMON.NAME_LIMIT));
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`You have changed \`${oldName}\`'s name to \`${name}\`!`)
                    .setColor(myRole.color),
            ],
        });
    }

    public async colorRun(message: Message<true>, args: Args) {

        const color = await args.rest("color");

        const myRole = await Roles.getRole(message);

        if (!myRole) return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });

        const botRole = message.guild?.members.me?.roles.highest,
            isPosition = botRole?.comparePositionTo(myRole);

        if (isPosition && isPosition <= 0) {
            return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message, "This role is higher than me, I cannot edit this role!")] });
        }

        const hex = Utility.RGBtoHEX(color);

        const oldHex = myRole.hexColor;
        await myRole.setColor(hex);

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`You have changed \`${myRole.name}\`'s color from \`${oldHex}\` to \`${color}\`!`)
                    .setColor(hex),
            ],
        });
    }

    public async iconRun(message: Message<true>, args: Args) {

        const { guild } = message;

        if (!guild.features.includes("ROLE_ICONS")) {
            return message.channel.send({
                embeds: [await KaikiEmbeds.errorMessage(message.guild || message, "This server does not have enough boosts for role-icons!")],
            });
        }

        if (!args.finished) {
            const icon = await args.rest("emoteImage");

            const myRole = await Roles.getRole(message);

            if (!myRole) return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message)] });

            const botRole = message.guild?.members.me?.roles.highest,
                isPosition = botRole?.comparePositionTo(myRole);

            if (isPosition && isPosition <= 0) {
                return message.channel.send({ embeds: [await KaikiEmbeds.embedFail(message, "This role is higher than me, I cannot edit this role!")] });
            }

            await myRole.setIcon(icon).catch(async (err) => message.channel.send({
                embeds: [
                    (await KaikiEmbeds.errorMessage(message.guild || message, "Unsupported image format"))
                        .addFields({ name: "Message", value: await Utility.codeblock(err, "xl") }),
                ],
            }));

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`You have set \`${myRole.name}\`'s icon!`)
                        .withOkColor(message),
                ],
            });
        }

        else {
            const myRole = await Roles.getRole(message);
            if (myRole && await rolePermissionCheck(message, myRole)) {
                myRole.setIcon(null);
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("Role-icon has been reset!")
                            .withOkColor(message),
                    ],
                });
            }
        }
    }
}
