import type { Metadata } from "next";
import ProjectDetailPage from "./ProjectDetailPage";
import { projects } from "@/data/projects";
import { findStaticProjectBySlug, getProjectSlug, getRelatedStaticProjects } from "@/lib/projects";

type Props = PageProps<"/du-an/[slug]">;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: getProjectSlug(project) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = findStaticProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
      images: [project.image],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const project = findStaticProjectBySlug(slug);

  return <ProjectDetailPage project={project} relatedProjects={project ? getRelatedStaticProjects(project) : []} slug={slug} />;
}
