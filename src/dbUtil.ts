import * as fs from 'fs';
import {execFileSync} from 'child_process';
import {Database, SqlJsStatic} from 'sql.js';

/** fs.readFileSync cannot read a file of 2 GiB or more. */
const MAX_READ_BYTES = 2 * 1024 * 1024 * 1024 - 1;

/** Problems found while indexing, so that an empty index can say why. */
export interface IndexStats {
  failed: number;
  errors: string[];
}

export function recordError(stats: IndexStats | undefined, message: string): void {
  if (stats && stats.errors.length < 5) stats.errors.push(message);
}

export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/** Loads a SQLite file into sql.js. Throws a clear error for files that Node cannot read in one call. */
export function readDatabase(SQL: SqlJsStatic, dbPath: string): Database {
  const size = fs.statSync(dbPath).size;
  if (size > MAX_READ_BYTES) {
    throw new Error(`${dbPath} is ${(size / 1024 ** 3).toFixed(1)} GB, which is too large to load into memory`);
  }
  return new SQL.Database(new Uint8Array(fs.readFileSync(dbPath)));
}

/** Runs a read-only query with the system sqlite3 CLI and returns its JSON output. */
export function runSqliteCli(dbPath: string, sql: string, maxBuffer: number): string {
  return execFileSync('sqlite3', ['-readonly', '-json', dbPath, sql], {
    maxBuffer,
    encoding: 'utf-8',
    windowsHide: true,
  }).toString();
}
