import { Router } from "express";

import { createBlog,deleteBlog,getBlogs,updateBlog } from "../controller/Blog.controller.js";

import { upload } from "../middlewares/Multer.middlewere.js";
import requireAuth from "../middlewares/Auth.middlewere.js";


const router = Router();
// local middleweres
router.use(requireAuth)


// Create a blog
router.route('/create-blog').post(upload.single('thumbnail'),createBlog)
// Get blogs 
router.route('/get-blog').get(getBlogs)
// Get single blog
router.route('/get-blog/:blogId').get(getBlogs)
// Update blog
router.route('/update-blog/:blogId').put(upload.single('thumbnail'),updateBlog)
// Delete blog
router.route('/delete/:blogId').delete(deleteBlog)

export default router;
