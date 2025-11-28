import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import path from 'path';
import { Environment, getCurrentEnvironment, getEnvironmentDisplayName } from '../enums';

/**
 * Environment to .env file mapping
 * Maps each environment enum to its corresponding .env file
 */
const ENV_FILE_MAP: Record<Environment, string> = {
  [Environment.DEVELOPMENT]: '.env.dev',
  [Environment.QA]: '.env.qa',
  [Environment.STAGING]: '.env.staging',
  [Environment.PRODUCTION]: '.env.prod'
};

/**
 * Load environment-specific .env file
 * Priority: .env.[environment] > .env (in apps/api directory)
 * 
 * Examples:
 * - Environment.DEVELOPMENT → loads .env.dev, then falls back to .env
 * - Environment.QA → loads .env.qa, then falls back to .env
 * - Environment.STAGING → loads .env.staging, then falls back to .env
 * - Environment.PRODUCTION → loads .env.prod, then falls back to .env
 */
const currentEnv = getCurrentEnvironment();
const envFile = ENV_FILE_MAP[currentEnv];
const envPath = path.resolve(process.cwd(), 'apps/api', envFile);
const defaultEnvPath = path.resolve(process.cwd(), 'apps/api', '.env');

// Try to load environment-specific file first
let result = dotenv.config({ path: envPath });

// Fallback to default .env in apps/api directory if environment-specific file doesn't exist
if (result.error) {
  console.log(`⚠️  ${envFile} not found, trying .env in apps/api directory`);
  result = dotenv.config({ path: defaultEnvPath });
  
  if (!result.error) {
    console.log(`✓ Loaded environment config from: .env`);
  }
} else {
  console.log(`✓ Loaded environment config from: ${envFile}`);
}

// Final fallback: try .env in current working directory (for backward compatibility)
if (result.error) {
  console.log(`⚠️  .env not found in apps/api, trying root directory`);
  dotenv.config(); // This loads from process.cwd()
  
  // Check if we got DB_NAME after this fallback
  if (process.env.DB_NAME) {
    console.log(`✓ Loaded environment config from root .env`);
  }
}

// In production/VPS, environment variables may be set directly by docker-compose
// which overrides file-based .env, so this is fine
if (!process.env.DB_NAME) {
  console.warn(`⚠️  No .env file found and no DB_NAME environment variable set`);
  console.warn(`   Expected locations:`);
  console.warn(`   - apps/api/${envFile}`);
  console.warn(`   - apps/api/.env`);
  console.warn(`   - .env (root directory)`);
}

/**
 * Database configuration for different environments
 */
const getConfig = () => {
  const env = getCurrentEnvironment();
  
  const dbConfig = {
    dialect: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || '',
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    logging: env === Environment.DEVELOPMENT ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    models: [path.join(__dirname, '../models/**/*.model.{ts,js}')],
    define: {
      timestamps: true,
      underscored: false,
    },
  };

  // Log configuration details (but not password)
  console.log(`📊 Database Configuration:`);
  console.log(`   Environment: ${getEnvironmentDisplayName(env).toUpperCase()}`);
  console.log(`   Database: ${dbConfig.database}`);
  console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
  console.log(`   User: ${dbConfig.username}`);
  
  return dbConfig;
};

/**
 * Sequelize instance with TypeScript support
 */
const config = getConfig();
const sequelize = new Sequelize(config);

export { sequelize, getConfig };
export default sequelize;

