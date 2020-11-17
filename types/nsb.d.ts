import { Command, CommandOptions } from "discord-akairo";

type description = {
    description?: string,
    usage?: string,
}

declare global {

    class Command {

        description: description;
    }

    interface CommandOptions {

        description?: description;
    }
}