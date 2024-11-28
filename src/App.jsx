import ControlPanel from './components/ControlPanel'
import BitNoise from './components/BitNoise'
import './App.css'
import React, { useState, useEffect } from 'react';

export const DataFrameContext = React.createContext();
function App() {

  const [dataFrame, setDataFrame] = useState([]);
  const fetachCurDataFrame = (dataFrame) =>{
    setDataFrame(dataFrame);
  }
  useEffect(()=>{
    console.log('dataFrameChanged');
  }, [dataFrame]) 
  return (
   <DataFrameContext.Provider value = {dataFrame}>
      <ControlPanel returnDataFrame={fetachCurDataFrame}></ControlPanel>
      <div className='display-panel-container'>
        <BitNoise plottingData={dataFrame}></BitNoise>
      </div>
   </DataFrameContext.Provider>
  )
}

export default App
