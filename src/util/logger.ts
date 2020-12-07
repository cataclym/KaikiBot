import { Console } from "console";
import { stdout } from "process";
import { standardColor } from "../util/Util";

const infoCSS = "\x1b[34m";
const lowCSS = "\x1b[32m";
const mediumCSS = "\x1b[33m";
const highCSS = "\x1b[31m";
const reset = "\x1b[0m";

declare global {
    export interface Logger {
        info(message?: any, ...optionalParams: any[]): void;
        low(message?: any, ...optionalParams: any[]): void;
        medium(message?: any, ...optionalParams: any[]): void;
        high(message?: any, ...optionalParams: any[]): void;
    }
}

export default class Logger extends Console {
    message?: any;

    info(...args: any): void {
    	return this.log(`${infoCSS}${args} ${reset}`);
    }

    low(...args: any): void {
    	return this.log(`${lowCSS}${args} ${reset}`);
    }

    medium(...args: any): void {
    	return this.log(`${mediumCSS}${args} ${reset}`);
    }

    high(...args: any): void {
    	return this.log(`${highCSS}${args} ${reset}`);
    }
}

export const logger = new Logger(stdout);

// Logger.prototype.low = function(...args: any): void {
// 	return this.log(...args, lowCSS);
// };

// Logger.prototype.medium = function(...args: any): void {
// 	return this.log(...args, mediumCSS);
// };

// Logger.prototype.high = function(...args: any): void {
// 	return this.log(...args, highCSS);
// };

