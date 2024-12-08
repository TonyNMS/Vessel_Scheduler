import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CreateSection.css'
function CreateSections({returnDataFrame, onDatabaseUpdate, dataSrc}) {
   
    const [frame2, setFrame2] = useState({
        columns: [],
        index: [],
        data: []
    });

    const [frame,setFrame] = useState({});
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
    const [bookingStatus, setBookingStatus] = useState(0);
    const planningOptions = [
        {0 : "Select a Booking Status"},
        {1 : "Dev"},
        {2 : "Confirmed"},
        {3 : "Binding order sent"},
        {4 : "Contract outstanding"},
        {5 : "Mantainance/Dry Dock"},
        {7 : "Plan May Change"}
    ]
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
    useEffect(() => {
        const checkAndFetchData = async () => {
            try {
                console.log(`Upon INitial render, CS is using https://vessel-planner.onrender.com/`)
                const checkResponse = await axios.post(`https://vessel-planner.onrender.com/api/check_or_create_task_table`);
                console.log(checkResponse.data.message);
    
               
                const response = await axios.post(`https://vessel-planner.onrender.com/api/get_prop`, { prop: 'Task' });
    
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
                console.error("Failed to initialize or fetch data:", error);
            }
        };
        checkAndFetchData();
        
    }, []);
    

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
        }else if (number ==7){
            rgb = "rgb(204, 204, 0)"
        }
        return rgb
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
        let taskInforDetailed = `${taskName}£${vesselStatsBegin}£${vesselStatsBegin === "On Sea"? "NONE":startPort}£${vesselStatsEnd}£${endPort === "On Sea"? "NONE":endPort}£${bookingStatus}£${scope}£${client===""? "NONE":client}£${master==="" ? "NONE":master}£${crew==="" ? "NONE":crew}£${jobCode===""? "NONE":jobCode}`;
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
    };
    const handleSubmit = async () => {

        try {
            setIsLoading(true); 
            console.log(frame);
            await axios.post(`${dataSrc}api/save_prop`, {
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
            console.log(`Control Panel Using, https://vessel-planner.onrender.com/ as data source`)
            const response = await axios.post(`https://vessel-planner.onrender.com/api/get_prop`, { prop: prop });
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
    
                    
                    for (let i = 0; i < Object.keys(rawData[ship]).length; i++) {
                        const currentTask = rawData[ship][i];
    
                        if (currentTask !== "" && currentTask !== null) {
                            if (tempTaskName === null) {
                                tempTaskName = currentTask;
                                tempStartTimeIndex = i;
                            } else if (currentTask !== tempTaskName) {
                                const tempEndTimeIndex = i - 1;
                                const startTime = new Date(rawData.index[tempStartTimeIndex]);
                                const endTime = new Date(rawData.index[tempEndTimeIndex]);
                                const taskDetails = tempTaskName.split("£");
                                const dynamicSpacing = adjustSpacing(endTime, startTime);
                                const bookingStats = taskDetails[5];
                                //id: `${ship};${taskScope};${taskClient};${taskMaster};${taskCrew};${taskJobCode}`
                                //`${startStats}${startPort === "NONE" ? "" : ":" + startPort}${dynamicSpacing}${endPort === "NONE" ? "" :endPort}${":"+endStats}`
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
                            const dynamicSpacing = adjustSpacing(endTime, startTime);     
                            const bookingStats = taskDetails[5];                        
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
                        const dynamicSpacing = adjustSpacing(endTime, startTime); 
                        const bookingStats = taskDetails[5];
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
    const resetDevDaraBase = async () => {

        try {
            setIsLoading(true); // Show a loading spinner or similar feedback
            await axios.post(`${dataSrc}api/save_prop`, {
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
    const planningStatusSelection = () =>{
        return planningOptions.map((stat, index)=>{
            return <option value = {Object.keys(stat)} index = {index}>{Object.values(stat)}</option>
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
                    <select onChange={e=>setBookingStatus(e.target.value)}>{planningStatusSelection()}</select>
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
