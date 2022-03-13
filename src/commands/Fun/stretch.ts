// import { GuildMember, Message, MessageEmbed, MessageAttachment } from "discord.js";
// import canvas from "canvas";
// import KaikiCommand from "../../lib/Kaiki/KaikiCommand.js";
//
//
// export default class SquishCommand extends KaikiCommand {
//     constructor() {
//         super("stretch", {
//             aliases: ["stretch"],
//             description: "Stretches given member's avatar",
//             usage: "@dreb",
//             args: [
//                 {
//                     id: "member",
//                     type: "member",
//                     default: (message: Message) => message.member,
//                 },
//             ],
//         });
//     }
//     public async exec(message: Message, { member }: { member: GuildMember}): Promise<Message> {
//
//         const picture = canvas.createCanvas(512, 128);
//         const squishImage = picture.getContext("2d");
//         const avatar = await canvas.loadImage(member.user.displayAvatarURL({ dynamic: true, size: 256, format: "png" }));
//         squishImage.drawImage(avatar, 0, 0, 512, 128);
//         const attachment: MessageAttachment = new MessageAttachment(picture.toBuffer(), "Stretched.jpg");
//         const embed = new MessageEmbed({
//             title: "Stretched avatar...",
//             image: { url: "attachment://Stretched.jpg" },
//             color: member.displayColor,
//         });
//
//         return message.channel.send({ files: [attachment], embeds: [embed] });
//     }
// }
