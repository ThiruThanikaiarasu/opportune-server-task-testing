const { findUserNameAlreadyExists, updateUserProfileData, fetchUserProfileData } = require('../services/userService')
const { validationResult } = require('express-validator')
const { setResponseBody } = require('../utils/responseFormatter')

const checkUsernameAvailability = async(request,response) => {
    const { username } = request.body
    try {
        const errors = validationResult(request)

        if(!errors.isEmpty()) {
            return response.status(400).send(setResponseBody(errors.array()[0].msg,"validation_error",null))
        }

        const userExists = !!(await findUserNameAlreadyExists(username))
        if (userExists) {
            return response.status(409).send(setResponseBody("Username already exists","existing_user_name",null));
        }
        return response.status(200).send(setResponseBody("Username is available",null,null));
    }
    catch(error)
    {
        return response.status(500).send(setResponseBody(error.message, "server_error", null))
    }
}

const getUserProfile = async (request, response) => {
    const { username } = request.params
    try {
        const userProfile = await fetchUserProfileData(username)

        if (!userProfile || userProfile.length == 0) {
            return response.status(404).send(setResponseBody("User profile not found", "not_found", null))
        }
        console.log(userProfile)

        response.status(200).send(setResponseBody("User data fetched", null, userProfile))
    }
    catch(error) {
        return response.status(500).send(setResponseBody(error.message, "server_error", null))
    }
}

const updateUserProfile = async (request, response) => {
    const profileData = request.body
    const profilePicture = request.files?.profilePicture ? request.files.profilePicture[0] : null
    const resumeFile = request.files?.resumeFile ? request.files.resumeFile[0] : null

    try {
        const userProfile = await updateUserProfileData(profileData, profilePicture, resumeFile)

        response.status(200).send(setResponseBody("User Profile updated", null, userProfile))
    }
    catch(error) {
        return response.status(500).send(setResponseBody(error.message, "server_error", null))
    }
}

module.exports = {
    checkUsernameAvailability,
    getUserProfile,
    updateUserProfile,
}