const Document = require("../models/Document");

exports.createDocument = async (req, res) => {
  try {
    const { title } = req.body;
    const document = new Document({ title, collaborators: [req.user.id] });
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDocument = async (req, res) => {
  const { documentId, content } = req.body;

  try {
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.content = content;
    document.lastModified = new Date();

    await document.save();

    res
      .status(200)
      .json({ message: "Document updated successfully", document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    res.json(document);
  } catch (error) {
    res.status(404).json({ message: "Document not found" });
  }
};

exports.getDocuments = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const documents = await Document.find()
      .skip(skip)
      .limit(limit)
      .sort({ lastModified: -1 });

    const totalDocuments = await Document.countDocuments();

    res.status(200).json({
      documents,
      totalDocuments,
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDocument = await Document.findByIdAndDelete(id);

    if (!deletedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({
      message: "Document deleted successfully",
      document: deletedDocument,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
