import "@bitnoi.se/react-scheduler/dist/style.css";
import {Scheduler} from "@bitnoi.se/react-scheduler";
import React, {useEffect, useState, useCallback} from "react";
import dayjs from "dayjs";
import "./BitNoise.css"
import Modal from 'react-modal'
const mockedSchedulerData = [
    {
      id: "resource-1",
      label: {
        icon: "https://picsum.photos/200/300",
        title: "Ship1",
        subtitle: "Status of Today",
      },
      data: [
        {
          id: "task-1",
          startDate: new Date("2024-11-18"),
          endDate: new Date("2024-11-19"),
          title: "Task: Surveying",
          subtitle: `Trip Start on ${new Date("2024-11-10")}`,
          bgColor: "rgb(100,150,255)",
        },
        {
          id: "task-2",
          startDate: new Date("2024-11-18"),
          endDate: new Date("2024-11-19"),
          title: "Task: Repairing",
          subtitle: `Trip Start on ${new Date("2024-11-18")}`,
          bgColor: "rgb(255,100,150)",
        }
      ]
    },
    {
      id: "resource-2",
      label: {
        icon: "https://picsum.photos/200/300",
        title: "Ship2",
        subtitle: "Status of Today",
      },
      data: [
        {
          id: "task-3",
          startDate: new Date("2024-11-05"),
          endDate: new Date("2024-11-20"),
          title: "Task: Fishing",
          subtitle: `Trip Start on ${new Date("2024-11-05")}`,
          bgColor: "rgb(150,255,100)",
        }
      ]
    }
];

const anotherData = [
    {
      id:"Ship1",
      label:{icon:"https://picsum.photos/200/300",title:"Ship1",subtitle:"Lets Go"},
      data:[
      {id:"Ship1-Floating-Sat Nov 09 2024 00:00:00 GMT+0000 (Greenwich Mean Time)-Sun Nov 10 2024 00:00:00 GMT+0000 (Greenwich Mean Time)",
      startDate:new Date("2024-11-09T00:00:00.000Z"),
      endDate:new Date("2024-11-10T00:00:00.000Z"),
      title:"Floating",
      subtitle:"Vessel Ship1 is doing Floating from Sat Nov 09 2024 00:00:00 GMT+0000 (Greenwich Mean Time) to Sun Nov 10 2024 00:00:00 GMT+0000 (Greenwich Mean Time)",
      bgColor:"rgb(255,100,150)"},
      {id:"Ship1-SLeeping-Tue Nov 12 2024-Tue Nov 12 2024",
        startDate:new Date ("2024-11-12T00:00:00.000Z"),
        endDate:new Date ("2024-11-12T00:00:00.000Z"),
        title:"SLeeping",
        subtitle:"Vessel Ship1 is doing SLeeping from Tue Nov 12 2024 to Tue Nov 12 2024",
        bgColor:"rgb(255,100,150)"}

      ]
      }
]

function BitNoise({plottingData, startTimeFileter, endTimeFilter}) {
  const [range, setRange] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState({});

  const handleRangeChange = useCallback((range) => {
    setRange(range);
  }, []);
  const [startDate, setStartDate] = useState("");  
  const [endDate, setEndDate] = useState(""); 
  const handleTileClick = (data) => {
    console.log(data);
    const cleanedParts = data.description.replace(/-/g, "").split(/(?<!:)(?=Cux|Esb|Sas|Rød|Emd|Büs|UK|Han|NONE|Dep|Arr|Sail|Dry Dock)/);
    
    const departure = cleanedParts[0].trim();
    const arrival = cleanedParts[1].trim().split(":")[1] + ":" + cleanedParts[1].trim().split(":")[0];
    console.log(departure);
    console.log(arrival);
    const taskScope = data.id.split(";")[1];
    const taskClient = data.id.split(";")[2];
    const taskMaster = data.id.split(";")[3];
    const taskCrew = data.id.split(";")[4];
    const jobCode = data.id.split(";")[5];

  
    setTaskDetails({
      title: data.title,
      jobCode,
      departure,
      startDate: data.startDate,
      arrival,
      endDate: data.endDate,
      taskScope,
      taskClient,
      taskMaster,
      taskCrew,
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
      <div>
        <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <Scheduler
        data={plottingData}
        onRangeChange={handleRangeChange}
        config={{
          zoom: 1,
          maxRecordsPerPage: 15,
          filterButtonState: 1,
          lang: "en",
          showTooltip: true,
          showThemeToggle: true,
        }}
        onTileClick={(resource) => handleTileClick(resource)}
        onItemClick={(item) => console.log("Clicked item:", item)}
      />

      {/* Modal for Task Details */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Task Details"
        ariaHideApp={false} 
        style={{
          content: {
            maxWidth: "600px", 
            maxHeight:"45%",
            height: "auto",
            margin: "auto",
            borderRadius: "8px",
            padding: "15px",
            backgroundColor: "white",
            color: "black", 
            display: "flex",
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "flex-start",
            textAlign: "center",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", 
            display: "flex",
            alignItems: "center", 
            justifyContent: "center",
          },
          
        }}
      >
        <h2 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>Task Details</h2>
        <div style={{ textAlign: "center", width: "100%" }}>
          <p><strong>Task Name:</strong> {taskDetails.title}</p>
          <p><strong>Job Code:</strong> {taskDetails.jobCode}</p>
          <p><strong>Start:</strong> {taskDetails.departure}</p>
          <p><strong>End:</strong> {taskDetails.arrival}</p>
          <p><strong>Scope:</strong> {taskDetails.taskScope}</p>
          <p><strong>Client:</strong> {taskDetails.taskClient}</p>
          <p><strong>Master:</strong> {taskDetails.taskMaster}</p>
          <p><strong>Crew:</strong> {taskDetails.taskCrew}</p>
        </div>
        <button onClick={closeModal} style={{ marginTop: "20px",
          padding: "8px 15px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#007bff", // A primary button color
          color: "white",
          cursor: "pointer",
          fontSize: "1rem", }}>Close</button>
      </Modal>
    </div>
  );
};

export default BitNoise;

