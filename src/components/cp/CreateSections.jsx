import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CreateSection.css'
function CreateSections({returnDataFrame, onDatabaseUpdate}) {
   
    const [frame2, setFrame2] = useState({
        columns: [],
        index: [],
        data: []
    });

    const [frame,setFrame] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [shipName, setShipName] = useState("");
    const [taskName, setTaskName] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [startPort, setStartPort] = useState("Esb");
    const [endPort, setEndPort] = useState("Esb");
    const [scope, setScope] = useState("");
    const [client, setClient] = useState("");
    const [master, setMaster] = useState("");
    const [crew, setCrew] = useState("NONE");
    const [jobCode, setJobCode] = useState("");
    const [comment, setComment] = useState("");
    const [vesselStatsBegin, setVesselStatsBegin] = useState("Dep");
    const [vesselStatsEnd, setVesselStatsEnd] = useState("Arr");
    const vesselStatus = [
        "Dep",
        "Sail",
        "Arr",
        "Dry Dock"
    ]
    const crewStatus = [
        "Full Crew",
        "Half Crew",
        "Partly Manned",
        "NONE"
    ]
    const dockPorts = [
        "Choose A Port",
        "Esb",
        "Cux",
        "Sas",
        "Rød",
        "Emd",
        "Büs",
        "Han",
        "UK",
        "NONE"
    ]
    useEffect(()=>{
        const fetchInitialData = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:5000/api/get_prop', { prop: 'Task' });
                
                if (response.data) {
                    const rawData = response.data;
                    const transformedFrame = {
                        columns: Object.keys(rawData).filter(key => key !== "index"), 
                        index: Object.values(rawData.index).map(timestamp =>
                            new Date(timestamp).toISOString().split("T")[0]
                        ), 
                        data: Object.values(rawData.index).map((_, i) =>
                            Object.keys(rawData)
                                .filter(key => key !== "index")
                                .map(ship => rawData[ship][i])
                        )
                    };
    
                    setFrame(transformedFrame);
                } else {
                    console.error("Failed to fetch initial data: No data returned");
                }
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            }
        };
        fetchInitialData();
    }, [])

    const adjustSpacing = (endDate, startDate) =>{
        const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        let spaceCount = durationInDays * 7; // 6 spaces per day
        if (durationInDays === 1){
                spaceCount = 0;
        }else if (durationInDays ===2){
                spaceCount = 1
        }else if (durationInDays ===3){
                spaceCount = durationInDays * 2.5; 
        }else if (durationInDays ===4){
                spaceCount = durationInDays * 3.5; 
        }else if (durationInDays ===5){
                spaceCount = durationInDays * 5;  
        }else if (durationInDays ===6){
                spaceCount = durationInDays * 6; 
        }else if (durationInDays ===7){
                spaceCount = 48;
        }
        const dynamicSpacing = "-".repeat(spaceCount);
        return dynamicSpacing

    }
    const handleAddTask = async () => {
     
        if (!shipName || !taskName || !startTime || !endTime || !vesselStatsBegin || !vesselStatsEnd || !scope) {
            alert("All fields must be filled out!");
            return;
        }
    
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
    
    
        let currentDates = frame.index.map(date => new Date(date));
        const minDate = new Date(Math.min(...currentDates.map(d => d.getTime()), startDate.getTime()));
        const maxDate = new Date(Math.max(...currentDates.map(d => d.getTime()), endDate.getTime()));
    
      
        let continuousDates = [];
        for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
            continuousDates.push(new Date(d));
        }
    
      
        const newIndex = continuousDates.map(date => date.toISOString().split("T")[0]);
    
     
        let newColumns = [...frame.columns];
        let newData = newIndex.map(() => Array(newColumns.length).fill(""));
        
        
     
        if (!newColumns.includes(shipName)) {
            newColumns.push(shipName);
        }
    
      
        const shipIndex = newColumns.indexOf(shipName);
     
        
        let taskInforDetailed = `${taskName}£${vesselStatsBegin}£${vesselStatsBegin === "On Sea"? "NONE":startPort}£${vesselStatsEnd}£${endPort === "On Sea"? "NONE":endPort}£${0}£${scope}£${client===""? "NONE":client}£${master==="" ? "NONE":master}£${crew==="" ? "NONE":crew}£${jobCode===""? "NONE":jobCode}`;
        newIndex.forEach((date, idx) => {
            if (date >= startTime && date <= endTime) {
                newData[idx][shipIndex] = taskInforDetailed;
            }
        });
    
        frame.index.forEach((oldDate, idx) => {
            const newIndexPos = newIndex.indexOf(oldDate);
            frame.data[idx].forEach((task, i) => {
                if (task) newData[newIndexPos][i] = task;
            });
        });

        setFrame({
            columns: newColumns,
            index: newIndex,
            data: newData,
        });
        
    
        //console.log(`Updated frame: ${JSON.stringify({ columns: newColumns, index: newIndex, data: newData })}`);
    };
    

    const handleSubmit = async () => {

        try {
            setIsLoading(true); 
            await axios.post('http://127.0.0.1:5000/api/save_prop', {
              prop: 'Task',
              frame: frame,
            });
            onDatabaseUpdate();
          } catch (error) {
            console.error('Error submitting task:', error);
            alert('Failed to submit task. Please try again.');
          } finally {
            setIsLoading(false); // Hide the loading spinner
          }
    };
    const handleShowAll = async () => {
        try {
            const prop = 'Task';
            const response = await axios.post('http://127.0.0.1:5000/api/get_prop', { prop: prop });
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
                                const dynamicSpacing = "-".repeat(spaceCount);; // Generate dynamic spaces

                                // Construct subtitle with dynamic spacing
                                let des = `${startStats }${startPort === "NONE" ? "" : ":" + startPort}${dynamicSpacing}${endPort === "NONE" ? "" :endPort}${":"+endStats}`;
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
                        const dynamicSpacing = "-".repeat(spaceCount); // Generate dynamic spaces

                       
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
    const resetDevDaraBase = async () => {

        try {
            setIsLoading(true); // Show a loading spinner or similar feedback
            await axios.post('http://127.0.0.1:5000/api/save_prop', {
              prop: 'Task',
              frame: frame2,
            });
            onDatabaseUpdate();
          } catch (error) {
            console.error('Error submitting task:', error);
            alert('Failed to submit task. Please try again.');
          } finally {
            setIsLoading(false); // Hide the loading spinner
          }
    };
    const vesselOptionSelection = () =>{
        return vesselStatus.map((stat, index) =>{
            return <option value = {stat} index = {index}> {stat}</option>
        })
    }
    const vesselCrewOptionSelction = () =>{
        return crewStatus.map((stat, index)=>{
            return <option value = {stat} index = {index}>{stat}</option>
        })
    }
    const vesselPortOptionSelection = () =>{
        return dockPorts.map((stat, index)=>{
            return <option value = {stat} index = {index}>{stat}</option>
        })
    }

    return (
        <div className="cs-options-sections">
                <div>
                    <input type="text" placeholder="Ship Name" value={shipName} className="input_createSection" onChange={e => setShipName(e.target.value)} />
                    <input type="text" placeholder="Task Name" value={taskName} className="input_createSection" onChange={e => setTaskName(e.target.value)} />
                </div>
                <div>
                    <input type="date" placeholder="Start Time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                    <input type="date" placeholder="End Time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
                <div>
                    <select onChange={e => setVesselStatsBegin(e.target.value)}>{vesselOptionSelection()}</select>
                    <select onChange={e => setStartPort(e.target.value)}>{vesselPortOptionSelection()}</select>
                    <select onChange={e => setVesselStatsEnd(e.target.value)}>{vesselOptionSelection()}</select>
                    <select onChange={e => setEndPort(e.target.value)}>{vesselPortOptionSelection()}</select>
                </div>
                <div>
                    <input type="text" placeholder='Task Scope' value = {scope} className='input_createSection' onChange={e => setScope(e.target.value)}></input>
                    <input type="text" placeholder='Client Name' value = {client} className='input_createSection' onChange={e => setClient(e.target.value)}></input>
                </div>
                <div>
                    <input type="text" placeholder='Master of the Task' value = {master} className='input_createSection' onChange={e => setMaster(e.target.value)}></input>
                    
                    <select onChange={e=> setCrew(e.target.value)}>{vesselCrewOptionSelction()}</select>
                </div>
                <div>
                    <input type="text" placeholder='Job Code' value = {jobCode} className='input_createSection' onChange={e => setJobCode(e.target.value)}></input>
                    <input type="text" placeholder='Comment' value = {comment} className='input_createSection' onChange={e => setComment(e.target.value)}></input>
                </div>
                <div>
                    <button onClick={async () =>{ handleAddTask(); await handleSubmit();}} className="cs_button">Confirm Input</button>
                    <button onClick={async () => {handleAddTask(); await handleSubmit(); await handleShowAll();}}>Refresh</button> 
                    <button onClick={resetDevDaraBase} className="cs_button">Reset</button>
                    {isLoading && <div className="spinner">Loading...</div>}
                </div>
        </div>
    );
}

export default CreateSections;
