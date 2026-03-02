import * as orderService from "../services/orderService.js";

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "";

    const result = await orderService.getUserOrders(
      userId,
      page,
      limit,
      status,
    );

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: result.orders,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { orderId } = req.params;

    const order = await orderService.getOrderById(orderId, userId);

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Create order (subscribe)
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { subscription_price_id } = req.body;

    if (!subscription_price_id) {
      return res.status(400).json({
        success: false,
        message: "subscription_price_id is required",
      });
    }

    const order = await orderService.createOrder(userId, subscription_price_id);

    res.status(201).json({
      success: true,
      message: "Order created successfully. Please proceed to payment.",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
