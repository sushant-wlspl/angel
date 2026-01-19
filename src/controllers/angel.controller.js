const { initAngelSession } = require("../services/angel.service");

exports.testAngelLogin = async (req, res) => {
  try {
    await initAngelSession();

    res.json({
      success: true,
      message: "Angel One login successful"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};