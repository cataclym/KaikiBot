import { Listener } from "discord-akairo";
import logger from "loglevel";
import chalk from "chalk";


export default class RateLimitListener extends Listener {
	constructor() {
		super("rateLimit", {
			event: "rateLimit",
			emitter: "client",
		});
	}
	// Emitted when the client hits a rate limit while making a request

	public async exec({ timeout, _, method }: { timeout: number, _	: number, method: string }): Promise<void> {

		// Shut uuuuup
		logger.warn(chalk.magenta(`rateLimit | Timeout: ${chalk.green(timeout)} | Method: ${chalk.green(method)}`));
		// Limit: ${limit} // Number of requests that can be made to this endpoint
		// Method: ${method} // HTTP method used for request that triggered this event
		// Path: ${path} // Path used for request that triggered this event
		// Route: ${route} // Route used for request that triggered this event\n`);
	}
}
