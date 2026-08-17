import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "../enums";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string

    @Column({ type: 'varchar', length: 255, name: 'password_hash' })
    passwordHash: string

    @Column({ type: 'varchar', length: 255, name: 'full_name' })
    fullName: string

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date

    @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
    deletedAt: Date
}