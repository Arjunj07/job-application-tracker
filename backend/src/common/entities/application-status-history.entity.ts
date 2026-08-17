import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JobApplication } from './job-application.entity';
import { ApplicationStatus } from '../enums';

@Entity('application_status_history')
export class ApplicationStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'job_application_id' })
  jobApplicationId: string;

  @ManyToOne(() => JobApplication, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_application_id' })
  jobApplication: JobApplication;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    name: 'from_status',
    nullable: true,
  })
  fromStatus?: ApplicationStatus;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    name: 'to_status',
  })
  toStatus: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'changed_at' })
  changedAt: Date;
}
