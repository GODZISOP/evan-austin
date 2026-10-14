import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  getExerciseBySlug, 
  getAllExercises, 
  getAdjacentExercises 
} from "@/data/workoutData";
import ExerciseDetailView from "@/components/ExerciseDetailView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const all = getAllExercises();
  return all.map((ex) => ({
    slug: ex.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const exercise = getExerciseBySlug(slug);

  if (!exercise) {
    return {
      title: "Exercise Not Found | Evan Austin",
    };
  }

  return {
    title: `${exercise.title} | ${exercise.dayName} Protocol | Evan Austin`,
    description: `Complete execution guide for ${exercise.title}. Sets, reps, rest periods, technique cues, and form demonstration.`,
  };
}

export default async function ExerciseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const exercise = getExerciseBySlug(slug);

  if (!exercise) {
    notFound();
  }

  const { prev, next } = getAdjacentExercises(exercise.slug);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 selection:bg-red-600 selection:text-white">
      <ExerciseDetailView 
        exercise={exercise} 
        prevExercise={prev} 
        nextExercise={next} 
      />
    </div>
  );
}
