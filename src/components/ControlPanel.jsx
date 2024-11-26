import React, {useState} from "react";
import "./ControlPanel.css";
import axios from 'axios';
import QuerySections from "./cp/QuerySections";
import CreateSections from "./cp/CreateSections";
import ModifySections from "./cp/ModifySections";

const ControlPanel = ({returnDataFrame}) =>{
    const [dbUpdateTrigger, setDbUpdateTrigger] = useState(false);
    const handleDatabaseUpdate = () => {
        setDbUpdateTrigger((prev) => !prev); 
    };
    const adjustSpacing = (endDate, startDate) =>{
        const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        let spaceCount = durationInDays * 9.25; // 6 spaces per day
        if (durationInDays === 1){
                spaceCount = 0;
        }else if (durationInDays ===2){
                spaceCount = 6
        }else if (durationInDays ===3){
                spaceCount = durationInDays * 5.5; 
        }else if (durationInDays ===4){
                spaceCount = durationInDays * 6; 
        }else if (durationInDays ===5){
                spaceCount = durationInDays * 7;  
        }else if (durationInDays ===6){
                spaceCount = durationInDays * 7.5; 
        }else if (durationInDays ===7){
                spaceCount = durationInDays * 7.75;
        }else if (durationInDays ===8){
                spaceCount = durationInDays * 8;
                                }
        const dynamicSpacing = "-".repeat(spaceCount);
        return dynamicSpacing;
    }
    const handelRefresh = async () => {
        try {
            const prop = 'Task';
            const response = await axios.post('https://vessel-planner.onrender.com/api/get_prop', { prop: prop });
            let rawData = null;
    
            if (!response.data) {
                throw new Error("Data structure is incorrect or missing");
            } else {
                //console.log(`response.data at CS, ${JSON.stringify(response.data)}`);
                rawData = response.data;
            }
    
            if (!rawData.index) {
                throw new Error("This is impossible, how could index being missing???");
            }
    
            let finalRes = [];
            for (const ship in rawData) {
                if (ship !== "index") {
                    let id = ship;
                    let label = {
                        icon: "https://picsum.photos/200/300",
                        title: ship,
                        subtitle: "Status of Today",
                    };
                    let data = [];
                    let tempTaskName = null;
                    let tempStartTimeIndex = null;
    
                    // Iterate through each time slot for the current ship
                    for (let i = 0; i < Object.keys(rawData[ship]).length; i++) {
                        const currentTask = rawData[ship][i];
    
                        if (currentTask !== "" && currentTask !== null) {
                            if (tempTaskName === null) {
                                // Start a new task
                                tempTaskName = currentTask;
                                tempStartTimeIndex = i;
                            } else if (currentTask !== tempTaskName) {
                                // Task transition, finalize the previous task
                                const tempEndTimeIndex = i - 1;
                                const startTime = new Date(rawData.index[tempStartTimeIndex]);
                                const endTime = new Date(rawData.index[tempEndTimeIndex]);
                                const taskDetails = tempTaskName.split("£");
                                const actualTaskName = taskDetails[0];
                                const startStats = taskDetails[1];
                                const endStats = taskDetails[3];
                                const startPort = taskDetails[2];
                                const endPort = taskDetails[4];
                                const bookingStats = taskDetails[5];
                                const taskScope = taskDetails[6];
                                const taskClient = taskDetails[7];
                                const taskMaster = taskDetails[8];
                                const taskCrew = taskDetails[9];
                                const taskJobCode = taskDetails[10];
                                
                                // Calculate task duration in days
                                const durationInDays = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24)); // Convert ms to days
                                let spaceCount = durationInDays * 9.25; // 6 spaces per day
                                if (durationInDays === 1){
                                    spaceCount = 0;
                                }else if (durationInDays ===2){
                                    spaceCount = 6
                                }else if (durationInDays ===3){
                                    spaceCount = durationInDays * 5.5; 
                                }else if (durationInDays ===4){
                                    spaceCount = durationInDays * 6; 
                                }else if (durationInDays ===5){
                                    spaceCount = durationInDays * 7;  
                                }else if (durationInDays ===6){
                                    spaceCount = durationInDays * 7.5; 
                                }else if (durationInDays ===7){
                                    spaceCount = durationInDays * 7.75;
                                }else if (durationInDays ===8){
                                    spaceCount = durationInDays * 8;
                                }
                                
                                const dynamicSpacing = "-".repeat(spaceCount);; 

                                // Construct subtitle with dynamic spacing
                                let des = `${startStats}${startPort === "NONE" ? "" : ":" + startPort}${dynamicSpacing}${endPort === "NONE" ? "" :endPort}${":"+endStats}`;
                                const subtitle = `${taskJobCode}`
                                data.push({
                                    id: `${ship};${taskScope};${taskClient};${taskMaster};${taskCrew};${taskJobCode}`,
                                    startDate: startTime,
                                    endDate: endTime,
                                    title: actualTaskName,
                                    subtitle: subtitle,
                                    description: des,
                                    bgColor: "rgb(139, 212, 114)",
                                });
                                // Start a new task
                                tempTaskName = currentTask;
                                tempStartTimeIndex = i;
                            }
                        } else if (tempTaskName !== null) {
                            // Gap detected, finalize the current task
                            const tempEndTimeIndex = i - 1;
                            const startTime = new Date(rawData.index[tempStartTimeIndex]);
                            const endTime = new Date(rawData.index[tempEndTimeIndex]);
                            const taskDetails = tempTaskName.split("£");
                            const actualTaskName = taskDetails[0];
                            const startStats = taskDetails[1];
                            const endStats = taskDetails[3];
                            const startPort = taskDetails[2];
                            const endPort = taskDetails[4];
                            const bookingStats = taskDetails[5];
                            const taskScope = taskDetails[6];
                            const taskClient = taskDetails[7];
                            const taskMaster = taskDetails[8];
                            const taskCrew = taskDetails[9];
                            const taskJobCode = taskDetails[10];
                            
                            // Calculate task duration in days
                            const durationInDays = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24)); // Convert ms to days
                            let spaceCount = durationInDays * 9.25; // 6 spaces per day
                                if (durationInDays === 1){
                                    spaceCount = 0;
                                }else if (durationInDays ===2){
                                    spaceCount = 6
                                }else if (durationInDays ===3){
                                    spaceCount = durationInDays * 5.5; 
                                }else if (durationInDays ===4){
                                    spaceCount = durationInDays * 6; 
                                }else if (durationInDays ===5){
                                    spaceCount = durationInDays * 7;  
                                }else if (durationInDays ===6){
                                    spaceCount = durationInDays * 7.5; 
                                }else if (durationInDays ===7){
                                    spaceCount = durationInDays * 7.75;
                                }else if (durationInDays ===8){
                                    spaceCount = durationInDays * 8;
                                }
                            const dynamicSpacing = "-".repeat(spaceCount);; // Generate dynamic spaces

                            // Construct subtitle with dynamic spacing
                            let des = `${startStats}${startPort === "NONE" ? "" : ":" + startPort}${dynamicSpacing}${endPort === "NONE" ? "" :endPort}${":"+endStats}`;
                            const subtitle = `${taskJobCode}`
                            data.push({
                                id: `${ship};${taskScope};${taskClient};${taskMaster};${taskCrew};${taskJobCode}`,
                                startDate: startTime,
                                endDate: endTime,
                                title: actualTaskName,
                                subtitle: subtitle,
                                description: des,
                                bgColor: "rgb(139, 212, 114)",
                            });
                            tempTaskName = null;
                        }
                    }
    
                    // Finalize the last task, if any
                    if (tempTaskName !== null) {
                        const tempEndTimeIndex = Object.keys(rawData[ship]).length - 1;
                        const startTime = new Date(rawData.index[tempStartTimeIndex]);
                        const endTime = new Date(rawData.index[tempEndTimeIndex]);
                        const taskDetails = tempTaskName.split("£");
                        const actualTaskName = taskDetails[0];
                        const startStats = taskDetails[1];
                        const endStats = taskDetails[3];
                        const startPort = taskDetails[2];
                        const endPort = taskDetails[4];
                        const bookingStats = taskDetails[5];
                        const taskScope = taskDetails[6];
                        const taskClient = taskDetails[7];
                        const taskMaster = taskDetails[8];
                        const taskCrew = taskDetails[9];
                        const taskJobCode = taskDetails[10];
                        
                        // Calculate task duration in days
                        const durationInDays = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24)); // Convert ms to days
                        let spaceCount = durationInDays * 9.25; 
                                if (durationInDays === 1){
                                    spaceCount = 0;
                                }else if (durationInDays ===2){
                                    spaceCount = 6
                                }else if (durationInDays ===3){
                                    spaceCount = durationInDays * 5.5; 
                                }else if (durationInDays ===4){
                                    spaceCount = durationInDays * 6; 
                                }else if (durationInDays ===5){
                                    spaceCount = durationInDays * 7;  
                                }else if (durationInDays ===6){
                                    spaceCount = durationInDays * 7.5; 
                                }else if (durationInDays ===7){
                                    spaceCount = durationInDays * 7.75;
                                }else if (durationInDays ===8){
                                    spaceCount = durationInDays * 8;
                                }
                        const dynamicSpacing = "-".repeat(spaceCount);; // Generate dynamic spaces

                        // Construct subtitle with dynamic spacing
                        let des = `${startStats}${startPort === "NONE" ? "" : ":" + startPort}${dynamicSpacing}${endPort === "NONE" ? "" :endPort}${":"+endStats}`;
                        const subtitle = `${taskJobCode}`
                        data.push({
                            id: `${ship};${taskScope};${taskClient};${taskMaster};${taskCrew};${taskJobCode}`,
                            startDate: startTime,
                            endDate: endTime,
                            title: actualTaskName,
                            subtitle: subtitle,
                            description: des,
                            bgColor: "rgb(139, 212, 114)",
                        });
                    }
    
                    const shipObj = {
                        id: id,
                        label: label,
                        data: data,
                    };
                    finalRes.push(shipObj);
                }
            }
    
            //console.log(`here is the data ${JSON.stringify(finalRes)}`);
            returnDataFrame(finalRes);
        } catch (error) {
            console.error("Fix it:", error);
            alert("Unable to receive tasks from the backend: " + error.message);
        }
    };



    return(
        <div className="control-panel-container">
            <div className="query-section">
                <QuerySections></QuerySections>
            </div>
            <div className = "create-section">
                <CreateSections returnDataFrame={returnDataFrame} onDatabaseUpdate={handleDatabaseUpdate}></CreateSections>
            </div>
            <div className="modify-section">
                <ModifySections dbUpdateTrigger={dbUpdateTrigger}></ModifySections>
            </div>
            <div className="delete-section">
             
            </div>
            <button onClick={handelRefresh} className="control-panel-button"><p>Refresh</p></button>
        </div>
    )
}
export default ControlPanel