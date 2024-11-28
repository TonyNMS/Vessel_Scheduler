import ControlPanel from './components/ControlPanel'
import BitNoise from './components/BitNoise'
import './App.css'
import React, { useState, useEffect } from 'react';

export const DataFrameContext = React.createContext();

function App() {
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [dataFrame, setDataFrame] = useState([]);
  const [filteredDataFrame, setFilteredDataFrame] = useState([]);

  const fetchCurDataFrame = (dataFrame) => {
    setDataFrame(dataFrame);
    setFilteredDataFrame(dataFrame); // Initialize filtered data with the full data frame
  };

  const handleFilterTime = (fStart, fEnd) => {
    if (dataFrame.length > 0) {
      const filtered = dataFrame.map((ship) => {
        const filteredData = ship.data.filter((task) => {
          const taskStart = new Date(task.startDate);
          const taskEnd = new Date(task.endDate);
          const filterStart = new Date(fStart);
          const filterEnd = new Date(fEnd);

          // Check if the task overlaps with the filter range
          return (
            (taskStart >= filterStart && taskStart <= filterEnd) || 
            (taskEnd >= filterStart && taskEnd <= filterEnd) || 
            (taskStart <= filterStart && taskEnd >= filterEnd)
          );
        });

        // Return the ship only if it has filtered tasks
        return filteredData.length > 0
          ? { ...ship, data: filteredData }
          : null;
      }).filter(Boolean); 

      setFilteredDataFrame(filtered);
    }
  };

  useEffect(() => {
    console.log("Filtered Data Frame: ", JSON.stringify(filteredDataFrame));
    console.log('Data Frame Updated');
  }, [filteredDataFrame]);

  return (
    <DataFrameContext.Provider value={dataFrame}>
      <ControlPanel returnDataFrame={fetchCurDataFrame} filterTime={handleFilterTime}></ControlPanel>
      <div className="display-panel-container">
        <BitNoise plottingData={filteredDataFrame}></BitNoise>
      </div>
    </DataFrameContext.Provider>
  );
}

export default App;
