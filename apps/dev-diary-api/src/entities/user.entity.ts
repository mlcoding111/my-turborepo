import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IBaseEntity } from '@/core/entity/base.entity';

@Entity()
export class User implements IBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  hashed_refresh_token: string | null;

  @Column({ type: 'varchar', nullable: true })
  refresh_token: string | null;

  @Column({ type: 'varchar', nullable: true })
  github_token: string | null;

  // Json integration data
  @Column({ type: 'jsonb', nullable: true })
  integration_data: Record<string, any> | null;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export type UserType = InstanceType<typeof User>;

// Make sure it satisfies the TCreateUserType
export type TCreateUser = Partial<
  Omit<User, 'id' | 'created_at' | 'updated_at'>
>;
