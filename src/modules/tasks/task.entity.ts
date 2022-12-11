import { Entity, Column, ObjectIdColumn, ManyToOne } from 'typeorm';
import User from '../users/user.entity';

@Entity('Task')
export class Task {
  @ObjectIdColumn()
  _id: string;

  @Column({
    type: 'uuid',
    unique: true,
    primary: true,
  })
  task_id: string;

  @Column({ length: 500 })
  title: string;

  @Column()
  status: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}
