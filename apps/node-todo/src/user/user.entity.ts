import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserType {
  ADMIN = 'Admin',
  USER = 'User',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    enum: UserType,
    default: UserType.USER,
  })
  role: UserType
}
