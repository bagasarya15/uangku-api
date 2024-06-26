import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ExpenseModule } from './expense/expense.module';
import { IncomeModule } from './income/income.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME,
        models: [],
        autoLoadModels: true,
      }),
    }),
    UsersModule,
    AuthModule,
    CategoryModule,
    ExpenseModule,
    IncomeModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
