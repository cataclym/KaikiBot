import logger from "loglevel";
import prefix from "loglevel-plugin-prefix";
import chalk from "chalk";

type logColors = {
	TRACE: chalk.Chalk,
	DEBUG: chalk.Chalk,
	INFO: chalk.Chalk,
	WARN: chalk.Chalk,
	ERROR: chalk.Chalk,
}

const colors: logColors = {
	TRACE: chalk.magenta,
	DEBUG: chalk.cyan,
	INFO: chalk.blue,
	WARN: chalk.yellow,
	ERROR: chalk.red,
};

export async function startLogger() {
	prefix.reg(logger);
	logger.enableAll();
	prefix.apply(logger, {
		format(level, name, timestamp) {
			return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase() as keyof logColors](level)}`;
		},
	});
}