declare module 'pg' {
  export class Pool {
    constructor(config: { connectionString?: string });
    query(sql: string, values?: unknown[]): Promise<{ rows: unknown[] }>;
    end(): Promise<void>;
  }

  export class Client {
    constructor(config: { connectionString?: string });
    connect(): Promise<void>;
    query(sql: string, values?: unknown[]): Promise<{ rows: unknown[] }>;
    end(): Promise<void>;
  }
}
