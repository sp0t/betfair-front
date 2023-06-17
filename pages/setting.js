import { useState } from "react";
import React from "react";
import axios from 'axios'
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import Header from "./header";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import Button from '@mui/material/Button';
// import Header from "./../component/header";

const SportCard = ({ img = '', name = '', _monit = true, _betting = false, _playmode = false, _kelly = false, _market = '0', count = 0}) => {
  const [monit, setMonitState] = useState(_monit);
  const [betting, setBettingState] = useState(_betting);
  const [playmode, setPlaymodeState] = useState(_playmode);

  const setMonit = async (check) => {
    setMonitState(check)
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setMonit', { sport: name, state: check });

      if (check) toast.success(`Will monit on ${name} matchs.`);
      else toast.success(`Will stop montoring on ${name} matchs.`);
    } catch (error) {
      toast.error(`${name} monit set error.`);
      setMonitState(!check)
      console.error(error);
      return;
    }
  }

  const setBetting = async (check) => {
    setBettingState(check)
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setBetting', { "sport": name, "state": check });
      console.log(result)

      if (check) toast.success(`Will bet on ${name} matchs.`);
      else toast.success(`Will stop betting on ${name} matchs.`);
    } catch (error) {
      toast.error(`${name} betting set error.`);
      setBettingState(!check)
      console.error(error);
      return;
    }
  }

  const setPlayMode = async (check) => {
    setPlaymodeState(check)
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setPlayMode', { sport: name, state: check });
      console.log(result)

      if (check) toast.success(`Will bet on inPlay ${name} matchs.`);
      else toast.success(`Will bet all ${name} matchs.`);
    } catch (error) {
      toast.error(`${name} set error.`);
      setPlaymodeState(!check)
      console.error(error);
      return;
    }
  }
  return (
    <div className="p-2 mb-1 sm:p-3 sm:mb-2 items-center text-blue-700 rounded-lg text-base bg-orange-400 hover:bg-orange-500 hover:text-blue-800 dark:bg-gray-800 dark:text-blue-400">
      <div className="flex mb-2">
        <Image className="rounded-lg w-auto h-auto" width="25" height="25" src={img} alt="Rounded avatar"></Image>
        <div className="flex items-center text-lg font-bold ml-2">{name}</div>
      </div>
      <div className="flex justify-end">
        <div className="flex border border-gray-200 rounded-lg p-1">
          <ul className="flex text-sm font-medium text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li className="w-full rounded-t-lg dark:border-gray-600">
              <div className="flex items-center pl-3">
                <input type="checkbox" value="" name="inplay" checked={playmode} className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer" onChange={(e) => setPlayMode(e.target.checked)}></input>
                <label htmlFor="inplay" className="w-full py-1 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">InPlay </label>
              </div>
            </li>
            <li className="w-full rounded-t-lg dark:border-gray-600">
              <div className="flex items-center pl-3">
                <input type="checkbox" value="" name="monit" checked={monit} className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer" onChange={(e) => setMonit(e.target.checked)}></input>
                <label htmlFor="monit" className="w-full py-1 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">Monit </label>
              </div>
            </li>
            <li className="w-full rounded-t-lg dark:border-gray-600">
              <div className="flex items-center pl-3">
                <input type="checkbox" value="" name="betting" checked={betting} className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer" onChange={(e) => setBetting(e.target.checked)}></input>
                <label htmlFor="betting" className="w-full py-1 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">Betting</label>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

 const Setting = () => {

  const [sportData, setSportData] = useState([]);
  const [searchkey, setSearchKey] = useState('');

  const [filteredData, setFilteredData] = useState([]);
  const [stakemodedata, setStakeModeData] = useState({});
  const [edge, setEdge] = useState(0);
  const [max, setMax] = useState(0);
  const [mdmax, setMdMax] = useState(0);
  const [mdedge, setMdEdge] = useState(0);
  const [mdkellybalance, setMdkellybalance] = useState(0);
  const [kellybalance, setKellybalance] = useState(0);
  const [totalfund, setTotalFund] = useState(0);
  const [maxfund, setMaxFund] = useState(0);
  const [modifymaxfund, setModifyMaxFund] = useState(0);
  const [availablefund, setAvailableFund] = useState(0);
  const [maxdlgflag, setMaxDlgFlag] = useState(false);
  const [modifystakemode, setModifyStakeMode] = React.useState(false);

  React.useEffect(() => {
    const run = async () => {
      var [price, sport, balance] = await Promise.all([
        await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getStakeMode`),
        await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMonitor?sport=ALL`),
        await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getBalance`)
      ])

      setStakeModeData(price.data[0]);
      setSportData(sport.data);
      setFilteredData(sport.data);
      setTotalFund(balance.data.total);
      setMaxFund(balance.data.max);
      setAvailableFund(balance.data.available);
    };

    run();
  }, []);

  React.useEffect(() => {
    setFilteredData(!!searchkey ? sportData.filter(el => el.sport.toLowerCase().includes(searchkey.toLowerCase())) : sportData);
  }, [searchkey, sportData]);

 const addPrice = React.useCallback(async() => {

    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'addStakeMode', {edge:edge, max:max, kellybalance: kellybalance});
      console.log(result)
      temp.push(data)
      toast.success(`StakeMode( ${from} ~ ${to} ) added.`);
      setStakeModeData(temp);
    } catch (error) {
      toast.error('Adding failed.');
      console.error(error);
      return;
    }

  }, [edge, max, kellybalance]);

  const devideString = (data) => {
    const val = data.split("-");
    const extracted = val[0].trim();
    return extracted;
  }

 const setMaxBalance = React.useCallback( async() => {
  try {
    var ret = await axios.post(`${process.env.NEXT_PUBLIC_APIURL}setMaxBalance`, {max: modifymaxfund});
    if (ret.data.result == 1) {
      setMaxFund(modifymaxfund);
      setAvailableFund(modifymaxfund);
      toast.success(`Max value is setted as $${modifymaxfund}.`);
      setMaxDlgFlag(false);
    } else {
      toast.warn(`Your account doesn't have enough fund. Max value should be small than total fund.`);
      setMaxDlgFlag(true);
    }
  } catch (error) {
    toast.error(`Max value setting failed!`);
    setMaxDlgFlag(true);
  }
 }, [modifymaxfund]);

 const resetAvailable = async() => {
  try {
    var ret = await axios.post(`${process.env.NEXT_PUBLIC_APIURL}resetAvailableBalance`);
    if (ret.data.result == 1) {
      setAvailableFund(maxfund);
      toast.success(`Success.`);
    } else {
      toast.error(`Failed!`);
    }
  } catch (error) {
    toast.error(`Failed!`);
  }
 }

 const cancelModfy = () => {
  setMdMax(stakemodedata.max);
  setMdEdge(stakemodedata.edge);
  setMdkellybalance(stakemodedata.kellybalance);
  setModifyStakeMode(false);
}

const okModify = React.useCallback(async() => {
  var tmp = JSON.parse(JSON.stringify(stakemode));
  tmp.edge = mdedge;
  tmp.max = mdmax;
  tmp.kellybalance = mdkellybalance;

  try {
    const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setMatchStakeMode', { edge: mdedge, max: mdmax, kellybalance: mdkellybalance });
    toast.success(`Success.`);
    setStakeModeData(tmp);
    setModifyStakeMode(false);
  } catch (error) {
    toast.error(`Failed.`);
    console.error(error);
    return;
  }
  
}, [mdmax, mdkellybalance, mdedge])

  return (
    <>
      <div className="h-full">
        <Header />
        <div className="row"></div>
        <div></div>
        <div className="bg-gradient-to-r from-green-600 to-[#233d26] min-h-screen">
          <div className="pt-10 sm:pt-20 m-auto justify-center lg:flex">
            <div className="h-[600px] m-3 sm:w-[440px] sm:m-auto lg:mr-7 sm:mb-3 lg:mb-0 border-solid border-rose-600 bg-orange-600 p-2 rounded-lg sm:p-4">
              <div className="mb-2 text-2xl sm:text-3xl sm:mb-4 font-bold flex justify-center w-full text-purple-900">
                <h1>Sport</h1>
              </div>
              <div className="relative mb-4 sm:mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
                  <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="search" id="default-search" className="block w-full p-2 sm:pl-10 sm:py-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search sports..." onChange={(e) => setSearchKey(e.target.value)} required></input>
              </div>
              <div className="h-[490px] sm:h-[440px] overflow-y-auto p-1 sm:p-2 bg-blue-50 rounded-lg">
                {filteredData.map((val, index) => (
                  <SportCard img={`/images/${devideString(val.sport)}.png`} name={val.sport} _monit={val.monit} _betting={val.betting} _playmode={val.playmode} _kelly={val.kellymode} _market={val.market} count = {index} key={index}/>
                ))}
              </div>
            </div>
            <div className="h-[600px] m-3 sm:w-[440px] sm:m-auto lg:ml-7 border-solid border-rose-600 bg-orange-600 p-2 rounded-lg sm:p-4">
              <div className="mb-2 text-2xl font-bold flex justify-center w-full text-purple-900 sm:mb-4 sm:text-3xl">
                <h1>Balances</h1>
              </div>
              <div className="pl-5 font-bold text-xl mb-3 text-blue-700">
                <div className="flex">
                  <h1 className="w-24 text-end">Total:</h1>
                  <h1 className="pl-3">${totalfund}</h1>
                </div>
                <div className="flex">
                  <h1 className="w-24 text-end">Max:</h1>
                  <h1 className="pl-3">${maxfund}</h1>
                  <div className="pl-8 hover:cursor-pointer" onClick={() => setMaxDlgFlag(true)}>
                    <ModeEditOutlineOutlinedIcon className="mb-1"></ModeEditOutlineOutlinedIcon>
                  </div>
                </div>
                <div className="flex">
                  <h1 className="w-24 text-end">Available:</h1>
                  <h1 className="pl-3">${availablefund}</h1>
                  <div className="pl-8 hover:cursor-pointer" onClick={() => resetAvailable()}>
                    <RestartAltOutlinedIcon className="mb-1"></RestartAltOutlinedIcon>
                  </div>
                </div>
              </div>
              <div className="mb-2 text-2xl font-bold flex justify-center w-full text-purple-900 sm:mb-4 sm:text-3xl">
                <h1>Stake Mode</h1>
              </div>
              {/* <div className="flex space-x-2 px-2 mb-2">
                <h1 className="mr-3 mt-1">Diff</h1>
                <select className="cursor-pointer block w-18 p-1 overflow-auto text-sm text-center bg-orange-500 text-black border rounded-md" onChange={(e) => setDiffMode(e.target.value)}>
                  <option className="cursor-pointer" value={0}>Fiexd</option>
                  <option className="cursor-pointer" value={1}>Percent</option>
                </select>
                <input type="number" className="text-sm w-16 text-center bg-white text-black border rounded-md" min="0" required onChange={(e) => setFrom(e.target.value)}></input>
                <h1 className="px-3.5">~</h1>
                <input type="number" className="text-sm w-16 text-center bg-white text-black border rounded-md" min="0" required onChange={(e) => setTo(e.target.value)}></input>
                <h1 className=""></h1>
              </div> */}
              {/* <div className="flex justify-around px-2 mb-4">
                <h1 className="">Edge(%):</h1>
                <select className="cursor-pointer block w-18 p-1 overflow-auto text-sm text-center bg-orange-500 text-black border rounded-md " onChange={(e) => setBetMode(e.target.value)}>
                  <option className="cursor-pointer" value={0}>Fiexd</option>
                  <option className="cursor-pointer" value={1}>Percent</option>
                </select>
                <div className="flex">
                  <input type="number" className="text-sm w-16 text-center bg-white text-black border rounded-md" min="0" required onChange={(e) => setEdge(e.target.value)}></input>
                </div>
                <h1 className=""></h1>
                <h1 className="mr-2 pl-8">Max($):</h1>
                <div className="flex">
                  <input type="number" className="py-1 text-sm w-16 text-center bg-white text-black border rounded-md" min="0" required onChange={(e) => setMax(e.target.value)}></input>
                </div>
                <div className="flex items-end mb-0.5">
                  <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1" onClick={() => addPrice()}>+</button>
                </div>
              </div> */}
              <div className="h-[400px] sm:h-[360px] overflow-y-auto bg-blue-50 p-1 sm:p-2 rounded-lg">
                  <div className="p-2 mb-1 sm:mb-2 text-blue-800 rounded-lg text-base bg-orange-400 dark:bg-gray-800 dark:text-blue-400 flex">
                    <div className="flex justify-between items-center w-full text-md font-bold">
                      {/* <div className="flex text-center">
                        <div className="w-20 text-end">{val.diffmode == 0 ? 'Fixed:':'Percent:'}</div>
                        <h1 className="pl-1">{val.diffmode == 0 ? `${val.from} `: `${val.from}`}</h1>
                        <h1>~</h1>
                        <h1>{val.diffmode == 0 ? `${val.to} `: `${val.to}`}</h1>
                      </div> */}
                      <div className="flex text-center">
                        <div>Max:</div>
                        <h1 className="pl-1">{`$${stakemodedata == undefined? '-' :stakemodedata.max}`}</h1>
                      </div>
                      <div className="flex text-center pl-3">
                        <div>Edge:</div>
                        <h1 className="pl-1">{`${stakemodedata == undefined? '-' :stakemodedata.edge}%`}</h1>
                      </div>
                      <div className="flex text-center">
                        <div>Kellybalance:</div>
                        <h1 className="pl-1">{`$${stakemodedata == undefined? '-' :stakemodedata.kellybalance}`}</h1>
                      </div>
                      <div className="pl-8 hover:cursor-pointer" onClick={() => setModifyStakeMode(true)}>
                        <ModeEditOutlineOutlinedIcon className="mb-1"></ModeEditOutlineOutlinedIcon>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
        <Dialog onClose={() => setMaxDlgFlag(false)} open={maxdlgflag}>
          <DialogContent className="oddlog bg-sky-950 pt-10">
            <div className="absolute top-2 right-2 p-1 cursor-pointer hover:bg-slate-400 rounded-full" onClick={() => setMaxDlgFlag(false)}>
              <CloseIcon className="text-white"></CloseIcon>
            </div>
            <div className="flex">
              <h1 className="text-2xl mt-0.5 mr-3 text-white">($)</h1>
              <input type="number" className="block w-full py-1 text-lg px-2 text-gray-900 border mb-2" placeholder="0" onChange={(e) => setModifyMaxFund(e.target.value)} required></input>
            </div>
            <div className="flex justify-center pt-2 space-x-10 sm:space-x-12">
              <Button variant="outlined"  style={{backgroundColor: "rgb(23 37 84)", border:"1px solid white", color:"white"}} onClick={() => setMaxDlgFlag(false)} >
                Cancel
              </Button>
              <Button variant="outlined"  style={{backgroundColor: "rgb(23 37 84)", border:"1px solid white", color:"white"}} onClick={() => setMaxBalance()} >
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog onClose={() => cancelModfy()} open={modifystakemode}>
          <DialogContent className="modifymonitor bg-sky-950 pt-10">
            <div className="absolute top-2 right-2 p-1 cursor-pointer hover:bg-slate-400 rounded-full" onClick={() => cancelModfy()}>
              <CloseIcon className="text-white"></CloseIcon>
            </div>
            <div className="pt-5">
              <div className="flex mb-3">
                <span className="w-32 text-end text-white">{'Max($) :'}</span>
                <div className="flex pl-2">
                  <input type="number" className="py-1 text-sm w-20 text-center bg-sky-950 text-white border rounded-md" min="0" value={mdmax} required onChange={(e) => setMdMax(e.target.value)}></input>
                </div>
              </div>
              <div className="flex mb-3">
                <span className="w-32 text-end text-white">{'Edge(%) :'}</span>
                <div className="flex pl-2">
                  <input type="number" className="py-1 text-sm w-20 text-center bg-sky-950 text-white border rounded-md" min="0" value={mdedge} required onChange={(e) => setMdEdge(e.target.value)}></input>
                </div>
              </div>
              <div className="flex mb-3">
                <span className="w-32 text-end text-white">{'KellyBalance($) :'}</span>
                <div className="flex pl-2">
                  <input type="number" className="py-1 text-sm w-20 text-center bg-sky-950 text-white border rounded-md" min="0" value={mdkellybalance} required onChange={(e) => setMdkellybalance(e.target.value)}></input>
                </div>
              </div>
            </div>
            <div className="flex justify-center pt-2 space-x-8">
              <Button variant="outlined"  style={{backgroundColor: "rgb(23 37 84)", border:"1px solid white", color:"white"}} onClick={() => cancelModfy()}>
                Cancel
              </Button>
              <Button variant="outlined"  style={{backgroundColor: "rgb(23 37 84)", border:"1px solid white", color:"white", paddingLeft:"34px", paddingRight:"34px"}} onClick={() => okModify()}>
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

export default Setting;