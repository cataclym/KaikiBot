import Discord, { GuildMember, Message } from "discord.js";
import sharp from "sharp";
import KaikiCommand from "Kaiki/KaikiCommand";
import Utility from "../../lib/Utility.js";
const background = async () => await loadImage("https://cdn.discordapp.com/attachments/717045059215687691/763459004352954368/deadbeats.jpg");

module.exports = class DeadbeatCommand extends KaikiCommand {
    // I should host this on GitLab
    private backgroundUrl = "https://cdn.discordapp.com/attachments/717045059215687691/763459004352954368/deadbeats.jpg";

    constructor() {
        super("deadbeat", {
            aliases: ["dead", "deadbeat"],
            description: "Just try it",
            usage: "@dreb",
            cooldown: 8000,
            typing: true,
            args: [{
                id: "member",
                type: "member",
                match: "rest",
                default: (message: Message) => message.member,
            }],
        });
    }

    public async exec(message: Message, args: { member: GuildMember, default: GuildMember }) {
        const member = args.member || args.default;

        const url = await Utility.loadimage(member.displayAvatarURL({ format: "jpg", size: 64 }));

        const image = sharp(await this.background())
            .composite([{ input: url, top: 100, left: 625 }]);

        const attachment = new Discord.MessageAttachment(image, "deadBeats.jpg");
        await message.channel.send({ content: `Deadbeat 👉 ${member.user}`, files: [attachment] });
    }

    private async background() {
        return Utility.loadimage(this.backgroundUrl);
    }
};
