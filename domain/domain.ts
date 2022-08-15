import { uid } from "../utils/utils";

export interface ProjectDto {
  id: number;
  name: string;
  color: string;
  task: TaskDto[];
}

export interface TaskDto {
  id: number;
  name: string;
  description: string;
  preview: string;
  status: number;
  time: number;
}

export enum TaskStatus {
  ToDo,
  Done,
}

export const EmptyTask: TaskDto = {
  id: uid(),
  name: "",
  description: "",
  preview: "",
  status: TaskStatus.ToDo.valueOf(),
  time: 0,
};
