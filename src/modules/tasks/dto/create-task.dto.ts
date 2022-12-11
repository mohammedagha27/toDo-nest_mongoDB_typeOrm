import { IsNotEmpty, IsNumber } from 'class-validator';
export class TasksDTO {
  id?: number;
  userId: number;
  @IsNotEmpty()
  title: string;
  status?: string;
}
