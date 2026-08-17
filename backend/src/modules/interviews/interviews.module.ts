import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview } from '../../common/entities/interview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview])],
  exports: [TypeOrmModule],
})
export class InterviewsModule {}
