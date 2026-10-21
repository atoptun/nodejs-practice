declare module "connect-sqlite3" {
  import session from "express-session";

  type SQLiteStoreOptions = {
    db?: string;
    dir?: string;
    table?: string;
    createDirIfNotExists?: boolean;
    concurrentDb?: boolean;
    mode?: number;
  };

  type SQLiteStoreConstructor = new (
    options?: SQLiteStoreOptions,
  ) => session.Store;

  export default function connectSqlite3(
    sessionModule: typeof session,
  ): SQLiteStoreConstructor;
}
