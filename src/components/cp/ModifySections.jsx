import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ModifySections.css"

const ModifySections = ({refresh, dbUpdateTrigger, dataSrc}) =>{
    const [currentData, setCurrentData] = useState(null);
    const [selecterdModOption, setSelectedModOption] = useState("a");
    const [modifiedData, setModifiedData] = useState({});
    const [selectedShipName, setSelectedShipName] = useState("");
    const [modifiedShipName, setModifiedShipName] = useState("");
    const [selectedTaskName, setSelectedTaskName] = useState("");
    const [modifiedTaskName, setModifiedTaskName] = useState("");
    const [modifiedVesselStartStatus, setModifiedStartVesselStatus] = useState("Departure");
    const [modifiedVesselEndStatus, setModifiedEndVesselStatus] = useState("Arrival");
    const [vesselBookingStatus, setVesselBookingStatus] = useState(0);
    
    
    const planningOptions = [
        {0 : "Select a Booking Status"},
        {1 : "Dev"},
        {2 : "Confirmed"},
        {3 : "Binding order sent"},
        {4 : "Contract outstanding"},
        {5 : "Mantainance/Dry Dock"},
        {7 : "Plan May Change"}
    ]
    const modificationOptions = [
        "Chose One of the Following",
        "Change Vessel Name",
        "Change Task Name",
        "Change Task Duration",
        "Change Task Port",
        "Change Task Detail",
        "Change Booking Status"
    ];
    const vesselStatus = [
        "On Sea",
        "Departure",
        "Arrival"
    ];
    const resetState =() =>{
        setSelectedShipName("");
        setSelectedTaskName("");
        setModifiedShipName("");
        setModifiedTaskName(""); 
        setVesselBookingStatus(0);
    }
    const refreshDatabase = () =>{
        refresh();
    }
    const retrieveDataFrame = async () => {
        try {
          const response = await axios.post(`https://vessel-planner.onrender.com/api/get_prop`, { prop: "Task" });
    
          if (response.data) {
            const rawData = response.data;
            const transformedFrame = {
              columns: Object.keys(rawData).filter((key) => key !== "index"),
              index: Object.values(rawData.index).map((timestamp) =>
                new Date(timestamp).toISOString().split("T")[0]
              ),
              data: Object.values(rawData.index).map((_, i) =>
                Object.keys(rawData)
                  .filter((key) => key !== "index")
                  .map((ship) => rawData[ship][i])
              ),
            };
    
            setCurrentData(transformedFrame);
          } else {
            console.error("Failed to fetch initial data: No data returned");
          }
        } catch (error) {
          console.error("Failed to fetch initial data:", error);
        };
    };
    const updateDataBase = async (modData) => {
        try {
            if (!modData || Object.keys(modData).length === 0) {
                alert("No modifications to save.");
                return;
            }
            await axios.post(`https://vessel-planner.onrender.com/api/save_prop`, {
                prop: 'Task',
                frame: modData,
            });
            await retrieveDataFrame();
            
            alert("Database updated successfully!");
        } catch (error) {
            console.error("Fix it:", error);
            alert("Unable to upload modified data: " + error.message);
        } finally{
            setSelectedShipName("");
            setSelectedTaskName("");
            setModifiedShipName("");
            setModifiedTaskName("");
        }
    };
   
    useEffect(()=>{
        retrieveDataFrame();
    }, [dbUpdateTrigger])
//================================Drop Down List=================================================
    const modificationSelection = () =>{
        return modificationOptions.map((option, index)=>{
            return <option value = {option} index = {index}> {option}</option>
        });
    }
    const vesselOptionSelection = () =>{
        return vesselStatus.map((stat, index) =>{
            return <option value = {stat} key = {index}> {stat}</option>
        })
    }
    const shipNameSelection = () => {
        const defaultOption = <option key = "default" value = "">Select A ship Name</option>
        const otherOptions = currentData.columns.map((option, index) => (                
            <option key={index} value={option}>
                {option}
            </option>
        ));
        return  [defaultOption, ...otherOptions];
    };
    const shipBookingStatusSelection = ()=>{
        const defaultOption = <option key = "default" value = "">Select A Booking Status</option>
        const otherOptions = planningOptions.map((stat, index)=>{
            return <option value = {Object.keys(stat)} index = {index}>{Object.values(stat)}</option>
        })
        return [defaultOption, ...otherOptions];
    }

    const shipTaskSelection = () =>{
        if (!currentData) return ;

        const idx = currentData.columns.indexOf(selectedShipName===""? currentData.columns[0]:selectedShipName);
        console.log(idx);
        const tasks = new Set();
        console.log(currentData);
        currentData.data.map((row)=>{
            if (row[idx] !== null){
                tasks.add(row[idx].split("£")[0]);
            }
        });
        
        const defaultOptions = <option key="default" value = "">Please Choose a Task</option>
        const otherOptions = [...tasks].map((item, index)=>(
            <option key={index} value={item}>
                {item}
            </option>
        ))
        return [defaultOptions, ...otherOptions];
    }
//================================Handle Modification=================================================
    const handelNewVesselName = () =>{
        if (modifiedShipName === "") {
            alert("A Vessel Name is Required to Perform the Operation");
            return;
        }
        if (selectedShipName === "") {
            alert("Please select a ship to rename.");
            return;
        }
        let index = currentData.columns.indexOf(selectedShipName);
        if (index === -1){
            alert("Selected ship is not present in database")
            return;
        }
        const updatedColumns = [...currentData.columns];
        updatedColumns[index] = modifiedShipName;
        const updatedData = { ...currentData, columns: updatedColumns };
        setModifiedData(updatedData);
        return updatedData;
    }

    const handelNewTaskName = () =>{
        if (modifiedTaskName === ""){
            alert("A New Task Name is Required to Perform the Operation");
            return;
        }
        if (selectedTaskName === ""){
            alert("An Existing Task Must be Selected To complete the Operation");
            return;
        }
        if (selectedShipName === ""){
            alert("A Ship Must be Selected to Complete the Operation");
            return;
        }
        if (currentData.columns.indexOf(selectedShipName) === -1){
            alert("Selected Ship does not Exist in Server");
            return;
        }
        const idx = currentData.columns.indexOf(selectedShipName);
        const newData = [...currentData.data];
        newData.map((item)=> {
            if (item[idx] !== null){
                const curDataDetail = item[idx].split("£");
                if (curDataDetail[0] === selectedTaskName){
                    item[idx] = `${modifiedTaskName}£${curDataDetail[1]}£${curDataDetail[2]}£${curDataDetail[3]}£${curDataDetail[4]}£${curDataDetail[5]}£${curDataDetail[6]}£${curDataDetail[7]}£${curDataDetail[8]}£${curDataDetail[9]}£${curDataDetail[10]}`;
                }
            }
        });
        const newDatFrame = {...currentData, data: newData};
        setModifiedData(newDatFrame);
        return newDatFrame;

    }
    const handelNewTaskDuration = () =>{

    }
    const handelNewPortStatus =()=>{

    }
    const handelNewTaskDetail =()=>{

    }
    const handelNewAssignedOccupency =()=>{
     
        if (selectedTaskName === ""){
            alert("An Existing Task Must be Selected To complete the Operation");
            return;
        }
        if (selectedShipName === ""){
            alert("A Ship Must be Selected to Complete the Operation");
            return;
        }
        if (currentData.columns.indexOf(selectedShipName) === -1){
            alert("Selected Ship does not Exist in Server");
            return;
        }
        const idx = currentData.columns.indexOf(selectedShipName);
        const newData = [...currentData.data];
        newData.map((item)=> {
            if (item[idx] !== null){
                const curDataDetail = item[idx].split("£");
                if (curDataDetail[0] === selectedTaskName){
                    item[idx] = `${curDataDetail[0]}£${curDataDetail[1]}£${curDataDetail[2]}£${curDataDetail[3]}£${curDataDetail[4]}£${vesselBookingStatus}£${curDataDetail[6]}£${curDataDetail[7]}£${curDataDetail[8]}£${curDataDetail[9]}£${curDataDetail[10]}`;
                }
            }
        });
        const newDatFrame = {...currentData, data: newData};
        setModifiedData(newDatFrame);
        return newDatFrame;

    }
//=================================Button Interface================================================
    const handleComfirmNewVesselNameChange = async ()=>{
        const updateData = handelNewVesselName();
        if (updateData){
            await updateDataBase(updateData);
        }
    }
    const handleComfirmNewTaskNameChange = async ()=>{
        const updateData = handelNewTaskName();
        if (updateData){
            await updateDataBase(updateData);
        }
    }
    const handleComfirmNewAssignedOccupency = async()=>{
        const updatedData = handelNewAssignedOccupency();
        if(updatedData){
            await updateDataBase(updatedData);
        }
    }
//=================================================================================

    
    const renderDiaplayOptions = ()=>{
        switch (selecterdModOption){
            case "Change Vessel Name":
                return (
                    <>
                        <div>
                            <select onChange={(e) => {setSelectedShipName(e.target.value); console.log(e.target.value)}}> {shipNameSelection()} </select>
                            <input placeholder="Input New Vessel Name Here" onChange={(e)=> setModifiedShipName(e.target.value)}></input>
                            <button onClick={handleComfirmNewVesselNameChange}>Confirm Change</button> 
                            <button onClick = {refreshDatabase}>Refresh</button>   
                        </div>
                    </>
                );
            case "Change Task Name":
                return (
                    <>
                        <div>
                            <select onChange = {(e) => setSelectedShipName(e.target.value)}> {shipNameSelection()} </select>
                            <select onChange = {(e) => setSelectedTaskName(e.target.value)}>{shipTaskSelection()}</select>
                            <input placeholder ="Input New Task Name" onChange = {e=>setModifiedTaskName(e.target.value)}></input>
                            <button onClick = {handleComfirmNewTaskNameChange}>Confirm Change</button>
                            <button onClick ={refreshDatabase}>Refresh</button>
                        </div>
                    </>
                );
            case "Change Task Duration":
                return(
                    <>
                        <div>
                            <select onChange={e => setSelectedShipName(e.target.value)}> {shipNameSelection()} </select>
                            <input type = "date" placeholder = "Start Time"></input>
                            <input type = "date" placeholder = "End Time"></input>
                            <button>Confirm Change</button>
                        </div>
                    </>
                );
            case "Change Task Port":
                return(
                    <>
                        <div>
                            <select onChange={e => setSelectedShipName(e.target.value)}> {shipNameSelection()} </select>
                            <input placeholder="Input Task Start Port"></input>
                            <input placeholder="Input Task End Port"></input>
                            <select onChange={e => setModifiedStartVesselStatus(e.target.value)}>{vesselOptionSelection()}</select>
                            <select onChange={e => setModifiedEndVesselStatus(e.target.value)}>{vesselOptionSelection()}</select>
                            <button onClick={handelNewPortStatus}>Confirm Change</button>
                        </div>
                    </>
                );
            case "Change Task Detail":
                return(
                    <>
                        <div>
                            <select onChange={e => setSelectedShipName(e.target.value)}> {shipNameSelection()} </select>
                        </div>
                    </>
                );
            case "Change Booking Status":
                return(
                    <>
                        <div>
                            <select onChange={e => setSelectedShipName(e.target.value)}> {shipNameSelection()} </select>
                            <select onChange={e => setSelectedTaskName(e.target.value)}>{shipTaskSelection()}</select>
                            <select onChange={e => setVesselBookingStatus(e.target.value)}>{shipBookingStatusSelection()}</select>
                            <button onClick= {handleComfirmNewAssignedOccupency}>Confirm Change</button>
                            <button onClick ={refreshDatabase}>Refresh</button>
                        </div>
                    </>
                );
            default:
                return <p>Select a modification option</p>
        }
    }
    return(
        <div className= "modify-section-inner">
            <select className="modification-type" onChange={(e)=>{setSelectedModOption(e.target.value)}}>
                {modificationSelection()}
            </select>
            <div className="modification-detail">
                {renderDiaplayOptions()}
            </div>
        </div>
    )
}

export default ModifySections;