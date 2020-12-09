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

const CustomerListView = () => {
  const classes = useStyles();
  const [customers] = useState(data);

  const [users, setUsers] = useState([]);

  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if(token){
      api.get('users').then(res => {
        setUsers(res.data.users);
      })
    }
  }, []);

  return (
    token == null ?
    <Navigate to="/login"/>
    :
    <Page
      className={classes.root}
      title="Customers"
    >
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          <Results users={users} />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
