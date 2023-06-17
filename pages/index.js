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
import { Connected, Wmatch, Wodd, Wbetdata, SendTime } from '../modules/SocketSlice';
import { initSocket, sendSportLeagueName, sendBetInfor } from '../modules/websocketManager';
import store from '../modules/store'

const LeagueCard = ({_monitid = '',  _eventid = 0, _away = '', _home = '', _stakemode = {}, _betid = '0', _btodd = {away: 0, home: 0}, _psodd = {away: 0, home: 0}, count = 0}) => {
  const odddata = useSelector(Wodd);
  const betdata = useSelector(Wbetdata);
  const [stakemode, setStakeMode] = useState(_stakemode);
  const [modifystakemode, setModifyStakeMode] = React.useState(false);
  const [oddlog, setOddlog] = React.useState(false);

  const [max, setMax] = useState(_stakemode.max);
  const [edge, setEdge] = useState(_stakemode.edge);
  const [kellybalance, setKellybalance] = useState(_stakemode.kellybalance);
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
      console.log('================formula', ret.data)
    } 
    run();
  }, []);


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
    
    setMax(stakemode.max);
    setEquation(stakemode.formula);
    setEdge(stakemode.edge);
    setRunState(stakemode.state);
    setModifyStakeMode(false);
  }

  const okModify = React.useCallback(async() => {
    var tmp = JSON.parse(JSON.stringify(stakemode));
    tmp.edge = edge;
    tmp.max = max;
    tmp.kellybalance = kellybalance;
    tmp.formula = equation;
    tmp.state = true;
    setRunState(true);
    console.log('setmatchstake============>', equation)
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
    
  }, [max, kellybalance, edge, equation])
  
  const openDetailDlg = async() => {
    
    setOddlog(true);
    sendBetInfor(_monitid, _betid, _away, _home);
  }

  const closeDetaildlg = () => {
    setOddlog(false);
  }

  return (
    <div className="border px-2 text-white rounded border-green-600 bg-sky-950 hover:bg-gray-900">
      <div className="lg:flex justify-between 2xl:px-8">
        <div className="flex text-xl pt-8">
          <span className="text-center">{_away}</span> <span className=" px-4">vs</span> <span className="text-center">{_home}</span>
        </div>
        <div className="flex">
          <div className="mb-9 pt-6 pr-2 text-center">
            <div className="flex">
              <span className="w-40 sm:w-56 text-center"></span>
              <span className="w-16 text-center">Betfair</span>
              <span className="w-16 text-center">PS3838</span>
            </div>
            <div className="flex">
              <span className="w-40 sm:w-56 text-end">{_away}</span>
              <span className="w-16 text-center">{_btodd.away}</span>
              <span className="w-16 text-center">{_psodd.away}</span>
            </div>
            <div className="flex">
              <span className="w-40 sm:w-56 text-end">{_home}</span>
              <span className="w-16 text-center">{_btodd.home}</span>
              <span className="w-16 text-center">{_psodd.home}</span>
            </div>
          </div>
          <div className="hover:cursor-pointer pt-5 mr-2" onClick={() => openDetailDlg()}>
              <InfoOutlinedIcon className=""></InfoOutlinedIcon>
          </div>
        </div>
      </div>
      <div className="lg:flex mb-4">
        <div className="pl-2 sm:pl-10 lg:pl-4">
          <div className="flex pl-4 -mt-8 xl:-mt-14 space-x-2 py-4 px-1 2xl:px-10">
            <div className="flex text-center space-x-2">
              <span>Max :</span>
              <span>{`$${stakemode.max}`}</span>
            </div>
            <div className="flex text-center space-x-2">
              <span>Edge :</span>
              <span>{`${stakemode.edge}%`}</span>
            </div>
            <div className="flex text-center space-x-2">
              <span>Kelly Balance :</span>
              <span>{`$${stakemode.kellybalance}`}</span>
            </div>
          </div>
          <div className="md:flex pl-4 -mt-5 space-x-4 py-4 px-4 2xl:px-10">
            <div className="flex text-center space-x-2">
              <div className="">{'Formula:'}</div>
              <span>{stakemode.formula}</span>
            </div> 
          </div>
        </div>
        <div className="flex pt-4">
          <div className="-mt-4 xl:-mt-14">
            <div className="flex">
              <span className="text-end w-40 sm:w-56"></span>
              <span className="text-center w-24 pl-4">Amount</span>
            </div>
            <div className="flex">
              <span className="text-end w-40 sm:w-56">{_away}</span>
              <span className="text-center w-24 pl-4">{stakemode.awayamount}</span>
            </div>
            <div className="flex">
              <span className="text-end w-40 sm:w-56">{_home}</span>
              <span className="text-center w-24 pl-4">{stakemode.homeamount}</span>
            </div>
          </div>
          <div className="flex items-center pl-3 lg:-mt-12">
            <div className="hover:cursor-pointer pr-4" onClick={() => setModifyStakeMode(true)}>
              <ModeEditOutlineOutlinedIcon className=""></ModeEditOutlineOutlinedIcon>
            </div>
            <div className="hover:cursor-pointer" onClick={() => setRun(!runstate)}>
              {runstate ?<PauseCircleOutlineOutlinedIcon className=""></PauseCircleOutlineOutlinedIcon> : <PlayCircleFilledWhiteOutlinedIcon className=""></PlayCircleFilledWhiteOutlinedIcon>}
            </div>
          </div>
        </div>
      </div>
      <Dialog onClose={() => cancelModfy()} open={modifystakemode}>
        <DialogContent className="modifymonitor bg-sky-950 pt-10">
          <div className="absolute top-2 right-2 p-1 cursor-pointer hover:bg-slate-400 rounded-full" onClick={() => cancelModfy()}>
            <CloseIcon className="text-white"></CloseIcon>
          </div>
          <div className="pt-5">
            <div className="flex mb-3">
              <span className="w-32 text-end text-white">{'Max($) :'}</span>
              <div className="flex pl-2">
                <input type="number" className="py-1 text-sm w-20 text-center bg-sky-950 text-white border rounded-md" min="0" value={max} required onChange={(e) => setMax(e.target.value)}></input>
              </div>
            </div>
            <div className="flex mb-3">
              <span className="w-32 text-end text-white">{'Edge(%) :'}</span>
              <div className="flex pl-2">
                <input type="number" className="py-1 text-sm w-20 text-center bg-sky-950 text-white border rounded-md" min="0" value={edge} required onChange={(e) => setEdge(e.target.value)}></input>
              </div>
            </div>
            <div className="flex mb-3">
              <span className="w-32 text-end text-white">{'KellyBalance($) :'}</span>
              <div className="flex pl-2">
                <input type="number" className="py-1 text-sm w-20 text-center bg-sky-950 text-white border rounded-md" min="0" value={kellybalance} required onChange={(e) => setKellybalance(e.target.value)}></input>
              </div>
            </div>
            <div className="flex justify-center mb-3">
              <select className="cursor-pointer block w-60 p-1 pl-10 overflow-auto text-sm text-center bg-sky-950 text-white border rounded-md"  onChange={(el) => (setEquation(el.target.value))}>
                {formulas.map((el, index) => (
                  <option className="cursor-pointer" selected = {el.formula == equation} value={el.formula} key = {index}>{el.formula}</option>
                ))}
              </select>
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
                  <span className="w-40">{(Object.keys(betdata).length === 0 || betdata.length === 0) ? '-': betdata.gamedate}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-end pr-3">{`BetTime :`}</span>
                  <span className="w-40">{(Object.keys(betdata).length === 0 || betdata.length === 0) ? '-': betdata.betdate}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-end pr-3">{`BetPlace :`}</span>
                  <span>{(Object.keys(betdata).length === 0 || betdata.length === 0) ? '-': betdata.place}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-end pr-3">{`Stake :`}</span>
                  <span>{(Object.keys(betdata).length === 0 || betdata.length === 0) ? '-': betdata.stake}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-end pr-3">{`Odd :`}</span>
                  <span>{(Object.keys(betdata).length === 0 || betdata.length === 0) ? '-': betdata.odds}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-end pr-3">{`Profit :`}</span>
                  <span>{(Object.keys(betdata).length === 0 || betdata.length === 0) ? '-': betdata.odds * betdata.stake}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-end pr-3">{`Market :`}</span>
                  <span>{(Object.keys(betdata).length === 0 || betdata.length === 0) ? '-': 'MoneyLine'}</span>
                </div>
                <div className="flex pt-1">
                  <span className="w-20 text-end pr-3">{`State :`}</span>
                  <span>{(Object.keys(betdata).length === 0 || betdata.length === 0) ? '-': betdata.state == 0 ? 'Pending' : betdata.state == 2 ? 'Win':'Lose'}</span>
                </div>
              </div>
              <div className="">
                <div className="mb-9 pt-24">
                  <div className="flex">
                    <span className="w-36 text-center"></span>
                    <span className="w-16 text-center">Betfair</span>
                    <span className="w-16 text-center">PS3838</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 text-end">{_away}</span>
                    <span className="w-16 text-center">{_btodd.away}</span>
                    <span className="w-16 text-center">{_psodd.away}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 text-end">{_home}</span>
                    <span className="w-16 text-center">{_btodd.home}</span>
                    <span className="w-16 text-center">{_psodd.home}</span>
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
const sendtime = useSelector(SendTime);
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
        <div className="text-end w-full">{sendtime}</div>
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