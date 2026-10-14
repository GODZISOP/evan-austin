import type { Metadata } from "next";
import WorkoutPrograms from "@/components/WorkoutPrograms";

export const metadata: Metadata = {
  title: "Training Programs & Split | Evan Austin",
  description: "Official hypertrophic workout splits: Leg Day, Arm Day, detailed sets, reps, rest periods, and anatomical movement guides.",
};

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <WorkoutPrograms />
    </div>
  );
}
