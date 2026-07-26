declare const _default: () => {
    port: number;
    nodeEnv: string;
    database: {
        uri: string;
    };
    jwt: {
        secret: string;
        refreshSecret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    cors: {
        origin: string;
    };
};
export default _default;
