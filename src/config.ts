import { SapphirePrefix } from '@sapphire/framework';
import nodeConfig from 'config';

interface ClientConfig {
    api_key: string;
    prefix: SapphirePrefix;
    guild_id: string;
    channel_id: string;
    vr_channel_id: string;
}

interface LogConfig {
    level: string;
    logToFile: boolean;
}

const clientC: ClientConfig = {
    api_key: nodeConfig.get('client.api_key'),
    prefix: nodeConfig.get('client.prefix'),
    guild_id: nodeConfig.get('client.guild_id'),
    channel_id: nodeConfig.get('client.channel_id'),
    vr_channel_id: nodeConfig.get('client.vr_channel_id')
}

const logC: LogConfig = {
    level: nodeConfig.get('log.level'),
    logToFile: nodeConfig.get('log.logToFile')
}

export const clientConfig = clientC;
export const logConfig = logC;
