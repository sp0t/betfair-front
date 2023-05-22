import Link from "next/link"
import { useState } from "react";
import Image from "next/image";
import React from "react";
import axios from 'axios'
import { useEffect } from "react";

const SportCard = ({ img = '', name = '', count = 0, state = false}) => {
  const [checked,setChecked] = useState(state);

  const checkSport = async()=> {
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setMornitor', {sport: name, state: !checked});
      console.log(result);
    } catch (error) {
      console.error(error);
    }
    setChecked(!checked)
  }

  return (
    <div className="p-3 mb-2 text-blue-800 rounded-lg text-base bg-orange-400 dark:bg-gray-800 dark:text-blue-400 flex">
      {/* <Image className="rounded-full" width="20" height="20" src={img} alt="Rounded avatar" /> */}
      <div className="flex justify-between ml-4	w-full text-lg font-bold">
        <div className="flex items-center">{name}</div>
        <input type="checkbox" checked={checked} onChange={checkSport}/>
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

  const [filteredData,setFilteredData]= useState([]);

  React.useEffect(()=>{
    const run = async() => {
      var [price, sport] = await Promise.all([
        await axios.get(process.env.NEXT_PUBLIC_APIURL + 'getBetrate'),
        await axios.get(process.env.NEXT_PUBLIC_APIURL + 'getMornitor'),
      ])

      setPriceData(price.data);
      setSportData(sport.data);
      setFilteredData(sport.data);
    };

    run();
  }, []);

  React.useEffect(()=>{
    setFilteredData(!!searchkey?sportData.filter(el=> el.sport.toLowerCase().includes(searchkey.toLowerCase())):sportData);
  }, [searchkey]);

  const addPrice = React.useCallback(async() => {
    var data = {};
    var temp = JSON.parse(JSON.stringify(priceData));

    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'addBetrate', {from: from, to: to,  price:price, state:true});
      console.log(result);
    } catch (error) {
      console.error(error);
    }

    data.from = from;
    data.to = to;
    data.price = price;
    temp.push(data)
    
    setPriceData(temp);
  }, [from, to, price, priceData]);

  const removePrice = async(index) => {
    var temp = JSON.parse(JSON.stringify(priceData));
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'removeBetrate', {from: underOdd, to: overOdd,  price:price, state:true});
      console.log(result);
    } catch (error) {
      console.error(error);
    }
    temp.splice(index, 1);
    setPriceData(temp);
  }


  return (
    <>
      <div className="h-screen">
        <div className='h-20 bg-slate-600'>
          <div className='flex justify-between pl-24 pt-6 h-full'>
            <div className='text-rose-600 text-4xl font-bold'>
              <h1>Betfair-bot</h1>
            </div>
            <div className='flex pr-20 text-white  text-2xl'>
              <div className="p-3">
                <Link href="/">
                  <h2>Home</h2>
                </Link>
              </div>
              {/* <div className="p-3">
                <Link href="/setting">
                  <h2>Setting</h2>
                </Link>
              </div> */}
            </div>
          </div>
        </div>
        <div className="bg-green-600 h-screen">
          <div className="pt-28 flex m-auto justify-center 	space-x-10">
            <div className="h-[600px] w-[500px] m-3 border-solid border-rose-600 bg-orange-600 p-4 rounded-lg">
              <div className="mb-4 text-3xl font-bold flex justify-center w-full">
                <h1>Sport</h1>
              </div>
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search sports..." onChange={(e) => setSearchKey(e.target.value)} required></input>
              </div>
              <div className="h-[440px] overflow-y-auto p-1 bg-blue-50 rounded-lg">
                {filteredData.map((val, index) => (
                  <SportCard img="/BNB.webp" name={val.sport} count={20} key = {index} state={val.state}/>
                ))}
              </div>
            </div>
            <div className="h-[600px] w-[500px] m-3 border-solid border-rose-600 bg-orange-600 p-4 rounded-lg">
              <div className="mb-4 text-3xl font-bold flex justify-center w-full">
                <h1>Betting Rate</h1>
              </div>
              <div className="relative flex justify-start pb-5">
                <div className="pr-4">
                    <div className="mb-1 text-base flex justify-center w-full">
                      <h1>Over</h1>
                    </div>
                    <input type="number"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => {setFrom(e.target.value)}} required></input>
                </div>
                <div className="pr-4">
                    <div className="mb-1 text-base flex justify-center w-full">
                      <h1>Under</h1>
                    </div>
                    <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => 
                      {
                        if (e.target.value < from)
                          e.target.value = from;
                        setTo(e.target.value)
                      }} required></input>
                </div>
                <div className="pr-4">
                    <div className="mb-1 text-base flex justify-center w-full">
                      <h1>Price</h1>
                    </div>
                    <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min = "0" onChange={(e) => {
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
                <div className="p-2 mb-2 text-blue-800 rounded-lg text-base bg-orange-400 dark:bg-gray-800 dark:text-blue-400 flex"  key = {index}>    
                  <div className="flex justify-between	w-full text-lg font-bold">
                    <div className="flex justify-center w-[50px]">{val.from}</div>
                    <div className="flex justify-center w-[60px]"> ~ </div>
                    <div className="flex justify-center w-[60px]">{val.to}</div>
                    <div className="flex justify-center w-[120px]">{val.price}</div>
                    <button type="button" className="text-white p-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-full" onClick = {(e) => removePrice(index)}>
                      <svg fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
