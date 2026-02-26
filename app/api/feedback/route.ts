import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json");

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readFeedbackData() {
  try {
    const data = await readFile(FEEDBACK_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeFeedbackData(data: unknown[]) {
  await ensureDataDir();
  await writeFile(FEEDBACK_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  const feedback = await readFeedbackData();
  return NextResponse.json(feedback);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, rating, comment, email } = body;

    // Validation
    if (!category || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields: category, rating, comment" },
        { status: 400 }
      );
    }

    if (!["bug", "feature", "general", "praise"].includes(category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const feedback = await readFeedbackData();
    
    const newFeedback = {
      id: Date.now().toString(),
      category,
      rating,
      comment,
      email: email || null,
      createdAt: new Date().toISOString(),
    };

    feedback.push(newFeedback);
    await writeFeedbackData(feedback);

    return NextResponse.json({ success: true, feedback: newFeedback }, { status: 201 });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}
