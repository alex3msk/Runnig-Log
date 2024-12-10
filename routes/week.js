const express = require("express");
const {
  weekruns,
  weeklystat,
  } = require("../controllers/weekController")
const router = express.Router();

/**
 * @swagger
 * /api/week/:
 *   get:
 *     summary: Get all workouts made during a week
 *     tags: [Week]
 *     parameters:
 *       - name: week
 *         in: path
 *         required: true
 *         schema:
 *           type: string "YYYYWW"
 *     responses:
 *       200:
 *         description: Week runs/workouts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stat'
 * components:
 *   schemas:
 *     Stat:
 *       type: object
 *       properties:
 *         date:
 *           type: date
 *         totalRuns:
 *           type: integer
 *         totalTime:
 *           type: integer
 *         totalDistance:
 *           type: integer
 */
router.route("/").get(weekruns);

/**
 * @swagger
 * /api/week/total:
 *   get:
 *     summary: Get workout statistics for a given week
 *     tags: [Week]
 *     parameters:
 *       - name: week
 *         in: path
 *         required: true
 *         schema:
 *           type: string "YYYYWW"
 *     responses:
 *       200:
 *         description: Total week workouts statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stat'
 */
router.route("/total").get(weeklystat);

module.exports = router;