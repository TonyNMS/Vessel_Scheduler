import "@bitnoi.se/react-scheduler/dist/style.css";
import {Scheduler} from "@bitnoi.se/react-scheduler";
import React, {useEffect, useState, useCallback} from "react";
import dayjs from "dayjs";
import "./BitNoise.css"
import ReactModal from 'react-modal'
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

function BitNoise({plottingData}) {
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: dayjs().add(1, "month").toDate(),
  });
  const addStarEndMarker = (plottingData) =>{
    if (!plottingData){
      return;
    };
    return plottingData.map((ship) => {
      const updatedData = [...ship.data]; 
  
      ship.data.forEach((task) => {
        const { id, startDate, endDate, description } = task;
        const taskDuration = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

        if (taskDuration >= 1) {
          const startTask = {
            id: `${id}-startInfo`, 
            startDate: startDate, 
            endDate: startDate, 
            title: "Start Info", 
            bgColor: "rgb(102, 187, 106)", 
          };
          const endTask = {
            id: `${id}-endInfo`, 
            startDate: endDate, 
            endDate: endDate, 
            title: "End Info", 
            bgColor: "rgb(239, 83, 80)", 
          };
          updatedData.push(startTask, endTask);
        }
      });
      return {
        ...ship,
        data: updatedData,
      };
    });
  }
  const updatedPlottingData = addStarEndMarker(plottingData);

  const handleRangeChange = useCallback((range) => {
    setRange(range);
  }, []);
  const handleTileClick = (data) =>{
    const cleanedParts = data.description.replace(/-/g, "").split(/(?<=Dep:Cux)/);
    const departure = cleanedParts[0].trim();
    const arrival = cleanedParts[1]?.trim();
    console.log(departure+ arrival)
    const taskScope = data.id.split(";")[1];
    const taskClient = data.id.split(";")[2];
    const taskMaster = data.id.split(";")[3];
    const taskCrew = data.id.split(";")[4];
    const jobCode = data.id.split(";")[5];

    
    alert(
      `
      Task Name: ${data.title}
      \n
      Job Code: ${jobCode}
      \n
      ${departure} || Start Date: ${data.startDate} 
      \n
      ${arrival} || End Date: ${data.endDate}
      \n
      Task Scope: ${taskScope}
      \n
      Task Client: ${taskClient}
      \n
      Task Master: ${taskMaster}
      \n
      Task Crew: ${taskCrew}
      `
    )
  }

  return (
    <div>
      <Scheduler
        data={(plottingData)}
        onRangeChange={handleRangeChange}
        config={{
          zoom: 1,
          maxRecordsPerPage :8,
          filterButtonState :0,
          lang : "en",
          filterButtonState : 2,
          showTooltip : true,
          showThemeToggle : true,

        }}
        onTileClick={(resource) => handleTileClick(resource)}
        onItemClick={(item) => console.log("Clicked item:", item)}
        
  
      />
    </div>
  );
}

export default BitNoise;

