import * as AWS from 'aws-sdk';
import { createConnection, Connection } from 'typeorm';
import 'reflect-metadata';
import Cases from '../entity/Cases';

interface DbSecret {
    username: string;
    password: string;
    engine: string;
    host: string;
    port: string;
    dbname: string;
    dbInstanceIdentifier: string;
}

let connection: Connection;

export default abstract class Helpers {
    public static async prepareLambda(): Promise<Connection> {
        // AWS.config.loadFromPath(`../../.aws_config.json`);
        console.log('PREPARING ENVIRONMENT...');
        // Set ENV vars
        if (!process.env.PGPASSWORD) {
            await Helpers.setEnvVars();
        }
        if (!connection) {
            connection = await createConnection({
                type: 'postgres',
                host: process.env.PGHOST,
                port: Number(process.env.PGPORT),
                username: process.env.PGUSER,
                password: process.env.PGPASSWORD,
                database: process.env.PGDATABASE,
                schema: 'covid19',
                logging: true,
                entities: [
                    Cases,
                ],
            });   
        }

        return connection;
    }

     /**
     * Set necessary environment vars
     * @param endpoint - AWS secret manager endpoint
     * @param secretName - AWS secret name to retrieve
     */
    public static async setEnvVars(): Promise<void> {
        console.log('SETTING ENV VARS');
        // Create a Secrets Manager client
        const client = new AWS.SecretsManager({
            endpoint: 'https://secretsmanager.eu-west-1.amazonaws.com',
            region: 'eu-west-1',
        });

        const getSecretValue = (secretName: string): Promise<string> => new Promise((resolve, reject) => {
            client.getSecretValue({SecretId: secretName}, (err, data) => {
                if (err) {
                    if (err.code === 'ResourceNotFoundException') {
                        reject('The requested secret ' + secretName + ' was not found');
                    } else if (err.code === 'InvalidRequestException') {
                        reject('The request was invalid due to: ' + err.message);
                    } else if (err.code === 'InvalidParameterException') {
                        reject('The request had invalid params: ' + err.message);
                    } else {
                        reject(err);
                    }
                } else {
                    // Decrypted secret using the associated KMS CMK
                    // Depending on whether the secret was a string or binary, one of these fields will be populated
                    resolve(data.SecretString);
                }
            });
        });

        const db: DbSecret = JSON.parse(await getSecretValue('postgresUser'));
        // Set env with values
        process.env.PGUSER = db.username;
        process.env.PGHOST = db.host;
        process.env.PGPASSWORD = db.password;
        process.env.PGDATABASE = db.dbname;
        process.env.PGPORT = db.port;
    }
}