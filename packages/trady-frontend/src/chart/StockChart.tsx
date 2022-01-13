import React, { useState, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApexOptions } from 'apexcharts';
import ApexCharts from 'react-apexcharts';
import { Button } from '@mui/material';

import { simpleCallThunk } from '../state/reducks';
import dummySeries from './dummyData';

const options: ApexOptions = {
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
  },
};

const StockChart = () => {
  const [trigger, setTrigger] = useState(false);
  const dispatch = useDispatch();

  const handleClick = (e: MouseEvent): void => {
    e.preventDefault();

    dispatch(simpleCallThunk());
  };

  if(trigger) {
    return (
      <div>
        <Button variant="contained" onClick={(e: MouseEvent) => {handleClick(e)}}>
          Load
        </Button>
      </div>
    );
  }

  return (
    <div className="stockChart">
      <ApexCharts options={options} series={dummySeries} type="candlestick" 
        height={550} width={700} />
    </div>
  );
};

export default StockChart;