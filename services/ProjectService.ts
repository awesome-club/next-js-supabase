import { ProjectDto } from "../domain/domain";
import { supabase } from "../utils/supabase";

export const ProjectTable = "project";

export function getMemberProjects() {
  return supabase
    .from(ProjectTable)
    .select(`*, task(*)`);
}

export function updateProject(id: number, data: Partial<ProjectDto>) {
  return supabase
    .from(ProjectTable)
    .update(data)
    .match({ id });
}

export function deleteProject(id: number) {
  return supabase
    .from(ProjectTable)
    .delete()
    .match({ id });
}

export function createProject(name: string, authorId: string) {
  return supabase
    .from(ProjectTable)
    .upsert([{
      name,
      author_id: authorId,
    }]);
}
