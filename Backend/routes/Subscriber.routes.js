import { Router } from "express";

const router = Router();

// Subscribe to a user
router.post("/subscriptions/:userId", (req, res) => {
    res.send(`Subscribe to user ${req.params.userId}`);
});

// Unsubscribe
router.delete("/subscriptions/:userId", (req, res) => {
    res.send(`Unsubscribe from user ${req.params.userId}`);
});

// My subscriptions
router.get("/subscriptions/me", (req, res) => {
    res.send("Get my subscriptions");
});

// Get followers of a user
router.get("/subscriptions/:userId/followers", (req, res) => {
    res.send(`Get followers of user ${req.params.userId}`);
});

export default router;