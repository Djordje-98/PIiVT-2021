import IConfig from '../common/IConfig.interface';
import { readFileSync } from 'fs';  

const Config: IConfig = {
    server: {
        port: 40080,
        static: {
            route: "/static",
            path: "./static/",
            cacheControl: false,
            dotfiles: "deny",
            etag: false,
            index: false,
            maxAge: 360000,

        }
    },
    database: {
        host: "localhost",
        port: 3307,
        user: "root",
        password: "root",
        database: "aplikacija",
        charset: "utf8",
        timezone: "+01:00",


    },
    fileUpload: {
        maxSize: 5 * 1024 * 1024,
        maxFiles: 5,
        timeout: 60000,
        temporaryDirectory: '../remp/',
        uploadDestinationDirectory: 'static/uploads/',
        photos: {
            limits: {
                minWidth: 320,                
                minHeight: 200,
                maxWidth: 1920,
                maxHeight: 1440,
            },
            resizes: [
                {
                    sufix: "-medium",
                    fit: "cover",
                    width: 800,
                    height: 600,
                },
                {
                    sufix: "-small",
                    fit: "cover",
                    width: 400,
                    height: 300,
                },
                {
                    sufix: "-thumb",
                    fit: "cover",
                    width: 250,
                    height: 200,
                }
            ],
        }

    },
    auth: {
        administrator: {
            algorithm: "RS256",
            issuer: "localhost",
            auth: {
                duration: 60 * 60 * 24 * 7,
                public: readFileSync("keystore/administrator-auth.public", "utf-8"),
                private: readFileSync("keystore/administrator-auth.private", "utf-8"),
            },
            refresh: {
                duration: 60 * 60 * 24 * 365,
                public: readFileSync("keystore/administrator-refresh.public", "utf-8"),
                private: readFileSync("keystore/administrator-refresh.private", "utf-8"),
            },

        },
        allowRequestEvenWithoutValidTokens: true,
    },
};

export default Config;