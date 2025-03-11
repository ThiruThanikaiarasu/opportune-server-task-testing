const mongoose = require('mongoose')

/**
 * @swagger
 * components:
 *  schemas: 
 *   UserProfile:
 *    type: object
 *    required: 
 *     - username
 *     - profilePicture
 *     - bio
 *     - skills
 *     - passedOutYear
 *    properties: 
 *     username:
 *      type: string
 *      description: A unique identifier for the user, following strict validation rules.
 *      example: 'john_doe-99'
 *      minLength: 3
 *      maxLength: 20
 *      pattern: "^(?![-_])[a-zA-Z0-9-_]{3,20}(?<![-_])$"
 *     bio: 
 *      type: string 
 *      description: A short biography about the user.
 *      example: 'Passionate web developer with expertise in the MERN stack.'
 *      maxLength: 200
 *     profilePicture:
 *      type: string
 *      description: The URL of the user's profile picture.
 *      example: 'https://lh3.googleusercontent.com/a/profile-image'
 *      pattern: "^(http|https):\\/\\/[a-zA-Z0-9\\-_.]+(\\.[a-zA-Z]{2,})?(:[0-9]{1,5})?(\\/[a-zA-Z0-9\\-_.~!*'();:@&=+$,/?#[\\]%]*)?$"
 *     portfolioLink:
 *      type: string
 *      description: A link to the user's portfolio website.
 *      example: 'https://myportfolio.com'
 *      pattern: "^(http|https):\\/\\/[a-zA-Z0-9\\-_.]+(\\.[a-zA-Z]{2,})?(:[0-9]{1,5})?(\\/[a-zA-Z0-9\\-_.~!*'();:@&=+$,/?#[\\]%]*)?$"
 *     resumeLink:
 *      type: string
 *      description: A link to the user's resume (either this or resumeFile is required).
 *      example: 'https://myresume.com/resume'
 *      pattern: "^(http|https):\\/\\/[a-zA-Z0-9\\-_.]+(\\.[a-zA-Z]{2,})?(:[0-9]{1,5})?(\\/[a-zA-Z0-9\\-_.~!*'();:@&=+$,/?#[\\]%]*)?$"
 *     resumeFile:
 *      type: string
 *      description: The URL of the user's uploaded resume file (either this or resumeLink is required).
 *      example: 'https://s3.amazonaws.com/bucket-name/resume.pdf'
 *     accounts:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        domain:
 *         type: string
 *         description: The domain or platform of the account.
 *         example: 'LeetCode'
 *         maxLength: 50
 *        url:
 *         type: string
 *         description: The URL of the user's account on the specified domain.
 *         example: 'https://leetcode.com/username'
 *         pattern: "^(http|https):\\/\\/[a-zA-Z0-9\\-_.]+(\\.[a-zA-Z]{2,})?(:[0-9]{1,5})?(\\/[a-zA-Z0-9\\-_.~!*'();:@&=+$,/?#[\\]%]*)?$"
 *    additionalProperties: false
 *    timestamps: true 
 */

const userProfileSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is a mandatory field'],
            unique: true,
            match: [/^(?![-_])[a-zA-Z0-9-_]{3,20}(?<![-_])$/, 'Invalid username format'],
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
            required: [true, 'Bio is a mandatory field'],
            maxlength: [200, 'Bio must not exceed 200 characters'],
        },
        profilePicture: {
            type: String,
            trim: true,
            match: [
                /^(http|https):\/\/[a-zA-Z0-9\-_.]+(\.[a-zA-Z]{2,})?(:[0-9]{1,5})?(\/[a-zA-Z0-9\-_.~!*'();:@&=+$,/?#[\]%]*)?$/,
                'External link must be a valid URL'
            ]
        },
        portfolioLink: {
            type: String,
            match: [
                /^(http|https):\/\/[a-zA-Z0-9\-_.]+(\.[a-zA-Z]{2,})?(:[0-9]{1,5})?(\/[a-zA-Z0-9\-_.~!*'();:@&=+$,/?#[\]%]*)?$/, 
                'Portfolio link must be a valid URL'
            ],
        },
        resumeLink: {
            type: String,
            match: [/^(http|https):\/\/[a-zA-Z0-9\-_.]+(\.[a-zA-Z]{2,})?(:[0-9]{1,5})?(\/[a-zA-Z0-9\-_.~!*'();:@&=+$,/?#[\]%]*)?$/, 'Resume link must be a valid URL'],
        },
        resumeFile: {
            type: String,
        },
        accounts: [
            {
                domain: {
                    type: String,
                    required: [true, 'Account domain is required'],
                    trim: true,
                    maxlength: [50, 'Domain name cannot exceed 50 characters'],
                },
                url: {
                    type: String,
                    required: [true, 'Account URL is required'],
                    trim: true,
                    match: [
                        /^(http|https):\/\/[a-zA-Z0-9\-_.]+(\.[a-zA-Z]{2,})?(:[0-9]{1,5})?(\/[a-zA-Z0-9\-_.~!*'();:@&=+$,/?#[\]%]*)?$/,
                        'Account URL must be a valid URL',
                    ],
                },
            },
        ],
        // professionalExperience: {
        //     type: Number,
        //     required: [true, 'Professional Experience is a mandatory field'],
        //     min: [0, 'Professional Experience cannot be negative'],
        //     max: [60, 'Professional Experience exceeds the realistic limit']
        // },
        // passedOutYear: {
        //     type: Number,
        //     required: [true, 'Passed Out Year is a mandatory field'],
        //     min: [1960, 'Year must be a four-digit positive number'],
        //     max: [2040, 'Year must be a four-digit positive number'],
        //     validate: {
        //         validator: Number.isInteger,
        //         message: 'Year must be an integer',
        //     },
        // }
    },
    {
        timestamps: true
    },
    {
        collection: 'userProfiles'
    }
)

module.exports = mongoose.model('userProfiles', userProfileSchema)

userProfileSchema.pre('validate', function(next) {
    if (!this.resumeLink && !this.resumeFile) {
        return next(new Error('Either Resume Link or Resume File is required'))
    }
    next()
})