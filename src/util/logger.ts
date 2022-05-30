import chalk from 'chalk';
//@ts-expect-error NPM Module does not have typings
import logToFile from 'log-to-file';
import { logConfig } from '../config';

export class Logger {

    static log(message?: string) {
        const dateTime = new Date().toLocaleTimeString();

        console.log(
            chalk.gray('[' +
                dateTime.replace(/\..+/, '') +
                ']' +
                '[Console/Log]', message));

        if (logConfig.logToFile) {
            logToFile('[Console/Log]' + message, 'console.log');
        }
    }

    static warn(message?: string) {
        const dateTime = new Date().toLocaleTimeString();

        console.log(
            chalk.yellow('[' +
                dateTime.replace(/\..+/, '') +
                ']') +
            chalk.yellow('[Console/Warn]' +
                message));

        if (logConfig.logToFile) {
            logToFile('[Console/Warn]' + message, 'console.log');
        }
    }

    static error(message?: string) {
        const dateTime = new Date().toLocaleTimeString();

        console.log(
            chalk.red('[' +
                dateTime.replace(/\..+/, '') +
                ']') +
            chalk.red('[Console/Error]' +
                message));

        if (logConfig.logToFile) {
            logToFile('[Console/Error]' + message, 'console.log');
        }
    }

    static fatal(message?: string) {
        const dateTime = new Date().toLocaleTimeString();

        console.log(
            chalk.bgRedBright('[' +
                dateTime.replace(/\..+/, '') +
                ']') +
            chalk.bgRedBright('[Console/Fatal]' +
                message));

        if (logConfig.logToFile) {
            logToFile('[Console/Fatal]' + message, 'console.log');
        }
    }
}