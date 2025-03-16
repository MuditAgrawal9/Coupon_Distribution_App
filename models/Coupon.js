import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true },
  claimed: { type: Boolean, default: false },
  claimedBy: { type: String },
  claimedAt: { type: Date },
  available: { type: Boolean, default: true },
});

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
