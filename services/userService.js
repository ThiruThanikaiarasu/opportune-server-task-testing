const bcrypt = require('bcryptjs')

const userProfileModel = require('../models/userProfileModel')
const { uploadToS3, deleteFromS3 } = require('./s3Service')
const { S3_BASE_URL } = require('../configurations/constants')

const findUserNameAlreadyExists = async (username) => {
    return await userProfileModel.exists({ username })
}

const updateUser = async (user, updates) => {
    if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(updates.password, salt);
        user.password = hashedPassword;
    }

    const { password, ...otherUpdates } = updates;

    Object.assign(user, otherUpdates); 

    await user.save();
    return user;
};


const fetchUserProfileData = (username) => {
    const userProfile = userProfileModel.aggregate(
        [
            {
                $match: { username: username }
            },
            {
                $project: {
                    _id: 0, 
                    __v: 0,
                }
            }
        ]
    )
    return userProfile
}

const updateUserProfileData = async (profileData, profilePicture, resumeFile) => {
    let userProfile
    if(profileData?.username) {
        userProfile = await userProfileModel.findOne({ username: profileData.username })
    }

    if (!userProfile) {
        userProfile = new userProfileModel({
            ...profileData
        })
    } else {
        Object.keys(profileData).forEach(key => {
            if (profileData[key] !== undefined) {
                userProfile[key] = profileData[key]
            }
        })
    }

    if (profilePicture) {
        if (userProfile.profilePicture) {
            const s3Key = userProfile.profilePicture.replace(S3_BASE_URL, '')
            await deleteFromS3(s3Key)
        }

        const profilePicS3Key = await uploadToS3(profilePicture)
        userProfile.profilePicture = S3_BASE_URL + profilePicS3Key
    }

    if (resumeFile) {
        if (userProfile.resumeFile) {
            const s3Key = userProfile.resumeFile.replace(S3_BASE_URL, '')
            await deleteFromS3(s3Key)
        }

        const resumeS3Key = await uploadToS3(resumeFile)
        userProfile.resumeFile = S3_BASE_URL + resumeS3Key
    }

    await userProfile.save()
    return userProfile
}

module.exports = {
    findUserNameAlreadyExists,
    updateUser,
    fetchUserProfileData,
    updateUserProfileData,
}