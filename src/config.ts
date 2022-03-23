import { SapphirePrefix } from '@sapphire/framework';
import nodeConfig from 'config';

interface ClientConfig {
    api_key: string;
    prefix: SapphirePrefix;
}

interface LogConfig {
    level: string;
    logToFile: boolean;
}

const clientC: ClientConfig = {
    api_key: nodeConfig.get('client.api_key'),
    prefix: nodeConfig.get('client.prefix')
}

const logC: LogConfig = {
    level: nodeConfig.get('log.level'),
    logToFile: nodeConfig.get('log.logToFile')
}

export const clientConfig = clientC;
export const logConfig = logC;
