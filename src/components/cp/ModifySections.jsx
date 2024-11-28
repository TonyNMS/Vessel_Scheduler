import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ModifySections.css"

const ModifySections = ({returnedDataFrame, dbUpdateTrigger, dataSrc}) =>{
    const [currentData, setCurrentData] = useState(null);
    const [selecterdModOption, setSelectedModOption] = useState("a");
    const [modifiedData, setModifiedData] = useState({});
    const [selectedShipName, setSelectedShipName] = useState("Ship1");
    const [modifiedShipName, setModifiedShipName] = useState("");
    const [modifiedTaskName, setModifiedTaskName] = useState("");
    const [modifiedVesselStartStatus, setModifiedStartVesselStatus] = useState("Departure");
    const [modifiedVesselEndStatus, setModifiedEndVesselStatus] = useState("Arrival");
    

    const modificationOptions = [
        "Chose One of the Following",
        "Change Vessel Name",
        "Change Task Name",
        "Change Task Duration",
        "Change Task Port",
        "Change Task Detail",
        "Assign Task Occupancy"
    ];
    const vesselStatus = [
        "On Sea",
        "Departure",
        "Arrival"
    ]
    const retrieveDataFrame = async () => {
        try {
          const response = await axios.post(`${dataSrc}api/get_prop`, { prop: "Task" });
    
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
            await axios.post(`${dataSrc}api/save_prop`, {
                prop: 'Task',
                frame: modData,
            });
            await retrieveDataFrame();
            alert("Database updated successfully!");
        } catch (error) {
            console.error("Fix it:", error);
            alert("Unable to upload modified data: " + error.message);
        }
    };
 

    useEffect(()=>{
        retrieveDataFrame();
    }, [dbUpdateTrigger])

    const modificationSelection = () =>{
        return modificationOptions.map((option, index)=>{
            return <option value = {option} index = {index}> {option}</option>
        });
    }
    const shipNameSelection = () => {
        if (!currentData) return null; 
        return currentData.columns.map((option, index) => (
            <option key={index} value={option}>
                {option}
            </option>
        ));
    };
    
    const vesselOptionSelection = () =>{
        return vesselStatus.map((stat, index) =>{
            return <option value = {stat} key = {index}> {stat}</option>
        })
    }
   
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
        console.log(modifiedShipName);
        console.log(updatedData);
        setModifiedData(updatedData);
        return updatedData;
    }
    const handleComfirmNewVesselNameChange = async ()=>{
        const updateData = handelNewVesselName();
        if (updateData){
            await updateDataBase(updateData);
        }
    }


    const handelNewTaskName = () =>{

    }
    const handelNewTaskDuration = () =>{

    }
    const handelNewPortStatus =()=>{

    }
    const handelNewTaskDetail =()=>{

    }
    const handelNewAssignedOccupency =()=>{

    }
    
    
    
    const renderDiaplayOptions = ()=>{
        switch (selecterdModOption){
            case "Change Vessel Name":
                return (
                    <>
                        <div>
                            <select onChange={e => setSelectedShipName(e.target.value)}> {shipNameSelection()} </select>
                            <input placeholder="Input New Vessel Name Here" onChange={e=> setModifiedShipName(e.target.value)}></input>
                            <button onClick={handleComfirmNewVesselNameChange}>Confirm Change</button>    
                        </div>
                    </>
                );
            case "Change Task Name":
                return (
                    <>
                        <div>
                            <select onChange={e => setSelectedShipName(e.target.value)}> {shipNameSelection()} </select>
                            <input placeholder="Input New Task Name" onChange = {e=>setModifiedShipName(e.target.value)}></input>
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
            case "Assign Task Occupancy":
                return(
                    <>
                        <div>
                            <select onChange={e => setSelectedShipName(e.target.value)}> {shipNameSelection()} </select>
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