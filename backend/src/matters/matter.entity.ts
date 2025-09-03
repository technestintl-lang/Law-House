import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MatterStatus, MatterType } from '@shared/types/matter';

@Entity('matters')
export class Matter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: MatterStatus,
    default: MatterStatus.OPEN,
  })
  status: MatterStatus;

  @Column({
    type: 'enum',
    enum: MatterType,
  })
  type: MatterType;

  @Column()
  clientId: string;

  @Column()
  responsibleAttorneyId: string;

  @Column()
  firmId: string;

  @Column({ nullable: true })
  ohadaCaseNumber: string;

  @Column({ nullable: true })
  courtName: string;

  @Column({ nullable: true })
  opposingCounsel: string;

  @Column({ type: 'timestamp' })
  openDate: Date;

  @Column({ nullable: true, type: 'timestamp' })
  closeDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

