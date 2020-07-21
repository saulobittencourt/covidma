import React, { useState, useEffect } from 'react'
import { json } from 'd3-fetch'
import BarChart from './BarChart'


const BarChartData = () => {
    const [preparedData, setPreparedData] = useState(null);

    const getData = async () => {
        const confirmedData = await json('/base/confirmed.json')
        const deathsData = await json('/base/deaths.json')
        // const recoveredData = await json('/base/recovered.json')

        setPreparedData({confirmedData, deathsData});
    };

    useEffect(() => {
        getData();
    },[]);

    return [preparedData];
}

const Renderizador = () => {
    const [preparedData] = BarChartData();

    if (preparedData === null) {
        return <p>Loading...</p>
    }
    
    return <BarChart data={preparedData} />
}

export default Renderizador;