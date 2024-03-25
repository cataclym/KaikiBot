import { ApplyOptions } from "@sapphire/decorators";
import {
    Listener,
    ListenerOptions,
    MessageCommandDeniedPayload,
    UserError,
} from "@sapphire/framework";
import { SubcommandPluginEvents } from "@sapphire/plugin-subcommands";
import ArgumentErrorRun from "../lib/Errors/ArgumentErrorRun";

@ApplyOptions<ListenerOptions>({
    event: SubcommandPluginEvents.MessageSubcommandError,
})
export default class MessageSubCommandError extends Listener {
    // Ran when precondition check blocks a command

    public async run(
        error: UserError,
        payload: MessageCommandDeniedPayload
    ): Promise<void> {
        await ArgumentErrorRun(error, payload);
    }
}
