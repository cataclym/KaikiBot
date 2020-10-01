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
const discord_akairo_1 = require("discord-akairo");
class HentaiCommand extends discord_akairo_1.Command {
    constructor() {
        super("hentai", {
            aliases: ["hentai"],
        });
    }
    exec(message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const condition = (message) => __awaiter(this, void 0, void 0, function* () {
                let condition = false;
                if (message.channel.type === "text") {
                    if (message.channel.nsfw) {
                        condition = true;
                    }
                }
                return condition;
            });
            if (condition(message)) {
                return (_a = message.util) === null || _a === void 0 ? void 0 : _a.send("yes it worked");
            }
        });
    }
}
exports.default = HentaiCommand;
//# sourceMappingURL=hentai.js.map