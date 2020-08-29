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
  CircularProgress
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import ProductDialog from '../../../components/ProductDialog';
import api from '../../../services/api';

const useStyles = makeStyles((theme) => ({
  margin: {
    marginBottom: theme.spacing(3),
  },
}));

const Toolbar = ({ className, categories, setProducts, products, ...rest }) => {
  const classes = useStyles();

  const [openDialog, setOpen] = useState(false);

  const handleClickOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [category, setCategory] = useState();
  const [submiting, setSubmiting] = useState(false);

  const submit = () => {
    let file = document.getElementById('file').files[0];

    if(name && price && category && file){
      setSubmiting(true);
      var formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('category_id', category);
      formData.append('img', file);
      api.post('products', formData).then(res => {
        setProducts([res.data.product, ...products]);
        handleCloseDialog();
        setSubmiting(false);
        setName("");
        setPrice("");
        setCategory("");
      });
    }
  };

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
        >
          NOVO PRODUTO
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
                placeholder="Search product"
                variant="outlined"
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
                <CircularProgress/>
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
            <input type="file" id="file" required/>
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField id="standard-basic" label="Nome do produto" onChange={(e) => setName(e.target.value)} required/>
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField type="number" id="standard-basic" label="Preço do produto" onChange={(e) => setPrice(e.target.value)} required/>
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
        </form>
      </ProductDialog>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
