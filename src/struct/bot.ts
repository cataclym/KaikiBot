import { inject, injectable } from "inversify";
import { customClient } from "./client";
import { TYPES } from "./types";

@injectable()
export class Bot {
    public client: customClient;
    private readonly token: string;

    constructor(
        @inject(TYPES.Client) client: customClient,
        @inject(TYPES.Token) token: string,
    ) {

    	this.client = client;
    	this.token = token;
    }

    public start(): Promise <string> {

    	if (!process.env.PREFIX) {
    		throw new Error("Missing prefix! Set a prefix in .env");
    	}

    	if (!process.env.OWNER) {
    		throw new Error("Missing owner-ID! Please double-check the guide and set an owner in .env");
    	}

    	this.client.init();

    	return this.client.login(this.token);
    }
}