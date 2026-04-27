import { User } from "../model/User.Model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/api-Error.js";
import asyncHandler from "../utils/Async-handler";
import {ApiResponse} from "../utils/api-Response.js"

const updateUserProfile = asyncHandler( (req, res) => {
   
        const file = req.files?.profilePic?.[0]; // safer extraction

        if (!file) {
            throw new ApiError(401, "Profile picture not found");
        }

        const uploadedImage = await uploadOnCloudinary(file.path);

        if (!uploadedImage?.url) {
            throw new ApiError(500, "Unable to upload profile pic");
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user._id }, // assuming auth middleware
            {
                avatar: {
                    url: uploadedImage.url,
                    public_id: uploadedImage.public_id
                }
            },
            {
                new: true
            }
        );

        return res.status(200).json(new ApiResponce(200,"Profile updated successfully"))
       

   });

export default updateUserProfile;