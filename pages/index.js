import { useState } from "react";
import React from "react";
import axios from 'axios'
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import { Header } from "./../component/header";

const SportCard = ({ img = '', name = '', count = 0, inplay = false, runstate = false }) => {
  const [runcheck, setRunCheck] = useState(runstate);
  const [playcheck, setPlayCheck] = useState(inplay);

  useEffect(() => {
    setRunCheck(runstate);
  }, [runstate])

  useEffect(() => {
    setPlayCheck(inplay);
  }, [inplay])

  const checkRunSport = async (check) => {
    setRunCheck(check)
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setMornitor', { sport: name, state: check });
      console.log(result)

      if (check) toast.success(`Started betting on ${name} matchs.`);
      else toast.success(`Stopped betting on ${name} matchs.`);
    } catch (error) {
      toast.error(`${name} set error.`);
      setChecked(!check)
      console.error(error);
      return;
    }
  }

  const checkInplaySport = async (check) => {
    setPlayCheck(check)
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setInPlay', { sport: name, state: check });
      console.log(result)

      if (check) toast.success(`Will bet on inPlay ${name} matchs.`);
      else toast.success(`Will bet all ${name} matchs.`);
    } catch (error) {
      toast.error(`${name} set error.`);
      setChecked(!check)
      console.error(error);
      return;
    }
  }

  return (
    <div className="p-3 mb-2 text-blue-700 rounded-lg text-base bg-orange-400 hover:bg-orange-500 dark:bg-gray-800 dark:text-blue-400 flex">
      <Image className="rounded-lg" width="28" height="28" src={img} alt="Rounded avatar"></Image>
      <div className="flex justify-between ml-4	w-full text-lg font-bold">
        <div className="flex items-center">{name}</div>
        <div className="flex text-base">
          <div className="flex items-center px-2 space-x-1 hover:text-blue-900">
            <h1>inPlay</h1>
            <input type="checkbox" className="cursor-pointer" checked={playcheck} onChange={(e) => checkInplaySport(e.target.checked)} />
          </div>
          <div className="flex items-center px-2 space-x-1 hover:text-blue-900">
            <h1>run</h1>
            <input type="checkbox" className="cursor-pointer" checked={runcheck} onChange={(e) => checkRunSport(e.target.checked)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {

  const [priceData, setPriceData] = useState([]);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [price, setPrice] = useState(0);
  const [sportData, setSportData] = useState([]);
  const [searchkey, setSearchKey] = useState('');

  const [filteredData, setFilteredData] = useState([]);

  React.useEffect(() => {
    const run = async () => {
      var [price, sport] = await Promise.all([
        await axios.get(process.env.NEXT_PUBLIC_APIURL + 'getBetrate'),
        await axios.get(process.env.NEXT_PUBLIC_APIURL + 'getMornitor'),
      ])

      console.log(sport)

      setPriceData(price.data);
      setSportData(sport.data);
      setFilteredData(sport.data);
    };

    run();
  }, []);

  React.useEffect(() => {
    setFilteredData(!!searchkey ? sportData.filter(el => el.sport.toLowerCase().includes(searchkey.toLowerCase())) : sportData);
  }, [searchkey, sportData]);

  const addPrice = React.useCallback(async () => {
    var data = {};
    var temp = JSON.parse(JSON.stringify(priceData));

    if (to <= from) {
      toast.info('Under value should bigger than Over value.');
      return;
    }

    if (price <= 0) {
      toast.info('Price value should bigger than zero.');
      return;
    }

    data.from = from;
    data.to = to;
    data.price = price;

    for (var x in temp) {
      if (temp[x].from == from && temp[x].to == to) {
        toast.info('Already added.');
        return;
      }
    }

    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'addBetrate', { from: from, to: to, price: price, state: true });
      console.log(result)
      temp.push(data)
      toast.success(`Price ${price} ( ${from} ~ ${to} ) added.`);
      setPriceData(temp);
    } catch (error) {
      toast.error('Adding failed.');
      console.error(error);
      return;
    }

  }, [from, to, price, priceData]);

  const removePrice = async (index) => {
    var temp = JSON.parse(JSON.stringify(priceData));
    var from = temp[index].from;
    var to = temp[index].to;
    var price = temp[index].price;
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'removeBetrate', { from: temp[index].from, to: temp[index].to, price: temp[index].price, state: true });
      temp.splice(index, 1);
      toast.success(`Price ${price} ( ${from} ~ ${to} ) removed.`);
      setPriceData(temp);
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <>
      <div className="h-screen">
        <Header />
        <div className="row"></div>
        <div></div>
        <div className="h-screen bg-gradient-to-r from-teal-400 to-green-600">
          <div className="pt-28 flex m-auto justify-center 	space-x-10">
            <div className="h-[600px] w-[500px] m-3 border-solid border-rose-600 bg-orange-600 p-4 rounded-lg">
              <div className="mb-4 text-3xl font-bold flex justify-center w-full text-purple-900">
                <h1>Sport</h1>
              </div>
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search sports..." onChange={(e) => setSearchKey(e.target.value)} required></input>
              </div>
              <div className="h-[440px] overflow-y-auto p-2 bg-blue-50 rounded-lg">
                {filteredData.map((val, index) => (
                  <SportCard img={`/images/${val.sport}.png`} name={val.sport} count={20} key={index} state={val.state} />
                ))}
              </div>
            </div>
            <div className="h-[600px] w-[500px] m-3 border-solid border-rose-600 bg-orange-600 p-4 rounded-lg">
              <div className="mb-4 text-3xl font-bold flex justify-center w-full text-purple-900">
                <h1>Betting Rate</h1>
              </div>
              <div className="relative flex justify-start pb-5">
                <div className="pr-4">
                  <div className="mb-1 text-base flex justify-center w-full font-bold">
                    <h1>Over</h1>
                  </div>
                  <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => { setFrom(e.target.value) }} required></input>
                </div>
                <div className="pr-4">
                  <div className="mb-1 text-base flex justify-center w-full font-bold">
                    <h1>Under</h1>
                  </div>
                  <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => {
                    if (e.target.value < from)
                      e.target.value = from;
                    setTo(e.target.value)
                  }} required></input>
                </div>
                <div className="pr-4">
                  <div className="mb-1 text-base flex justify-center w-full font-bold">
                    <h1>Price</h1>
                  </div>
                  <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" onChange={(e) => {
                    if (e.target.value < 0)
                      e.target.value = 0;
                    setPrice(e.target.value)
                  }} required></input>
                </div>
                <div className="flex items-end mb-0.5">
                  <button className="text-white h-10 right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={addPrice}>+</button>
                </div>
              </div>
              <div className="h-[430px]	overflow-y-auto bg-blue-50 p-2 rounded-lg">
                {priceData.map((val, index) => (
                  <div className="p-2 mb-2 text-blue-800 rounded-lg text-base bg-orange-400 dark:bg-gray-800 dark:text-blue-400 flex" key={index}>
                    <div className="flex justify-between	w-full text-lg font-bold">
                      <div className="flex justify-center w-[50px]">{val.from}</div>
                      <div className="flex justify-center w-[60px]"> ~ </div>
                      <div className="flex justify-center w-[60px]">{val.to}</div>
                      <div className="flex justify-center w-[120px]">{val.price}</div>
                      <button type="button" className="text-white p-2 bg-blue-700 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 rounded-full" onClick={(e) => removePrice(index)}>
                        <svg fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
               </div>
              {/*<div class="flex mt-6 content-around border-2 border-gray-500 h-[50px] w-[470px] m-auto bg-orange-400">
                <div class="flex items-center mr-4">
                    <input id="inline-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                    <label for="inline-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">MoneyLine</label>
                </div>
                <div class="flex items-center mr-4">
                    <input id="inline-2-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                    <label for="inline-2-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Handicap</label>
                </div>
                <div class="flex items-center mr-4">
                    <input id="inline-2-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                    <label for="inline-2-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Total Points</label>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  )
}
