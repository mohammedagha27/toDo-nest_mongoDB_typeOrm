import { Entity, Column, ObjectIdColumn, ObjectID, OneToMany } from 'typeorm';
import { Task } from '../tasks/task.entity';

@Entity('User')
export default class User {
  @ObjectIdColumn()
  _id: ObjectID | string;

  @Column({
    type: 'uuid',
    unique: true,
    primary: true,
  })
  user_id: string;

  @Column({ length: 500 })
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
