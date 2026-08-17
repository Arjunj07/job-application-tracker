import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from '../../common/entities/job-application.entity';
import { ApplicationStatusHistory } from '../../common/entities/application-status-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplication, ApplicationStatusHistory]),
  ],
  exports: [TypeOrmModule],
})
export class ApplicationsModule {}
