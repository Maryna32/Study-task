import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const taskId = Number(id);
    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: "Невірний id завдання" },
        { status: 400 }
      );
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return NextResponse.json(
        { error: "Завдання не знайдено" },
        { status: 404 }
      );
    }

    const subjectId = task.subjectId;

    await prisma.task.delete({ where: { id: taskId } });

    const remainingTasks = await prisma.task.findMany({
      where: { subjectId },
    });

    if (remainingTasks.length === 0) {
      await prisma.subject.delete({ where: { id: subjectId } });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const taskId = Number(id);
    if (isNaN(taskId))
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });

    const body = await req.json();

    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.deadline !== undefined)
      updateData.deadline = body.deadline ? new Date(body.deadline) : null;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.done !== undefined) updateData.done = body.done;
    if (body.subjectId !== undefined) updateData.subjectId = body.subjectId;
    if (body.userId !== undefined) updateData.userId = body.userId;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const taskId = Number(id);
    if (isNaN(taskId))
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { subject: true },
    });

    if (!task)
      return NextResponse.json({ error: "Task not found" }, { status: 404 });

    if (task.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, task });
  } catch (err) {
    console.error("Error fetching task:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
