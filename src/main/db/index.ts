import { app } from 'electron'
import { join } from 'path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from './schema'

let sqlite: Database.Database | null = null
let db: ReturnType<typeof drizzle> | null = null

/**
 * 初始化数据库连接
 * 在 Electron 主进程的 app.whenReady() 中调用
 */
export function initDatabase() {
  // 数据库文件存放在用户数据目录
  const dbPath = join(app.getPath('userData'), 'litebook.db')

  console.log('[Database] Initializing database at:', dbPath)

  // 创建 SQLite 数据库实例
  sqlite = new Database(dbPath)

  // 启用 WAL 模式以提高性能
  sqlite.pragma('journal_mode = WAL')

  // 创建 Drizzle 实例
  db = drizzle(sqlite, { schema })

  console.log('[Database] Database initialized successfully')

  return db
}

/**
 * 运行数据库迁移
 * 在初始化数据库后立即调用
 */
export function runMigrations() {
  if (!db) {
    throw new Error('[Database] Database not initialized. Call initDatabase() first.')
  }

  // __dirname 在编译后指向 out/main（所有代码打包到 out/main/index.js）
  // 而 migrations 文件被复制到 out/main/db/migrations
  const migrationsFolder = join(__dirname, 'db', 'migrations')
  console.log('[Database] Running migrations from:', migrationsFolder)

  try {
    migrate(db, { migrationsFolder })
    console.log('[Database] Migrations completed successfully')
  } catch (error) {
    console.error('[Database] Migration failed:', error)
    throw error
  }
}

/**
 * 获取数据库实例
 * 在需要执行数据库操作时调用
 */
export function getDatabase() {
  if (!db) {
    throw new Error('[Database] Database not initialized. Call initDatabase() first.')
  }
  return db
}

/**
 * 关闭数据库连接
 * 在 Electron app.on('before-quit') 中调用
 */
export function closeDatabase() {
  if (sqlite) {
    console.log('[Database] Closing database connection')
    sqlite.close()
    sqlite = null
    db = null
  }
}

// 导出类型供其他模块使用
export type Database = NonNullable<typeof db>
