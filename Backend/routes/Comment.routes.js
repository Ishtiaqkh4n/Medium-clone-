import { Router } from "express";

const router = Router();

// Create + Get comments for a blog
router.route("/:blogId/comments")
    .post((req, res) => {
        res.send(`Create comment for blog ${req.params.blogId}`);
    })
    .get((req, res) => {
        res.send(`Get all comments for blog ${req.params.blogId}`);
    });

// Single comment operations
router.route("/comments/:id")
    .get((req, res) => {
        res.send(`Get comment ${req.params.id}`);
    })
    .put((req, res) => {
        res.send(`Update comment ${req.params.id}`);
    })
    .delete((req, res) => {
        res.send(`Delete comment ${req.params.id}`);
    });



export default router;