import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Get counts for each collection
    const [messagesCount, writersCount, uploadsCount] = await Promise.all([
      // Count unread messages
      db.collection("contacts").countDocuments({ status: "unread" }),
      // Count pending writer requests
      db.collection("writers").countDocuments({ status: "pending" }),
      // Count pending uploads
      db.collection("uploads").countDocuments({ status: "pending" })
    ])

    return NextResponse.json({
      success: true,
      data: {
        messages: messagesCount,
        writers: writersCount,
        uploads: uploadsCount
      }
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch admin statistics" },
      { status: 500 }
    )
  }
} 