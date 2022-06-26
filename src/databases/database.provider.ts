import { createConnection } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => await createConnection({
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
    }),
  },
];

// const config: SqlServerConnectionOptions = {
//   type: 'mssql',
//   host: 'XayKPmtN',
//   // port: 1433,
//   username: 'sa',
//   password: 'abc@123',
//   database: 'VinhDDT',
//   entities: ['dist/**/*.entity.js'],
//   migrations: ['dist/databases/migrations/*.js'],
//   cli: { migrationsDir: 'src/databases/migrations' },
//   synchronize: false,
//   extra: {
//     trustServerCertificate: true,
//   }
// };
