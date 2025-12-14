import type { Config } from 'drizzle-kit'

export default {
  // 数据库类型
  dialect: 'sqlite',

  // Schema 文件位置
  schema: './src/main/db/schema.ts',

  // 迁移文件输出目录
  out: './src/main/db/migrations',

  // 开发时数据库文件路径（用于 drizzle-kit push）
  // 生产环境的路径在运行时由 Electron app.getPath('userData') 决定
  dbCredentials: {
    url: './knownote.db'
  }
} satisfies Config
