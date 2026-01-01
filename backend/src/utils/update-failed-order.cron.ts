import Order from "../models/Order";

export const updateFailedOrders = async () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const orders = await Order.updateMany(
    {
      status: "placed",
      createdAt: {
        $lte: oneHourAgo,
      },
    },
    {
      $set: {
        status: "failed",
      },
    }
  );
  console.log(`Failed orders updated: ${orders.modifiedCount}`);
};
