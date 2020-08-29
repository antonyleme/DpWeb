import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  makeStyles,
  Button,
  TextField,
  FormControl,
  MenuItem,
  CircularProgress
} from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ProductDialog from '../../../components/ProductDialog';
import api from '../../../services/api';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  statsItem: {
    alignItems: 'center',
    display: 'flex'
  },
  statsIcon: {
    marginRight: theme.spacing(1)
  },
  margin: {
    marginBottom: theme.spacing(3),
  }
}));

const ProductCard = ({ className, categories, product, removeProduct, ...rest }) => {
  const classes = useStyles();

  const [openDialog, setOpen] = useState(false);

  const handleClickOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [category, setCategory] = useState(product.category_id);
  const [available, setAvailable] = useState(product.available);
  const [submiting, setSubmiting] = useState(false);

  const submit = () => {

  }

  const changeAvailable = (value) => {
    setAvailable(value);
    api.put(`products/${product.id}`, {
      available: value
    });
  }

  const deleteProduct = () => {
    api.delete(`products/${product.id}`);
    removeProduct(product.id);
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
      style={{opacity: available ? 1 : 0.6}}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="center"
          mb={3}
        >
          <img src={`http://10.0.0.133:8000/${product.imgPath}`} style={{maxWidth: 150, maxHeight: 150}}/>
        </Box>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h4"
        >
          {product.name}
        </Typography>
        <Typography
          align="center"
          color="textPrimary"
          variant="body1"
        >
          R${product.price}
        </Typography>
        
        <div style={{textAlign: 'center'}}>
        <FormControl>
            <TextField
              id="standard-select-currency"
              select
              onChange={(e) => changeAvailable(e.target.value)}
              value={available}
              required
            >
              <MenuItem value={1}>
                Em estoque
              </MenuItem>
              <MenuItem value={0}>
                Sem estoque
              </MenuItem>
            </TextField>
          </FormControl>
        </div>
      </CardContent>
      <Box flexGrow={1} />
      <Divider />
      <Box p={2}>
        <Grid
          container
          justify="space-between"
          spacing={2}
        >
          <Grid
            className={classes.statsItem}
            item
          >
            <ShoppingBasketIcon
              className={classes.statsIcon}
              color="action"
            />
            <Typography
              color="textSecondary"
              display="inline"
              variant="body2"
            >
              {product.totalDemands}
              {' '}
              Pedidos
            </Typography>
          </Grid>
          <Grid
            className={classes.statsItem}
            item
          >
            <Button
              color="primary"
              endIcon={<VisibilityIcon />}
              size="small"
              variant="text"
              onClick={handleClickOpenDialog}
            >
              Visualizar
            </Button>
          </Grid>
        </Grid>
      </Box>

      <ProductDialog 
        open={openDialog} 
        handleClickOpen={handleClickOpenDialog} 
        handleClose={handleCloseDialog}
        actions={
          <>
          <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
            <div>
              <Button onClick={deleteProduct} color="primary">
                Deletar
              </Button>
            </div>
            <div>
              <Button onClick={handleCloseDialog} color="primary">
                Fechar
              </Button>
              {
                submiting ?
                  <CircularProgress/>
                :
                <Button onClick={submit} color="primary" variant="contained">
                  Cadastrar
                </Button>
              }
            </div>
          </div>
          </>
        }
      >
        <form>
          <FormControl fullWidth className={classes.margin}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div>
                <img src={`http://10.0.0.133:8000/${product.imgPath}`} style={{height: 100, marginRight: 10}}/>
              </div>
              <div>
                <Typography>Foto do produto</Typography>
                <input type="file" id="file"/>
              </div>
            </div>
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField id="standard-basic" label="Nome do produto" defaultValue={name} onChange={(e) => setName(e.target.value)} required/>
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField type="number" id="standard-basic" label="Preço do produto" defaultValue={price} onChange={(e) => setPrice(e.target.value)} required/>
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField
              id="standard-select-currency"
              select
              label="Categoria"
              helperText="Selecione a categoria do produto"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              required
            >
              {
                categories.map(category => (
                  <MenuItem value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              }
            </TextField>
          </FormControl>
        </form>
      </ProductDialog>
    </Card>
  );
};

ProductCard.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object.isRequired
};

export default ProductCard;
