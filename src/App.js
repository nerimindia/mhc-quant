import logo from './logo.svg';
import './App.css';
import InputElement from "./InputElement.js";
import Button from "./Button.js";
import { useState } from "react";
function App() {
  const [noOfDistrict, setNoOfDistrict] = useState(localStorage.getItem("district") ? parseInt(localStorage.getItem("district")) : 2);
  const [noOfParams, setNoOfParams] = useState(localStorage.getItem("param") ? parseInt(localStorage.getItem("param")) : 2);
  const [matrixObj, setMatrixObj] = useState(localStorage.getItem("theMatrix") ? JSON.parse(localStorage.getItem("theMatrix")) : {});
  const [hi, setHi]= useState([]);
  const [wi, setWi]= useState([]);
  const [fij, setFij]= useState([]);
  const [mhIndex, setMhIndex]= useState([]);
  const Fij = [];
  let _K=1/Math.log(noOfDistrict);
  const getSum = (i) => {
    let totalSum = 0;
    for(let j=0;j<noOfDistrict;j++) {
      totalSum += matrixObj[i+"-"+j];
    }
    return totalSum;
  }
  const getFij = () => {
    for(let i=0;i<noOfParams;i++) {
      for(let d=0;d<noOfDistrict;d++) {
        Fij[i]=Fij[i]||[];
        Fij[i].push(matrixObj[i+"-"+d]/(getSum(i)));
      }
    }
    setFij(Fij);
    console.log("Fij", Fij);
  }

  const Hi=[];
  const getHi = () => {
    for(let i=0;i<noOfParams;i++) {
      let val = -1*_K;
      let FijSum=0;
      for(let d=0;d<noOfDistrict;d++) {
        FijSum += (Fij[i][d]) * Math.log(Fij[i][d]);
      }
      val *= FijSum;
      Hi.push(val);
    }
    setHi(Hi);
    console.log("HI", Hi);
  }

  const Wi = [];
  const getWi = () => {
    let total = 0;
    let sumHi = 0;
    for(let i=0;i<noOfParams;i++) {
      sumHi += Hi[i];
    }
    for(let i=0;i<noOfParams;i++) {
      Wi.push((1  - Hi[i])/(noOfParams - sumHi)); 
      total+=(1  - Hi[i])/(noOfParams - sumHi);
    }
    setWi(Wi);
    console.log("WI", Wi);
    console.log("Total",total);
  }


  const __DISTRICT_DATA = {};
  let MHINDEX = [];
  const getMHCI = () => {
    getFij();
    getHi();
    getWi();

    for(let d=0;d<noOfDistrict;d++) {
      let ans=0;
      for(let i=0;i<noOfParams;i++) {
        ans += Wi[i] * matrixObj[i+"-"+d];
      }
      console.log("DISTRICT:"+d, ans);
      MHINDEX.push({district: d, val: ans});
    }
    setMhIndex(MHINDEX.sort((x,y)=>x.val - y.val));
    console.log("MHINDEX",MHINDEX.sort((x,y)=>x.val - y.val));
  }



  const onValueChange = (e, fieldName) => {
    if(fieldName == "noOfDistrict") {
      localStorage.setItem("district", e.currentTarget.value);
      setNoOfDistrict(e.currentTarget.value);

    }
    if(fieldName == "noOfParams") {
      localStorage.setItem("param", e.currentTarget.value);
      setNoOfParams(e.currentTarget.value); 
    }
  }
  const valueChange = (e, fieldName) => {
    matrixObj[fieldName] = parseFloat(e.currentTarget.value);
    localStorage.setItem("theMatrix", JSON.stringify(matrixObj));
    setMatrixObj(JSON.parse(JSON.stringify(matrixObj)));
    
  }
  const getTheMatrix = () => {
    const matrix=[];
    const row=[];
    for(let j=0;j<parseInt(noOfParams);j++)
    {
      if(j==0)
        row.push(<div className="cell"></div>);
      row.push(<div className="cell">Param {j+1}</div>);
    }
    matrix.push(<div className="row">{row}</div>);
    for(let j=0;j<parseInt(noOfDistrict);j++) {
      const row=[];
      for(let i=0;i<parseInt(noOfParams);i++) {
        row.push(<div className="cell"><InputElement fieldName={i+"-"+j} value={matrixObj[i+"-"+j] == undefined ? 0 : matrixObj[i+"-"+j]} onValueChange={valueChange} type="text" className="full"/></div>);
      } 
      matrix.push(<div className="row"><div className="cell">DISTRICT {j+1}:</div>{row}</div>);
    }
    return matrix;
  }
  const resetMatrix = () => {
    localStorage.setItem("district", "");
    localStorage.setItem("param", "");
    localStorage.setItem("theMatrix", "{}");
    setNoOfDistrict(2);
    setNoOfParams(2);
    setHi([]);
  }
  const calculateTheValues = () => {
    _K=1/Math.log(noOfDistrict);
    getMHCI();
  }
  const test = () => {
    _K=1/Math.log(noOfDistrict);
    setData();
    getMHCI();
  }
  const setData = () => {
    let mtx = {};
    const district=[
    [56,43.6,46.5,33.9,32.7,64.5,56.5,37.5,62.2,37.6,75.6,46.9,44.1,65.7,43.1,51.3,67,68.9,46.9,63.9,42.8,36.9,51.7,72.2,42,59.4,55.9,80.9,45.5,35.3,63.1,49.8,46.7],
    [61.1,62.2,41.2,65.1,52,74.1,55.9,56.5,76.2,49.9,75.8,58.9,65.3,76.1,77.6,52.7,78.3,77.6,57,64.8,54.8,67,61,76.1,64,73.1,70.7,85.1,48.8,60.1,70.7,50.1,55.5],
    [95,94.9,94.6,91.8,90,95.9,96.1,91.1,96.5,97,94.1,96.8,96.6,97.7,96.2,96.2,97.4,96.3,85.9,90.9,94.2,95.8,97.3,97.2,94.8,97.1,92.8,96.5,99.2,93,93.9,91,87.6],
    [56.2,49.4,63.7,46.7,35.6,34.9,47.1,43.3,45.3,47.6,58.9,40.8,52.2,63.7,29,50.5,52.1,51.7,42.5,35.3,39.9,61.1,42.2,56.7,53.4,46.5,38.6,53.7,56.4,47.4,43.8,44.2,39.9],
    [99.8,99.1,99.3,98.5,98.2,98.7,99.2,99,98.9,98.2,99.6,99.2,98.6,100,100,98.3,99.2,98.3,95.5,96.4,99.5,98.4,99.6,98.4,98.7,98.3,96.9,100,98.5,99.4,100,99.6,98.7],
    [65,70.5,56.5,57,57.3,70.5,59.7,53.2,72.8,48.4,82.1,73.8,73.5,73.5,68.8,63.9,81.4,75.6,61.4,56.9,63.9,68.3,67.7,73.5,67.9,62,73.8,73.8,63.5,62.6,73.6,53.1,55.7]];
    
    const district2 = [[49.8,47.5,50.9,41.2,39.9,49.1,26,67.6,35.1,24.2,42.1,62.5,34.5,75.8,40.4,56.6,38.1,37.1,39.1,59,43.1,46.2,49.2,70.8,42,56.1,37],
    [60.6,64.3,37.3,61.9,61.5,58.6,36.3,71.3,44.8,54.6,57.5,52.9,49.6,82,49,64.9,47.4,47.3,46.7,68.8,48.9,55.1,62.3,66.9,54.6,64.1,45.2],
    [92.6,86.8,88.5,86.3,95.7,94.5,71.4,92.8,85.9,87.9,83.4,94.2,96.6,95.2,80.1,85.8,87.2,96.9,86.9,94.5,94.2,94,94.6,95.3,97.1,90.6,94.4],
    [39.7,18.6,18.7,34.3,25.1,34.9,13,55.2,34.8,35.5,31.6,44.6,24.3,63.3,23.5,45.8,25.1,18.2,26.7,43.9,37.9,31.2,33.8,42.6,39.7,39.8,29.9],
    [21.4,10.2,12.2,10.9,11.7,22.5,5.5,39.3,17.5,12.5,16.4,30.5,9.7,48,11.5,28,11.6,5.2,16.8,27.1,22.6,18.3,17.1,30.7,18.1,23.1,13.3],
    [99.1,96.4,96.7,97.9,92,96,94.6,97.7,95.3,97.9,97.2,99.3,96.6,98.3,96.7,90.1,95.5,97.7,97.7,97.5,92.8,93.8,99.3,97.5,98.5,95.9,98.6],
    [70.1,36.6,62.8,36.6,40.8,65.9,22.1,71.1,48.5,47.5,58.8,78.3,39.3,77.1,61.3,71.4,40.5,36.1,57.8,67.8,53.9,47.7,50.5,74.3,55.5,66.9,61.7],
    [76.8,66.7,49.2,68.1,74.3,90.2,48.3,63.9,77.6,67.4,71.4,73.1,77,75,53.9,28.4,65.6,75.8,76.7,78.4,80.6,62.5,70.2,69.7,73.3,53.8,77.1]];

    const district3 = [
    [49.7,46.3,51.2,41.4,38.2,47.3,23.7,67,26,24.5,39.4,61.7,34,72.3,42.2,37.2,38.2,37.2,58.9,40.8,43.1,47.9,69.9,42.2,54.5,36],
    [60.9,63.8,37,61.2,60.7,57.6,34.5,68.6,39.3,53.4,54.8,51.4,49.4,81.8,48.3,48.2,45.3,44.9,69.8,46.7,53,60.4,66.9,53.5,63.4,44.6],
    [92.5,86.1,88.1,86.8,95.5,94.1,69.8,91.7,83.6,88,82.4,93.7,96.5,95.3,80.2,87,96.7,86.2,94.2,93.7,93.7,94.1,94.9,96.9,91.9,94.1],
    [39.9,18.8,17.8,34,25.6,33.8,11.4,54.1,30,34.5,30.9,44.7,24.2,65.6,22.2,23.1,17.7,25.8,44.4,36.5,29.3,34.2,39.9,40.2,36,29.4],
    [21.5,9.7,11.1,11.7,12,21.5,4.8,37.2,12,12.6,15.4,29.9,9.9,48,11.1,10.4,5.2,15.8,26.9,21.4,15.5,16.9,27.7,18,19.5,13.7],
    [99.1,96.5,96.4,98.5,91.8,95.7,94.1,98.2,94.4,98,96.8,99.3,96.4,97.9,96.3,95.4,97.5,97.6,98,92.2,93.5,99.2,97.7,98.4,96.5,98.9],
    [69.6,33.6,61.5,35.1,38.8,64.4,20.4,72.1,40.1,46.4,56,78.9,38.7,75.5,58.9,38.1,35.2,56.6,66.2,52.8,44.7,49.9,73.9,54.7,67.4,62.2],
    [77.4,68.3,50.7,68.8,76.3,89.8,50.2,71.5,81.4,73.7,73.7,73.8,77.7,78.5,53,64.9,81,77.5,78.8,80.9,67.2,69.5,73.5,75.9,59.5,78.7]
    ];

    for(let i=0;i<noOfDistrict;i++) {
      for(let j=0;j<noOfParams;j++) {
        mtx[j+"-"+i]=district3[j][i];
      }
    }
    setMatrixObj(JSON.parse(JSON.stringify(mtx)));
  }
  return (
    <div className="App">
      <h1>MHC Quantification Software</h1>
      <h3>A Comparative Study of Maternal Health Care of Different District of Assam and Strategies for Improvement.</h3> 
      <p>
        <b>How to operate:</b><br/>
        <i><u>step1.</u></i>Enter the number of data centres (number of districts).<br/>
        This is the number of data centres from where we<br/>
        collect the data. It may be a state, district, village or block etc. In our case a district is used as data center.
        <br/>
        <br/>
        <i><u>step2.</u></i>Enter the number of parameters, relating to maternal health care.<br/>
        This is the number of health care parameters, <br/>which will be used for calculating the index value. In our case we have 6 parameters.
        <br/>
        <br/>
        <i>As you enter above two values, a 2D matrix will</i><br/>
        <i>be created for entering the values.</i><br/><br/>
        <i><u>step3.</u></i>Enter the maternal health realted values (parameters) in coresponding cells of the matrix.<br/><br/>
        <i><u>step4.</u></i>Click on the "CALCULATE" Button.<br/><br/>
        <i><u>step5.</u></i>RESET button can be use for clearing the input values.<br/><br/>
        



      </p>
      <div className="row">
      
      <div style={{width: "500px"}}>
      <InputElement
                    type="text"
                    value={noOfDistrict}
                    fieldName="noOfDistrict"
                    onValueChange={onValueChange}
                    label="Enter number of data centre" />
      <InputElement
                    type="text"
                    value={noOfParams}
                    fieldName="noOfParams"
                    onValueChange={onValueChange}
                    label="Enter number of params" />
      </div>
      <Button buttonText={"RESET"} onClick={resetMatrix} />
      <Button buttonText={"CALCULATE"} onClick={calculateTheValues} />
      {
        // <Button buttonText={"TEST"} onClick={test} />
      }
      </div>
      {
        hi.length > 0 && <div>
          <h2>RESULT:</h2>
          <div style={{padding: "0 50px"}}>
          <div className="row">
          <div className="cell" style={{borderColor: "#fff", fontWeight: "bold"}}> H[i] </div>
          {
            hi.map(x=> {
              return (
                <div className="cell">
                  {x.toPrecision(3)}
                </div>
              )
            })
          }
          </div>
          <br/>
          <div className="row">
          <div className="cell" style={{borderColor: "#fff", fontWeight: "bold" }}> W[i] (Weight Index) </div>
          {
            wi.map(x=> {
              return (
                <div className="cell">
                  {x.toPrecision(3)}
                </div>
              )
            })
          }
          </div>
          <br/>

          <div><b>Maternal Health Care  INDEX OF DISTRICTS</b></div>
          <div className="row">
          {
            mhIndex.map((x, i)=> {
              return (
                <div className="cell mtx">
                  {
                    i+1>=3 & <span>J<sup>{i+1}th</sup></span> 
                    
                  }
                  <b>District [{x.district}]</b><br/>
                  val:<b> {x.val.toFixed(3)}</b>
                </div>
              )
            })
          }
          </div>
          </div>
          <br/>
          <br/>
          <br/>
        </div>
      }
      <div><h2>INPUT MATRIX:</h2></div>
      {
        getTheMatrix()
      }
      <br/>
      <br/>
      
    </div>
  );
}

export default App;
