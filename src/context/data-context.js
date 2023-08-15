import React from 'react'
import { useState } from 'react'


const DataContext =React.createContext ({
    data:[],
  acceptData:(column,row,value)=>{},
  savedData:[],
  colorHandler:()=>{},
  conditionalRowStyles:[],
  sendRequestHandler:()=>{},
  searcheButtonHandler:(a,b)=>{},
})

export default DataContext


export const DataContextProvider=(props)=>{
    const [savedData,setSavedData]=useState([])  // {id , status,packN,boxN}  data for send
    const [data,setData]=useState([]) //given data
    
  const acceptHandlerF =(column, row, value)=>{
    
    const existinItem=savedData.find(item=>{return item.id===row.LoanId})
    if (!existinItem){
      setSavedData((prevState)=>([...prevState,Object.assign({id:row.LoanId, [column]:column=value})]));
       } 
       else { 
                existinItem.id=row.LoanId;
                existinItem[column]=value
            }

       colorHandler(row,false)
  }

  
  const searcheNewdata= async (personalNo,agreementNo)=>{        
    console.log(personalNo,agreementNo);
    const response = await fetch(`http://localhost:5000/api?personalNo=${personalNo}&agreementNo=${agreementNo}`);
    const newData=await response.json();
    console.log(newData);  
    setData(newData[0])  
  }


//accept color

const colorHandler=(row,action)=>{
    const updatedData = data.map(item => {
      if (row.LoanId !== item.LoanId) {
        return item;
      }
    
      return {
        ...item,
        toggleSelected: action
      };
    });
    
    setData(updatedData);
  }
  const conditionalRowStyles = [
    {
      when: row => row.toggleSelected,
      style: {
        backgroundColor: "#e8fed5",
        userSelect: "none"
      }
    }];

    const submitHandler=()=>{
        console.log("send data  ", savedData);        
    }

    return <DataContext.Provider value={{
        acceptData:acceptHandlerF,
        savedData:savedData,
        colorHandler:colorHandler,
        conditionalRowStyles:conditionalRowStyles,
        data:data,
        sendRequestHandler:submitHandler,
        searcheButtonHandler:searcheNewdata

    }} >
        {props.children}
    </DataContext.Provider>    
}
