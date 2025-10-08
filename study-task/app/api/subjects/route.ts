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
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const subjects = await prisma.subject.findMany({
      where: { userId: user.id },
      select: { name: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      subjects: subjects.map((s) => s.name),
    });
  } catch (err) {
    console.error("Error fetching subjects:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, token } = await req.json();

    if (!name || !token)
      return NextResponse.json(
        { error: "Назва предмета або токен відсутні" },
        { status: 400 }
      );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.subject.findFirst({
      where: { userId: user.id, name },
    });

    if (existing) {
      return NextResponse.json({ success: true, subject: existing });
    }

    const subject = await prisma.subject.create({
      data: { name, userId: user.id },
    });

    return NextResponse.json({ success: true, subject });
  } catch (err) {
    console.error("Error creating subject:", err);
    return NextResponse.json(
      { error: "Помилка при створенні предмета" },
      { status: 500 }
    );
  }
}
