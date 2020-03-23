import { Connection, ConnectionManager, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm'
import Cases from '../entity/Cases';

/**
 * Database manager class
 */
export class Database {
    private connectionManager: ConnectionManager

    constructor() {
        this.connectionManager = getConnectionManager();
    }

    public async getConnection(): Promise<Connection> {
        const CONNECTION_NAME = 'default';
        let connection: Connection

        if (this.connectionManager.has(CONNECTION_NAME)) {
            console.log(`Database.getConnection()-using existing connection ...`);
            connection = this.connectionManager.get(CONNECTION_NAME);

            if (!connection.isConnected) {
                console.log('CONNECTING');
                connection = await connection.connect();
            }
        } else {
            console.log(`Database.getConnection()-creating connection ...`);
            
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
}