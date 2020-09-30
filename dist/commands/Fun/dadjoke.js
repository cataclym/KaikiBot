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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const discord_js_1 = require("discord.js");
const discord_akairo_1 = require("discord-akairo");
module.exports = class DadJokeCommand extends discord_akairo_1.Command {
    constructor() {
        super("dadjoke", {
            cooldown: 8000,
            typing: true,
            aliases: ["dadjoke", "dadjokes"],
            description: { description: "Returns a dadjoke." },
        });
    }
    exec(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const color = message.member.displayColor;
            yield loadTitle();
            function loadTitle() {
                return __awaiter(this, void 0, void 0, function* () {
                    const promise = () => __awaiter(this, void 0, void 0, function* () { return node_fetch_1.default("https://www.reddit.com/r/dadjokes.json?limit=1000&?sort=top&t=all"); });
                    promise()
                        .then((res) => res.json())
                        .then((json) => json.data.children.map((t) => t.data))
                        .then((data) => postRandomTitle(data));
                });
            }
            function postRandomTitle(data) {
                return __awaiter(this, void 0, void 0, function* () {
                    const randomTitle = data[Math.floor(Math.random() * data.length) + 1];
                    let randomTitleSelfText = randomTitle.selftext.substring(0, 2045);
                    if (randomTitle.selftext.length > 2048) {
                        randomTitleSelfText += "...";
                    }
                    const RTTitle = randomTitle.title.substring(0, 256);
                    const embed = new discord_js_1.MessageEmbed({
                        title: RTTitle,
                        description: randomTitleSelfText,
                        color,
                        author: {
                            name: `Submitted by ${randomTitle.author}`,
                        },
                        image: {
                            url: randomTitle.url,
                        },
                        footer: {
                            text: `${randomTitle.ups} updoots`,
                        },
                    });
                    return message.util.send(embed);
                });
            }
        });
    }
};
//# sourceMappingURL=dadjoke.js.map