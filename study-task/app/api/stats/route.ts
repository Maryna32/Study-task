import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);
    if (userError || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tasks = await prisma.task.findMany({ where: { userId: user.id } });

    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    const startOfWeek = new Date(startOfToday);
    const day = startOfWeek.getDay(); // 0 = неділя
    startOfWeek.setDate(startOfWeek.getDate() - (day === 0 ? 6 : day - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const stats = {
      total: tasks.length,
      done: tasks.filter((t) => t.status === "DONE").length,
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      notStarted: tasks.filter((t) => t.status === "NOT_STARTED").length,

      overdue: tasks.filter(
        (t) => t.deadline < startOfToday && t.status !== "DONE"
      ).length,

      today: tasks.filter(
        (t) =>
          t.deadline >= startOfToday &&
          t.deadline <= endOfToday &&
          t.status !== "DONE"
      ).length,

      thisWeek: tasks.filter(
        (t) =>
          t.deadline >= startOfWeek &&
          t.deadline <= endOfWeek &&
          t.status !== "DONE"
      ).length,

      highPriority: tasks.filter(
        (t) => t.priority === "HIGH" && t.status !== "DONE"
      ).length,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
