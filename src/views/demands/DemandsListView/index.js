import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import data from './data';
import api from '../../../services/api';

import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const DemandsListView = () => {
  const classes = useStyles();
  const [customers] = useState(data);
  const [demands, setDemands] = useState([]);

  const [searchId, setSearchId] = useState('');

  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if(token){
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
  
      today = yyyy + '-' + mm + '-' + dd;
      api.get(`demands/${today}`).then(res => {
        setDemands(res.data.demands);
      });
    }
  }, []);

  function changeDate(date){
    api.get(`demands/${date}`).then(res => {
      setDemands(res.data.demands);
    });
  }

  return (
    token == null ?
    <Navigate to="/login"/>
    :
    <Page
      className={classes.root}
      title="Histórico de pedidos"
    >
      <Container maxWidth={false}>
        <Toolbar changeDate={changeDate} setSearchId={setSearchId} searchId={searchId} />
        <Box mt={3}>
          <Results demands={demands} searchId={searchId} />
        </Box>
      </Container>
    </Page>
  );
};

export default DemandsListView;
