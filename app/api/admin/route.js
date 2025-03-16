import connectDB from "@/utils/db";
import Coupon from "@/models/Coupon";

//fetch coupons
export async function GET() {
  await connectDB();
  const coupons = await Coupon.find();
  return Response.json(coupons);
}

//add coupon
export async function POST(req) {
  await connectDB();
  const { code } = await req.json();
  const newCoupon = new Coupon({ code });
  await newCoupon.save();
  return Response.json({ message: "Coupon added!" });
}

//delete coupon
export async function DELETE(req) {
  await connectDB();
  const { id } = await req.json(); // Get coupon ID from request body

  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return Response.json({ error: "Coupon not found" }, { status: 404 });
    }

    return Response.json({ message: "Coupon deleted!" });
  } catch (error) {
    return Response.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}

//toggle coupon
export async function PATCH(req) {
  await connectDB();
  const { id, available } = await req.json(); // ✅ Get id from body

  if (!id) {
    return Response.json({ message: "Coupon ID is required" }, { status: 400 });
  }

  const updatedCoupon = await Coupon.findByIdAndUpdate(
    id,
    { available },
    { new: true }
  );

  if (!updatedCoupon) {
    return Response.json({ message: "Coupon not found" }, { status: 404 });
  }

  return Response.json({ message: "Coupon updated!", updatedCoupon });
}