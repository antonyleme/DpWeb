import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Budget from './Budget';
import LatestOrders from './LatestOrders';
import LatestProducts from './LatestProducts';
import Sales from './Sales';
import TasksProgress from './TasksProgress';
import TotalCustomers from './TotalCustomers';
import TotalProfit from './TotalProfit';
import TrafficByDevice from './TrafficByDevice';
import Demands from './Demands';
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

  const [totalValue, setTotalValue] = useState(0);
  const [totalDemands, setTotalDemands] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const [products, setProducts] = useState([]);

  const token = useSelector(state => state.auth.token);

  const [deliveryTax, setDeliveryTax] = useState(0);
  
  useEffect(() => {
    if(token){
      api.get('dashboard/demands/received').then(res => {
        setReceived(res.data.demands);
      });
      api.get('dashboard/demands/accepted').then(res => {
        setAccepted(res.data.demands);
      });
      api.get('dashboard/demands/delivered').then(res => {
        setDelivered(res.data.demands);
      });
      api.get('dashboard/demands/balcony').then(res => {
        setBalcony(res.data.demands);
      });
      api.get('products').then(res => {
        setProducts(res.data.products);
      })
      api.get('delivery-tax').then(res => {
        setDeliveryTax(res.data.tax);
      })
  
      api.get('dashboard').then(res => {
        setTotalValue(res.data.totalValue);
        setTotalDemands(res.data.totalDemands);
        setTotalProducts(res.data.totalProducts);
        setTotalUsers(res.data.totalUsers);
      })

      reloadData();
    }
  }, []);

  function reloadData(){
    setInterval(() => {
      api.get('dashboard/demands/received').then(res => {
        setReceived(res.data.demands);
      });
      api.get('dashboard/demands/accepted').then(res => {
        setAccepted(res.data.demands);
      });
      api.get('dashboard/demands/delivered').then(res => {
        setDelivered(res.data.demands);
      });
      api.get('dashboard/demands/balcony').then(res => {
        setBalcony(res.data.demands);
      });
      api.get('products').then(res => {
        setProducts(res.data.products);
      })
  
      api.get('dashboard').then(res => {
        setTotalValue(res.data.totalValue);
        setTotalDemands(res.data.totalDemands);
        setTotalProducts(res.data.totalProducts);
        setTotalUsers(res.data.totalUsers);
      })
    }, 15000);
  }

  function reloadProducts(){
    api.get('products').then(res => {
      setProducts(res.data.products);
    })
  }

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
        <Toolbar style={{marginBottom: 20}} reloadProducts={reloadProducts} accepted={accepted} delivered={delivered} setDelivered={setDelivered} balcony={balcony} setBalcony={setBalcony} products={products} setAccepted={setAccepted}/>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit total={totalValue}/>
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget total={totalDemands}/>
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalCustomers total={totalUsers}/>
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TasksProgress total={totalProducts}/>
          </Grid>

          <Grid item lg={6} md={6} xs={12}>
            <Demands title="Pedidos pendentes" status="received" demands={received} updateStatus={updateStatus} deliveryTax={deliveryTax}/>
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <Demands title="Pedidos aceitos" status="accepted" demands={accepted} updateStatus={updateStatus} deliveryTax={deliveryTax}/>
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <Demands title="Pedidos entregues" status="delivered" demands={delivered} updateStatus={updateStatus} deliveryTax={deliveryTax}/>
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            <Demands title="Vendas no balcão" status="balcony" demands={balcony} updateStatus={updateStatus} deliveryTax={deliveryTax}/>
          </Grid>
          
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
