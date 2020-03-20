import * as mysql from 'mysql';

class Mysql {
    private conn: mysql.Connection;

    constructor(connection: mysql.Connection) {
        this.conn = connection;
    }

    public query<T = any>(sql: string, params: any[] = []): Promise<T> {
        return new Promise((resolve, reject) => {
            console.log(mysql.format(sql, params));
            this.conn.query(sql, params, (err, data) => {
                if (err) {
                    return reject(err);
                }

                console.log('RETURN MYSQL', data);
                return resolve(data);
            });
        });
    }

    public end(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.conn.end((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public hasConn(): boolean {
        return this.conn !== null;
    }
}

export default Mysql;
