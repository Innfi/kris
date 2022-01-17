import React, { useState, MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
// import { ApexOptions } from 'apexcharts';
// import ApexCharts from 'react-apexcharts';
import { Button, Typography } from '@mui/material';

import { simpleCallThunk } from '../state/reducks';
// import dummySeries from './dummyData';

// const options: ApexOptions = {
//   xaxis: {
//     type: 'datetime',
//   },
//   yaxis: {
//     tooltip: {
//       enabled: true,
//     },
//   },
// };

const StockChart = () => {
  const [trigger, setTrigger] = useState(true);
  const dispatch = useDispatch();

  const handleClick = (e: MouseEvent): void => {
    e.preventDefault();
    console.log('handleClick');
    setTrigger(false);
    dispatch(simpleCallThunk());
  };

  if (trigger) {
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
    <div>
      <Typography>
        trigger false
      </Typography>
    </div>
  );

  // return (
  //   <div className="stockChart">
  //     <ApexCharts
  //       options={options}
  //       series={dummySeries}
  //       type="candlestick"
  //       height={550}
  //       width={700}
  //     />
  //   </div>
  // );
};

export default StockChart;
