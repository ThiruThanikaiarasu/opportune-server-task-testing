const express = require('express')
const router = express.Router()

const { checkUsernameAvailability, updateUserProfile, getUserProfile, getPortfolioByUsername, searchSkills } = require('../controllers/userController')
const { validateCheckUsernameInput } = require('../validators/userValidator')
const upload = require('../middleware/fileUpload')

/**
 * @swagger
 * /user/checkUsername:
 *   post:
 *     tags:
 *       - User Profile
 *     summary: Check if a username is available or already exists
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe123
 *                 description: The username to check for availability.
 *     responses:
 *       200:
 *         description: Username availability check successful
 *       400:
 *         description: Bad Request (validation or missing parameters)
 *       409:
 *         description: Username already exists
 *       500:
 *         description: Internal server error
 */

router.post('/checkUsername', validateCheckUsernameInput(), checkUsernameAvailability)

/**
 * @swagger
 * /profile/{username}:
 *   get:
 *     summary: Retrieve a user's profile by username
 *     description: Fetches the profile details of a user based on their username.
 *     tags:
 *       - User Profile
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user whose profile is being retrieved.
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Internal server error
 */

router.get('/profile/:username', getUserProfile)

/**
 * @swagger
 * /user/profile:
 *  patch:
 *   tags:
 *    - User Profile
 *   summary: Update user profile information
 *   requestBody:
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: A unique identifier for the user, following strict validation rules.
 *           example: 'john_doe-99'
 *           minLength: 3
 *           maxLength: 20
 *           pattern: "^(?![-_])[a-zA-Z0-9-_]{3,20}(?<![-_])$"
 *         bio:
 *           type: string
 *           description: A short biography about the user.
 *           example: "Passionate web developer with a focus on MERN stack projects."
 *         profilePicture:
 *           type: string
 *           format: binary
 *           description: Upload a new profile picture.
 *         portfolioLink:
 *           type: string
 *           description: A link to the user's portfolio website.
 *           example: "https://myportfolio.com"
 *         resumeLink:
 *           type: string
 *           description: A link to the user's resume.
 *           example: "https://myresume.com/resume"
 *         resumeFile:
 *           type: string
 *           format: binary
 *           description: Upload your resume.
 *         accounts:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               domain:
 *                 type: string
 *                 description: The domain or platform of the account.
 *                 example: "LeetCode"
 *                 maxLength: 50
 *               url:
 *                 type: string
 *                 description: The URL of the user's account on the specified domain.
 *                 example: "https://leetcode.com/username"
 *   responses:
 *    200:
 *     description: User profile updated successfully
 *    400:
 *     description: Validation error in input data
 *    401:
 *     description: Unauthorized, user must be logged in
 *    500:
 *     description: Internal server error
 *    503: 
 *     description: Server busy try again later
 */

router.patch('/profile', upload.fields([{name: 'profilePicture', maxCount: 1}, {name:'resumeFile', maxCount: 1}]), updateUserProfile)

module.exports = router