import React, {useState} from "react";
import "./ControlPanel.css";
import axios from 'axios';
import QuerySections from "./cp/QuerySections";
import CreateSections from "./cp/CreateSections";
import ModifySections from "./cp/ModifySections";

const ControlPanel = ({returnDataFrame}) =>{
    const [dbUpdateTrigger, setDbUpdateTrigger] = useState(false);
    const [dataSrc, setDataSrc] = useState('http://127.0.0.1:5000/');
    const handelChangeDataSrc = (event)=>{
        if(event.target.checked){
            setDataSrc('https://vessel-planner.onrender.com/');
        }else{
            setDataSrc('http://127.0.0.1:5000/');
        }
    }
    const handleDatabaseUpdate = () => {
        setDbUpdateTrigger((prev) => !prev); 
    };
    const assignColor = (number) =>{
        let rgb = "rgb(139, 212, 114)"
        if (number == 0){
            rgb = "rgb(139, 212, 114)"
        }else if(number == 1){
            rgb = "rgb(31, 21, 172)"
        }else if(number == 2){
            rgb = "rgb(0, 134, 53)"
        }else if(number ==3){
            rgb = "rgb(109, 232, 158)"
        }else if(number ==4){
            rgb = "rgb(211, 186, 216)"
        }else if(number ==5){
            rgb = "rgb(255, 51, 51)"
        }else if (number ==6){
            rgb = "rgb(182, 148, 136)"
        }
        return rgb
    }
    const adjustSpacing = (endDate, startDate) =>{
        const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Convert ms to days
        let spaceCount = durationInDays * 6; // 6 spaces per day
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
            console.log(`Control Panel is using ${dataSrc} as the data source`);
            const response = await axios.post(`${dataSrc}api/get_prop`, { prop: prop });
            let rawData = null;
    
            if (!response.data) {
                throw new Error("Data structure is incorrect or missing");
            } else {
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
                                const bookingStats = taskDetails[5];
                                const dynamicSpacing = adjustSpacing(endTime, startTime); 

                              
                                data.push({
                                    id: `${ship};${taskDetails[6]};${taskDetails[7]};${taskDetails[8]};${taskDetails[9]};${taskDetails[10]}`,
                                    startDate: startTime,
                                    endDate: endTime,
                                    title: taskDetails[0],
                                    subtitle: `${taskDetails[10]}`,
                                    description: `${taskDetails[1]}${taskDetails[2] === "NONE" ? "" : ":" + taskDetails[2]}${dynamicSpacing}${taskDetails[4] === "NONE" ? "" :taskDetails[4]}${":"+taskDetails[3]}`,
                                    bgColor: assignColor(bookingStats),
                                });
        
                                tempTaskName = currentTask;
                                tempStartTimeIndex = i;
                            }
                        } else if (tempTaskName !== null) {
    
                            const tempEndTimeIndex = i - 1;
                            const startTime = new Date(rawData.index[tempStartTimeIndex]);
                            const endTime = new Date(rawData.index[tempEndTimeIndex]);
                            const taskDetails = tempTaskName.split("£");
                            const bookingStats = taskDetails[5];
            
                            const dynamicSpacing = adjustSpacing(endTime, startTime);

                           
                            data.push({
                                id: `${ship};${taskDetails[6]};${taskDetails[7]};${taskDetails[8]};${taskDetails[9]};${taskDetails[10]}`,
                                startDate: startTime,
                                endDate: endTime,
                                title: taskDetails[0],
                                subtitle: `${taskDetails[10]}`,
                                description: `${taskDetails[1]}${taskDetails[2] === "NONE" ? "" : ":" + taskDetails[2]}${dynamicSpacing}${taskDetails[4] === "NONE" ? "" :taskDetails[4]}${":"+taskDetails[3]}`,
                                bgColor: assignColor(bookingStats),
                            });
                            tempTaskName = null;
                        }
                    }
                    if (tempTaskName !== null) {
                        const tempEndTimeIndex = Object.keys(rawData[ship]).length - 1;
                        const startTime = new Date(rawData.index[tempStartTimeIndex]);
                        const endTime = new Date(rawData.index[tempEndTimeIndex]);
                        const taskDetails = tempTaskName.split("£");
                        const bookingStats = taskDetails[5];
            
                        const dynamicSpacing = adjustSpacing(endTime, startTime); // Generate dynamic spaces

                        data.push({
                            id: `${ship};${taskDetails[6]};${taskDetails[7]};${taskDetails[8]};${taskDetails[9]};${taskDetails[10]}`,
                            startDate: startTime,
                            endDate: endTime,
                            title: taskDetails[0],
                            subtitle: `${taskDetails[10]}`,
                            description: `${taskDetails[1]}${taskDetails[2] === "NONE" ? "" : ":" + taskDetails[2]}${dynamicSpacing}${taskDetails[4] === "NONE" ? "" :taskDetails[4]}${":"+taskDetails[3]}`,
                            bgColor: assignColor(bookingStats),
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
                <CreateSections returnDataFrame={returnDataFrame} onDatabaseUpdate={handleDatabaseUpdate} dataSrc={dataSrc}></CreateSections>
            </div>
            <div className="modify-section">
                <ModifySections refresh={handelRefresh} dbUpdateTrigger={dbUpdateTrigger} dataSrc={dataSrc} ></ModifySections>
            </div>
            <div className="delete-section"></div>
            <div className="dev-section">
                <div className = "dev-section-inner">
                    <h5 className="dev-h5">DEV PANEL</h5>
                    <label> <input type="checkbox" onChange={handelChangeDataSrc}></input> Use Server?</label>
                    <button onClick={handelRefresh}>Refresh</button>
                </div>
            </div>
          
        </div>
    )
}
export default ControlPanel