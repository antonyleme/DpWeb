import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Total from './Total';
import TotalCard from './TotalCard';
import TotalMoney from './TotalMoney';
import TotalBalance from './TotalBalance';
import ListView from './ListView';
import api from '../../../services/api';
import Toolbar from './Toolbar';

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

const Dashboard = () => {
  const classes = useStyles();

  const [received, setReceived] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [delivered, setDelivered] = useState([]);
  const [balcony, setBalcony] = useState([]);

  const [totalReceived, setTotalReceived] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [totalBalcony, setTotalBalcony] = useState(0);
  const [totalApp, setTotalApp] = useState(0);

  const [notPaidBills, setNotPaidBills] = useState([]);
  const [monthPaidBills, setMonthPaidBills] = useState([]);

  const [products, setProducts] = useState([]);
  
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if(token){
      api.get('finance/stats').then(res => {
        setTotalReceived(res.data.totalReceived);
        setTotalBills(res.data.totalBills);
        setTotalBalcony(res.data.totalBalcony);
        setTotalApp(res.data.totalApp);
      });
  
      api.get('bills/not-paid').then(res => {
        setNotPaidBills(res.data.bills);
      });
      var date = new Date();
      var month = date.getMonth();
      var year = date.getFullYear();
      api.get(`bills/${month + 1}/${year}`).then(res => {
        setMonthPaidBills(res.data.bills);
      })
    }
  }, []);

  function updateStatus(updatedDemand){

    switch(updatedDemand.status){
      case 'accepted':
        setReceived(received.filter(demand => demand.id != updatedDemand.id));
        setAccepted([...accepted, updatedDemand]);
        break;
      case 'delivered':
        setAccepted(accepted.filter(demand => demand.id != updatedDemand.id));
        setDelivered([...delivered, updatedDemand]);
        break;
      default:
        setReceived(received.filter(demand => demand.id != updatedDemand.id));
        return;
    }
  }



  return (
    token == null ?
    <Navigate to="/login"/>
    :
    <Page className={classes.root} title="Pedidos">
      <Container maxWidth={false}>
        <Toolbar style={{marginBottom: 20}} 
          notPaidBills={notPaidBills} 
          setNotPaidBills={setNotPaidBills} 
          monthPaidBills={monthPaidBills}
          setMonthPaidBills={setMonthPaidBills}
          accepted={accepted} 
          delivered={delivered} 
          setDelivered={setDelivered} 
          balcony={balcony} 
          setBalcony={setBalcony} 
          products={products} 
          setAccepted={setAccepted}
          setTotalApp={setTotalApp}
          setTotalBalcony={setTotalBalcony}
          setTotalBills={setTotalBills}
          setTotalReceived={setTotalReceived}
        />
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Total total={totalReceived}/>
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalBalance total={totalBills}/>
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalCard total={totalApp}/>
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalMoney total={totalBalcony}/>
          </Grid>

          <Grid item lg={6} md={12} xs={12}>
            <ListView title="Despesas pendentes" bills={notPaidBills} monthPaidBills={monthPaidBills} setNotPaidBills={setNotPaidBills} setMonthPaidBills={setMonthPaidBills}/>
          </Grid>
          <Grid item lg={6} md={12} xs={12}>
            <ListView title="Despesas do mês pagas" bills={monthPaidBills} />
          </Grid>
          
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
