import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      deadline,
      priority,
      status,
      done,
      notes,
      subjectName,
      token,
    } = body;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json(
        { error: "Неавторизований користувач" },
        { status: 401 }
      );
    }

    let subject = await prisma.subject.findFirst({
      where: { name: subjectName, userId: user.id },
    });

    if (!subject) {
      subject = await prisma.subject.create({
        data: { name: subjectName, userId: user.id },
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        deadline: new Date(deadline),
        priority,
        status,
        done,
        notes,
        subjectId: subject.id,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, task });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Помилка при створенні завдання" },
      { status: 500 }
    );
  }
}

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

    const url = new URL(req.url);
    const subjectIdParam = url.searchParams.get("subjectId");
    const priorityParam = url.searchParams.get("priority");
    const doneParam = url.searchParams.get("done");

    const whereClause: any = { userId: user.id };
    if (subjectIdParam && subjectIdParam !== "all") {
      whereClause.subjectId = Number(subjectIdParam);
    }

    if (priorityParam && priorityParam !== "all") {
      whereClause.priority = priorityParam.toUpperCase();
    }

    if (doneParam && doneParam !== "all") {
      whereClause.done = doneParam === "true";
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        subject: true,
      },
      orderBy: {
        deadline: "asc",
      },
    });

    return NextResponse.json({ success: true, tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
