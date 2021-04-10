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
import Toolbar from './Toolbar';
import ProductCard from './ProductCard';
import api from '../../../services/api';

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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState()

  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if (token) {
      api.get('products').then(res => {
        setProducts(res.data.products);
        setLoading(false)
      });
      api.get('categories').then(res => {
        setCategories(res.data.categories);
      });
    }
  }, []);

  const removeProduct = (id) => {
    setProducts(products.filter(product => product.id != id));
  }

  return (
    token == null ?
      <Navigate to="/login" />
      :
      <Page
        className={classes.root}
        title="Products"
      >
        <Container maxWidth={false}>
          <Toolbar categories={categories} products={products} setProducts={setProducts} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <Box mt={3}>
            <Grid
              container
              spacing={3}
            >
              {products.map((product) => (
                (searchTerm == null || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                <Grid
                  item
                  key={product.id}
                  lg={3}
                  md={4}
                  xs={12}
                >
                  <ProductCard
                    className={classes.productCard}
                    product={product}
                    categories={categories}
                    removeProduct={removeProduct}
                    products={products}
                    setProducts={setProducts}
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
