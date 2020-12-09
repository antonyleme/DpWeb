import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles,
  CircularProgress
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import Page from 'src/components/Page';
import BannerCard from './BannerCard';
import Toolbar from './Toolbar';
import api from '../../services/api';

import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%'
  }
}));

const ProductList = () => {
  const classes = useStyles();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if(token){
      api.get('banners').then(res => {
        setBanners(res.data.banners);
        setLoading(false)
      });
    }
  }, []);

  const removeBanner = (id) => {
    setBanners(banners.filter(banner => banner.id != id));
  }

  return (
    token == null ?
    <Navigate to="/login"/>
    :
    <Page
      className={classes.root}
      title="Banners"
    >
      <Container maxWidth={false}>
        <Toolbar banners={banners} setBanners={setBanners}/>
        <Box mt={3}>
          <Grid
            container
            spacing={3}
          >
            {banners.map((banner) => (
              <Grid
                item
                key={banner.id}
                lg={3}
                md={4}
                xs={12}
              >
                <BannerCard
                  className={classes.productCard}
                  banner={banner}
                  removeBanner={removeBanner}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Page>
  );
};

export default ProductList;
