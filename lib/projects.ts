import type { Project } from "@/data/projects";
import { slugify } from "@/lib/utils";

export function getProjectSlug(project: Pick<Project, "id" | "name" | "slug">) {
  return project.slug || `${slugify(project.name)}-dp${project.id}`;
}

export function getProjectDetailHref(project: Pick<Project, "id" | "name" | "slug">) {
  return `/du-an/${getProjectSlug(project)}`;
}

export function findProjectBySlug(projects: Project[], slug: string) {
  return projects.find((p) => getProjectSlug(p) === slug || p.id === slug);
}

export function getRelatedProjects(projects: Project[], project: Project, limit = 3) {
  const sameCategory = projects.filter((item) => item.id !== project.id && item.category === project.category);
  const others = projects.filter((item) => item.id !== project.id && item.category !== project.category);
  return [...sameCategory, ...others].slice(0, limit);
}
