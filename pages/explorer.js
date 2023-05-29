import { useState } from "react";
import React from "react";
import axios from 'axios'
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Header from "./../pages/header";
import Header from "../component/header";
import Image from "next/image";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';

const LeagueCard = ({ _sportid = 0, _leaguid = 0, _eventid = 0, _away = '', _home, _stakemode = {},  count = 0}) => {
  const [stakemode, setStakeMode] = useState(_stakemode);

  const [modifystakemode, setModifyStakeMode] = React.useState(false);
  const [oddlog, setOddlog] = React.useState(false);

  const [mdfixFrom, setMdFixFrom] = useState(_stakemode.fixfrom);
  const [mdfixTo, setMdFixTo] = useState(_stakemode.fixto);
  const [mdfixStake, setMdFixStake] = useState(_stakemode.fixed);
  const [mdpercentFrom, setMdPercentFrom] = useState(_stakemode.percentfrom);
  const [mdpercentTo, setMdPercentTo] = useState(_stakemode.percentto);
  const [mdpercentStake, setMdPercentStake] = useState(_stakemode.percent);
  const [runstate, setRunState] = useState(_stakemode.state);
  const [mdMax, setMdMax] = useState(_stakemode.max);

  const setDiffMode = async (check) => {
    
    var tmp = JSON.parse(JSON.stringify(stakemode));
    if (check == '1') 
      tmp.diffmode = 1;
    else
      tmp.diffmode = 0;

    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setMatchDiffMode', { sportId: _sportid, competitionId: _leaguid, eventId: _eventid, state: check });
      console.log(result)
      setStakeMode(tmp);

      if (check == '1') toast.success(`Percent Diff Mode setted on ${_away} vs ${_home} match.`);
      else toast.success(`Fixed Diff Mode setted on ${_away} vs ${_home} match.`);
    } catch (error) {
      toast.error(`${_away} vs ${_home} Diff Mode set error.`);
      console.error(error);
      return;
    }
  }

  const setBetMode = async (check) => {
    var tmp = JSON.parse(JSON.stringify(stakemode));
    if (check == '1') 
      tmp.betmode = 1;
    else
      tmp.betmode = 0;

    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setMatchBetMode', { sportId: _sportid, competitionId: _leaguid, eventId: _eventid, state: check });
      console.log(result)
      setStakeMode(tmp);
      if (check == '1') toast.success(`Percent Bet Mode setted on ${_away} vs ${_home} match.`);
      else toast.success(`Fixed Bet Mode setted on ${_away} vs ${_home} match.`);
    } catch (error) {
      toast.error(`${_away} vs ${_home} Bet Mode set error.`);
      console.error(error);
      return;
    }
  }

  const setRun = async (check) => {
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setRun', { sportId: _sportid, competitionId: _leaguid, eventId: _eventid, state: check });
      setRunState(check)
      if (check) toast.success(`Will bet on ${_away} vs ${_home} match.`);
      else toast.success(`Will stop bet on${_away} vs ${_home} match.`);
    } catch (error) {
      toast.error(`${_away} vs ${_home} bet set error.`);
      console.error(error);
      return;
    }
  }

  const cancelModfy = () => {
    setMdFixFrom(stakemode.fixfrom);
    setMdFixTo(stakemode.fixto);
    setMdFixStake(stakemode.fixed);
    setMdPercentFrom(stakemode.percentfrom);
    setMdPercentTo(stakemode.percentto);
    setMdPercentStake(stakemode.percent);
    setMdMax(stakemode.max);
    setModifyStakeMode(false);
  }

  const okModify = React.useCallback(async() => {
    var tmp = JSON.parse(JSON.stringify(stakemode));
    tmp.fixfrom = mdfixFrom;
    tmp.fixto = mdfixTo;
    tmp.fixed = mdfixStake;
    tmp.percentfrom = mdpercentFrom;
    tmp.percentto = mdpercentTo;
    tmp.percent = mdpercentStake;
    tmp.max = mdMax;

    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setMatchStakeMode', { sportId: _sportid, competitionId: _leaguid, eventId: _eventid, stakemode: tmp });
      if (check) toast.success(`Success.`);
      else toast.success(`Failed.`);
      setStakeMode(tmp);
      setModifyStakeMode(false);
    } catch (error) {
      toast.error(`Failed.`);
      console.error(error);
      return;
    }
    
  }, [mdfixFrom, mdfixTo, mdfixStake, mdpercentFrom, mdpercentTo, mdpercentStake, mdMax])


  return (
    <div className=" border px-2 text-white rounded border-green-600 bg-gray-600 hover:bg-gray-700">
      <div className="p-2 font-bold text-lg">
        <h1>{_away} vs {_home}</h1>
      </div>
      <div className="lg:flex space-x-2 mb-2">
        <div className=" mx-2 flex place-items-center space-x-2">
          <div className="place-items-center">
            <div className="flex space-x-2 mb-2">
              <div className="flex place-items-end pr-5">
                <h1 className="p-1">Fixed($)</h1>
              </div>
              <div className=" text-center">
                <h1>Over</h1>
                <input type="number" className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" value={stakemode.fixfrom} placeholder='0.00$' readOnly = {true} required></input>
              </div>
              <div className="flex place-items-end">
                <h1>~</h1>
              </div>
              <div className=" text-center">
                <h1>Under</h1>
                <input type="number" className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" value={stakemode.fixto} placeholder='0.00$' readOnly = {true} required></input>
              </div>
              <div className=" text-center">
                <h1>Stake</h1>
                <input type="number" className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" value={stakemode.fixed} placeholder='0.00$' readOnly = {true} required></input>
              </div>
            </div>
            <div className="flex space-x-2 mb-2">
              <div className=" text-center p-1">
                <h1>Percent(%)</h1>
              </div>
              <input type="number" className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" value={stakemode.percentfrom} placeholder='0.00$' readOnly = {true} required></input>
              <div className="flex place-items-end">
                <h1>~</h1>
              </div>
              <input type="number" className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" value={stakemode.percentto} placeholder='0.00$' readOnly = {true} required></input>
              <input type="number" className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" value={stakemode.percent} placeholder='0.00$' readOnly = {true} required></input>
            </div>
          </div>
          <div className=" text-center">
            <h1>Max</h1>
            <input type="number" className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" value={stakemode.max} placeholder='0.00$' readOnly = {true} required></input>
          </div>
        </div>
        <div className="flex space-x-2 justify-around">
          <div className="flex space-x-2">
            <div className="border border-gray-200 rounded-lg p-2 m-auto">
              <h3 className=" text-white dark:text-white pl-2">DiffMode</h3>
              <ul className="w-1/3 text-sm text-white  dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full rounded-t-lg dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <input type="radio" value='0' onChange={(el) => setDiffMode(el.target.value)} checked={stakemode.diffmode == "0"} name={`${count}-diffmode`} className="w-4 h-4 text-blue-600 bg-gray-100  focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer"></input>
                    <label htmlFor={`${count}-diffmode`} className="w-full py-2 ml-1 text-sm  text-white dark:text-gray-300">Fixed </label>
                  </div>
                </li>
                <li className="w-full rounded-t-lg dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <input type="radio" value='1' onChange={(el) => setDiffMode(el.target.value)} checked={stakemode.diffmode == "1"} name={`${count}-diffmode`} className="w-4 h-4 text-blue-600 bg-gray-100  focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer"></input>
                    <label htmlFor={`${count}-diffmode`} className="w-full py-2 ml-1 text-sm  text-white dark:text-gray-300">Percent</label>
                  </div>
                </li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-2 m-auto">
              <h3 className="text-white dark:text-white pl-2">BetMode</h3>
              <ul className="w-1/3 text-sm text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full rounded-t-lg dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <input type="radio" value="0" onChange={(el) => setBetMode(el.target.value)} checked={stakemode.betmode == "0"}  name={`${count}-betmode`} className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer"></input>
                    <label htmlFor={`${count}-betmode`} className="w-full py-2 ml-1 text-sm  text-white dark:text-gray-300">Fixed </label>
                  </div>
                </li>
                <li className="w-full rounded-t-lg dark:border-gray-600">
                  <div className="flex items-center pl-3">
                    <input type="radio" value="1" onChange={(el) => setBetMode(el.target.value)} checked={stakemode.betmode == "1"} name={`${count}-betmode`} className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer"></input>
                    <label htmlFor={`${count}-betmode`} className="w-full py-2 ml-1 text-sm  text-white dark:text-gray-300">Percent</label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex place-items-center">
            <div className="pt-2">
              <div className="group relative flex">
                  <button type="button" onClick={() => {setModifyStakeMode(true)}} className="text-black p-1 bg-white hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-full">
                    <svg fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                    </svg>
                  </button>
                  <h1>Edit</h1>
              </div>
              <div className="flex items-center pl-1">
                <input type="checkbox" value="" name="monit" checked = {runstate} onClick={(el) => setRun(el.target.checked)} className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer"></input>
                <label htmlFor="monit" className="w-full py-2 pl-3 text-white dark:text-gray-300">Run</label>
              </div>
            </div>
          </div>
          <div className="flex place-items-center">
            <button className="p-2 sm:px-9 lg:px-2 xl:px-5 text-center bg-orange-600 rounded-md hover:bg-orange-700" onClick={() => setOddlog(true)}>Info</button>
          </div>
        </div>        
      </div>
      <Dialog onClose={() => cancelModfy()} open={modifystakemode}>
        <DialogContent className="modifymonitor bg-stone-900 pt-10">
          <div className="absolute top-2 right-2 p-1 cursor-pointer hover:bg-slate-400 rounded-full" onClick={() => cancelModfy()}>
            <CloseIcon className="text-white"></CloseIcon>
          </div>
          <div className="text-white">
            <div className=" mx-2 flex place-items-center space-x-2">
              <div className="place-items-center">
                <div className="flex space-x-2 mb-2">
                  <div className="flex place-items-end mr-3">
                    <h1 className="pb-1 mr-2">Fixed($)</h1>
                  </div>
                  <div className=" text-center">
                    <h1>Over</h1>
                    <input type="number" className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" value={mdfixFrom} onChange={(el) => setMdFixFrom(el.target.value)} placeholder='0.00$' required></input>
                  </div>
                  <div className="flex place-items-end">
                    <h1>~</h1>
                  </div>
                  <div className=" text-center">
                    <h1>Under</h1>
                    <input type="number" className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" value={mdfixTo} onChange={(el) => setMdFixTo(el.target.value)} placeholder='0.00$' required></input>
                  </div>
                  <div className=" text-center">
                    <h1>Stake</h1>
                    <input type="number" className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" value={mdfixStake} onChange={(el) => setMdFixStake(el.target.value)} placeholder='0.00$' required></input>
                  </div>
                </div>
                <div className="flex space-x-2 mb-2">
                  <div className=" text-center">
                    <h1>Percent(%)</h1>
                  </div>
                  <input type="number" className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" value={mdpercentFrom} onChange={(el) => setMdPercentFrom(el.target.value)} placeholder='0.00%' required></input>
                  <div className="flex place-items-end">
                    <h1>~</h1>
                  </div>
                  <input type="number" className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" value={mdpercentTo} onChange={(el) => setMdPercentTo(el.target.value)} placeholder='0.00%' required></input>
                  <input type="number" className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" value={mdpercentStake} onChange={(el) => setMdPercentStake(el.target.value)} placeholder='0.00%' required></input>
                </div>
              </div>
              <div className=" text-center">
                <h1>Max</h1>
                <input type="number" className="bg-gray-600 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" value={mdMax} placeholder='0.00$' onChange={(el) => setMdMax(el.target.value)} required></input>
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-2 space-x-10 sm:space-x-16">
            <button type="button" className=" text-white hover:bg-orange-500 bg-orange-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => cancelModfy()}>
              Cancel
            </button>
            <button type="button" className=" px-8 text-white hover:bg-orange-500 bg-orange-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => okModify()}>
              OK
            </button>
          </div>
        </DialogContent>

      </Dialog>
      <Dialog onClose={() => setOddlog(false)} open={oddlog}>
        <DialogContent className="modifymonitor bg-stone-900 pt-10">
          <div className="absolute top-2 right-2 p-1 cursor-pointer hover:bg-slate-400 rounded-full" onClick={() => setOddlog(false)}>
            <CloseIcon className="text-white"></CloseIcon>
          </div>
          <div className="text-white">
            <div className="p-2 font-bold text-lg flex justify-center">
              <h1>{_away} VS {_home}</h1>
            </div>
            <div className="flex border-b-2 sm:space-x-5 justify-start pb-2">
              <div className="w-1/2 text-center sm:pl-52">
                PS3838
              </div>
              <div className="w-1/2 text-center sm:pr-7">
                Betfair
              </div>
            </div>
            <div>
              <div className="flex border-b-2">
                <hl className="border-r-2 px-2 sm:px-16">Time</hl>
                <hl className="sm:px-3 px-1">Away</hl>
                <hl className="border-r-2 px-1 sm:px-3">Home</hl>
                <hl className="sm:px-3 px-1">Away</hl>
                <hl className="sm:px-3 border-r-2 px-1">Home</hl>
                <hl className="sm:px-2 px-1">Betstate</hl>
              </div>
            </div>
          </div>
        </DialogContent>

      </Dialog>
    </div>
  )
}

const Explorer = () => {
const [sportdata, setSportdata] = useState([]);
const [leagueData, setLeagueData] = useState([]);
const [selectSport, setSelectSport] = useState('ALL');
const [selectleague, setSelectLeague] = useState('ALL');
const [gamedata, setGameData] = useState([]);
const [dipleague, setDispLeague] = useState('');
const [leagueidData, setLeagueidData] = useState({});
// var tmp = {'Basketball':['American leauge', 'NBA'], 'Baseball':['MLB', 'Asian cup']}

React.useEffect(() => {
  const run = async () => {
    var [sport, league, game] = await Promise.all([
      await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMornitor?sport=ALL`),
      await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getLeague`),
      await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMatchs?sportName=ALL&competitionName=ALL`)
    ])

    var sporttemp = [];
    for (var x in sport.data) {
      var tmp = {};
      tmp.name = sport.data[x].sport;
      tmp.id = sport.data[x].sites[0].sportid;
      tmp.competition = sport.data[x].sites[0].competition;
      sporttemp.push(tmp);
    }

    var leauguetemp = {};
    var leagueidtemp = {};

    for (var x in sporttemp) {
      if (!leauguetemp.hasOwnProperty(sporttemp[x].name))
        leauguetemp[sporttemp[x].name] = [];
      
      for (var y in sporttemp[x].competition) {
        for (var z in league.data.betfair) {
          if (league.data.betfair[z] == sporttemp[x].competition[y]) {
            leauguetemp[sporttemp[x].name].push(z);
            leagueidtemp[z] = league.data.betfair[z];
          }
        }
      }
    }

    setLeagueData(leauguetemp);
    setSportdata(sporttemp);
    setLeagueidData(leagueidtemp);
    setGameData(game.data);
  };


  run();
}, []);

useEffect(() => {
  const run = async() => {
    const ret = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMatchs?sportName=${selectSport}&competitionName=${selectleague}`);
    setGameData(ret.data);
  }

  run();
}, [selectSport, selectleague])

// useEffect(() => {
//   const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_APIURL}getLeague?sport=${sportid}&league=${leagueid}`);
//     eventSource.onmessage = (e) => {
//       setodddata(e.data);
//     };
//   return () => eventSource.close(); // Clean up event listener when component unmounts
// }, []);

const setsportname = (val) => {
  if(val == selectSport)
    setSelectSport('ALL');
  else
    setSelectSport(val);
  setSelectLeague('ALL');
  setDispLeague('');  
}

const setleaguename = (val) => {
  setSelectLeague(val);
  setDispLeague('');  
}

  return (
    <>
      <div className="h-full">
        <Header />
        <div className="bg-gradient-to-r from-green-600 to-[#233d26] min-h-screen">
          <div className="pt-10 sm:pt-20 m-auto justify-center mr-1 lg:flex">
            <div className="border-solid border-rose-600 p-2 bg-orange-600 rounded-lg justify-center sm:flex">
              <div className="h-[550px] sm:w-[250px] bg-white overflow-y-auto rounded-lg">
                {sportdata.map((el, index) => (<>
                    <div className="text-white items-center bg-gray-900 rounded-sm text-base hover:bg-gray-800  hover:cursor-pointer" key = {index} onClick={() => setsportname(el.name)}>
                      <div className="flex p-2 justify-start">
                        <Image className="rounded-lg filter invert" width="25" height="25" src={`/images/${el.name}.png`} alt="Rounded avatar"></Image>
                        <div className="flex items-center text-lg font-bold ml-2" >{el.name}</div>
                      </div>
                    </div>
                    {selectSport == el.name ? leagueData[el.name].map((e, indexchild) => (
                      <div className="flex items-center text-white p-2 bg-gray-500 hover:bg-gray-600 text-lg font-bold pl-8 hover:cursor-pointer" key = {indexchild} onClick={() => setleaguename(e)}>{e}</div>
                    )):<></>}
                  </>
                  ))}
              </div>            
              <div className="sm:ml-2 h-[550px] sm:w-[700px] xl:w-[900px] overflow-y-auto mt-2 sm:mt-0 bg-blue-50 rounded-lg">
                {gamedata.map((el, index) => (<>
                  {index ==0 || (index > 0 && el.competitionName!= gamedata[index-1].competitionName) ?<div className="bg-gray-800 text-white p-2"> {el.competitionName}</div> : <div></div>}
                  <LeagueCard _sportid = {el.sportId} _leaguid = {el.competitionId} _eventid = {el.eventId} _away = {el.away} _home = {el.home} _stakemode = {el.stakemode} count={index}></LeagueCard>
                </>
                ))}
              </div>     
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  )
}

export default Explorer;