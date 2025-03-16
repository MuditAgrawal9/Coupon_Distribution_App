import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  claimed: { type: Boolean, default: false },
  claimedBy: { type: String, default: null },
  claimedAt: { type: Date, default: null },
});

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
