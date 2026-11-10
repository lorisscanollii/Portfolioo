import {
  aboutArtifacts,
  experience,
  experienceObjects,
  infrastructure,
  projects,
  skillDetails,
  skills,
  worldStations,
  type AboutArtifact,
  type ExperienceObject,
  type Project,
  type SkillCategory,
  type StationId,
  type WorldStation,
} from "@/data/portfolio";

export type SelectionKind =
  | "about"
  | "experience"
  | "skill"
  | "project"
  | "achievement"
  | "contact";

export interface WorldSelection {
  kind: SelectionKind;
  id: string;
}

export interface ExperienceDetail {
  object: ExperienceObject;
  title: string;
  summary: string;
  points: string[];
  source: "experience area" | "infrastructure component";
}

export function getStation(id: StationId): WorldStation {
  return worldStations.find((station) => station.id === id) ?? worldStations[0];
}

export function getAboutArtifact(id: string): AboutArtifact | undefined {
  return aboutArtifacts.find((artifact) => artifact.id === id);
}

export function getExperienceDetail(id: string): ExperienceDetail | null {
  const object = experienceObjects.find((item) => item.id === id);
  if (!object) return null;

  if (object.areaId) {
    const area = experience.areas.find((item) => item.id === object.areaId);
    if (!area) return null;

    return {
      object,
      title: area.title,
      summary: area.summary,
      points: area.responsibilities,
      source: "experience area",
    };
  }

  if (object.nodeId) {
    const node = infrastructure.nodes.find((item) => item.id === object.nodeId);
    if (!node) return null;

    return {
      object,
      title: node.label,
      summary: node.description,
      points: [],
      source: "infrastructure component",
    };
  }

  return null;
}

export function getSkillDetail(id: string): {
  category: SkillCategory;
  usage: string;
} | null {
  const category = skills.find((item) => item.category === id);
  if (!category) return null;

  return {
    category,
    usage:
      skillDetails[category.category] ??
      "Practical experience across the tools listed in this discipline.",
  };
}

export function getProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

/**
 * Stations are arranged as a linear path through one world. Navigation wraps
 * at both ends so the visitor never reaches a dead end.
 */
export function getAdjacentStation(
  active: StationId,
  direction: 1 | -1,
): StationId {
  const index = worldStations.findIndex((station) => station.id === active);
  const next = (index + direction + worldStations.length) % worldStations.length;
  return worldStations[next].id;
}

export function getStationIndex(id: StationId): number {
  return worldStations.findIndex((station) => station.id === id);
}
