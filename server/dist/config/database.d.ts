import { Pool } from 'pg';
export declare const pool: Pool;
export declare function testConnection(): Promise<boolean>;
export declare function query<T = any>(text: string, params?: any[]): Promise<T[]>;
export declare function transaction<T>(callback: (client: any) => Promise<T>): Promise<T>;
export declare function closePool(): Promise<void>;
//# sourceMappingURL=database.d.ts.map