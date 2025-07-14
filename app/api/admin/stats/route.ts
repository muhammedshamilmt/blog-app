import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

function formatTime(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleString();
}

function getLastNDates(n: number) {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Fetch total users
    const totalUsers = await db.collection("users").countDocuments();
    // Fetch total uploads
    const totalUploads = await db.collection("uploads").countDocuments();
    // Fetch total likes (sum of likes field in uploads)
    const likesAggTotal = await db.collection("uploads").aggregate([
      { $group: { _id: null, total: { $sum: "$likes" } } }
    ]).toArray();
    const totalLikes = likesAggTotal[0]?.total || 0;
    // Fetch total views (sum of views field in uploads)
    const viewsAgg = await db.collection("uploads").aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } }
    ]).toArray();
    const totalViews = viewsAgg[0]?.total || 0;
    // Calculate engagement rate
    const engagementRate = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) + "%" : "0.0%";
    // Fetch total writers (users with isWriter true)
    const totalWriters = await db.collection("users").countDocuments({ isWriter: true });

    // Fetch pending writer applications (writers collection, status: 'pending')
    const pendingWriterApplications = await db.collection("writers").countDocuments({ status: "pending" });
    // Fetch pending content reviews (uploads collection, status: 'pending')
    const pendingContentReviews = await db.collection("uploads").countDocuments({ status: "pending" });
    // Fetch unread messages (contacts collection, status: 'new')
    const unreadMessages = await db.collection("contacts").countDocuments({ status: "new" });

    // Fetch most liked 3 articles
    const mostLikedArticles = await db.collection("uploads")
      .find({ status: "published" })
      .sort({ likes: -1 })
      .limit(3)
      .project({ _id: 1, titles: 1, likes: 1, author: 1, publishedAt: 1, featuredImage: 1 })
      .toArray();

    // Time series for last 7 days
    const last7Days = getLastNDates(7);

    // Likes by day (sum of likes for uploads created that day)
    const likesAgg = await db.collection("uploads").aggregate([
      { $match: { createdAt: { $gte: new Date(last7Days[0]) } } },
      { $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          likes: 1
        }
      },
      { $group: { _id: "$date", count: { $sum: "$likes" } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    const likesByDay = last7Days.map(date => ({ date, count: likesAgg.find(d => d._id === date)?.count || 0 }));

    // Uploads by day (count of uploads created that day)
    const uploadsAgg = await db.collection("uploads").aggregate([
      { $match: { createdAt: { $gte: new Date(last7Days[0]) } } },
      { $project: { date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } } },
      { $group: { _id: "$date", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    const uploadsByDay = last7Days.map(date => ({ date, count: uploadsAgg.find(d => d._id === date)?.count || 0 }));

    // Uploads by category
    const uploadsByCategoryAgg = await db.collection("uploads").aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();
    const uploadsByCategory = uploadsByCategoryAgg.map(c => ({ category: c._id || 'Uncategorized', count: c.count }));

    // Signups by day (count of users created that day)
    const signupsAgg = await db.collection("users").aggregate([
      { $match: { createdAt: { $gte: new Date(last7Days[0]) } } },
      { $project: { date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } } },
      { $group: { _id: "$date", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    const signupsByDay = last7Days.map(date => ({ date, count: signupsAgg.find(d => d._id === date)?.count || 0 }));

    // Fetch recent activity from users, uploads, writers, contacts
    const [recentUsers, recentUploads, recentWriters, recentContacts] = await Promise.all([
      db.collection("users").find({}, { projection: { firstName: 1, lastName: 1, createdAt: 1 } }).sort({ createdAt: -1 }).limit(5).toArray(),
      db.collection("uploads").find({}, { projection: { titles: 1, author: 1, createdAt: 1 } }).sort({ createdAt: -1 }).limit(5).toArray(),
      db.collection("writers").find({}, { projection: { name: 1, submittedAt: 1 } }).sort({ submittedAt: -1 }).limit(5).toArray(),
      db.collection("contacts").find({}, { projection: { name: 1, createdAt: 1 } }).sort({ createdAt: -1 }).limit(5).toArray(),
    ]);
    const recentActivity = [
      ...recentUsers.map(u => ({
        type: "New User",
        description: `${u.firstName || ''} ${u.lastName || ''} joined the platform`,
        time: u.createdAt || new Date(),
      })),
      ...recentUploads.map(a => ({
        type: "New Article",
        description: `${Array.isArray(a.titles) ? (typeof a.titles[0] === 'string' ? a.titles[0] : (a.titles[0]?.value || 'Untitled')) : (typeof a.titles === 'string' ? a.titles : 'Untitled')} published`,
        time: a.createdAt || new Date(),
      })),
      ...recentWriters.map(w => ({
        type: "Writer Application",
        description: `${w.name || 'Unknown'} applied to become a writer`,
        time: w.submittedAt || new Date(),
      })),
      ...recentContacts.map(c => ({
        type: "Contact Message",
        description: `${c.name || 'Unknown'} sent a message`,
        time: c.createdAt || new Date(),
      })),
    ].sort((a, b) => new Date(b.time as string).getTime() - new Date(a.time as string).getTime()).slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalUploads,
        totalLikes,
        totalViews,
        engagementRate,
        totalWriters,
        pendingWriterApplications,
        pendingContentReviews,
        unreadMessages,
        mostLikedArticles,
        recentActivity,
        likesByDay,
        uploadsByDay,
        signupsByDay,
        uploadsByCategory,
      }
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch admin statistics" },
      { status: 500 }
    );
  }
} 