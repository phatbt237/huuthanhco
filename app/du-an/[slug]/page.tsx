import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProjectDetailPage from "./ProjectDetailPage";
import { fetchPublicCmsContent } from "@/lib/cmsContent";
import { findProjectBySlug, getProjectDetailHref, getRelatedProjects } from "@/lib/projects";
import { absoluteSiteUrl } from "@/lib/siteMetadata";

type Props = PageProps<"/du-an/[slug]">;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await fetchPublicCmsContent();
  const project = findProjectBySlug(projects, slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.description,
    alternates: {
      canonical: absoluteSiteUrl(getProjectDetailHref(project)),
    },
    openGraph: {
      title: project.name,
      description: project.description,
      url: absoluteSiteUrl(getProjectDetailHref(project)),
      images: [project.image],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const { projects } = await fetchPublicCmsContent();
  const project = findProjectBySlug(projects, slug);
  if (!project) notFound();

  return (
    <ProjectDetailPage
      project={project!}
      relatedProjects={getRelatedProjects(projects, project!)}
    />
  );
}
