import React from "react";
import axios from 'axios'
import { useState } from "react";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./header";
import Image from "next/image";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Connected, Wmatch, Wodd, Wbetdata, Wstakemode } from '../modules/SocketSlice';
import { initSocket, sendSportLeagueName, sendBetInfor } from '../modules/websocketManager';
import store from '../modules/store'
import { CoPresentOutlined } from "@mui/icons-material";

const LeagueCard = ({_monitid = '',  _eventid = 0, _away = '', _home = '', _stakemode = {}, _betid = '0', _btodd = {away: 0, home: 0}, _psodd = {away: 0, home: 0}, count = 0}) => {
  const gstakemode = useSelector(Wstakemode);
  const odddata = useSelector(Wodd);
  const betdata = useSelector(Wbetdata);
  console.log('1====================>', betdata.length)
  const [stakemode, setStakeMode] = useState(_stakemode);
  const [modifystakemode, setModifyStakeMode] = React.useState(false);
  const [oddlog, setOddlog] = React.useState(false);

  const [diffFrom, setDiffFrom] = useState(_stakemode.from);
  const [diffTo, setDiffTo] = useState(_stakemode.to);
  const [stake, setStake] = useState(_stakemode.stake);
  const [max, setMax] = useState(_stakemode.max);
  const [diffmode, setMdDiffState] = useState(_stakemode.diffmode);
  const [betmode, setMdBetMode] = useState(_stakemode.betmode);
  const [probability, setProbability] = useState(_stakemode.probability);
  const [runstate, setRunState] = useState(_stakemode.state);
  const [formulas, setFormula] = useState([]);
  const [equation, setEquation] = useState(_stakemode.formula);

  useEffect(()=>{
    setStakeMode(_stakemode)
  },[_stakemode])

  useEffect( () => {
    const run = async() => {
      var ret = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getFormula`);
      setFormula(ret.data);
      console.log()
    } 
    run();
  }, []);



  const setDiffMode = async (check) => {
    if (check == 1)
      setMdDiffState(1);
    else
      setMdDiffState(0)
  }

  const setBetMode = async (check) => {
    if (check == 1)
      setMdBetMode(1);
    else
      setMdBetMode(0)
  }

  const setRun = async (check) => {
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setRun', { monitId: _monitid, eventId: _eventid, state: check });
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
    setMdDiffState(stakemode.diffmode);
    setMdBetMode(stakemode.betmode);
    setDiffFrom(stakemode.from);
    setDiffTo(stakemode.to);
    setStake(stakemode.stake);
    setMax(stakemode.max);
    setEquation(stakemode.formula);
    setProbability(stakemode.probability);
    setRunState(stakemode.state);
    setModifyStakeMode(false);
  }

  const okModify = React.useCallback(async() => {
    var tmp = JSON.parse(JSON.stringify(stakemode));
    tmp.diffmode = diffmode;
    tmp.betmode = betmode;
    tmp.from = diffFrom;
    tmp.to = diffTo;
    tmp.stake = stake;
    tmp.max = max;
    tmp.state = runstate;
    tmp.formula = equation;
    tmp.probability = probability;

    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setMatchStakeMode', { monitId: _monitid, eventId: _eventid, stakemode: tmp });
      toast.success(`Success.`);
      setStakeMode(tmp);
      setModifyStakeMode(false);
    } catch (error) {
      toast.error(`Failed.`);
      console.error(error);
      return;
    }
    
  }, [diffFrom, diffTo, stake, max, diffmode, betmode, probability, max, runstate, equation])
  
  const openDetailDlg = async() => {
    
    setOddlog(true);
    sendBetInfor(_monitid, _betid, _away, _home);
  }

  const closeDetaildlg = () => {
    setOddlog(false);
  }

  return (
    <div className="border px-2 text-white rounded border-green-600 bg-sky-950 hover:bg-gray-900">
      <div className="lg:flex justify-between px-4 2xl:px-10">
        <div className="flex text-xl pt-8">
          <span>{_away}</span> <span className=" px-4">vs</span> <span>{_home}</span>
        </div>
        <div className="mb-9 pt-6">
            <div className="flex justify-center items-center space-x-4 pl-52">
              <div className="pt-0.5">Betfair</div>
              <div className="pt-0.5">PS3838</div>
              <div className="hover:cursor-pointer" onClick={() => openDetailDlg()}>
                <InfoOutlinedIcon className=""></InfoOutlinedIcon>
              </div>
            </div>
            <div className="flex justify-center items-center space-x-10">
              <div className=" w-36 text-center">{_away}</div>
              <div className="place-items-center">{_btodd.away}</div>
              <div className="place-items-center">{_psodd.away}</div>
            </div>
      
            <div className="flex justify-center items-center space-x-10">
              <div className=" w-36 text-center" >{_home}</div>
              <div>{_btodd.home}</div>
              <div>{_psodd.home}</div>
            </div>
        </div>
      </div>
      <div className="flex pl-4 -mt-8 xl:-mt-14 space-x-4 py-4 px-4 2xl:px-10">
        {/* <div className="flex text-center space-x-2">
          <div className="text-end">{stakemode.state ? (stakemode.diffmode == 0 ? 'Fixed' : 'Percent'):(gstakemode.diffmode == 0 ? 'Fixed' : 'Percent')}{':'}</div>
          <span>{stakemode.state ? (stakemode.diffmode == 0 ? `${stakemode.from}`: `${stakemode.from}%`):(gstakemode.diffmode == 0 ? `${gstakemode.from}`: `${gstakemode.from}%`)}</span>
          <span>~</span>
          <span>{stakemode.state ? (stakemode.diffmode == 0 ? `${stakemode.to} `: `${stakemode.to} %`):(gstakemode.diffmode == 0 ? `${gstakemode.to} `: `${gstakemode.to} %`)}</span>
        </div> */}
        <div className="flex text-center space-x-2">
          <div>Stake :</div>
          <span>{stakemode.state ? (stakemode.betmode == 0 ? `$${stakemode.stake}`: `${stakemode.stake}%`):(gstakemode.betmode == 0 ? `$${gstakemode.stake}`: `${gstakemode.stake}%`)}</span>
        </div>
        <div className="flex text-center space-x-2">
          <div>Max :</div>
          <span>{`$${stakemode.state ? stakemode.max : gstakemode.max}`}</span>
        </div>
        <div className="flex text-center space-x-2">
          <div>Probability :</div>
          <span>{`${stakemode.probability}%`}</span>
        </div>
        <div className="flex text-center space-x-2">
          <div>Kelly Balance :</div>
          <span>{`$${stakemode.kellybalance}`}</span>
        </div>
      </div>
      <div className="md:flex pl-4 -mt-5 space-x-4 py-4 px-4 2xl:px-10">
        <div className="flex text-center space-x-2">
          <div className="">{'Formula:'}</div>
          <span>{stakemode.formula}</span>
        </div>
        {/* <div className="flex text-center space-x-2">
          <div>Kelly Balance :</div>
          <span>{`$${stakemode.kellybalance}`}</span>
        </div> */}  
        <div className="hover:cursor-pointer pl-4" onClick={() => setModifyStakeMode(true)}>
          <ModeEditOutlineOutlinedIcon className=""></ModeEditOutlineOutlinedIcon>
        </div>
        <div className="hover:cursor-pointer" onClick={() => setRun(!runstate)}>
          {runstate ?<PauseCircleOutlineOutlinedIcon className=""></PauseCircleOutlineOutlinedIcon> : <PlayCircleFilledWhiteOutlinedIcon className=""></PlayCircleFilledWhiteOutlinedIcon>}
        </div>
      </div>
      <Dialog onClose={() => cancelModfy()} open={modifystakemode}>
        <DialogContent className="modifymonitor bg-sky-950 pt-10">
          <div className="absolute top-2 right-2 p-1 cursor-pointer hover:bg-slate-400 rounded-full" onClick={() => cancelModfy()}>
            <CloseIcon className="text-white"></CloseIcon>
          </div>
          <div className="text-white pt-5">
            {/* <div className="flex space-x-1 sm:space-x-3 sm:px-4 mb-2">
              <span className="w-16 sm:w-20 text-end">{'Diff :'}</span>
              <select className="cursor-pointer block w-22 p-1 overflow-auto text-sm text-center bg-sky-950 text-white border rounded-md" onChange={(e) => setDiffMode(e.target.value)}>
                <option className="cursor-pointer" value={0} selected = {diffmode == 0}>Fiexd</option>
                <option className="cursor-pointer" value={1} selected = {diffmode == 1}>Percent</option>
              </select>
              <input type="number" className="text-sm w-16 sm:w-20 text-center bg-sky-950 text-white border rounded-md" min="0" value={diffFrom} required onChange={(e) => setDiffFrom(e.target.value)}></input>
              <span className="px-3 sm:px-0">~</span>
              <input type="number" className="text-sm w-16 sm:w-20 text-center bg-sky-950 text-white border rounded-md" min="0" value={diffTo} required onChange={(e) => setDiffTo(e.target.value)}></input>
              <span className="">{diffmode == 0 ? '':'(%)'}</span>
            </div> */}
            <div className="flex space-x-1 sm:space-x-3 sm:px-4 mb-2">
              <span className="w-16 sm:w-20 text-end">{betmode == 0 ? 'Stake($) :':'Stake :'}</span>
              {/* <select className="cursor-pointer block w-22 p-1 overflow-auto text-sm text-center bg-sky-950 text-white border rounded-md" onChange={(e) => setBetMode(e.target.value)}>
                <option className="cursor-pointer" value={0} selected = {betmode == 0}>Fiexd</option>
                <option className="cursor-pointer" value={1} selected = {betmode == 1}>Percent</option>
              </select> */}
              <div className="flex">
                <input type="number" className="py-1 text-sm w-16 sm:w-20 text-center bg-sky-950 text-white border rounded-md" min="0" value={stake} required onChange={(e) => setStake(e.target.value)}></input>
              </div>
              <span className="">{betmode == 0 ? '':'(%)'}</span>
            </div>
            <div className="flex space-x-1 sm:space-x-3 sm:px-4 mb-2">
              <span className="w-16 sm:w-20 text-end">{'Max($) :'}</span>
              <div className="flex pr-4">
                <input type="number" className="py-1 text-sm w-20 text-center bg-sky-950 text-white border rounded-md" min="0" value={max} required onChange={(e) => setMax(e.target.value)}></input>
              </div>
              <span className="w-22">{'Probability :'}</span>
              <div className="flex">
                <input type="number" className="py-1 text-sm w-16 sm:w-20 text-center bg-sky-950 text-white border rounded-md" min="0" value={probability} required onChange={(e) => setProbability(e.target.value)}></input>
              </div>
              <span className="">{'(%)'}</span>
            </div>
            <div className="flex space-x-1 sm:space-x-3 sm:px-4 mb-2">
              <span className="sm:pl-2 w-20 sm:w-24 text-end">{'Formula :'}</span>
              <select className="cursor-pointer block p-1 w-full overflow-auto text-sm text-center bg-sky-950 text-white border rounded-md" onChange={(e) => setEquation(e.target.value)}>
              {formulas.map((el, index) => (
                <option className="cursor-pointer" value={el.formula} selected = {el.formula == equation ? true: false} key = {index} >{el.formula}</option>
              ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center pt-2 space-x-10 sm:space-x-16">
            <Button variant="outlined"  style={{backgroundColor: "rgb(23 37 84)", border:"1px solid white", color:"white"}} onClick={() => cancelModfy()}>
              Cancel
            </Button>
            <Button variant="outlined"  style={{backgroundColor: "rgb(23 37 84)", border:"1px solid white", color:"white"}} onClick={() => okModify()}>
              OK
            </Button>
          </div>
        </DialogContent>

      </Dialog>
      <Dialog onClose={() => closeDetaildlg()} open={oddlog}>
        <DialogContent className="oddlog bg-sky-950 pt-10">
          <div className="absolute top-2 right-2 p-1 cursor-pointer hover:bg-slate-400 rounded-full" onClick={() => closeDetaildlg()}>
            <CloseIcon className="text-white"></CloseIcon>
          </div>
          <div className="text-white">
            <div className="p-2 font-bold text-lg flex justify-center">
              <span>{_away}</span> <span className=" px-4">vs</span> <span>{_home}</span>
            </div>
            <div className="flex">
              <div>
                <div className="flex">
                  <span className="w-20 text-end pr-3">{`Play :`}</span>
                  <span className="w-40">{betdata.length == 0 ? '-': betdata[0].gamedate}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-end pr-3">{`BetTime :`}</span>
                  <span className="w-40">{betdata.length == 0 ? '-': betdata[0].betdate}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-end pr-3">{`BetPlace :`}</span>
                  <span>{betdata.length == 0 ? '-': betdata[0].place}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-end pr-3">{`Stake :`}</span>
                  <span>{betdata.length == 0 ? '-': betdata[0].stake}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-end pr-3">{`Odd :`}</span>
                  <span>{betdata.length == 0 ? '-': betdata[0].odds}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-end pr-3">{`Profit :`}</span>
                  <span>{betdata.length == 0 ? '-': betdata[0].odds * betdata[0].stake}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-end pr-3">{`Market :`}</span>
                  <span>{betdata.length == 0 ? '-': 'MoneyLine'}</span>
                </div>
                <div className="flex pt-1">
                  <span className="w-20 text-end pr-3">{`State :`}</span>
                  <span>{betdata.length == 0 ? '-': betdata[0].state == 0 ? 'Pending' : betdata[0].state == 2 ? 'Win':'Lose'}</span>
                </div>
              </div>
              <div>
                <div className="mb-9  pt-24">
                  <div className="pl-44 flex space-x-3">
                    <div className="pt-0.5">Betfair</div>
                    <div className="pt-0.5">PS3838</div>
                  </div>
                  <div className="flex justify-center items-center space-x-6">
                    <div className=" w-36 text-center">{_away}</div>
                    <div className="place-items-center">{_btodd.away}</div>
                    <div className="place-items-center">{_psodd.away}</div>
                  </div>
            
                  <div className="flex justify-center items-center space-x-6">
                    <div className=" w-36 text-center" >{_home}</div>
                    <div className="place-items-center">{_btodd.home}</div>
                    <div className="place-items-center">{_psodd.home}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex border-b-2 sm:space-x-5 justify-start pb-2">
              <div className="w-2/3 text-end pr-8">
                Betfair
              </div>
              <div className="w-1/3 text-center">
                PS3838
              </div>
            </div>
            <div>
              <div className="flex border-b-2">
                <div className="w-48 text-center">
                  <span>Time</span>
                </div>
                <div className="w-20 text-center">
                  <span>Away</span>
                </div>
                <div className="w-20 text-center">
                  <span>Home</span>
                </div>
                <div className="w-20 text-center">
                  <span>Away</span>
                </div>
                <div className="w-20 text-center">
                  <span>Home</span>
                </div>
              </div>
              <div className="overflow-y-auto h-80">
                {odddata.map((el, index) => (
                   el.gamedate != 'NONE' && <><div className="flex pt-2" key = {index}>
                    <div className="w-48 text-center">
                      <span>{el.gamedate}</span>
                    </div>
                    <div className="w-20 text-center">
                      <span>{el.betfair.away == undefined ? '-': el.betfair.away}</span>
                    </div>
                    <div className="w-20 text-center">
                      <span>{el.betfair.home == undefined ? '-': el.betfair.home}</span>
                    </div>
                    <div className="w-20 text-center">
                      <span>{el.ps3838.away == undefined ? '-': el.ps3838.away}</span>
                    </div>
                    <div className="w-20 text-center">
                      <span>{el.ps3838.home == undefined ? '-': el.ps3838.home}</span>
                    </div>
                  </div></>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>

      </Dialog>
    </div>
  )
}

const Explorer = () => {
  
// const dispatch = useDispatch();
const matchData = useSelector(Wmatch);

const [monitmenu, setMonitMenu] = useState([]);
const [sportmenu, setSportMenu] = useState([]);
const [competitionmenu, setCompetitionMenu] = useState([]);
const [selectsport, setSelectSport] = useState('ALL');
const [selectcompetition, setSelectCompetition] = useState('ALL');

React.useEffect(() => {
  const run = async () => {
    var [monitor] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMonitor?sport=ALL`)
    ])

    var tmpSport = [];
    for (var x in monitor.data) {
      if (!tmpSport.includes(getSportString(monitor.data[x].sport)))
        tmpSport.push(getSportString(monitor.data[x].sport));
    }

    setMonitMenu(monitor.data);
    setSportMenu(tmpSport);
    initSocket(store);

  };
  run();
}, []);

useEffect(() => {
  sendSportLeagueName(selectsport, selectcompetition);
}, [selectsport, selectcompetition])

useEffect(() => {
  var tmpcompetition = [];
  for (var x in monitmenu) {
    var sportname = monitmenu[x].sport;
    var val = sportname.split('-');
    if (selectsport == val[0]) {
      tmpcompetition.push(sportname.replace(`${val[0]}-`, '') );
    }
  }
  setCompetitionMenu(tmpcompetition);

}, [selectsport])

const setSelectSportName = (val) => {
  if(val == selectsport)
    setSelectSport('ALL');
  else
    setSelectSport(val);
  setSelectCompetition('ALL');
}

const setSelectCompetitionName = (val) => {
  if(val == selectcompetition)
    setSelectCompetition('ALL');
  else
    setSelectCompetition(val);
}

const getSportString = (data) => {
  const val = data.split("-");
  const extracted = val[0].trim();
  return extracted;
}

  return (
    <>
      <div className="h-full">
        <Header />
        {matchData.length != 0?<div className="text-end w-full">{matchData[0].update}</div>:<div  className="text-end w-full">NONE</div>}
        <div className="bg-gradient-to-r from-green-600 to-[#233d26] min-h-screen">
          <div className="m-auto justify-center lg:flex">
            <div className="w-screen h-auto sm:h-screen border-solid border-rose-600 bg-orange-600 p-1 justify-center sm:flex">
              <div className="w-full sm:w-[350px] 2xl:w-[400px] bg-white overflow-y-auto">
                {sportmenu.map((el, index) => (<>
                    <div className="text-white items-center bg-gray-900 rounded-sm text-base hover:bg-gray-800  hover:cursor-pointer" key = {index} onClick={() => setSelectSportName(el)}>
                      <div className="flex p-2 justify-start">
                        <Image className="rounded-lg filter invert" width="25" height="25" src={`/images/${el}.png`} alt="Rounded avatar"></Image>
                        <div className="flex items-center text-lg font-bold ml-2" >{el}</div>
                      </div>
                    </div>
                    {getSportString(el) == selectsport ? competitionmenu.map((e, indexchild) => (
                      <div className="flex items-center text-white p-2 bg-gray-500 hover:bg-gray-600 text-lg font-bold pl-8 hover:cursor-pointer" key = {indexchild} onClick={() => setSelectCompetitionName(e)}>{e}</div>)):<></>}
                  </>
                  ))}
              </div>            
              <div className=" w-full h-screen sm:ml-2 overflow-y-auto mt-2 sm:mt-0 bg-blue-50">
              { (matchData.length > 0 && selectsport == 'ALL')?<div className="bg-gray-950 text-white p-2"> {'All Leagues'}</div> : <div></div>}
                {sportmenu.length > 0 ? matchData.map((el, index) => (<>
                  {index ==0 || (index > 0 && el.competitionName!= matchData[index-1].competitionName) ?<div className="bg-gray-800 text-white p-2"> {el.competitionName}</div> : <div></div>}
                  <div key = {index}>
                  <LeagueCard _monitid = {el.monitId} _eventid = {el.eventId} _away = {el.away} _home = {el.home} _stakemode = {el.stakemode} _betid = {el.betid} _btodd = {el.betfairodd} _psodd = {el.ps3838odd} count={index}></LeagueCard>
                  </div>
                </>
                )): <div></div>}
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