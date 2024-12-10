const express = require("express");
const {
  monthruns,
  monthlystat,
  } = require("../controllers/monthController")
const router = express.Router();

/**
 * @swagger
 * /api/month/:
 *   get:
 *     summary:  Get all workouts made during a month
 *     tags: [Month]
 *     parameters:
 *       - name: month
 *         in: path
 *         required: true
 *         schema:
 *           type: string "YYYYMM"
 *     responses:
 *       200:
 *         description: Month runs/workouts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stat'
 */
router.route("/").get(monthruns);
/**
 * @swagger
 * /api/month/total:
 *   get:
 *     summary: Get workout statistics for a given month
 *     tags: [Month]
 *     parameters:
 *       - name: month
 *         in: path
 *         required: true
 *         schema:
 *           type: string "YYYYMM"
 *     responses:
 *       200:
 *         description: Total month workouts statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stat'
 */
router.route("/total").get(monthlystat);

module.exports = router;