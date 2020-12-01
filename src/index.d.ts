export type StringResolvable = string | string[] | any;

export type description = {
        description?: string,
        usage?: string,
    };


export declare interface CommandOptions {
    description?: description | StringResolvable;
}

export declare interface Command {
    description: description | StringResolvable;
}