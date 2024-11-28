import React, { useState } from "react";
import axios from "axios";
import "./QuerySections.css";
const QuerySections = ({filterTime})=>{
    const [data, setData] = useState({});
    const [selectedFilter, setSelectedFilter] = useState("");
    const [fStart, setFStart] = useState("")
    const[fEnd, setFEnd] = useState("")
    const handleShowAllScheduel = async () =>{
        try{
            const prop = 'Task';
            const response = await axios.post('http://127.0.0.1:5000/api/get_prop', {
                prop: prop
            })
            console.log(response.data);
            setData(response.data)

        }catch(error){
            console.error("Fix it :", error);
            alert("Uable to receive tasks from the backend");
        }
    }
    const filterOptions = [
        "Select a Filter",
        "Show All Scheduels",
        "Filter Events by Ship & Time",
        "Filter Events by Time",
        "Filter Events by Ships",
        "Filter Events by Task Name",
    ]
    const handelChange = (e) =>{
       setSelectedFilter(e);
    }

    const handelTimeFitler = () =>{
        filterTime(fStart, fEnd);
    }
    const renderFilterDetails = () => { 
        switch (selectedFilter) {
            case "Show All Scheduels":
                return (
                    <>
                        <button>Display All</button>;
                    </>
                );
            case "Filter Events by Ship & Time":
                return (
                    <>
                        <div className="form-group">
                            <label>Ship:</label>
                            <input type="text" placeholder="Enter Ship Name" />   
                        </div>
                        <div className="form-group">
                            <label>Start Time: </label>
                            <input type="date" placeholder="Start Time" />
                        </div>
                        <div className="form-group">
                            <label>End Time:</label>
                            <input type="date" placeholder="End Time"/>
                            
                        </div>
                        
                        <button>Filter</button>
                    </>
                );
            case "Filter Events by Time":

                return (
                    <>  
                        <div className="form-group">
                            <label>Start Time: </label>
                            <input type="date" placeholder="Select Time" onChange = {e => setFStart(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label>End Time: </label>
                            <input type="date" placeholder="Select Time" onChange = {e => setFEnd(e.target.value)}/>
                        </div>
                        <button onClick={handelTimeFitler}>Filter</button>
                    </>
                
                );
                
            case "Filter Events by Ships":
                return (
                    <>
                        <div className="form-group">
                            <label>Ship Name:</label>
                            <input placeholder="Enter Ship Name" />
                        </div>
                        <button>Filter</button>
                    </>
                );
            case "Filter Events by Task Name":
                return (
                    <>
                        <div className="form-group">
                            <label>Task Name:</label>
                            <input placeholder="Enter Task Name" />
                        </div>    
                        <button>Filter</button>
                    </>
                );
            default:
                return <p>Please select a filter option</p>;
        }
    };
    const filterSelection = () =>{
        return  filterOptions.map((option, index) =>{
            return <option value = {option} index = {index}> {option}</option>})
    }
   
    return(
       <div className="query-sectiopn-inner">
            <select className= "filter-type" onChange={(e)=>{handelChange(e.target.value);}}>
                {filterSelection()}
            </select>
            <div className= "filter-detail">
                {renderFilterDetails()}
            </div>
       </div>
    )
}
export default QuerySections