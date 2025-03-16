import { cookies } from "next/headers";
import connectDB from "@/utils/db";
import Coupon from "@/models/Coupon";

export async function POST(req) {
  await connectDB();

  const ip = req.headers.get("x-forwarded-for") || req.headers.get("host");
  const cookieStore = cookies();
  const claimed = cookieStore.get("claimed"); // ✅ FIX: No await needed


  // if the user already claimed a coupon (cookie exists) OR the IP is missing, reject the request with 429 Too Many Requests
  if (claimed || !ip) {
    return Response.json({ message: "Try again later." }, { status: 429 });
  }

  const coupon = await Coupon.findOne({ claimed: false }).sort("_id");
  if (!coupon) return Response.json({ message: "No coupons left" }, { status: 400 });

  coupon.claimed = true;
  coupon.claimedBy = ip;
  coupon.claimedAt = new Date();
  await coupon.save();

  // ✅ FIX: Set cookie correctly in Next.js App Router
  cookieStore.set("claimed", "true", { maxAge: 600 });

  return Response.json({ message: "Coupon claimed!", coupon });
}
