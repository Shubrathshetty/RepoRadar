import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTACT_FILE = path.join(DATA_DIR, "contact-messages.json");

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readContactData() {
  try {
    const data = await readFile(CONTACT_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeContactData(data: unknown[]) {
  await ensureDataDir();
  await writeFile(CONTACT_FILE, JSON.stringify(data, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (message.length < 20) {
      return NextResponse.json(
        { error: "Message must be at least 20 characters" },
        { status: 400 }
      );
    }

    const messages = await readContactData();
    
    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      status: "unread",
    };

    messages.push(newMessage);
    await writeContactData(messages);

    // In production, you would also send an email notification here
    // await sendEmailNotification(newMessage);

    return NextResponse.json({ 
      success: true, 
      message: "Message sent successfully",
      id: newMessage.id 
    }, { status: 201 });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // This would typically be protected by authentication
  // For now, just return success to indicate the endpoint exists
  return NextResponse.json({ 
    message: "Contact messages endpoint. Use POST to submit a message." 
  });
}
