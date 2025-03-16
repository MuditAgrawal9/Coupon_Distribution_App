import { cookies } from "next/headers";
import connectDB from "@/utils/db";
import Coupon from "@/models/Coupon";

export async function POST(req) {
  await connectDB();

  const ip = req.headers.get("x-forwarded-for") || req.headers.get("host");
  const cookieStore = cookies();
  const claimed = cookieStore.get("claimed");

  const recentClaim = await Coupon.findOne({
    claimedBy: ip,
    claimedAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) }, // 10-minute cooldown
  });
  
  if (recentClaim) {
    return Response.json({ message: "You have already claimed a coupon. Try again later." }, { status: 429 });
  }

  if (claimed || !ip) {
    return Response.json({ message: "Try again later." }, { status: 429 });
  }

  // Fetch the oldest unclaimed coupon in a round-robin manner
  const coupon = await Coupon.findOneAndUpdate(
    { claimed: false },
    { $set: { claimed: true, claimedBy: ip, claimedAt: new Date() } },
    { sort: { _id: 1 }, new: true } // Sort by _id (first available), return updated doc
  );

  if (!coupon) return Response.json({ message: "No coupons left" }, { status: 400 });

  // Set cooldown tracking cookie
  cookieStore.set("claimed", "true", { maxAge: 600 });

  return Response.json({ message: "Coupon claimed!", coupon });
}
