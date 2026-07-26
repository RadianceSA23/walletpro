import { Connection } from 'mongoose';
export declare class HealthController {
    private readonly connection;
    constructor(connection: Connection);
    checkHealth(): {
        status: string;
        uptime: number;
        timestamp: string;
        services: {
            database: {
                status: string;
                readyState: import("mongoose").ConnectionStates;
            };
        };
    };
}
