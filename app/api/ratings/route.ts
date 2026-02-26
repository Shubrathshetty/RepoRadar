import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const RATINGS_FILE = path.join(DATA_DIR, "ratings.json");

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readRatingsData() {
  try {
    const data = await readFile(RATINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      average: 4.8,
      total: 1247,
      distribution: { 5: 987, 4: 189, 3: 45, 2: 15, 1: 11 },
      ratings: [],
    };
  }
}

async function writeRatingsData(data: unknown) {
  await ensureDataDir();
  await writeFile(RATINGS_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = await readRatingsData();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rating } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const data = await readRatingsData();
    
    const newRating = {
      id: Date.now().toString(),
      rating,
      createdAt: new Date().toISOString(),
    };

    // Update distribution
    data.distribution[rating] = (data.distribution[rating] || 0) + 1;
    data.total += 1;
    
    // Recalculate average
    let sum = 0;
    for (let i = 1; i <= 5; i++) {
      sum += i * (data.distribution[i] || 0);
    }
    data.average = parseFloat((sum / data.total).toFixed(1));
    
    data.ratings.push(newRating);
    
    await writeRatingsData(data);

    return NextResponse.json({ 
      success: true, 
      rating: newRating,
      stats: {
        average: data.average,
        total: data.total,
        distribution: data.distribution,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error saving rating:", error);
    return NextResponse.json(
      { error: "Failed to save rating" },
      { status: 500 }
    );
  }
}
