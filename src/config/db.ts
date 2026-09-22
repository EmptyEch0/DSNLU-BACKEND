import { Pool, PoolClient, QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const poolConfig = connectionString
  ? {
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 20,
    }
  : {
      host: process.env.DB_HOST || "db.awhwmxmhrjmbnackhluf.supabase.co",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "Dsnlu@viz#2026",
      database: process.env.DB_NAME || "postgres",
      ssl: { rejectUnauthorized: false },
      max: 20,
    };

const pgPool = new Pool(poolConfig);

/**
 * Converts MySQL SQL dialect differences to PostgreSQL:
 * 1. '?' placeholders -> '$1, $2, ...'
 * 2. '= TRUE' / '= FALSE' for SMALLINT columns -> '= 1' / '= 0'
 * 3. 'SET col = TRUE/FALSE' -> 'SET col = 1/0'
 * 4. Backticks `col` -> "col"
 * 5. 'SHOW TABLES' -> Postgres table list
 */
function convertPlaceholders(sql: string): string {
  let inString = false;
  let paramIndex = 1;
  let result = "";

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];

    if (char === "'") {
      if (inString && sql[i + 1] === "'") {
        result += "''";
        i++;
        continue;
      }
      inString = !inString;
      result += char;
    } else if (char === "?" && !inString) {
      result += `$${paramIndex++}`;
    } else if (char === "`" && !inString) {
      result += '"';
    } else {
      result += char;
    }
  }

  // Handle MySQL SHOW TABLES -> Postgres equivalent
  if (result.trim().toUpperCase() === "SHOW TABLES") {
    return "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'";
  }

  // Convert boolean literal comparisons & assignments for Postgres smallint compatibility
  result = result
    .replace(/=\s*TRUE\b/gi, "= 1")
    .replace(/=\s*FALSE\b/gi, "= 0")
    .replace(/\bIS\s+TRUE\b/gi, "= 1")
    .replace(/\bIS\s+FALSE\b/gi, "= 0")
    .replace(/\bSET\s+([a-zA-Z0-9_"]+)\s*=\s*TRUE\b/gi, "SET $1 = 1")
    .replace(/\bSET\s+([a-zA-Z0-9_"]+)\s*=\s*FALSE\b/gi, "SET $1 = 0");

  return result;
}

/**
 * Formats pg query results to match MySQL2's [rows, fields] return format.
 */
function formatResult(res: QueryResult): [any, any[]] {
  if (res.command === "SELECT") {
    return [res.rows, res.fields || []];
  }

  const resultMeta = {
    affectedRows: res.rowCount ?? 0,
    rowCount: res.rowCount ?? 0,
    insertId: res.rows && res.rows[0]?.id ? res.rows[0].id : 0,
    rows: res.rows || [],
  };

  return [resultMeta, res.fields || []];
}

export interface DBConnection {
  query: <T = any>(sql: string, params?: any[]) => Promise<[T, any[]]>;
  beginTransaction: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  release: () => void;
  [key: string]: any;
}

/**
 * MySQL2-compatible adapter over pg.Pool for seamless Supabase PostgreSQL integration.
 */
export const pool = {
  async query<T = any>(sql: string, params?: any[]): Promise<[T, any[]]> {
    const convertedSql = convertPlaceholders(sql);
    const res = await pgPool.query(convertedSql, params);
    return formatResult(res) as [T, any[]];
  },

  async getConnection(): Promise<DBConnection> {
    const client: PoolClient = await pgPool.connect();
    return {
      async query<T = any>(sql: string, params?: any[]): Promise<[T, any[]]> {
        const convertedSql = convertPlaceholders(sql);
        const res = await client.query(convertedSql, params);
        return formatResult(res) as [T, any[]];
      },
      async beginTransaction(): Promise<void> {
        await client.query("BEGIN");
      },
      async commit(): Promise<void> {
        await client.query("COMMIT");
      },
      async rollback(): Promise<void> {
        await client.query("ROLLBACK");
      },
      release() {
        client.release();
      },
    };
  },

  async end(): Promise<void> {
    await pgPool.end();
  },
};

export default pool;
