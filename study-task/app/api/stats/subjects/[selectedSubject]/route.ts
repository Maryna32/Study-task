import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: { subject: string } }
) {
  const subject = decodeURIComponent(params.subject);

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

    const tasks = await prisma.task.findMany({
      where: { userId: user.id, subject: { name: subject } },
    });

    const grouped: Record<string, number> = {};
    tasks.forEach((task) => {
      const day = task.deadline?.toISOString().split("T")[0];
      if (!day) return;
      grouped[day] = (grouped[day] || 0) + 1;
    });

    const result = Object.entries(grouped).map(([x, y]) => ({
      x: new Date(x),
      y,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
