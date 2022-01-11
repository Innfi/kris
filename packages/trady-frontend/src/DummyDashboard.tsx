import React, { FormEvent, useState } from 'react';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
//import { NavigateFunction, useNavigate } from 'react-router-dom';

import { loadStatThunk } from './state/reducks';

const DummyDashboard = () => {
  const [ symbol, setSymbol ] = useState('');
  const dispatch: Dispatch<any> = useDispatch();
  //const navigator: NavigateFunction = useNavigate();

  const onSubmitSymbol = (e: FormEvent) => {
    e.preventDefault();

    dispatch(loadStatThunk(symbol, ));
  };

  return (
    <div>
      <input type="submit" onSubmit={(e: FormEvent) => onSubmitSymbol(e)} >test input</input>
    </div>
  );
};

export default DummyDashboard;
