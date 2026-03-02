import * as dashboardService from "../services/dashboardService.js";

// Get all dashboard statistics
export const getDashboardStatistics = async (req, res) => {
  try {
    const result = await dashboardService.getDashboardStatistics();
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error fetching dashboard statistics: ${error.message}`,
    });
  }
};

// Get total users
export const getTotalUsers = async (req, res) => {
  try {
    const result = await dashboardService.getTotalUsers();
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: result.count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error fetching total users: ${error.message}`,
    });
  }
};

// Get active courses
export const getActiveCourses = async (req, res) => {
  try {
    const result = await dashboardService.getActiveCourses();
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: result.count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error fetching active courses: ${error.message}`,
    });
  }
};

// Get test statistics
export const getTestStatistics = async (req, res) => {
  try {
    const result = await dashboardService.getTestStatistics();
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error fetching test statistics: ${error.message}`,
    });
  }
};

// Get recent subscriptions
export const getRecentSubscriptions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const result = await dashboardService.getRecentSubscriptions(limit);
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error fetching recent subscriptions: ${error.message}`,
    });
  }
};
