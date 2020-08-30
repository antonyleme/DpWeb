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

  useEffect(() => {
    api.get('demands').then(res => {
      setDemands(res.data.demands.data);
    })
  }, []);

  return (
    <Page
      className={classes.root}
      title="Histórico de pedidos"
    >
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          <Results demands={demands} />
        </Box>
      </Container>
    </Page>
  );
};

export default DemandsListView;
