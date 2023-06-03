import { useState } from "react";
import React from "react";
import axios from 'axios'
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./../pages/header";
import Image from "next/image";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import Button from '@mui/material/Button';

const LeagueCard = ({_monitid = '',  _eventid = 0, _away = '', _home = '', _stakemode = {}, _betid = '0', _btodd = {away: 0, home: 0}, _psodd = {away: 0, home: 0}, count = 0}) => {

  const [stakemode, setStakeMode] = useState(_stakemode);
  const [modifystakemode, setModifyStakeMode] = React.useState(false);
  const [oddlog, setOddlog] = React.useState(false);

  const [diffFrom, setDiffFrom] = useState(_stakemode.from);
  const [diffTo, setDiffTo] = useState(_stakemode.to);
  const [stake, setStake] = useState(_stakemode.stake);
  const [max, setMax] = useState(_stakemode.max);
  const [diffmode, setMdDiffState] = useState(_stakemode.diffmode);
  const [betmode, setMdBetMode] = useState(_stakemode.betmode);
  const [runstate, setRunState] = useState(_stakemode.state);
  const [oddbtdata, setOddBtData] = useState([]);
  const [oddpsdata, setOddPsData] = useState([]);
  const [betdata, setBetdata] = useState([]);


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
    
  }, [diffFrom, diffTo, stake, max, diffmode, betmode, max, runstate])

  const getPsAwayOdd = (index) => {
    if (oddpsdata[index] != undefined) {
      var odd =  oddpsdata[index].moneyline;
      var awayodd = odd.away > 0 ? odd.away / 100 + 1 : 100 / Math.abs(odd.away) + 1;
      return awayodd.toFixed(2) * 1;
    } else {
      return '-'
    }
  }

  const getPsHomeOdd = (index) => {
    if (oddpsdata[index] != undefined) {
      var odd = oddpsdata[index].moneyline;
      var homeodd = odd.home > 0 ? odd.home / 100 + 1 : 100 / Math.abs(odd.home) + 1;
      return homeodd.toFixed(2) * 1;
    } else {
      return '-'
    }
  }

  const openDetailDlg = async() => {
    setOddlog(true);
    const ret = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getOddData?monitId=${_monitid}&betId=${_betid}&away=${_away}&home=${_home}`);
    if (ret.data.betfair != undefined)
      setOddBtData(ret.data.betfair.market);
    if (ret.data.ps3838 != undefined)
      setOddPsData(ret.data.ps3838.market);
    if (ret.data)
      setBetdata(ret.data.betdata);
  }

  const closeDetaildlg = () => {
    setOddlog(false);
  }

  const convertToDate = (time) => {
    const dateObj = new Date(time);
    const year = dateObj.getFullYear().toString().slice(-2); // Get the last two digits of the year
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Month is zero-based, so add 1 and pad with leading zero if needed
    const day = ('0' + dateObj.getDate()).slice(-2); // Pad day with leading zero if needed
    const hours = ('0' + dateObj.getHours()).slice(-2); // Pad hours with leading zero if needed
    const minutes = ('0' + dateObj.getMinutes()).slice(-2); // Pad minutes with leading zero if needed
    const seconds = ('0' + dateObj.getSeconds()).slice(-2); // Pad seconds with leading zero if needed

    const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  }

  return (
    <div className="border px-2 text-white rounded border-green-600 bg-sky-950 hover:bg-gray-900">
      <div className="lg:flex justify-between px-4">
        <div className="flex text-xl pt-8">
          <h1>{_away}</h1> <h1 className=" px-4">vs</h1> <h1>{_home}</h1>
        </div>
        <div className="mb-9 pt-6">
            <div className="pl-52 flex space-x-3">
              <div className="pt-0.5">Betfair</div>
              <div className="pt-0.5">PS3838</div>
              <div className="hover:cursor-pointer" onClick={() => openDetailDlg()}>
                <InfoOutlinedIcon className=""></InfoOutlinedIcon>
              </div>
            </div>
            <div className="flex justify-center items-center space-x-10">
              <div className=" w-36 text-center">{_away}</div>
              <div className="place-items-center">{_btodd.away}</div>
              <div className="place-items-center">{(_psodd.away > 0 ? _psodd.away / 100 + 1 : 100 / Math.abs(_psodd.away) + 1).toFixed(2)}</div>
            </div>
      
            <div className="flex justify-center items-center space-x-10">
              <div className=" w-36 text-center" >{_home}</div>
              <div>{_btodd.home}</div>
              <div>{(_psodd.home > 0 ? _psodd.home / 100 + 1 : 100 / Math.abs(_psodd.home) + 1).toFixed(2)}</div>
            </div>
        </div>
      </div>
      <div className="flex pl-10 -mt-8 xl:-mt-16 space-x-4 py-4">
        <div className="flex text-center space-x-2">
          <div>{stakemode.diffmode == 0 ? 'Fixed' : 'Percent'}{':'}</div>
          <h1>{stakemode.diffmode == 0 ? `${stakemode.from}`: `${stakemode.from}%`}</h1>
          <h1>~</h1>
          <h1>{stakemode.diffmode == 0 ? `${stakemode.to} `: `${stakemode.to} %`}</h1>
        </div>
        <div className="flex text-center space-x-2">
          <div>Stake :</div>
          <h1>{stakemode.betmode == 0 ? `$${stakemode.stake}`: `${stakemode.stake}%`}</h1>
        </div>
        <div className="flex text-center space-x-2">
          <div>Max :</div>
          <h1>{`$${stakemode.max}`}</h1>
        </div>
        <div className="hover:cursor-pointer" onClick={() => setModifyStakeMode(true)}>
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
            <div className="flex space-x-3 px-4 mb-2">
              <h1 className="mr-3.5">Diff</h1>
              <select className="cursor-pointer block w-22 p-1 overflow-auto text-sm text-center bg-sky-950 text-white border rounded-md" onChange={(e) => setDiffMode(e.target.value)}>
                <option className="cursor-pointer" value={0} selected = {diffmode == 0}>Fiexd</option>
                <option className="cursor-pointer" value={1} selected = {diffmode == 1}>Percent</option>
              </select>
              <input type="number" className="text-sm w-20 text-center bg-sky-950 text-white border rounded-md" min="0" value={diffFrom} required onChange={(e) => setDiffFrom(e.target.value)}></input>
              <h1 className="px-6">~</h1>
              <input type="number" className="text-sm w-20 text-center bg-sky-950 text-white border rounded-md" min="0" value={diffTo} required onChange={(e) => setDiffTo(e.target.value)}></input>
              <h1 className="">{diffmode == 0 ? '($)':'(%)'}</h1>
            </div>
            <div className="flex space-x-3 px-4 mb-2">
              <h1>Stake</h1>
              <select className="cursor-pointer block w-22 p-1 overflow-auto text-sm text-center bg-sky-950 text-white border rounded-md" onChange={(e) => setBetMode(e.target.value)}>
                <option className="cursor-pointer" value={0} selected = {betmode == 0}>Fiexd</option>
                <option className="cursor-pointer" value={1} selected = {betmode == 1}>Percent</option>
              </select>
              <div className="flex">
                <input type="number" className="text-sm w-20 text-center bg-sky-950 text-white border rounded-md" min="0" value={stake} required onChange={(e) => setStake(e.target.value)}></input>
              </div>
              <h1 className="">{betmode == 0 ? '($)':'(%)'}</h1>
              <h1 className="mr-2">Max</h1>
              <div className="flex">
                <input type="number" className="py-1 text-sm w-20 text-center bg-sky-950 text-white border rounded-md" min="0" value={max} required onChange={(e) => setMax(e.target.value)}></input>
              </div>
              <h1 className="">($)</h1>
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
      <Dialog onClose={() => closeDetaildlg(false)} open={oddlog}>
        <DialogContent className="oddlog bg-sky-950 pt-10">
          <div className="absolute top-2 right-2 p-1 cursor-pointer hover:bg-slate-400 rounded-full" onClick={() => closeDetaildlg(false)}>
            <CloseIcon className="text-white"></CloseIcon>
          </div>
          <div className="text-white">
            <div className="p-2 font-bold text-lg flex justify-center">
              <h1>{_away}</h1> <h1 className=" px-4">vs</h1> <h1>{_home}</h1>
            </div>
            <div className="flex">
              <div>
                <div className="flex">
                  <h1 className="w-20 text-end pr-3">{`BetPlace :`}</h1>
                  <h1>{betdata.length == 0 ? '-': betdata.place}</h1>
                </div>
                <div className="flex">
                  <h1 className="w-20 text-end pr-3">{`BetTime :`}</h1>
                  <h1 className="w-40">{betdata.length == 0 ? '-': convertToDate(betdata.betdate)}</h1>
                </div>
                <div className="flex">
                  <h1 className="w-20 text-end pr-3">{`Stake :`}</h1>
                  <h1>{betdata.length == 0 ? '-': betdata.stake}</h1>
                </div>
                <div className="flex">
                  <h1 className="w-20 text-end pr-3">{`Odd :`}</h1>
                  <h1>{betdata.length == 0 ? '-': betdata.odds}</h1>
                </div>
                <div className="flex">
                  <h1 className="w-20 text-end pr-3">{`Profit :`}</h1>
                  <h1>{betdata.length == 0 ? '-': betdata.odds * betdata.stake}</h1>
                </div>
                <div className="flex">
                  <h1 className="w-20 text-end pr-3">{`Market :`}</h1>
                  <h1>{betdata.length == 0 ? '-': 'MoneyLine'}</h1>
                </div>
                <div className="flex pt-1">
                  <h1 className="w-20 text-end pr-3">{`State :`}</h1>
                  <h1>{betdata.length == 0 ? '-': betdata.state == 0 ? 'InPlay' : betdata.state == 2 ? 'Win':'Lose'}</h1>
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
                    <div className="place-items-center">{(_psodd.away > 0 ? _psodd.away / 100 + 1 : 100 / Math.abs(_psodd.away) + 1).toFixed(2)}</div>
                  </div>
            
                  <div className="flex justify-center items-center space-x-6">
                    <div className=" w-36 text-center" >{_home}</div>
                    <div className="place-items-center">{_btodd.home}</div>
                    <div className="place-items-center">{(_psodd.home > 0 ? _psodd.home / 100 + 1 : 100 / Math.abs(_psodd.home) + 1).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex border-b-2 sm:space-x-5 justify-start pb-2">
              <div className="w-2/3 text-end pr-8">
                PS3838
              </div>
              <div className="w-1/3 text-center">
                Betfair
              </div>
            </div>
            <div>
              <div className="flex border-b-2">
                <div className="w-48 text-center">
                  <hl>Time</hl>
                </div>
                <div className="w-20 text-center">
                  <hl>Away</hl>
                </div>
                <div className="w-20 text-center">
                  <hl>Home</hl>
                </div>
                <div className="w-20 text-center">
                  <hl>Away</hl>
                </div>
                <div className="w-20 text-center">
                  <hl>Home</hl>
                </div>
              </div>
              <div className="overflow-y-auto h-80">
                {oddbtdata.map((el, index) => (
                  <div className="flex pt-2" key = {index}>
                    <div className="w-48 text-center">
                      <hl>{convertToDate(el.update)}</hl>
                    </div>
                    <div className="w-20 text-center">
                      <hl>{el.moneyline.away.availableToBack[0] == undefined ? '-':el.moneyline.away.availableToBack[0].price}</hl>
                    </div>
                    <div className="w-20 text-center">
                      <hl>{el.moneyline.home.availableToBack[0] == undefined ? '-':el.moneyline.home.availableToBack[0].price}</hl>
                    </div>
                    <div className="w-20 text-center">
                      <hl>{getPsAwayOdd(index)}</hl>
                    </div>
                    <div className="w-20 text-center">
                      <hl>{getPsHomeOdd(index)}</hl>
                    </div>
                  </div>
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

const [monitmenu, setMonitMenu] = useState([]);
const [sportmenu, setSportMenu] = useState([]);
const [competitionmenu, setCompetitionMenu] = useState([]);
const [selectsport, setSelectSport] = useState('ALL');
const [selectcompetition, setSelectCompetition] = useState('ALL');
const [matchData, setMatchData] = useState([]);

React.useEffect(() => {
  const run = async () => {
    var [monitor, mactchs] = await Promise.all([
      await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMonitor?sport=ALL`),
      await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMatchs?sportName=ALL&competitionName=ALL`)
    ])

    var tmpSport = [];
    for (var x in monitor.data) {
      if (!tmpSport.includes(getSportString(monitor.data[x].sport)))
        tmpSport.push(getSportString(monitor.data[x].sport));
    }

    setMonitMenu(monitor.data);
    setSportMenu(tmpSport);
    setMatchData(mactchs.data);
  };


  run();
}, []);

useEffect(() => {
  const run = async() => {
    const ret = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMatchs?sportName=${selectsport}&competitionName=${selectcompetition}`);
    setMatchData(ret.data);
  }

  run();
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
        <div className="bg-gradient-to-r from-green-600 to-[#233d26] min-h-screen">
          <div className="pt-10 sm:pt-20 m-auto justify-center mr-1 lg:flex">
            <div className="border-solid border-rose-600 p-2 bg-orange-600 rounded-lg justify-center sm:flex">
              <div className="h-[550px] sm:w-[250px] bg-white overflow-y-auto rounded-lg">
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
              <div className="sm:ml-2 h-[550px] sm:w-[700px] xl:w-[900px] overflow-y-auto mt-2 sm:mt-0 bg-blue-50 rounded-lg">
                {matchData.map((el, index) => (<>
                  {index ==0 || (index > 0 && el.competitionName!= matchData[index-1].competitionName) ?<div className="bg-gray-800 text-white p-2"> {el.competitionName}</div> : <div></div>}
                  <LeagueCard _monitid = {el.monitId} _eventid = {el.eventId} _away = {el.away} _home = {el.home} _stakemode = {el.stakemode} _betid = {el.betid} _btodd = {el.betfairodd} _psodd = {el.ps3838odd} count={index}></LeagueCard>
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