import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ConfigService}  from '@nestjs/config'
import { UserModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/company.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ApplicationsModule } from './modules/applications/applications.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env'
    }),
    UserModule,
    CompaniesModule,
    ContactsModule,
    DocumentsModule,
    InterviewsModule,
    TasksModule,
    ApplicationsModule,
    TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get<string>('DB_HOST', 'localhost'),
    port: config.get<number>('DB_PORT', 5433),
    username: config.get<string>('DB_USERNAME', 'postgres'),
    password: config.get<string>('DB_PASSWORD', 'postgres'),
    database: config.get<string>('DB_DATABASE', 'job_tracker_db'),
    autoLoadEntities: true,
    synchronize: config.get<string>('NODE_ENV') !== 'production', // Auto-creates tables in dev
    logging: config.get<string>('NODE_ENV') === 'development',
  }),
}),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
