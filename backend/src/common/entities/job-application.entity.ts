import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Company } from './company.entity';
import { Document } from './document.entity';
import { Contact } from './contact.entity';
import { ApplicationStatus, WorkMode } from '../enums';

@Entity('job_applications')
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', name: 'company_id' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'uuid', name: 'submitted_resume_id', nullable: true })
  submittedResumeId?: string;

  @ManyToOne(() => Document, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'submitted_resume_id' })
  submittedResume?: Document;

  @Column({ type: 'varchar', length: 150, name: 'job_title' })
  jobTitle: string;

  @Column({ type: 'text', name: 'job_description', nullable: true })
  jobDescription?: string;

  @Column({ type: 'varchar', length: 500, name: 'job_url', nullable: true })
  jobUrl?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  location?: string;

  @Column({
    type: 'enum',
    enum: WorkMode,
    default: WorkMode.REMOTE,
    name: 'work_mode',
  })
  workMode: WorkMode;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    name: 'salary_min',
    nullable: true,
  })
  salaryMin?: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    name: 'salary_max',
    nullable: true,
  })
  salaryMax?: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source?: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.SAVED,
  })
  status: ApplicationStatus;

  @Column({ type: 'timestamptz', name: 'applied_date', nullable: true })
  appliedDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToMany(() => Contact)
  @JoinTable({
    name: 'application_contacts',
    joinColumn: { name: 'job_application_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'contact_id', referencedColumnName: 'id' },
  })
  contacts: Contact[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
