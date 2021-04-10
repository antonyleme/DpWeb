import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles,
  FormControl,
  MenuItem,
  Typography,
  Menu,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import ProductDialog from '../../../components/ProductDialog';
import api from '../../../services/api';

const useStyles = makeStyles((theme) => ({
  margin: {
    marginBottom: theme.spacing(3),
  },
}));

const Toolbar = ({ className, categories, setProducts, products, searchTerm, setSearchTerm, ...rest }) => {
  const classes = useStyles();

  const [openDialog, setOpen] = useState(false);

  const handleClickOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const [openDialogQtd, setOpenQtd] = useState(false);

  const handleClickOpenDialogQtd = () => {
    setOpenQtd(true);
  };

  const handleCloseDialogQtd = () => {
    setOpenQtd(false);
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductQtd, setSelectedProductQtd] = useState('');

  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [promocionalPrice, setPromocionalPrice] = useState();
  const [category, setCategory] = useState();
  const [submiting, setSubmiting] = useState(false);
  const [cold, setCold] = useState(false);
  const [qtd, setQtd] = useState();

  const submit = () => {
    let file = document.getElementById('file').files[0];

    if (name && price && category && file) {
      setSubmiting(true);
      var formData = new FormData();
      formData.append('name', name);
      formData.append('price', parseFloat(price.toString().replace(',', '.')));
      formData.append('promo_price', parseFloat(promocionalPrice.toString().replace(',', '.')));
      formData.append('category_id', category);
      formData.append('img', file);
      formData.append('cold', cold ? 1 : 0);
      formData.append('qtd', qtd);
      api.post('products', formData).then(res => {
        setProducts([res.data.product, ...products]);
        handleCloseDialog();
        setSubmiting(false);
        setName("");
        setPrice("");
        setCategory("");
        setCold(false);
        setQtd("");
      });
    }
  };

  const updateQtd = () => {
    if (selectedProduct && selectedProductQtd) {
      setSubmiting(true);
      api.put(`products/entry/${selectedProduct}`, {
        qtd: selectedProductQtd,
      }).then(res => {
        handleCloseDialogQtd();
        setSubmiting(false);
        setSelectedProductQtd('');
      });
    }
  }

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button
          color="primary"
          variant="contained"
          onClick={handleClickOpenDialog}
          style={{ marginRight: 10 }}
        >
          NOVO PRODUTO
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleClickOpenDialogQtd}
        >
          NOVA ENTRADA
        </Button>
      </Box>

      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Pesquisar produto"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      <ProductDialog
        open={openDialog}
        handleClickOpen={handleClickOpenDialog}
        handleClose={handleCloseDialog}
        actions={
          <>
            <Button onClick={handleCloseDialog} color="primary">
              Fechar
            </Button>
            {
              submiting ?
                <CircularProgress />
                :
                <Button onClick={submit} color="primary" variant="contained">
                  Cadastrar
              </Button>
            }
          </>
        }
      >
        <form>
          <FormControl fullWidth className={classes.margin}>
            <Typography>Foto do produto</Typography>
            <input type="file" id="file" required />
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField id="standard-basic" label="Nome do produto" onChange={(e) => setName(e.target.value)} required />
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField type="number" id="standard-basic" label="Preço do produto" onChange={(e) => setPrice(e.target.value)} required />
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField type="number" id="standard-basic" label="Preço promocional (+10uni.)" onChange={(e) => setPromocionalPrice(e.target.value)} required />
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField type="number" id="standard-basic" label="Estoque" onChange={(e) => setQtd(e.target.value)} required />
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField
              id="standard-select-currency"
              select
              label="Categoria"
              helperText="Selecione a categoria do produto"
              onChange={(e) => setCategory(e.target.value)}
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

      <ProductDialog
        open={openDialogQtd}
        handleClickOpen={handleClickOpenDialogQtd}
        handleClose={handleCloseDialogQtd}
        actions={
          <>
            <Button onClick={handleCloseDialogQtd} color="primary">
              Fechar
            </Button>
            {
              submiting ?
                <CircularProgress />
                :
                <Button onClick={updateQtd} color="primary" variant="contained">
                  Registrar
              </Button>
            }
          </>
        }
      >
        <form>
          <FormControl fullWidth className={classes.margin}>
            <TextField
              id="standard-select-currency"
              select
              label="Produto"
              helperText="Seleciono produto"
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
            >
              {
                products.map(product => (
                  <MenuItem value={product.id}>
                    {product.name} ({parseFloat(product.price).toFixed(2).toString().replace('.', ',')})
                  </MenuItem>
                ))
              }
            </TextField>
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField type="number" id="standard-basic" label="Quantidade" value={selectedProductQtd} onChange={(e) => setSelectedProductQtd(e.target.value)} required />
          </FormControl>
        </form>
      </ProductDialog>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
