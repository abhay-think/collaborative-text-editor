import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import axios from "axios";

const StyledQuill = styled(ReactQuill)`
  .ql-container {
    border: 2px solid #1976d2 !important;
    border-radius: 8px;
    height: 40vh;
    background-color: #f0f0f0;
  }

  .ql-toolbar {
    border: 2px solid #1976d2 !important;
    border-radius: 8px 8px 0 0;
    background-color: #e3f2fd;
  }

  .ql-editor {
    font-size: 16px;
    font-family: "Arial", sans-serif;
    padding: 10px;
  }
`;

const DocumentEditor = ({ newDocumentId }) => {
  const [editorValue, setEditorValue] = useState("");
  const socket = useRef(null);

  const token = useSelector((state) => state.auth.token);
  const userDetails = useSelector((state) => state.auth.user);
  const [textFieldValue, setTextFieldValue] = useState("");

  const [usersTyping, setUsersTyping] = useState([]);

  const handleTextFieldChange = (e) => {
    setTextFieldValue(e.target.value);
  };

  const createPrompt = (existingText, userSuggestion) => {
    return `You are a professional editor. Here is some text provided by the user:\n\n"${existingText}"\n\nThe user has suggested the following changes or additions:\n\n"${userSuggestion}"\n\nPlease update the existing text accordingly, ensuring it remains coherent and professional. Return only the updated text.`;
  };

  useEffect(() => {
    if (newDocumentId) {
      setEditorValue(newDocumentId.content || "");
    }
  }, [newDocumentId]);

  useEffect(() => {
    if (!newDocumentId) return;

    socket.current = io(`${process.env.REACT_APP_BASE_URL}`, {
      auth: { token },
    });
    if (socket) {
      socket?.current?.on("connect", () => {
        console.log("Socket connected:", socket.current.id);

        socket.current.emit("joinDocument", {
          documentId: newDocumentId._id,
          userDetails: userDetails,
        });

        socket.current.on("documentUpdate", (updatedContent, userDetails) => {
          setUsersTyping([userDetails]);
          setEditorValue(updatedContent);
        });

        setTimeout(() => {}, 3000);
      });
    }

    socket?.current?.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [newDocumentId, token]);

  const handleEditorChange = (value) => {
    setEditorValue(value);

    if (socket.current && newDocumentId) {
      socket.current.emit("editDocument", {
        documentId: newDocumentId._id,
        content: value,
        userDetails: userDetails,
      });
    }
  };

  const handleSave = async () => {
    const response = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/documents/update-documents`,
      {
        documentId: newDocumentId?._id,
        content: editorValue,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const handleAiSuggestion = async () => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          model: "gpt-3.5-turbo-instruct",
          prompt: `${createPrompt(editorValue, textFieldValue)}`,
          max_tokens: 150,
        },
        {
          headers: {
            Authorization: `ADD API KEY`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.choices[0].text;
    } catch (error) {
      console.log("error: ", error);
      throw new Error("Error fetching AI suggestions");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Document Editor</Typography>
        {usersTyping?.map((user) => (
          <Avatar sx={{ bgcolor: "#b79494" }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
        ))}
      </Box>

      <StyledQuill
        value={editorValue}
        onChange={handleEditorChange}
        theme="snow"
      />

      <Button
        variant="contained"
        sx={{ alignSelf: "flex-start" }}
        onClick={handleSave}
      >
        Save Document
      </Button>
      <TextField
        label="AI Suggestions"
        multiline
        rows={4}
        value={textFieldValue}
        onChange={handleTextFieldChange}
        variant="outlined"
        fullWidth
      />
      <Button
        variant="contained"
        sx={{ alignSelf: "flex-start" }}
        onClick={handleAiSuggestion}
        disabled={!textFieldValue.trim()}
      >
        Apply Suggestions
      </Button>
    </Box>
  );
};

export default DocumentEditor;
