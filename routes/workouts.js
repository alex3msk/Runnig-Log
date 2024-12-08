const express = require("express");
const {
  getting,
  gettingAll,
  updating,
  deleting,
  creating,
} = require("../controllers/workoutsController");

const router = express.Router();

/**
 * @swagger
 * /api/workouts:
 *   get:
 *     summary: Select all Workouts
 *     tags: [Workouts]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workout'
 *   post:
 *     summary: Create a new Workout
 *     tags: [Workouts]
 *     parameters:
 *       - name
 *       - email
 *       - password
 *     responses:
 *       200:
 *         description: New user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 * components:
 *   schemas:
 *     Workout:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: encripted string
 *         dob:
 *           type: date
 */
router.route("/").get(gettingAll).post(creating);

/**
 * @swagger
 * /api/workouts/{id}:
 *   get:
 *     tags: [Workouts]
 *     summary: Get a specific Workout by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single Workout object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *   put:
 *     summary: Update Workout data
 *     tags: [Workouts]
 *     parameters:
 *       - id
 *       - name
 *       - email
 *       - password
 *     responses:
 *       200:
 *         description: String - message
 *   delete:
 *     summary: Delete Workout by ID
 *     tags: [Workouts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: String - message
 */
router.route("/:id").get(getting).delete(deleting).put(updating);

module.exports = router;
