const { model, Schema } = require("mongoose");

const schema = new Schema(
  {
    comment: {
      type: String,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

module.exports = model("Comment", schema);
