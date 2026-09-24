import { TriangleAlert } from "lucide-react";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import { getMilestones } from "@/lib/milestones";

/** Milestone dari Supabase — dikelola lewat /admin/dashboard, tampil tanpa redeploy. */
export async function Journey() {
  const { milestones, error } = await getMilestones();

  if (error) {
    return (
      <div className="glass flex items-start gap-3 rounded-xl border-dashed p-5 text-sm text-muted-foreground">
        <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-destructive" />
        <p>{error}</p>
      </div>
    );
  }
  return <MilestoneTimeline milestones={milestones} />;
}
