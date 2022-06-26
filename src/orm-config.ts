import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';

const config: SqlServerConnectionOptions = {
  type: 'mssql',
  host: '20.205.184.139',
  port: 1433,
  username: 'sa',
  password: 'Lam@12345',
  database: 'VinhDDT',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/databases/migrations/*.js'],
  cli: { migrationsDir: 'src/databases/migrations' },
  synchronize: false,
  extra: {
    trustServerCertificate: true,
  }
};

export default config;
