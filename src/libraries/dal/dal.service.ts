import { Connection, ConnectOptions, createConnection } from 'mongoose';

export class DalService {
  private connections: { [key: string]: Connection } = {};

  async connect(
    url: string,
    config: ConnectOptions = {},
    connectionName: string = 'default',
  ): Promise<Connection> {
    if (!this.connections[connectionName]) {
      const baseConfig: ConnectOptions = {
        autoIndex: process.env.AUTO_CREATE_INDEXES === 'true',
      };

      const instance = await createConnection(url, {
        ...baseConfig,
        ...config,
      });
      console.log(`MongoDB Database connected successfully: ${connectionName}`);
      this.connections[connectionName] = instance;
    }
    return this.connections[connectionName];
  }

  getConnection(connectionName: string = 'default'): Connection {
    return this.connections[connectionName];
  }

  isConnected(connectionName: string = 'default'): boolean {
    const connection = this.connections[connectionName];
    return connection && connection.readyState === 1;
  }

  async disconnect(connectionName: string = 'default') {
    const connection = this.connections[connectionName];
    if (connection) {
      await connection.close();
      delete this.connections[connectionName];
    }
  }

  async destroy(connectionName: string = 'default') {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Allowed only in test environment');
    }

    const connection = this.connections[connectionName];
    if (connection) {
      await connection.dropDatabase();
    }
  }
}
