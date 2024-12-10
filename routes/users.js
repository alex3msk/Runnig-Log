const express = require("express");
const {
  getting,
  gettingAll,
  updating,
  deleting,
  creating,
} = require("../controllers/usersController");

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Select all Users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create a new User
 *     tags: [Users]
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
 *               $ref: '#/components/schemas/User'
 * components:
 *   schemas:
 *     User:
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
 * /api/users/{id}:
 *   get:
 *     summary: Get a specific User by ID
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *   put:
 *     summary: Update User data
 *     tags: [Users]
 *     parameters:
 *       - id
 *       - name
 *       - email
 *       - password
 *     responses:
 *       200:
 *         description: String - message
 *   delete:
 *     summary: Delete User by ID
 *     tags: [Users]
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
router.route("/:id").get(getting).put(updating).delete(deleting);

module.exports = router;
