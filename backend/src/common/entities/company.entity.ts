import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('company')
export class Company{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({type:'uuid',name:'user_id'})
    userId:string

    @ManyToOne(()=>User, {onDelete:'CASCADE'})
    @JoinColumn({name:'user_id'})
    user:User

    @Column({type:"varchar",length:150})
    name:string

    @Column({type:'varchar',length:255,name:'website',nullable:true})
    website:string
    
    @Column({type:'varchar',length:255,name:'industry',nullable:true})
    industry:string

    @Column({type:'varchar',length:255,name:'location',nullable:true})
    location:string

    @Column({type:'varchar',length:255,name:'notes',nullable:true})
    notes:string

    @CreateDateColumn({type:'timestamptz',name:'created_at'})
    createdAt:Date
    
      @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}