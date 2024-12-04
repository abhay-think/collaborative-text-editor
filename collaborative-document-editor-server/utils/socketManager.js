const Document = require("../models/Document");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinDocument", async ({ documentId, userDetails }) => {
      socket.join(documentId);

      console.log(
        `User ${socket.id} joined document >>>>>>>>>>>> ${documentId}`
      );

      socket.to(documentId).emit("userJoined", userDetails, () => {
        console.log("userJoined event emitted to room:", documentId);
      });
    });

    socket.on("editDocument", async ({ documentId, content, userDetails }) => {
      await Document.findByIdAndUpdate(documentId, {
        content,
        lastModified: new Date(),
      });

      socket.to(documentId).emit("documentUpdate", content, userDetails);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
