const express = require("express");
const {
  createDocument,
  getDocument,
  updateDocument,
  getDocuments,
  deleteDocument,
} = require("../controllers/documentController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createDocument);
router.put("/update-documents", authMiddleware, updateDocument);
router.get("/:id", authMiddleware, getDocument);
router.get("/", authMiddleware, getDocuments);
router.delete("/:id", authMiddleware, deleteDocument);
module.exports = router;
