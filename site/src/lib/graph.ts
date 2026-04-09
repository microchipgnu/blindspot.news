import { getDayIndex, getReport, getDayThreads, type Report, type Thread } from "./reports";

export interface GraphNode {
  id: string;
  label: string;
  type: "report" | "actor" | "thread";
  category?: string;
  topic?: string;
  threadType?: string;
  url?: string;
  weight: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: "appears-in" | "thread-link" | "cause-effect";
  label?: string;
  weight: number;
}

export interface DayGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function buildDayGraph(date: string): DayGraph | null {
  const index = getDayIndex(date);
  if (!index || index.reports.length < 2) return null;

  const reports: Report[] = [];
  for (const r of index.reports) {
    const full = getReport(date, r.id);
    if (full) reports.push(full);
  }

  const threads = getDayThreads(date);

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();

  // Add report nodes
  for (const r of reports) {
    const rid = `report:${r.id}`;
    nodes.push({
      id: rid,
      label: r.title.length > 45 ? r.title.slice(0, 42) + "..." : r.title,
      type: "report",
      category: r.category,
      topic: r.topic,
      url: `/report/${date}/${r.id}`,
      weight: 0,
    });
    nodeIds.add(rid);
  }

  // If we have threads, use them as the primary connection structure
  if (threads && threads.threads.length > 0) {
    for (const thread of threads.threads) {
      const tid = `thread:${thread.id}`;
      nodes.push({
        id: tid,
        label: thread.title,
        type: "thread",
        threadType: thread.type,
        weight: thread.stories.length,
      });
      nodeIds.add(tid);

      // Connect stories to thread
      for (const storyId of thread.stories) {
        const rid = `report:${storyId}`;
        if (nodeIds.has(rid)) {
          edges.push({
            source: rid,
            target: tid,
            type: "thread-link",
            weight: 2,
          });
        }
      }

      // Add directional cause-effect edges between stories
      for (const conn of thread.connections) {
        const fromId = `report:${conn.from}`;
        const toId = `report:${conn.to}`;
        if (nodeIds.has(fromId) && nodeIds.has(toId)) {
          edges.push({
            source: fromId,
            target: toId,
            type: "cause-effect",
            label: conn.relationship,
            weight: 3,
          });
        }
      }
    }
  }

  // Also add shared actors as secondary connections
  const actorToReports = new Map<string, string[]>();
  for (const r of reports) {
    for (const actor of r.actors || []) {
      const actorKey = actor.toLowerCase().trim();
      if (!actorToReports.has(actorKey)) actorToReports.set(actorKey, []);
      actorToReports.get(actorKey)!.push(r.id);
    }
  }

  for (const [actorKey, reportIds] of actorToReports) {
    if (reportIds.length < 2) continue;
    const aid = `actor:${actorKey}`;
    const originalName = reports
      .flatMap((r) => r.actors || [])
      .find((a) => a.toLowerCase().trim() === actorKey) || actorKey;

    nodes.push({
      id: aid,
      label: originalName,
      type: "actor",
      weight: reportIds.length,
    });
    nodeIds.add(aid);

    for (const rid of reportIds) {
      edges.push({
        source: `report:${rid}`,
        target: aid,
        type: "appears-in",
        weight: 1,
      });
    }
  }

  // Update report node weights
  for (const node of nodes) {
    if (node.type === "report") {
      node.weight = edges.filter(
        (e) => e.source === node.id || e.target === node.id
      ).length;
    }
  }

  if (edges.length === 0) return null;
  return { nodes, edges };
}
