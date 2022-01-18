import React, { useState, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApexOptions } from 'apexcharts';
import ApexCharts from 'react-apexcharts';
import { Button } from '@mui/material';

import { loadStatThunk } from '../state/reducks';

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
  const [trigger, setTrigger] = useState(true); // temporary
  const dispatch = useDispatch();

  const stockData = useSelector((state: any) => {
    return state.tradyReducer.stockData;
  });

  const handleClick = (e: MouseEvent): void => {
    e.preventDefault();

    console.log('handleClick');
    setTrigger(false);
    dispatch(loadStatThunk('TWTR', '60min'));
  };

  if (trigger && !stockData) {
    return (
      <div>
        <Button
          variant="contained"
          onClick={(e: MouseEvent) => {
            handleClick(e);
          }}
        >
          Load
        </Button>
      </div>
    );
  }

  return (
    <div className="stockChart">
      <ApexCharts
        options={options}
        series={stockData}
        type="candlestick"
        height={550}
        width={700}
      />
    </div>
  );
};

export default StockChart;
