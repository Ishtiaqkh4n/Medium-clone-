import { Blog } from "../model/Blog.Models.js";
import { ApiError } from "../utils/api-Error.js";
import { ApiResponse } from "../utils/api-Response.js";
import asyncHandler from "../utils/Async-handler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBlog = asyncHandler(async(req, res) => {
    const { title, body, tags } = req.body
    const thumbnail = req.files?.thumbnail?.[0]
    let uploadedThumbnailImage = null
    if (thumbnail) {
        uploadedThumbnailImage = await uploadOnCloudinary(thumbnail);
    }
    const blog = Blog.create(req.user._id, { title, body, tags, thumbnail: { imageUrl: thumbnail?.url, public_id: thumbnail?.public_id } });
    if (!blog) {
        throw new ApiError(500, "Unable to create blog")
    }
    return res.status(201).json(new ApiResponse(201, "Blog create successfully", blog))


});



const updateBlog = asyncHandler(async (req, res) => {
    // 1. get blog id from params
    const { blogId } = req.params;

    if (!blogId) {
        throw new ApiError(400, "Blog ID is required");
    }

    // 2. get updated data from body
    const { title, content, tags } = req.body;

    if (!title && !content && !tags) {
        throw new ApiError(400, "At least one field is required to update");
    }

    // 3. find and update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $set: {
                ...(title && { title }),
                ...(content && { content }),
                ...(tags && { tags })
            }
        },
        {
            new: true, // return updated doc
            runValidators: true
        }
    );

    if (!updatedBlog) {
        throw new ApiError(404, "Blog not found");
    }

    // 4. send response
    return res.status(200).json(
        new ApiResponse(200, updatedBlog, "Blog updated successfully")
    );
});

const deleteBlog = asyncHandler(async (req,res) => { 

       const { blogId } = req.params;

    if (!blogId) {
        throw new ApiError(400, "Blog ID is required");
    }

    const deleteBlog = Blog.findByIdAndDelete(blog)
    if (!deleteBlog) {
        
        throw new ApiError(401,"invalid blog id , unable to delete blog ")
    }
    return res.status(204,"blog deleted successfully")

 });



export { updateBlog,createBlog,deleteBlog };
