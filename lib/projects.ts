import type { Project } from "@/data/projects";
import { projects } from "@/data/projects";
import { slugify } from "@/lib/utils";

export function getProjectSlug(project: Pick<Project, "id" | "name" | "slug">) {
  return project.slug || `${slugify(project.name)}-dp${project.id}`;
}

export function getProjectDetailHref(project: Pick<Project, "id" | "name" | "slug">) {
  return `/du-an/${getProjectSlug(project)}`;
}

export function sortProjectsByYearDesc(projectItems: Project[]) {
  return projectItems
    .map((project, index) => ({ project, index }))
    .sort((a, b) => b.project.year - a.project.year || a.index - b.index)
    .map(({ project }) => project);
}

export function findStaticProjectBySlug(slug: string) {
  return projects.find((project) => getProjectSlug(project) === slug || project.id === slug);
}

export function getRelatedStaticProjects(project: Project, limit = 3) {
  const sameCategory = projects.filter((item) => item.id !== project.id && item.category === project.category);
  const others = projects.filter((item) => item.id !== project.id && item.category !== project.category);
  return [...sameCategory, ...others].slice(0, limit);
}
