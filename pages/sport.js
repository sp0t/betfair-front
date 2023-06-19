import { useState } from "react";
import React from "react";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import Header from "./header";
// import Header from "./../component/header";
import { sportNmaes } from "../const/const";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';

const Sport = () => {
  const [monitorData, setMonitorData] = useState([]);
  const [sportBt, setSportBt] = useState([]);
  const [sportPs, setSportPs] = useState([]);
  const [sportBtID, setSportBtID] = useState(0);
  const [sportPsID, setSportPsID] = useState(0);
  const [sportBtname, setSportBtname] = useState('');
  const [sportPsname, setSportPsname] = useState('');
  const [leagueBt, setLeagueBt] = useState([]);
  const [leagueSetBt, setLeagueSetBt] = useState([]);
  const [leaguePs, setLeaguePs] = useState([]);
  const [leagueSetPs, setLeagueSetPs] = useState([]);
  const [sportName, setSportName] = useState('Alpine Skiing');
  const [leagueBtids, setLeagueBtids] = useState([]);
  const [leaguePsids, setLeaguePsids] = useState([]);
  const [leagueBtname, setLeagueBtname] = useState('');
  const [leaguePsname, setLeaguePsname] = useState('');
  const [filterleagueBt, setFilterleagueBt] = useState([]);
  const [filterleaguePs, setFilterleaguePs] = useState([]);
  const [filterleagueSetBt, setFilterleagueSetBt] = useState([]);
  const [filterleagueSetPs, setFilterleagueSetPs] = useState([]);
  const [leaguekybt, setLeaguekybt] = useState('');
  const [leaguekyps, setLeaguekyps] = useState('');
  const [leaguekysetbt, setLeaguekysetbt] = useState('');
  const [leaguekysetps, setLeaguekysetps] = useState('');
  const [marketBt, setMarketBt] = useState([]);
  const [marketPs, setMarketPs] = useState([]);
  const [selectmarketBt, setSelectMarketBt] = useState('');
  const [selectmarketPs, setSelectMarketPs] = useState(0);
  const [marketsetBt, setMarketSetBt] = useState([]);
  const [marketsetPs, setMarketSetPs] = useState([]);
  const [modifyMonitor, setModifyMonitor] = React.useState(false);
  const [mornitorSetData, setMornitorSetData] = useState({});
  const [modifySportname, setModifySportname] = useState('');

  const sortObject = (mess) => {

    const sortedKeys = Object.keys(mess).sort();
    const sortedObj = {};
    sortedKeys.forEach(key => {
      sortedObj[key] = mess[key];
    });

    return sortedObj;
  }
  
  const filterObject = (searchkey, data, site) => {
    var tmp = [];
    for(var x in data) {
      if (site == 'betfair') {
        if (data[x].competition.name.toLowerCase().includes(searchkey.toLowerCase()))
          tmp.push(data[x])
      } else if (site == 'ps3838') {
        if (data[x].name.toLowerCase().includes(searchkey.toLowerCase()))
          tmp.push(data[x])
      }
    }

    return tmp;
  } 

  React.useEffect(() => {

    const run = async () => {

      var [mornitor, sport] = await Promise.all([
        await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMonitor?sport=ALL`),
        await axios.get(process.env.NEXT_PUBLIC_APIURL + 'getSport')
      ])
    
      setMonitorData(mornitor.data);

      if(sport.data.betfair != undefined) {
        setSportBt(sport.data.betfair);
        var ret = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getLeague?site=betfair&sportid=${sport.data.betfair[0].eventType.id}`);
        if (ret.data != undefined && ret.data.length > 0) {
          var market = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMarket?site=betfair&sportid=${sport.data.betfair[0].eventType.id}&leagueid=${ret.data[0].competition.id}`);
          if(market.data != null) {
            setMarketBt(market.data);
            setSelectMarketBt(market.data[0].marketType);
          }
          setLeagueBt(ret.data);
          setFilterleagueBt(ret.data);
        } 

        setSportBtname(sport.data.betfair[0].eventType.name);
        setSportBtID(sport.data.betfair[0].eventType.id);
      }
      if(sport.data.ps3838 != undefined) {
        setSportPs(sport.data.ps3838.sports);
        var ret = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getLeague?site=ps3838&sportid=${sport.data.ps3838.sports[0].id}`);
        if (ret.data != undefined) {
          var market = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMarket?site=ps3838&sportid=${sport.data.ps3838.sports[0].id}&leagueid=${ret.data.leagues[0].id}`);
          if(market.data != null) {
            setMarketPs(market.data.periods);
            setSelectMarketPs(market.data.periods[0].number);
          }
          setLeaguePs(ret.data.leagues);
          setFilterleaguePs(ret.data.leagues);
        }
        setSportPsname(sport.data.ps3838.sports[0].name);
        setSportPsID(sport.data.ps3838.sports[0].id);
      }
    };

    run();
  }, []);

  React.useEffect(() => {
    setLeaguePsids([]);
    setLeagueBtids([]);
    setLeagueBtname('');
    setLeaguePsname('');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
  }, [sportBtname, sportPsname]);

  React.useEffect(() => {
    setFilterleagueBt(filterObject(leaguekybt, leagueBt, 'betfair'));
  }, [leaguekybt, leagueBt]);

  React.useEffect(() => {
    setFilterleaguePs(filterObject(leaguekyps, leaguePs, 'ps3838'));
  }, [leaguekyps, leaguePs]);

  React.useEffect(() => {
    setFilterleagueSetBt(filterObject(leaguekysetbt, leagueSetBt, 'betfair'));
  }, [leaguekysetbt, leagueSetBt]);

  React.useEffect(() => {
    setFilterleagueSetPs(filterObject(leaguekysetps, leagueSetPs, 'ps3838'));
  }, [leaguekysetps, leagueSetPs]);

  const selectSportPs = async(val) => {
    var sport = JSON.parse(val);
    setSportPsname(sport.name);
    setSportPsID(sport.id);
    var ret =  await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getLeague?site=ps3838&sportid=${sport.id}`);
    if (ret.data != undefined) {
      setLeaguePs(ret.data.leagues);
      setFilterleaguePs(ret.data.leagues);

      var market = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMarket?site=ps3838&sportid=${sport.id}&leagueid=${ret.data.leagues[0].id}`);
      if(market.data != null) {
        setMarketPs(market.data.periods);
        setSelectMarketPs(market.data.periods[0].number);
      }
    } else {
      setLeaguePs([]);
      setFilterleaguePs([]);
      setMarketPs([]);
      setSelectMarketPs(0);
    }
    setLeaguePsids([]);
    setLeaguePsname('');
  }

  const selectSportBt = async(val) => {
    var sport = JSON.parse(val);
    setSportBtname(sport.eventType.name);
    setSportBtID(sport.eventType.id);
    console.log('sportid = ', sport.eventType.id)
    var ret =  await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getLeague?site=betfair&sportid=${sport.eventType.id}`);
    if (ret.data != undefined && ret.data.length > 0) {
      setLeagueBt(ret.data);
      setFilterleagueBt(ret.data);
      console.log('ret.data[0]', ret.data[0])

      var market = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMarket?site=betfair&sportid=${sport.eventType.id}&leagueid=${ret.data[0].competition.id}`);
      if(market.data != null) {
        setMarketBt(market.data);
        setSelectMarketBt(market.data[0].marketType);
      }
    } else {
      setLeagueBt([]);
      setFilterleagueBt([]);
      setMarketBt([]);
      setSelectMarketBt('');
    }
    setLeagueBtids([]);
    setLeagueBtname('');
  }

  const openModifyDialog = async(name) => {
    const retsport = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMonitor?sport=${name}`)
    setMornitorSetData(retsport.data[0])
    const btid = retsport.data[0].sites[0].sportid;
    const psid = retsport.data[0].sites[1].sportid;
    const btleagueid = retsport.data[0].sites[0].competition[0];
    const psleagueid = retsport.data[0].sites[1].competition[0];
    var [btleague, psleague, btmarket, psmarket] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_APIURL}getLeague?site=betfair&sportid=${btid}`),
      axios.get(`${process.env.NEXT_PUBLIC_APIURL}getLeague?site=ps3838&sportid=${psid}`),
      axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMarket?site=betfair&sportid=${btid}&leagueid=${btleagueid}`),
      axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMarket?site=ps3838&sportid=${psid}&leagueid=${psleagueid}`),
    ])

    if(btleague.data != undefined) {
      setLeagueSetBt(btleague.data);
      setFilterleagueSetBt(btleague.data);
    } else {
      setLeagueSetBt([]);
      setFilterleagueSetBt([]);
    }

    if(psleague.data != undefined) {
      setLeagueSetPs(psleague.data.leagues);
      setFilterleagueSetPs(psleague.data.leagues);
    } else {
      setLeagueSetPs([]);
      setFilterleagueSetPs([]);
    }

    if(btmarket.data != undefined)
      setMarketSetBt(btmarket.data)
    else
      setMarketSetBt([])

    if(psmarket.data.periods != undefined)
      setMarketSetPs(psmarket.data.periods)
    else
      setMarketSetPs([])
    setModifySportname(name);
    setModifyMonitor(true);
  }

  const checkPs = async(state, value) => {
    var market = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMarket?site=ps3838&sportid=${sportPsID}&leagueid=${value.id}`);
    if(market.data != undefined) {
      setMarketPs(market.data.periods);
      setSelectMarketPs(market.data.periods[0].number);
    } else {
      setMarketPs([]);
      setSelectMarketPs(0);
    }
    var tmp =  JSON.parse(JSON.stringify(leaguePsids));
    if(state) tmp.push(value.id)
    else {
      const index = tmp.indexOf(value.id);
      if (index !== -1) {
        tmp.splice(index, 1);
      }
    }
    setLeaguePsids(tmp)
    setLeaguePsname(value.name);
  }

  const checkBt = async(state, value) => {
    var tmp =  JSON.parse(JSON.stringify(leagueBtids));
    var market = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMarket?site=betfair&sportid=${sportPsID}&leagueid=${value.id}`);
    if(market.data != undefined) {
      setMarketBt(market.data);
      setSelectMarketBt(market.data[0].marketType);
    } else {
      setMarketBt([]);
      setSelectMarketBt('');
    }

    if(state) tmp.push(parseInt(value.competition.id))
    else {
      const index = tmp.indexOf(parseInt(value.competition.id));
      if (index !== -1) {
        tmp.splice(index, 1);
      }
    }
    setLeagueBtids(tmp)
    setLeagueBtname(value.competition.name)
  }

  const changeMornitorMarket = (market, order) => {
    var tmp =  JSON.parse(JSON.stringify(mornitorSetData));
    tmp.sites[order].market = market;

    setMornitorSetData(tmp)
  }
  const changeMornitorSetdata = (state, value, order, name) => {
    console.log('id =', value, 'name=', name);
    var tmp =  JSON.parse(JSON.stringify(mornitorSetData));
    if(state) {
      tmp.sites[order].competition.push(value);
      tmp.sites[order].competitionname = name;
    }
    else {
      const index = tmp.sites[order].competition.indexOf(value);
      if (index !== -1) {
        tmp.sites[order].competition.splice(index, 1);
      }
    }

    console.log('============after', tmp)

    setMornitorSetData(tmp)
  }

  const removeSport = React.useCallback(async (index, name) => {
    console.log('name=============>', name)
    var temp = JSON.parse(JSON.stringify(monitorData));

    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'removeMonitor', { sport: name });
      temp.splice(index, 1);
      toast.success(`Sport ${name} removed.`);
      setMonitorData(temp);
    } catch (error) {
      console.error(error);
    }
  }, [monitorData])

  const addMornitor = React.useCallback(async() => {

    var temp = JSON.parse(JSON.stringify(monitorData));

    if (sportName == '') {
      toast.warn(`Please input sport name for mornitor.`);
      return;
    }

    if (leagueBtids.length == 0) {
      toast.warn(`Please check competitions for ${sportBtname}.`);
      return;
    }

    if (leagueBtids.length > 1) {
      toast.warn(`Can't select more than 2 competitions for ${sportBtname}.`);
      return;
    }

    if (leaguePsids.length == 0) {
      toast.warn(`Please check competitions for ${sportPsname}.`);
      return;
    }

    if (leaguePsids.length > 1) {
      toast.warn(`Can't select more than 2 competitions for ${sportPsname}.`);
      return;
    }

    var data = {};
    data.sport = sportName + '-' + leagueBtname;
    data.sites = [];

    for (var x in temp) {
      if (temp[x].sport == data.sport) {
        toast.warn(`${data.sport} already added. Please remove it before add.`);
        return;
      }
    }

    var tmp = {};
    tmp.name = 'betfair';
    tmp.sportid = sportBtID;
    tmp.sportname = sportBtname;
    tmp.competition = leagueBtids;
    tmp.competitionname = leagueBtname;
    tmp.market = selectmarketBt;

    data.sites.push(tmp);

    tmp = {};
    tmp.name = 'ps3838';
    tmp.sportid = sportPsID;
    tmp.sportname = sportPsname;
    tmp.competition = leaguePsids;
    tmp.competitionname = leaguePsname;
    tmp.market = selectmarketPs;

    data.sites.push(tmp);

    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'addMonitor', { sport: data.sport, sites: data.sites});
      temp.push(data);
      setMonitorData(temp);
      toast.success(`Sucess.`);
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => checkbox.checked = false);

      setLeagueBtids([]);
      setLeaguePsids([]);
      setLeagueBtname('');
      setLeaguePsname('');
    } catch (error) {
      toast.error(`Failed.`);
      console.error(error);
    } 

  },[monitorData, sportName, sportBtID, sportPsID, sportBtname, sportPsname, leagueBtids, leaguePsids, leagueBtname, leaguePsname, selectmarketPs, selectmarketBt])

  const devideString = (data) => {
    const val = data.split("-");
    const extracted = val[0].trim();
    return extracted;
  }

  const updateMonitor = React.useCallback(async() => {
    if(mornitorSetData.sites[0].competition.length > 1 || mornitorSetData.sites[1].competition.length > 1)
    {
      toast.warn('Please select one competetion for each site.');
      return;
    }

    console.log('==============UpdateMonitor', modifySportname, mornitorSetData)

    try {
      await axios.post(process.env.NEXT_PUBLIC_APIURL + 'updateMonitor', { sites: mornitorSetData.sites, sport: modifySportname});
      toast.success('Success.');
    } catch (error) {
      toast.error('Failed.');
    }

    setLeaguekysetbt('');
    setLeaguekysetps('');
    setModifyMonitor(false);
  },[modifySportname, mornitorSetData])

  return (
    <>
      <div className="">
        <Header />
        <div className="bg-gradient-to-r from-green-600 to-[#233d26] min-h-screen">
          <div className="pt-10 m-auto justify-center place-items-center xl:flex">
            <div className="m-2 border-solid sm:w-[630px] sm:m-auto bg-stone-800 p-1 rounded-lg xl:mr-10 xl:p-2">
              <div className="justify-center p-2 sm:w-[400px] sm:m-auto">
                  <div className="flex justify-center w-full font-bold text-white text-2xl py-1 lg:py-2">
                    <h1>Sport Name</h1>
                  </div>
                  <div className="flex place-content-center w-full font-bold text-white text-2xl pt-2">
                    <div className="">
                      <select className="cursor-pointer block w-full mb-4 p-2 lg:mb-6 overflow-auto text-lg text-center text-white border border-gray-300 rounded-lg bg-blue-600 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => {setSportName(e.target.value)}}>
                        {
                          sportNmaes.map((item, index) => (
                            <option className="cursor-pointer" key = {index}>{item}</option>
                          ))
                        }
                      </select>
                    </div>
                    <div>
                      <button type="button" className="text-white ml-5 bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => addMornitor()}>
                          Insert
                          <svg aria-hidden="true" className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                      </button>
                    </div>
                  </div>
              </div>
              <div className="sm:flex ">
                <div className="h-[550px] lg:h-[580px] sm:w-[320px] m-1.5 lg:m-2 border-solid border-rose-600 bg-orange-600 p-2 rounded-lg mb-4 lg:mb-0">
                  <div className="mb-2 text-2xl lg:text-3xl font-bold flex justify-center w-full text-purple-900 lg:mb-4">
                    <h1>Betfair</h1>
                  </div>
                  <div className="relative mb-2 lg:mb-4">
                    <select className="cursor-pointer block w-full p-1 mb-4 lg:p-2 lg:mb-6 overflow-auto text-lg text-center text-white border border-gray-300 rounded-lg bg-blue-600 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => {selectSportBt(e.target.value)}}>
                      {
                        sportBt.map((el, index) => (
                          <option className="cursor-pointer" key = {index} value = {JSON.stringify(el)}>{el.eventType.name}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="relative mb-2">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:pl-3 pointer-events-none">
                      <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input type="search" id="default-search" className="block w-full sm:pl-10 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search leagues..." onChange={(e) => setLeaguekybt(e.target.value)} required></input>
                  </div>
                  <div className="h-[400px] bg-blue-50 rounded-lg">
                    <div className="h-[350px] mb-2 overflow-y-auto p-1 lg:p-2 bg-blue-50 rounded-lg">
                      {
                        filterleagueBt.map((el, index) => (
                        <div className="justify-center p-2 mb-1 lg:mb-2 text-blue-800 rounded-lg text-base bg-orange-400 hover:bg-orange-500 dark:bg-gray-800 hover:text-blue-900 dark:text-blue-400 flex" key = {index}>
                          <div className="flex justify-between items-center ml-2 lg:ml-4	w-full text-lg font-bold">
                            <div className="flex items-center justify-center">{el.competition.name}</div>
                            <input className="cursor-pointer" type="checkbox" onChange={(e) => checkBt(e.target.checked, el)}/>
                          </div>
                        </div>
                        ))
                      }
                    </div>
                    <div className="relative">
                      <select className="cursor-pointer block w-full p-1 mb-4 lg:mb-6 overflow-auto text-lg text-center text-white border border-gray-300 rounded-lg bg-gray-600 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => {setSelectMarketBt(e.target.value)}}>
                        {
                          marketBt.map((el, index) => (
                            <option className="cursor-pointer" key = {index} value = {el.marketType}>{el.marketType}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                </div>
                <div className="h-[550px] lg:h-[580px] sm:w-[320px] m-1.5 lg:m-2 border-solid border-rose-600 bg-orange-600 p-2 rounded-lg">
                  <div className="mb-2 text-2xl lg:text-3xl font-bold flex justify-center w-full text-purple-900 lg:mb-4">
                    <h1>PS3838</h1>
                  </div>
                  <div className="relative mb-2 lg:mb-4">
                    <select className="cursor-pointer block w-full p-1 mb-4 lg:p-2 lg:mb-6 overflow-auto text-lg text-center text-white border border-gray-300 rounded-lg bg-blue-600 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => {selectSportPs(e.target.value)}}>
                        {
                          sportPs.map((el, index) => (
                            <option className="cursor-pointer" value={JSON.stringify(el)} key = {index}>{el.name}</option>
                          ))
                        }
                      </select>
                  </div>
                  <div className="relative mb-2">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:pl-3 pointer-events-none">
                      <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input type="search" id="default-search" className="block w-full sm:pl-10 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search leagues..." onChange={(e) => setLeaguekyps(e.target.value)} required></input>
                  </div>
                  <div className="h-[400px] bg-blue-50 rounded-lg">
                    <div className="h-[350px] mb-2 overflow-y-auto p-1 lg:p-2 bg-blue-50 rounded-lg">
                      {
                          filterleaguePs.map((el, index) => (
                          <div className="justify-center p-2 mb-1 lg:mb-2 text-blue-800 rounded-lg text-base bg-orange-400 hover:bg-orange-500 dark:bg-gray-800 hover:text-blue-900 dark:text-blue-400 flex" key = {index}>
                            <div className="flex justify-between items-center ml-2 lg:ml-4	w-full text-lg font-bold">
                              <div className="flex items-center" >{el.name}</div>
                              <input className="cursor-pointer" type="checkbox" onChange={(e) => checkPs(e.target.checked, el)}/>
                            </div>
                          </div>
                          ))
                        }
                    </div>
                    <div className="relative">
                      <select className="cursor-pointer block w-full p-1 mb-4 lg:mb-6 overflow-auto text-lg text-center text-white border border-gray-300 rounded-lg bg-gray-600 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => {setSelectMarketPs(e.target.value)}}>
                          {
                            marketPs.map((el, index) => (
                              <option className="cursor-pointer" value={el.number} key = {index}>{el.description}</option>
                            ))
                          }
                        </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[600px] sm:w-[400px] sm:m-auto m-2 border-solid border-rose-600 bg-orange-600 p-2 sm:mt-2 rounded-lg xl:m-auto xl:ml-10">
              <div className="mb-2 text-2xl lg:text-3xl lg:mb-4 font-bold flex justify-center w-full text-purple-900">
                <h1>Sport</h1>
              </div>
              <div className="h-[530px]	overflow-y-auto bg-blue-50 p-1 lg:p-2 rounded-lg">
                {monitorData.map((val, index) => (
                  <div className="items-center justify-center p-2 mb-1 lg:mb-2 text-blue-800 rounded-lg text-base bg-orange-400 hover:bg-orange-500 dark:bg-gray-800 hover:text-blue-900 dark:text-blue-400 flex" key={index}>
                    <div className="flex justify-between items-center	w-full text-lg font-bold">
                    <Image className=" ml-1 lg:ml-2 rounded-lg" width="25" height="25" src={`/images/${devideString(val.sport)}.png`} alt="Rounded avatar"></Image>
                      <div className="flex justify-cente px-1 text-center">{val.sport}</div>
                      <div className="flex">
                        <div className="group relative inline-block">
                          <button type="button" className="text-white p-2 bg-blue-700 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-full" onClick={() => openModifyDialog(val.sport)}>
                            <svg fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                            </svg>
                          </button>
                          <div className="absolute hidden group-hover:block bg-white text-black border text-xs border-black px-1 py-1 rounded right-0 top-full mt-2 whitespace-no-wrap z-50">
                            Edit
                          </div>
                        </div>
                        <div className="group relative inline-block place-items-center">
                          <button type="button" className="text-white p-2 bg-blue-700 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-full" onClick={(e) => removeSport(index, val.sport)}>
                            <svg fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                            </svg>
                          </button>
                          <div className="absolute hidden group-hover:block bg-white text-black border text-xs border-black px-1 py-1 rounded right-0 top-full mt-2 whitespace-no-wrap z-50">
                            Delete
                          </div>
                        </div>                
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
      <Dialog onClose={() => {setModifyMonitor(false); setLeaguekysetbt(''); setLeaguekysetps('');}} open={modifyMonitor}>
        <DialogContent className="modifymonitor bg-stone-900 pt-10">
          <div className="absolute top-2 right-2 p-1 cursor-pointer hover:bg-slate-400 rounded-full" onClick={() => {setModifyMonitor(false); setLeaguekysetbt(''); setLeaguekysetps('');}}>
            <CloseIcon className="text-white"></CloseIcon>
          </div>
          <div>
            <div className="sm:flex">
              <div className="h-[520px] sm:w-[320px] m-1.5 lg:m-2 border-solid border-rose-600 bg-orange-600 p-2 rounded-lg mb-4 lg:mb-0">
                <div className="mb-2 text-2xl lg:text-3xl font-bold flex justify-center w-full text-purple-900 lg:mb-4">
                  <h1>Betfair</h1>
                </div>
                <div className="relative mb-3">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <input type="search" id="default-search" className="block w-full sm:pl-10 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search leagues..." onChange={(e) => setLeaguekysetbt(e.target.value)} required></input>
                </div>
                <div className="h-[400px] bg-blue-50 rounded-lg">
                  <div className="h-[360px] overflow-y-auto p-1 lg:p-2 bg-blue-50 rounded-lg">
                    {
                      filterleagueSetBt.map((el, index) => (
                      <div className="justify-center p-2 mb-1 lg:mb-2 text-blue-800 rounded-lg text-base bg-orange-400 hover:bg-orange-500 dark:bg-gray-800 hover:text-blue-900 dark:text-blue-400 flex" key = {index}>
                        <div className="flex justify-between items-center ml-2 lg:ml-4	w-full text-lg font-bold">
                          <div className="flex items-center justify-center">{el.competition.name}</div>
                          <input className="cursor-pointer" type="checkbox" checked = {mornitorSetData.sites[0].competition.includes(parseInt(el.competition.id))} onChange={(e) =>changeMornitorSetdata(e.target.checked, parseInt(el.competition.id), 0, el.competition.name)}/>
                        </div>
                      </div>
                      ))
                    }
                  </div>
                  <div className="relative">
                        <select className="cursor-pointer block w-full p-1 mb-4 lg:mb-6 overflow-auto text-lg text-center text-white border border-gray-300 rounded-lg bg-gray-600 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => {changeMornitorMarket(e.target.value, 0)}}>
                          {
                            marketsetBt.map((el, index) => (
                              <option className="cursor-pointer" key = {index} value = {el.marketType} selected={el.marketType == mornitorSetData.sites[0].market}>{el.marketType}</option>
                            ))
                          }
                        </select>
                  </div>
                </div>
              </div>
              <div className="h-[520px] sm:w-[320px] m-1.5 lg:m-2 border-solid border-rose-600 bg-orange-600 p-2 rounded-lg">
                <div className="mb-2 text-2xl lg:text-3xl font-bold flex justify-center w-full text-purple-900 lg:mb-4">
                  <h1>PS3838</h1>
                </div>
                <div className="relative mb-3">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <input type="search" id="default-search" className="block w-full sm:pl-10 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search leagues..." onChange={(e) => setLeaguekysetps(e.target.value)} required></input>
                </div>
                <div className="h-[400px] bg-blue-50 rounded-lg">
                  <div className="h-[360px] overflow-y-auto p-1 lg:p-2 bg-blue-50 rounded-lg">
                    {
                        filterleagueSetPs.map((el, index) => (
                        <div className="justify-center p-2 mb-1 lg:mb-2 text-blue-800 rounded-lg text-base bg-orange-400 hover:bg-orange-500 dark:bg-gray-800 hover:text-blue-900 dark:text-blue-400 flex" key = {index}>
                          <div className="flex justify-between items-center ml-2 lg:ml-4	w-full text-lg font-bold">
                            <div className="flex items-center" >{el.name}</div>
                            <input className="cursor-pointer" type="checkbox" checked = {mornitorSetData.sites[1].competition.includes(el.id)} onChange={(e) =>changeMornitorSetdata(e.target.checked, el.id, 1, el.name)}/>
                          </div>
                        </div>
                        ))
                      }
                  </div>
                  <div className="relative">
                    <select className="cursor-pointer block w-full p-1 mb-4 lg:mb-6 overflow-auto text-lg text-center text-white border border-gray-300 rounded-lg bg-gray-600 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => {changeMornitorMarket(e.target.value, 0)}}>
                        {
                          marketsetPs.map((el, index) => (
                            <option className="cursor-pointer" value={el.number} key = {index} selected={el.number == mornitorSetData.sites[1].market}>{el.description}</option>
                          ))
                        }
                      </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-2 space-x-10 sm:space-x-16">
            <button type="button" className=" text-white hover:bg-orange-500 bg-orange-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => {setModifyMonitor(false); setLeaguekysetbt(''); setLeaguekysetps('');}}>
              Cancel
            </button>
            <button type="button" className=" px-8 text-white hover:bg-orange-500 bg-orange-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => updateMonitor()}>
              OK
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Sport;