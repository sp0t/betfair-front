import { useState, useEffect } from "react";
import React from "react";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./header";
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Button from '@mui/material/Button';
// import Header from "./../component/header";

const Formula = () => {
const [formulastring, setFormulaString] = useState('f = ');
const [formulaid, setFormulaID] = useState('0');
const [mdformulastring, setMdFormulaString] = useState('f = ');
const [forumals, setFormulas] = useState([]);
const [modifydlg, setModifyDlg] = useState(false);

useEffect( () => {
  const run = async() => {
    var ret = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getFormula`);
    setFormulas(ret.data);
  }

  run();
}, []);

const addString = (val) => {
  if (/^[0-9]$/.test(val)) {
    if (formulastring.charAt(formulastring.length - 1) == 'p' || formulastring.charAt(formulastring.length - 1) == 'q' || formulastring.charAt(formulastring.length - 1) == 'd')
      return;
  }
  if (val == 'p' || val == 'q' || val == 'd') {
    if (formulastring.charAt(formulastring.length - 1) == '(' || formulastring.charAt(formulastring.length - 1) == ')' || formulastring.charAt(formulastring.length - 1) == '[' || formulastring.charAt(formulastring.length - 1) == ']' || formulastring.charAt(formulastring.length - 1) == '*' || formulastring.charAt(formulastring.length - 1) == '/' || formulastring.charAt(formulastring.length - 1) == '+' || formulastring.charAt(formulastring.length - 1) == '-' || formulastring.charAt(formulastring.length - 1) == '=' || formulastring.charAt(formulastring.length - 1) == ' ')
      {
        var tmpString = formulastring + val;
        setFormulaString(tmpString);
      }
  } else {
    var tmpString = formulastring + val;
    setFormulaString(tmpString);
  }
}

const deleteFormula = async(val) => {
  try {
    var ret = await axios.post(`${process.env.NEXT_PUBLIC_APIURL}removeFormula`, {formula: val});
    var result = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getFormula`);
    setFormulas(result.data);
  } catch (error) {
    toast.success('Failed!');
  }
}

const modifyFormula = (val) => {
  setMdFormulaString(val);
  setModifyDlg(true);
}

const removeChar = () => {
  if (formulastring.length <= 4)
    return;
  var tmpString = formulastring.slice(0, -1);
  if (tmpString.length <= 4)
    setFormulaString(tmpString);
  else
    setFormulaString(tmpString.trim());
}

const okModify = React.useCallback(async() => {
  if (!validateFormula(mdformulastring.slice(4))){
    toast.warn('The forumla which you input is invalid function.');
    return;
  }
  try {
    var ret = await axios.post(`${process.env.NEXT_PUBLIC_APIURL}modifyFormula`, {formula: mdformulastring, id: formulaid});
    var result = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getFormula`);
    setFormulas(result.data);
    toast.success('success!')
    setModifyDlg(false);
  } catch (error) {
    toast.error('Failed!')
  }
}, [mdformulastring, formulaid]);

const addFormula = React.useCallback(async() => {
  if (validateFormula(formulastring.slice(4))) {
    var ret = await axios.post(`${process.env.NEXT_PUBLIC_APIURL}addFormula`, {formula: formulastring});
    var result = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getFormula`);
    setFormulas(result.data);
    toast.success('Adding function success.')  
    setFormulaString('f = ');
  } else {
    toast.warn('The forumla which you input is invalid function.')
  }
}, [formulastring])

function validateFormula(formula) {
  const variables = ['p', 'q', 'd']; // List of variable names to check

  // Replace the variable names with placeholder values for evaluation
  const placeholderFormula = formula.replace(/[a-z]+/gi, '1');

  // Check if the formula is valid
  try {
    eval(placeholderFormula); // or math.evaluate(placeholderFormula)
    return true; // Formula is valid
  } catch (error) {
    return false; // Formula is invalid
  }
}

  return (
    <>
      <div className="">
        <Header />
        <div className="bg-gradient-to-r from-green-600 to-[#233d26] min-h-screen">
          <div className=" flex pt-20 m-auto justify-center place-items-center">
            <div className="h-[600px] w-full sm:w-[440px] sm:m-auto bg-stone-800 p-2 rounded-lg m-2">
              <div className="mb-2 text-2xl lg:text-3xl lg:mb-4 font-bold flex justify-center w-full text-purple-900">
                <h1 className="text-white pt-4">Formula</h1>
              </div>
              <div className="h-[290px]	overflow-y-auto bg-blue-200 p-1 lg:p-2 rounded-lg mb-3.5">
                <div className="w-full">
                  <textarea className="resize-none text-end border bg-blue-200 border-gray-300 text-2xl rounded-md p-2 w-full overflow-y-auto" placeholder="f = (p * (d - 1) - q) / (d-1)" value={formulastring} readOnly></textarea>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = '(' onClick={(e) => addString(e.target.getAttribute('value'))}>{'('}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = ')' onClick={(e) => addString(e.target.getAttribute('value'))}>{')'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = '[' onClick={(e) => addString(e.target.getAttribute('value'))}>{'['}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = ']' onClick={(e) => addString(e.target.getAttribute('value'))}>{']'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = ' / ' onClick={(e) => addString(e.target.getAttribute('value'))}>{'/'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = '7' onClick={(e) => addString(e.target.getAttribute('value'))}>{'7'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = '8' onClick={(e) => addString(e.target.getAttribute('value'))}>{'8'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = '9' onClick={(e) => addString(e.target.getAttribute('value'))}>{'9'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = 'p' onClick={(e) => addString(e.target.getAttribute('value'))}>{'p'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = ' * ' onClick={(e) => addString(e.target.getAttribute('value'))}>{'*'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = '4' onClick={(e) => addString(e.target.getAttribute('value'))}>{'4'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = '5' onClick={(e) => addString(e.target.getAttribute('value'))}>{'5'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = '6' onClick={(e) => addString(e.target.getAttribute('value'))}>{'6'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = 'q' onClick={(e) => addString(e.target.getAttribute('value'))}>{'q'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = ' + ' onClick={(e) => addString(e.target.getAttribute('value'))}>{'+'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = '1' onClick={(e) => addString(e.target.getAttribute('value'))}>{'1'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = '2' onClick={(e) => addString(e.target.getAttribute('value'))}>{'2'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = '3' onClick={(e) => addString(e.target.getAttribute('value'))}>{'3'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = 'd' onClick={(e) => addString(e.target.getAttribute('value'))}>{'d'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = ' - ' onClick={(e) => addString(e.target.getAttribute('value'))}>{'-'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = '0' onClick={(e) => addString(e.target.getAttribute('value'))}>{'0'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" value = '.' onClick={(e) => addString(e.target.getAttribute('value'))}>{'.'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" onClick={() => removeChar()}>
                    <BackspaceOutlinedIcon></BackspaceOutlinedIcon>
                  </div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" onClick={() => setFormulaString('f = ')}>{'C'}</div>
                  <div className="bg-gray-200 p-1 text-center cursor-pointer hover:bg-slate-400 rounded-md" onClick={() => addFormula()}>{'add'}</div>
              </div>
              </div>
              <div className=" bg-white overflow-y-auto rounded-xl p-2 h-[220px] sm:h-[210px]">
                {forumals.map((el, index) => (
                  <div className="flex items-center justify-between bg-blue-700 text-white p-2 rounded-lg overflow-y-auto mb-2 space-x-2 ">
                    <div className="text-xl ml-4">
                      <h1>{el.formula}</h1>
                    </div>
                    <div className="flex">
                      <div className=" cursor-pointer" onClick={() => {modifyFormula(el.formula), setFormulaID(el.id)}}>
                        <ModeEditOutlineOutlinedIcon></ModeEditOutlineOutlinedIcon>
                      </div>
                      <div className=" cursor-pointer" onClick={() => deleteFormula(el.formula)}>
                        <DeleteForeverOutlinedIcon></DeleteForeverOutlinedIcon>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Dialog onClose={() => setModifyDlg(false)} open={modifydlg}>
          <DialogContent className="oddlog bg-sky-950 pt-10">
            <div className="absolute top-2 right-2 p-1 cursor-pointer hover:bg-slate-400 rounded-full" onClick={() => setModifyDlg(false)}>
              <CloseIcon className="text-white"></CloseIcon>
            </div>
            <div className="flex pt-5">
              <input type="string" value={mdformulastring} className="block w-full py-1 text-lg px-2 text-gray-900 border mb-2" placeholder="f = " onChange={(el) => {if(el.target.value.length >= 4)setMdFormulaString(el.target.value)}} ></input>
            </div>
            <div className="flex justify-center pt-2 space-x-10 sm:space-x-12">
              <Button variant="outlined"  style={{backgroundColor: "rgb(23 37 84)", border:"1px solid white", color:"white"}} onClick={() => setModifyDlg(false)} >
                Cancel
              </Button>
              <Button variant="outlined"  style={{backgroundColor: "rgb(23 37 84)", border:"1px solid white", color:"white"}} onClick={() => okModify()} >
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <ToastContainer />
      </div>
    </>
  )
}

export default Formula;