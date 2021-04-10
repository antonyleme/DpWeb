import React, { useState, useEffect } from 'react';
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
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  TableHead,
  Paper,
  Table,
  Grid,
  IconButton,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteIcon from '@material-ui/icons/Delete';
import { Search as SearchIcon } from 'react-feather';
import ProductDialog from '../../../components/ProductDialog';
import Dialog from '../../../components/Dialog';
import api from '../../../services/api';
import cep from 'cep-promise';
import Select from 'react-select'
import Logo from '../../../assets/logo.png'

const useStyles = makeStyles((theme) => ({
  margin: {
    marginBottom: theme.spacing(3),
  },
}));

const Toolbar = ({ className, delivered, accepted, products, balcony, setBalcony, setAccepted, reloadProducts, ...rest }) => {
  const classes = useStyles();

  const [openDialog, setOpen] = useState(false);

  const [submiting, setSubmiting] = useState(false);

  const handleClickOpenDialog = () => {
    reloadProducts();
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const [saleType, setSaleType] = useState('balcony');

  const [paymentType, setPaymentType] = useState('balcony');
  const [clientName, setClientName] = useState();
  const [clientCEP, setClientCEP] = useState('');
  const [clientNeighborhood, setClientNeighborhood] = useState();
  const [clientStreet, setClientStreet] = useState();
  const [clientNumber, setClientNumber] = useState();
  const [clientComplement, setClientComplement] = useState();
  const [chargeFor, setChargeFor] = useState();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1); 

  const [selectedProducts, setSelectedProducts] = useState([]);

  const [insertedDemand, setInsertedDemand] = useState({});

  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorDialogTitle, setErrorDialogTitle] = useState('');
  const [errorDialogMessage, setErrorDialogMessage] = useState('');

  const [deliveryValue, setDeliveryValue] = useState(0);

  useEffect(() => {
    api.get('delivery-tax').then(res => {
      setDeliveryValue(res.data.tax);
    });
  })

  const handleClickOpenErrorDialog = () => {
    setOpenErrorDialog(true);
  };

  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false);
  };

  useEffect(() => {
    if(saleType == 'balcony'){
      setPaymentType('balcony');
    }
  }, [saleType])

  useEffect(() => {
    if(clientCEP.length >= 8){
      cep(clientCEP).then(res => {
        if(res){
          setClientNeighborhood(res.neighborhood);
          setClientStreet(res.street);
        }
      })
    }
  }, [clientCEP])

  useEffect(() => {
    if(paymentType == 'delivery-card')
      setChargeFor(null);
  }, [paymentType])

  const submit = () => {
    if(selectedProducts.length > 0){
      printDemand();
      setSubmiting(true);
      api.post('dashboard/store/demand', {
        items: selectedProducts,
        client_name: clientName,
        payment_type: paymentType,
        status: saleType == 'balcony' ? 'balcony' : 'accepted',
        cep: clientCEP,
        neighborhood: clientNeighborhood,
        street: clientStreet,
        number: clientNumber,
        complement: clientComplement,
        charge_for: chargeFor,
      }).then(res => {
        //printDiv();
        handleCloseDialog();
        setSubmiting(false);
        setSelectedProducts([]);
        if(saleType == 'balcony')
          setBalcony([...balcony, res.data.demand]);
        else
          setAccepted([...accepted, res.data.demand]);
        setInsertedDemand(res.data.demand);
        setClientCEP('');
        setClientComplement('');
        setClientName('');
        setClientNeighborhood('');
        setClientNumber('');
        setClientStreet('');
        setChargeFor('');
      }).catch(err => {
        console.log(err.response);
        if(err.response.data.error == 'out of qtd'){
            setErrorDialogTitle('Produto fora de estoque')
            setErrorDialogMessage(err.response.data.message);
            setOpenErrorDialog(true);
        }
        setSubmiting(false);
      });
    }
  };

  function changeProductSelect(id){
    const aux = products;
    let product = {};
    for(let i = 0; i < aux.length; i++){
      if(aux[i].id == id){
        product = aux[i];
      }
    }
    setSelectedProduct(product);
    setSelectedQuantity(1);
  }

  function selectProduct(){
    if(selectedProduct != null && selectedQuantity >= 0) {
      setSelectedProducts([...selectedProducts, {id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, promo_price: selectedProduct.promo_price, qtd: selectedQuantity}]);
    }
  }

  function removeProduct(index){
    let array = selectedProducts;
    array.splice(index, 1);
    setSelectedProducts([...array]);
  }

  function total(delivery = false){
    var total = 0.0;

    for(let i = 0; i < selectedProducts.length; i++){
      if(parseFloat(selectedProducts[i].qtd) >= 10){
        total += parseFloat(selectedProducts[i].promo_price) * parseFloat(selectedProducts[i].qtd);
      } else {
        total += parseFloat(selectedProducts[i].price) * parseFloat(selectedProducts[i].qtd);
      }
    }

    if(delivery)
      total += deliveryValue;

    return total.toFixed(2).toString().replace('.', ',');
  }

  function printDemand(){
    var mywindow = window.open('', 'new div', 'height=400,width=600');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('<style>.text-center{text-align:center}.ttu{text-transform:uppercase}.printer-ticket{display:table!important;width:100%;max-width:400px;font-weight:light;line-height:1.3em}.printer-ticket,.printer-ticket *{font-family:Tahoma,Geneva,sans-serif;font-size:10px}.printer-ticket td:nth-child(2),.printer-ticket th:nth-child(2){width:50px}.printer-ticket td:nth-child(3),.printer-ticket th:nth-child(3){width:90px;text-align:right}.printer-ticket th{font-weight:inherit;padding:10px 0;text-align:center;border-bottom:1px dashed #bcbcbc}.printer-ticket tbody tr:last-child td{padding-bottom:10px}.printer-ticket tfoot .sup td{padding:10px 0;border-top:1px dashed #bcbcbc}.printer-ticket tfoot .sup.p--0 td{padding-bottom:0}.printer-ticket .title{font-size:1.5em;padding:15px 0}.printer-ticket .top td{padding-top:10px}.printer-ticket .last td{padding-bottom:10px}</style>');
    mywindow.document.write('</head><body>');
    mywindow.document.write(document.getElementById('cupom-fiscal').innerHTML);
    mywindow.document.write('</body></html>');
    mywindow.document.close();
    mywindow.focus();
    setTimeout(function(){mywindow.print();},1000);

    return true;
  }

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <div style={{display: 'none'}}>
          <div id="cupom-fiscal">
            <table class="printer-ticket">
              <thead>
                <tr>
                    <th class="title" colspan="3"><img src={Logo} style={{maxWidth: 150}}/></th>
                </tr>
                <tr>
                    <th colspan="3">{new Date().toLocaleDateString('pt-br')}</th>
                </tr>
                {
                  clientName &&
                  <tr>
                      <th colspan="3">
                          {clientName}
                      </th>
                  </tr>
                }
                <tr>
                    <th class="ttu" colspan="3">
                        <b>Cupom não fiscal</b>
                    </th>
                </tr>
              </thead>
              <tbody>
                <tr class="sup ttu p--0">
                    <td colspan="3">
                        <b>Produtos</b>
                    </td>
                </tr>
                {
                  selectedProducts.map((product, index) => (
                    <>
                      <tr class="top">
                          <td colspan="3">{product.name}</td>
                      </tr>
                      <tr>
                          <td>R${product.qtd >= 10 ? product.promo_price.toFixed(2).toString().replace('.', ',') : product.price.toFixed(2).toString().replace('.', ',')}</td>
                          <td>{product.qtd}</td>
                          <td>R${product.qtd >= 10 ? (product.qtd * product.promo_price).toFixed(2).toString().replace('.', ',') : (product.qtd * product.price).toFixed(2).toString().replace('.', ',')}</td>
                      </tr>
                    </>
                  ))
                }
              </tbody>
              <tfoot>
                {
                  clientNeighborhood &&
                  <>
                  <tr class="sup p--0">
                      <td colspan="3">
                          <b>Endereço</b>
                      </td>
                  </tr>
                  <tr class="ttu"><td>{clientNeighborhood}, {clientStreet}, {clientNumber} {clientComplement ? ',' + clientComplement : ''}</td></tr>
                  </>
                }
                {
                  paymentType &&
                  <>
                  <tr class="sup p--0">
                      <td colspan="3">
                          <b>Pagamento</b>
                      </td>
                  </tr>
                  <tr class="ttu">
                    <td>
                      {{
                        'delivery': 'Dinheiro',
                        'delivery-card': 'Cartão'
                      }[paymentType]}
                    </td>
                  </tr>
                  </>
                }
                {
                  (chargeFor != null && paymentType == 'delivery') &&
                  <>
                  <tr class="sup p--0">
                      <td colspan="3">
                          <b>Troco para</b>
                      </td>
                  </tr>
                  <tr class="ttu"><td>R${parseFloat(chargeFor.replace(',', '.')).toFixed(2).replace('.', ',')}</td></tr>
                  </>
                }
                {
                  saleType != 'balcony' &&
                  
                  <tr class="sup ttu p--0">
                    <td colspan="2">
                        <b>Entrega</b>
                    </td>
                    <td align="right">
                        R${parseFloat(deliveryValue).toFixed(2).replace('.', ',')}
                    </td>
                </tr>
                }
                <tr class="sup ttu p--0">
                    <td colspan="3">
                        <b>Totais</b>
                    </td>
                </tr>
                <tr class="ttu">
                    <td colspan="2">Total</td>
                    <td align="right">R${total(saleType != 'balcony')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button
          color="primary"
          variant="contained"
          onClick={handleClickOpenDialog}
        >
          INSERIR VENDA
        </Button>
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
            <TextField
              id="standard-select-currency"
              select
              label="Tipo de venda"
              helperText="Selecione se a venda é no balcão ou delivery"
              onChange={(e) => setSaleType(e.target.value)}
              value={saleType}
              required
            >
              <MenuItem value={'balcony'}>
                Balcão
              </MenuItem>
              <MenuItem value={'delivery'}>
                Delivery
              </MenuItem>
            </TextField>
          </FormControl>

          {
            saleType == 'delivery' &&
            <>

              <Grid container spacing={3}>
                <Grid item xl={12} lg={12} sm={12} xs={12}>
                  <FormControl fullWidth className={classes.margin}>
                    <TextField
                      id="standard-select-currency"
                      select
                      label="Pagamento"
                      helperText="Dinheiro ou cartão"
                      onChange={(e) => setPaymentType(e.target.value)}
                      value={paymentType}
                      required
                    >
                      <MenuItem value={'delivery'}>
                        Dinheiro
                      </MenuItem>
                      <MenuItem value={'delivery-card'}>
                        Cartão
                      </MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
                {
                  paymentType === 'delivery' &&
                  <Grid item xl={12} lg={12} sm={12} xs={12}>
                    <FormControl fullWidth className={classes.margin}>
                      <TextField id="charge-for" label="Troco para" onChange={(e) => setChargeFor(e.target.value)} value={chargeFor}/>
                    </FormControl>
                  </Grid>
                }
                {
                  /*
                  paymentType === 'delivery-card' &&
                  <Grid item xl={12} lg={12} sm={12} xs={12}>
                    <FormControl fullWidth className={classes.margin}>
                      <TextField
                        id="standard-select-currency"
                        select
                        label="Maquininha"
                        helperText="Bandeira maquininha"
                        onChange={(e) => setPaymentType(e.target.value)}
                        value={paymentType}
                        required
                      >
                        <MenuItem value={'alelo'}>
                          Alelo
                        </MenuItem>
                      </TextField>
                    </FormControl>
                  </Grid>
                  */
                }
                <Grid item xl={12} lg={12} sm={12} xs={12}>
                  <FormControl fullWidth className={classes.margin}>
                    <TextField id="standard-basic" label="Nome do cliente" onChange={(e) => setClientName(e.target.value)} value={clientName} required/>
                  </FormControl>
                </Grid>
                <Grid item xl={4} lg={4} sm={12} xs={12}>
                  <FormControl fullWidth className={classes.margin}>
                    <TextField id="standard-basic" label="CEP" onChange={(e) => setClientCEP(e.target.value)} value={clientCEP} required/>
                  </FormControl>
                </Grid>
                <Grid item xl={8} lg={8} sm={12} xs={12}>
                  <FormControl fullWidth className={classes.margin}>
                    <TextField id="standard-basic" label="Bairro" onChange={(e) => setClientNeighborhood(e.target.value)} value={clientNeighborhood} required/>
                  </FormControl>
                </Grid>
                <Grid item xl={7} lg={7} sm={12} xs={12}>
                  <FormControl fullWidth className={classes.margin}>
                    <TextField id="standard-basic" label="Rua" onChange={(e) => setClientStreet(e.target.value)} value={clientStreet} required/>
                  </FormControl>
                </Grid>
                <Grid item xl={2} lg={2} sm={12} xs={12}>
                  <FormControl fullWidth className={classes.margin}>
                    <TextField id="standard-basic" label="Número" onChange={(e) => setClientNumber(e.target.value)} value={clientNumber} required/>
                  </FormControl>
                </Grid>
                <Grid item xl={3} lg={3} sm={12} xs={12}>
                  <FormControl fullWidth className={classes.margin}>
                    <TextField id="standard-basic" label="Complemento" onChange={(e) => setClientComplement(e.target.value)} value={clientComplement}/>
                  </FormControl>
                </Grid>
              </Grid>
              
            </>
          }

          <Grid container spacing={3}>
            <Grid item lg={6} sm={12} xl={8} xs={12}>
              <FormControl fullWidth className={classes.margin}>
              <Autocomplete
                options={products}
                getOptionLabel={(product) => `${product.name} (R$${product.price.toFixed(2).toString().replace('.', ',')}) (${product.qtd}uni.)`}
                id="products"
                autoHighlight
                renderInput={(params) => <TextField {...params} label="Produto*" />}
                onChange={(event, newValue) => {
                  if(newValue)
                    changeProductSelect(newValue.id);
                }}
              />
              {
                /*
                <TextField
                  id="standard-select-currency"
                  select
                  label="Produto"
                  helperText="Selecione um produto"
                  onChange={(e) => changeProductSelect(e.target.value)}
                  required={selectedProducts.length == 0}
                >
                  {
                    products.map((product, index) => (
                      product.qtd > 0 &&
                      <MenuItem value={index}>
                        {product.name} (R${product.price.toFixed(2).toString().replace('.', ',')}) ({product.qtd}uni.)
                      </MenuItem>
                    ))
                  }
                </TextField>
                */
              }
              </FormControl>
            </Grid>
            <Grid item lg={3} sm={12} xl={3} xs={12}>
              <FormControl fullWidth className={classes.margin}>
                <TextField disabled={!selectedProduct} InputProps={{ inputProps: selectedProduct ? { max: selectedProduct.qtd } : {} }} type="number" id="standard-basic" label="Quantidade" onChange={(e) => setSelectedQuantity(e.target.value)} value={selectedQuantity}/>
              </FormControl>
            </Grid>
            <Grid item lg={3} sm={12} xl={3} xs={12}>
              <Button color="primary" variant="contained" onClick={selectProduct} style={{marginTop: 20}}>
                INSERIR
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper} style={{marginTop: 20, marginBottom: 20}}>
            <Table aria-label="simple table" id="products-table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">#</TableCell>
                  <TableCell align="center">Produto</TableCell>
                  <TableCell align="center">Quantidade</TableCell>
                  <TableCell align="center">Valor unidade</TableCell>
                  <TableCell align="center">Valor total</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  selectedProducts.map((product, index) => (
                    <TableRow>
                      <TableCell component="th" scope="row" align="center"> {index + 1} </TableCell>
                      <TableCell align="center">{product.name}</TableCell>
                      <TableCell align="center">{product.qtd}</TableCell>
                      <TableCell align="center">
                        R${product.qtd >= 10 ? product.promo_price.toFixed(2).toString().replace('.', ',') : product.price.toFixed(2).toString().replace('.', ',')}
                      </TableCell>
                      <TableCell align="center">R${product.qtd >= 10 ? (product.qtd * product.promo_price).toFixed(2).toString().replace('.', ',') : (product.qtd * product.price).toFixed(2).toString().replace('.', ',')}</TableCell>
                      <TableCell align="center">
                        <IconButton aria-label="delete" onClick={() => removeProduct(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>

          <div>
            <Typography style={{textAlign: 'right', marginLeft: 'auto'}}>
              Total da venda: <br/><span style={{fontSize: 30, fontWeight: 'bold'}}>R${total()}</span>
            </Typography>
          </div>
        </form>
      </ProductDialog>
      
      <Dialog 
        open={openErrorDialog} 
        handleClickOpen={handleClickOpenErrorDialog} 
        handleClose={handleCloseErrorDialog}
        size="xs"
        title={errorDialogTitle}
        actions={
          <>
            <Button onClick={handleCloseErrorDialog} color="primary">
              Fechar
            </Button>
          </>
        }
      >
        <Typography>{errorDialogMessage}</Typography>
      </Dialog>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
