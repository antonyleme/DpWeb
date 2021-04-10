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
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import AcUnitIcon from '@material-ui/icons/AcUnit';
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
  },
  coldIcon: {
    marginRight: theme.spacing(1),
    color: 'blue',
  }
}));

const ProductCard = ({ className, categories, product, removeProduct, products, setProducts, ...rest }) => {
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
  const [promocionalPrice, setPromocionalPrice] = useState(product.promo_price);
  const [category, setCategory] = useState(product.category_id);
  const [available, setAvailable] = useState(product.qtd > 0);
  const [qtd, setQtd] = useState(product.qtd);
  const [cold, setCold] = useState(product.cold);
  const [submiting, setSubmiting] = useState(false);

  const submit = () => {
    setSubmiting(true);

    let formData = new FormData();
    formData.append('id', product.id);
    formData.append('name', name);
    formData.append('price', parseFloat(price.toString().replace(',', '.')));
    formData.append('promo_price', parseFloat(promocionalPrice.toString().replace(',', '.')));
    formData.append('category_id', category);
    formData.append('qtd', qtd);
    formData.append('cold', cold ? 1 : 0);
    formData.append('img', document.getElementById('productImg').files[0]);
    api.post(`products/update/product`, formData).then(res => {
      setSubmiting(false);
      handleCloseDialog();
      document.getElementById('productImg').value = "";
      let p = products;
      for(let i = 0; i < p.length; i++){
        if(p[i].id == product.id){
          p[i].name = res.data.product.name;
          p[i].price = res.data.product.price;
          p[i].promo_price = res.data.product.promocionalPrice;
          p[i].category_id = res.data.product.category;
          p[i].qtd = res.data.product.qtd;
          p[i].cold = res.data.product.cold;
          p[i].imgPath = res.data.product.imgPath;
        }
      }
      setProducts([...p]);
    })
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
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20, opacity: cold == 1 ? 1 : 0}}>
          <AcUnitIcon className={classes.coldIcon} />
          <Typography align="center" color="textPrimary">Gelada</Typography>
        </div>
        <Box
          display="flex"
          justifyContent="center"
          mb={3}
        >
          <img src={`https://api.dp.codenative.com.br/${product.imgPath}`} style={{maxWidth: 150, maxHeight: 150}}/>
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
          gutterBottom
          variant="h6"
        >
          {product.qtd} unidade{product.qtd > 1 ? 's' : ''}
        </Typography>
        <Typography
          align="center"
          color="textPrimary"
          variant="body1"
        >
          R${parseFloat(product.price).toFixed(2).replace('.', ',')}
        </Typography>
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
                  Salvar
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
                <img src={`https://api.dp.codenative.com.br/${product.imgPath}`} style={{height: 100, marginRight: 10}}/>
              </div>
              <div>
                <Typography>Foto do produto</Typography>
                <input type="file" id="productImg"/>
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
            <TextField type="number" id="standard-basic" label="Preço promocional (+10uni.)" defaultValue={promocionalPrice} onChange={(e) => setPromocionalPrice(e.target.value)} required/>
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField type="number" id="standard-basic" label="Estoque" defaultValue={qtd} onChange={(e) => setQtd(e.target.value)} required/>
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
          <FormControl>
            <FormControlLabel
              control={<Checkbox checked={cold} onChange={() => setCold(!cold)} name="gelada" />}
              label="Gelada"
            />
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
