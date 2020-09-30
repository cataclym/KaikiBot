"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_akairo_1 = require("discord-akairo");
class PingCommand extends discord_akairo_1.Command {
    constructor() {
        super("ping", {
            description: { description: "Ping!" },
            aliases: ["p", "ping"],
        });
    }
    exec(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const InitialMSG = yield message.channel.send("Pinging...!"), WSTime = Math.abs(message.client.ws.ping), ClientTime = InitialMSG.createdTimestamp - message.createdTimestamp;
            const color = message.member.displayColor, embed = new discord_js_1.MessageEmbed()
                .addFields([
                { name: "WebSocket ping", value: WSTime + " ms", inline: true },
                { name: "Client ping", value: ClientTime + " ms", inline: true }
            ])
                .setColor(color);
            return InitialMSG.edit(null, embed);
        });
    }
}
exports.default = PingCommand;
;
//# sourceMappingURL=ping.js.map