import React, { useState, useEffect } from "react";
import Select from "react-select";
import ImageUploader from "./ImageUploader"; // Ensure this handles multiple uploads and returns URLs
import "./BugComponent.css";
import {
  TextField,
  Select as MUISelect,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateBugModal = ({ onClose }) => {
  const [projects, setProjects] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [types, setTypes] = useState(["Bug", "Feature", "Task"]);
  const [selectedProject, setSelectedProject] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState({
    text: "",
    images: [],
  });
  const [actualOutcome, setActualOutcome] = useState({ text: "", images: [] });
  const [assignee, setAssignee] = useState("");
  const [type, setType] = useState(types[0]);
  const [sprint, setSprint] = useState(
    localStorage.getItem("currentSprint") || "1"
  );
  const [storyPoints, setStoryPoints] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [priority, setPriority] = useState("Medium");
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("userId");
  const currentSprint = localStorage.getItem("currentSprint");
  const [slaDate, setSlaDate] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const sprintOptions = [
    { value: currentSprint, label: `Current Sprint (${currentSprint})` },
  ]
    .concat(
      Array.from({ length: 27 }, (_, i) => ({
        value: (i + 1).toString(),
        label: `Sprint ${i + 1}`,
      }))
    )
    .concat({ value: "Backlog", label: "Backlog" });

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch(
        "http://localhost:8080/project/getProjects",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, role: userRole }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        if (data.length > 0) {
          setSelectedProject(data[0].name);
          setProjectManager(data[0].projectManager);
        }
      }
    };
    fetchProjects();
  }, [userEmail, userRole]);
  const priorityOptions = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  useEffect(() => {
    if (selectedProject) {
      const project = projects.find((p) => p.name === selectedProject);
      if (project) {
        setProjectManager(project.projectManager);

        const fetchAssignees = async () => {
          const response = await fetch(
            `http://localhost:8080/users/getDevelopersByProject`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: selectedProject,
            }
          );
          if (response.ok) {
            const data = await response.json();
            setAssignees(data);
          }
        };

        fetchAssignees();
      }
    }
  }, [selectedProject, projects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const bugData = {
      bug: {
        name,
        description,
        project: selectedProject,
        projectManager,
        assignee,
        type,
        sprint,
        storyPoints,
        expectedOutcome,
        actualOutcome,
        slaDate,
        priority,
      },
      userDetails: {
        email: userEmail,
        id: userId,
      },
    };

    const response = await fetch("http://localhost:8080/bug/createBug", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bugData),
    });

    if (response.ok) {
      navigate("/bugs");
      onClose(); // Close the modal
    } else {
      const errorData = await response.json();
      alert(
        `Error in creating bug: ${errorData.message || "Please try again"}.`
      );
    }

    setIsLoading(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleExpectedImageUpload = (urls) => {
    setExpectedOutcome({ ...expectedOutcome, images: urls });
    setIsUploading(false);
  };

  const handleExpectedImageUploadStart = () => {
    setIsUploading(true);
  };

  const handleActualImageUpload = (urls) => {
    setActualOutcome({ ...actualOutcome, images: urls });
    setIsUploading(false);
  };

  const handleActualImageUploadStart = () => {
    setIsUploading(true);
  };

  const handleAssigneeChange = (newValue) => {
    setAssignee(newValue ? newValue.value : "");
  };

  const assigneeOptions = [{ value: "Auto", label: "Auto Assign" }].concat(
    assignees.map((user) => ({ value: user, label: user }))
  );

  const handleSlaDateChange = (e) => {
    setSlaDate(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  return (
    <div
      style={{
        overflowY: "scroll",
        zIndex: 9999,
      }}
      onClick={handleOverlayClick}>
      <div onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>Create New Bug</h2>

          <TextField
            label="Title"
            required
            variant="outlined"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Description"
            required
            variant="outlined"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <FormControl required sx={{ m: 1, width: "100%", marginLeft: 0 }}>
            <InputLabel id="demo-simple-select-required-label">
              Select Project
            </InputLabel>
            <MUISelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedProject}
              style={{
                marginBottom: "10px",
                textAlign: "left",
                width: "100%",
              }}
              placeholder="Select Project"
              label="Select Project"
              onChange={(e) => setSelectedProject(e.target.value)}>
              {projects.map((proj) => (
                <MenuItem key={proj.name} value={proj.name}>
                  {proj.name}
                </MenuItem>
              ))}
            </MUISelect>
          </FormControl>

          <TextField
            label="Project Manager"
            required
            variant="outlined"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            value={projectManager}
            readOnly
          />
          <FormControl required sx={{ m: 1, width: "100%", marginLeft: 0 }}>
            <InputLabel id="demo-simple-select-required-label">
              Assignee
            </InputLabel>
            <MUISelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{
                marginBottom: "10px",
                textAlign: "left",
                width: "100%",
              }}
              placeholder="Assignee"
              label="Assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}>
              {assignees.map((user) => (
                <MenuItem key={user} value={user}>
                  {user}
                </MenuItem>
              ))}
            </MUISelect>
          </FormControl>
          <label>
            Sprint:
            <div style={{ padding: "10px 2px" }}>
              <Select
                options={sprintOptions}
                onChange={(option) => setSprint(option.value)}
                placeholder="Select or type a sprint"
                isSearchable
                value={sprintOptions.find((option) => option.value === sprint)}
                className="bug-selection"
              />
            </div>
          </label>
          <TextField
            label="Story Points"
            variant="outlined"
            style={{
              width: "100%",
              marginBottom: "10px",
              marginTop: "20px",
            }}
            type="number"
            value={storyPoints}
            onChange={(e) => setStoryPoints(e.target.value)}
            required
            InputLabelProps={{
              style: {
                zIndex: 0,
              },
            }}
          />
          <FormControl required sx={{ m: 1, width: "100%", marginLeft: 0 }}>
            <InputLabel
              id="demo-simple-select-required-label"
              style={{
                zIndex: 0,
              }}>
              Priority
            </InputLabel>
            <MUISelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{
                marginBottom: "10px",
                textAlign: "left",
                width: "100%",
                zIndex: 0,
              }}
              placeholder="Priority"
              label="Priority"
              value={priority}
              onChange={handlePriorityChange}>
              {priorityOptions.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  {p.label}
                </MenuItem>
              ))}
            </MUISelect>
          </FormControl>
          <FormControl required sx={{ m: 1, width: "100%", marginLeft: 0 }}>
            <InputLabel
              id="demo-simple-select-required-label"
              style={{
                zIndex: 0,
              }}>
              Type
            </InputLabel>
            <MUISelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{
                marginBottom: "10px",
                textAlign: "left",
                width: "100%",
                zIndex: 0,
              }}
              placeholder="Type"
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}>
              {types.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </MUISelect>
          </FormControl>
          <Grid
            container
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              // gap: "10px",
            }}>
            <Grid item md={5.7} lg={5.7}>
              <TextField
                label="Expected Outcome"
                variant="outlined"
                multiline
                style={{
                  width: "100%",
                  marginBottom: "10px",
                }}
                value={expectedOutcome.text}
                onChange={(e) =>
                  setExpectedOutcome({
                    ...expectedOutcome,
                    text: e.target.value,
                  })
                }
                InputLabelProps={{
                  style: {
                    zIndex: 0,
                  },
                }}
                required
              />
              <ImageUploader
                onUpload={handleExpectedImageUpload}
                onUploadStart={handleExpectedImageUploadStart}
              />
            </Grid>
            <Grid item md={5.7} lg={5.7}>
              <TextField
                label="Actual Outcome"
                variant="outlined"
                multiline
                style={{
                  minHeight: "50px",
                  width: "100%",
                  marginBottom: "10px",
                }}
                value={actualOutcome.text}
                onChange={(e) =>
                  setActualOutcome({ ...actualOutcome, text: e.target.value })
                }
                required
                InputLabelProps={{
                  style: {
                    zIndex: 0,
                  },
                }}
              />
              <ImageUploader
                onUpload={handleActualImageUpload}
                onUploadStart={handleActualImageUploadStart}
              />
            </Grid>
          </Grid>
          <label>
            SLA Date:
            <input
              type="date"
              value={slaDate}
              onChange={handleSlaDateChange}
              min={today}
              required
            />
          </label>
          {/* <DatePicker
            label="Basic date picker"
            // value={slaDate}
            onChange={(e) => console.log(e.target.value)}
            sx={{
              boxShadow: "none",
            }}
          /> */}
          <div className="form-actions">
            <Button type="button" variant="contained">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || isUploading}>
              {isLoading ? "Creating Bug..." : "Create Bug"}
            </Button>
            {/* <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading || isUploading}>
              {isLoading ? "Creating Bug..." : "Create Bug"}
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBugModal;
