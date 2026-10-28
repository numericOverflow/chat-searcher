"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordError = recordError;
exports.errorMessage = errorMessage;
exports.readDatabase = readDatabase;
exports.runSqliteCli = runSqliteCli;
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
/** fs.readFileSync cannot read a file of 2 GiB or more. */
const MAX_READ_BYTES = 2 * 1024 * 1024 * 1024 - 1;
function recordError(stats, message) {
    if (stats && stats.errors.length < 5)
        stats.errors.push(message);
}
function errorMessage(err) {
    return err instanceof Error ? err.message : String(err);
}
/** Loads a SQLite file into sql.js. Throws a clear error for files that Node cannot read in one call. */
function readDatabase(SQL, dbPath) {
    const size = fs.statSync(dbPath).size;
    if (size > MAX_READ_BYTES) {
        throw new Error(`${dbPath} is ${(size / 1024 ** 3).toFixed(1)} GB, which is too large to load into memory`);
    }
    return new SQL.Database(new Uint8Array(fs.readFileSync(dbPath)));
}
/** Runs a read-only query with the system sqlite3 CLI and returns its JSON output. */
function runSqliteCli(dbPath, sql, maxBuffer) {
    return (0, child_process_1.execFileSync)('sqlite3', ['-readonly', '-json', dbPath, sql], {
        maxBuffer,
        encoding: 'utf-8',
        windowsHide: true,
    }).toString();
}
//# sourceMappingURL=dbUtil.js.map