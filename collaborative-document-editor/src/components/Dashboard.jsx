import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import DocumentEditor from "./DocumentEditor";
import { logout } from "../slice/authSlice";

const Dashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const userDetails = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [documents, setDocuments] = useState([]);
  const [documentTitle, setDocumentTitle] = useState(""); // State for document title
  const [titleError, setTitleError] = useState("");
  const [newDocumentId, setNewDocumentId] = useState("");

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCreateDocument = async () => {
    if (documentTitle.trim() === "") {
      setTitleError("Document title is required.");
      return;
    }

    setTitleError("");

    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/documents/`,
      {
        title: documentTitle,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response?.status == 201) {
      setNewDocumentId(response?.data);
    }
  };

  const handleExistingDocumentClick = async (id) => {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/documents/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setNewDocumentId(response?.data);
  };

  useEffect(() => {
    const getExistingDocuments = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/documents/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.status == 200) {
        setDocuments(response?.data.documents);
      }
    };
    getExistingDocuments();
  }, [newDocumentId._id]);

  const isDisabled = !!newDocumentId?._id;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="sticky" sx={{ zIndex: 10 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Documents
          </Typography>
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            {userDetails?.name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flex: 1 }}>
        <Box
          sx={{
            width: isMobile ? "100%" : "20%",
            p: 2,
            borderRight: isMobile ? "none" : "1px solid #ddd",
            overflowY: "hidden",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Existing Documents
          </Typography>
          <List>
            {documents?.length > 0 ? (
              documents.map((doc, index) => (
                <ListItem
                  key={doc.id}
                  sx={{
                    bgcolor: index % 2 === 0 ? "lightblue" : "lightgray",
                    "&:hover": { bgcolor: "primary.main", color: "#fff" },
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={doc.title}
                    onClick={() => {
                      handleExistingDocumentClick(doc?._id);
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <Typography>No documents found</Typography>
            )}
          </List>
        </Box>

        <Box sx={{ flex: 1, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Add Document or Select the Existing Document
          </Typography>

          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              height: "92%",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <TextField
                label="Document Title"
                variant="outlined"
                fullWidth
                size="small"
                sx={{ flex: 7 }}
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                error={!!titleError}
                helperText={titleError}
              />
              <button
                style={{
                  flex: 2,
                  padding: "8px 16px",
                  backgroundColor: isDisabled ? "#ccc" : "#1976d2",
                  color: isDisabled ? "#666" : "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  height: "2.3rem",
                }}
                onClick={handleCreateDocument}
                disabled={isDisabled}
              >
                Create Document
              </button>
            </Box>
            <DocumentEditor newDocumentId={newDocumentId} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
