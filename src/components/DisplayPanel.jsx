import React, {useState} from 'react';
import Timeline from 'react-calendar-timeline';
import moment from 'moment';
import axios from 'axios';
import "react-calendar-timeline/lib/Timeline.css";
import BitNoise from './BitNoise';

/*
const groups = [
  { id: 1, title: 'Resource 1' },
  { id: 2, title: 'Resource 2' },
];

const items = [
  {
    id: 1,
    group: 1,
    title: 'Task 1',
    start_time: moment(),
    end_time: moment().add(2, 'days'),
    itemProps: {
      style: { background: 'red' },
    },
  },
  {
    id: 2,
    group: 2,
    title: 'Task 2',
    start_time: moment(),
    end_time: moment().add(4, 'days'),
    itemProps: {
      style: { background: 'red' },
    },
  },
  {
    id:3,
    group:2,
    title:'tony',
    start_time: moment().add(5, 'days'),
    end_time: moment().add(6, 'days'),
    itemProps: {
      style: { background: 'red' },
    },
  }
];*/ 
/**
 * 
 * {"data":{"index":{"0":1730419200000,"1":1730505600000,"2":1730592000000,"3":1730678400000},
 * "Ship1":{"0":"a","1":"a","2":"","3":""},
 * "Ship2":{"0":"b","1":"b","2":"b","3":"b"}
 * }
 */
const DisplayPanel = () => {
  const [data, setData] = useState({});
  const [items, setItems] = useState([]);
  const [groups, setGroups] = useState([]);
  const getBackgroundColor = (groupId) => {
    const colors = ['#33ff6e', '#3333ff', '#6e33ff', '#ff339c', '#9bf6ff', '#ffd733', '#5833ff', '#ffc6ff'];
    return colors[groupId % colors.length]; 
};
  const handleShowAllSchedule = async () => {
    try {
        const prop = 'Task';
        const response = await axios.post('http://127.0.0.1:5000/api/get_prop', { prop: prop });

        
        if (!response.data) {
            throw new Error("Data structure is incorrect or missing");
        }

        const rawData = response.data;

       
        if (!rawData.index) {
            throw new Error("Index is missing in data");
        }

       
        const timeIndex = Object.values(rawData.index);
        const startTime = timeIndex[0];
        const endTime = timeIndex[timeIndex.length - 1];

        
        for (const ship in rawData) {
            if (ship !== "index") {
                for (const key in rawData[ship]) {
                    if (rawData[ship][key] === null) {
                        rawData[ship][key] = "";
                    }
                }
            }
        }

        const groupsArray = [];
        const itemsArray = [];
        let groupId = 1;

        
        for (const shipName in rawData) {
            if (shipName !== "index") {
                groupsArray.push({ id: groupId, title: shipName });

                const tasks = rawData[shipName];
                for (const [key, task] of Object.entries(tasks)) {
                    if (task) {
                        itemsArray.push({
                            id: `${groupId}-${key}`, 
                            group: groupId,  
                            title: task,
                            start_time: moment(timeIndex[key]),  
                            end_time: moment(timeIndex[+key + 1] || endTime), 
                            itemProps: { style: { background: getBackgroundColor(groupId), color: "black" } } 
                        });
                    }
                }
                groupId++;
            }
        }

        setGroups(groupsArray);
        setItems(itemsArray);
        setData(rawData);

    } catch (error) {
        console.error("Fix it:", error);
        alert("Unable to receive tasks from the backend: " + error.message);
    }
};
  const customGroupRenderer = (group) => {
    return (
      <div style={{ color: 'blue', fontWeight: 'bold' }}>{group.title}</div>
    );
  };

  /**
   * <Timeline
      
        groups={groups}
        items={items}
        
        defaultTimeStart={moment()}
        defaultTimeEnd={moment().add(1, 'weeks')}
        sidebarWidth={200}
      />
  */
  
  return (
    <div>
        <BitNoise></BitNoise>
        <button className= 'load-button' onClick={handleShowAllSchedule}> Show All </button>
    </div>
  );
};

export default DisplayPanel;
