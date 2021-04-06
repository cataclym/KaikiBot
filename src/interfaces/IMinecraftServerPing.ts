export interface Motd {
    raw: string[];
    clean: string[];
    html: string[];
}

export interface Players {
    online: number;
    max: number;
    list: string[];
    uuid: {[id: string]: string};
}

export interface Plugins {
    names: string[];
    raw: string[];
}

export interface Mods {
    names: string[];
    raw: string[];
}

export interface Info {
    raw: string[];
    clean: string[];
    html: string[];
}

export interface ServerOnlineInterfaces {

    Debug: {
        ping: boolean;
        query: boolean;
        srv: boolean;
        querymismatch: boolean;
        ipinsrv: boolean;
        cnameinsrv: boolean;
        animatedmotd: boolean;
        cachetime: number;
    }

    Motd: Motd;

    Uuid: {[id: string]: string}

    Players: Players;

    Plugins: Plugins;

    Mods: Mods;

    Info: Info;
}

export interface ServerOnline {
        online: true;
        ip: string;
        port: number;
        debug: Debug;
        motd: Motd;
        players: Players;
        version: string;
        protocol: number;
        hostname: string;
        icon: string;
        software: string;
        map: string;
        plugins: Plugins;
        mods: Mods;
        info: Info;
    }

export interface ServerOffline {
        online: false;
        ip: string;
        port: number;
        debug: Debug;
        hostname: string;
    }

export interface Debug {
        ping: boolean;
        query: boolean;
        srv: boolean;
        querymismatch: boolean;
        ipinsrv: boolean;
        cnameinsrv: boolean;
        animatedmotd: boolean;
        cachetime: number;
}

