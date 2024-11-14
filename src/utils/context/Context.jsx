/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';
import run from '../../config/gemini'

export const Context = createContext();
const ContextProvider = (props) =>{


    const [input,setinput]=useState("");
    const [recentPrompt,setrecentPrompt]=useState("")
    const [previousPrompt,setpreviousPrompt]=useState([]);
    const [showresult,setshowresult]=useState(false);
    const [loading,setloading]=useState(false);
    const [resultdata,setresultdata]=useState("");


     const delayPara =(index,nextWord)=>{
        setTimeout(() => {
            setresultdata(prev=>prev+nextWord);
            
        }, 75*index);

     }

     const newChat=()=>{
        setloading(false)
        setshowresult(false)
     }

    const onSent = async (prompt) =>{
        setresultdata("")
        setloading(true)
        setshowresult(true)
        let response;
        if (prompt !== undefined) {
            response= await run(prompt)
            setrecentPrompt(prompt)
        }
        else{
            setpreviousPrompt(prev=>[...prev,input])
            setrecentPrompt(input)
            response = await run(input)
        }
        let responseArray=response.split("**")
        let newresponse="";
        for(let i=0;i<responseArray.length;i++){
            if(i===0 || i%2 !==1){
                newresponse+=responseArray[i];
            }
            else{
                newresponse+="<b>"+responseArray[i]+"</b>"
            }
        }
        let newResponse2 = newresponse.split("*").join("</br>")
        let newresponseArray=newResponse2.split(" ");
        for (let i = 0; i < newresponseArray.length; i++) {
            const nextWord = newresponseArray[i];
            delayPara(i,nextWord+" ")
            
        }
        setloading(false)
        setinput("")

    }
    

    const contextValue ={
        previousPrompt,
        setpreviousPrompt,
        onSent,
        setrecentPrompt,
        recentPrompt,
        showresult,
        loading,
        resultdata,
        input,
        setinput,
        newChat
    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}

        </Context.Provider>
    )
}
export default ContextProvider;