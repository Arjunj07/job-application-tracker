import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../../common/entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  exports: [TypeOrmModule],
})
export class DocumentsModule {}
