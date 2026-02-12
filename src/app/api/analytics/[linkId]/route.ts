import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import Click from "@/models/Click";

function getPeriodDate(period: string): Date | null {
  const now = new Date();
  switch (period) {
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "90d":
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    default:
      return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { linkId } = await params;

    if (!mongoose.Types.ObjectId.isValid(linkId)) {
      return NextResponse.json({ error: "Invalid link ID" }, { status: 400 });
    }

    await connectDB();

    const link = await Link.findOne({ _id: linkId, userId: session.user.id }).lean();
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    const period = request.nextUrl.searchParams.get("period") || "30d";
    const periodDate = getPeriodDate(period);

    const matchStage: Record<string, unknown> = {
      linkId: new mongoose.Types.ObjectId(linkId),
    };
    if (periodDate) {
      matchStage.timestamp = { $gte: periodDate };
    }

    const [timeline, countries, devices, browsers, os, referrers] =
      await Promise.all([
        Click.aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
              },
              clicks: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $project: { date: "$_id", clicks: 1, _id: 0 } },
        ]),
        Click.aggregate([
          { $match: matchStage },
          { $match: { country: { $ne: null } } },
          { $group: { _id: "$country", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
          { $project: { name: "$_id", count: 1, _id: 0 } },
        ]),
        Click.aggregate([
          { $match: matchStage },
          { $group: { _id: "$device", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $project: { name: "$_id", count: 1, _id: 0 } },
        ]),
        Click.aggregate([
          { $match: matchStage },
          { $match: { browser: { $ne: null } } },
          { $group: { _id: "$browser", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
          { $project: { name: "$_id", count: 1, _id: 0 } },
        ]),
        Click.aggregate([
          { $match: matchStage },
          { $match: { os: { $ne: null } } },
          { $group: { _id: "$os", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
          { $project: { name: "$_id", count: 1, _id: 0 } },
        ]),
        Click.aggregate([
          { $match: matchStage },
          { $match: { refererDomain: { $ne: null } } },
          { $group: { _id: "$refererDomain", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
          { $project: { name: "$_id", count: 1, _id: 0 } },
        ]),
      ]);

    return NextResponse.json({
      totalClicks: link.totalClicks,
      timeline,
      countries,
      devices,
      browsers,
      os,
      referrers,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
