import { TaskDto } from "../domain/domain";
import { supabase } from "../utils/supabase";

const TaskTable = "task";

export function createEmptyTask(memberId: string, projectId: number) {
  return supabase
    .from(TaskTable)
    .upsert([{
      author_id: memberId,
      project_id: projectId,
    }]);
}

export function updateTask(id: number, data: Partial<TaskDto>) {
  return supabase
    .from(TaskTable)
    .update(data)
    .match({ id });
}

export function deleteTask(id: number) {
  return supabase
    .from(TaskTable)
    .delete()
    .match({ id });
}

export function deleteTaskForProject(projectId: number) {
  return supabase
    .from(TaskTable)
    .delete()
    .match({ project_id: projectId });
}
