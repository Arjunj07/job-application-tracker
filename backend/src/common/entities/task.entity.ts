import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { JobApplication } from './job-application.entity';
import { Interview } from './interview.entity';
import { TaskPriority, TaskStatus } from '../enums';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', name: 'job_application_id', nullable: true })
  jobApplicationId?: string;

  @ManyToOne(() => JobApplication, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'job_application_id' })
  jobApplication?: JobApplication;

  @Column({ type: 'uuid', name: 'interview_id', nullable: true })
  interviewId?: string;

  @ManyToOne(() => Interview, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'interview_id' })
  interview?: Interview;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamptz', name: 'due_date' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({ type: 'boolean', default: false, name: 'reminder_sent' })
  reminderSent: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
