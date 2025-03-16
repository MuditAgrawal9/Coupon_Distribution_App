import connectDB from "@/utils/db";
import Coupon from "@/models/Coupon";

export async function GET() {
  await connectDB();
  const coupons = await Coupon.find();
  return Response.json(coupons);
}

export async function POST(req) {
  await connectDB();
  const { code } = await req.json();
  const newCoupon = new Coupon({ code });
  await newCoupon.save();
  return Response.json({ message: "Coupon added!" });
}
