import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import {
  Grid
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import api from '../services/api';
import ConfirmationDialog from './DemandConfirmationDialog';

const DemandDialog = (props) => {

  const [openConfirmationDialog, setOpenConfirmation] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState();

  const [loading, setLoading] = useState(false);

  function confirmation(status){
    setOpenConfirmation(true);
    setConfirmationStatus(status);
  }

  function closeConfirmation(){
    setOpenConfirmation(false);
  }

  function updateStatus(status){
    setLoading(true);
    api.put(`dashboard/demands/${props.demand.id}/${status}`).then(res => {
      props.updateStatus(res.data.demand);
      props.handleClose();
      closeConfirmation();
      setLoading(false);
      if(status == 'accepted'){
        printDemand();
      }
    });
  }

  function totalValue(){
    if(props.demand){
      let total = 0;
      for(let i = 0; i < props.demand.products.length; i++){
        if(parseFloat(props.demand.products[i].pivot.qtd) >= 10){
          total += parseFloat(props.demand.products[i].pivot.promo_price) * parseFloat(props.demand.products[i].pivot.qtd);
        } else {
          total += parseFloat(props.demand.products[i].pivot.price) * parseFloat(props.demand.products[i].pivot.qtd);
        }
      }
      return (total + props.deliveryTax).toFixed(2).toString().replace('.', ',');
    }
  }

  function printDemand(){
    var mywindow = window.open('', 'new div', 'height=400,width=600');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('<style>.text-center{text-align:center}.ttu{text-transform:uppercase}.printer-ticket{display:table!important;width:100%;max-width:400px;font-weight:light;line-height:1.3em}.printer-ticket,.printer-ticket *{font-family:Tahoma,Geneva,sans-serif;font-size:10px}.printer-ticket td:nth-child(2),.printer-ticket th:nth-child(2){width:50px}.printer-ticket td:nth-child(3),.printer-ticket th:nth-child(3){width:90px;text-align:right}.printer-ticket th{font-weight:inherit;padding:10px 0;text-align:center;border-bottom:1px dashed #bcbcbc}.printer-ticket tbody tr:last-child td{padding-bottom:10px}.printer-ticket tfoot .sup td{padding:10px 0;border-top:1px dashed #bcbcbc}.printer-ticket tfoot .sup.p--0 td{padding-bottom:0}.printer-ticket .title{font-size:1.5em;padding:15px 0}.printer-ticket .top td{padding-top:10px}.printer-ticket .last td{padding-bottom:10px}</style>');
    mywindow.document.write('</head><body>');
    mywindow.document.write(document.getElementById('cupom-fiscal-' + props.demand.id).innerHTML);
    mywindow.document.write('</body></html>');
    mywindow.document.close();
    mywindow.focus();
    setTimeout(function(){mywindow.print();},1000);

    return true;
  }

  return (
    props.demand &&
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="max-width-dialog-title">Pedido #{props.demand.id}</DialogTitle>
      <DialogContent>

        <div style={{display: 'none'}}>
          <div id={'cupom-fiscal-' + props.demand.id}>
            <table class="printer-ticket">
              <thead>
                <tr>
                    <th class="title" colspan="3">DEPÓSITO DE PÃES EMPÓRIO</th>
                </tr>
                <tr>
                    <th colspan="3">{new Date().toLocaleDateString('pt-br')}</th>
                </tr>
                {
                  props.demand.user &&
                  <tr>
                      <th colspan="3">
                          {props.demand.user.name}
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
                  props.demand.products.map(product => (
                    <>
                    <tr class="top">
                        <td colspan="3">{product.name}</td>
                    </tr>
                    <tr>
                        <td>R${product.pivot.qtd >= 10 ? product.pivot.promo_price.toFixed(2).toString().replace('.', ',') : product.pivot.price.toFixed(2).toString().replace('.', ',')}</td>
                        <td>{product.pivot.qtd}</td>
                        <td>R${product.pivot.qtd >= 10 ? (product.pivot.qtd * product.pivot.promo_price).toFixed(2).toString().replace('.', ',') : (product.pivot.qtd * product.pivot.price).toFixed(2).toString().replace('.', ',')}</td>
                    </tr>
                    </>
                  ))
                }
                <tr class="top">
                    <td colspan="3">Taxa de entrega</td>
                </tr>
                <tr>
                    <td>R${props.deliveryTax.toFixed(2).toString().replace('.', ',')}</td>
                    <td>-</td>
                    <td>R${props.deliveryTax.toFixed(2).toString().replace('.', ',')}</td>
                </tr>
              </tbody>
              <tfoot>
                {
                  props.demand.neighborhood &&
                  <>
                  <tr class="sup p--0">
                      <td colspan="3">
                          <b>Endereço</b>
                      </td>
                  </tr>
                  <tr class="ttu"><td>{props.demand.neighborhood}, {props.demand.street}, {props.demand.number} {props.demand.complement ? ',' + props.demand.complement : ''}</td></tr>
                  </>
                }

                <tr class="sup ttu p--0">
                    <td colspan="3">
                        <b>Totais</b>
                    </td>
                </tr>
                <tr class="ttu">
                    <td colspan="2">Total</td>
                    <td align="right">R${totalValue()}</td>
                </tr>
                <tr class="sup ttu p--0">
                    <td colspan="3">
                        <b>Pagamento</b>
                    </td>
                </tr>
                <tr class="ttu">
                    <td colspan="2">
                    {
                      {
                        'app': 'No aplicativo',
                        'delivery': 'Na entrega',
                        'balcony': 'No balcão',
                        'delivery-card': 'Na entrega',
                      }[props.demand.payment_type]
                    }
                    </td>
                    <td align="right">R${totalValue()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        {
          props.demand.status != 'balcony' &&
          <Grid container spacing={3} style={{overflowY: 'hidden'}}>
            <Grid item xs={12}>
              <div style={{marginBottom: 15}}>
                <InputLabel>
                  Nome
                </InputLabel>
                <Typography>
                  {props.demand.user.name}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div style={{marginBottom: 15}}>
                <InputLabel>
                  Celular
                </InputLabel>
                <Typography>
                  {props.demand.user.tel}
                </Typography>
              </div>
            </Grid>
  
            <Grid item xs={3}>
              <div style={{marginBottom: 15}}>
                <InputLabel>
                  Bairro
                </InputLabel>
                <Typography>
                  {props.demand.neighborhood}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={9}>
              <div style={{marginBottom: 15}}>
                <InputLabel>
                  Rua
                </InputLabel>
                <Typography>
                  {props.demand.street}
                </Typography>
              </div>
            </Grid>
            <Grid item sm={3} xs={12}>
              <div style={{marginBottom: 15}}>
                <InputLabel>
                  Número
                </InputLabel>
                <Typography>
                  {props.demand.number}
                </Typography>
              </div>
            </Grid>
            <Grid item sm={3} xs={12}>
              <div style={{marginBottom: 15}}>
                <InputLabel>
                  Complemento
                </InputLabel>
                <Typography>
                  {
                    props.demand.complement ?
                    props.demand.complement
                    :
                    'Não se aplica'
                  }
                </Typography>
              </div>
            </Grid>
          </Grid>
        }

        <Grid container spacing={3} style={{overflowY: 'hidden'}}>
          <Grid item lg={3} xs={12}>
            <div style={{marginBottom: 15}}>
              <InputLabel>
                Valor total
              </InputLabel>
              <Typography>
                R${totalValue().toString().replace('.', ',')}
              </Typography>
            </div>
          </Grid>
          <Grid item lg={4} xs={12}>
            <div style={{marginBottom: 15}}>
              <InputLabel>
                Forma de pagamento
              </InputLabel>
              <Typography>
                {
                  {
                    'app': 'No aplicativo',
                    'delivery': 'Na entrega',
                    'balcony': 'No balcão'
                  }[props.demand.payment_type]
                }
              </Typography>
            </div>
          </Grid>

          {
            props.demand.status != 'balcony' &&
            <>
              <Grid item lg={3} xs={12}>
                <div style={{marginBottom: 15}}>
                  <InputLabel>
                    Troco para
                  </InputLabel>
                  <Typography>
                    {
                      props.demand.charge_for ?
                      `R${props.demand.charge_for.toString().replace('.', ',')}`
                      :
                      'Não se aplica'
                    }
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div style={{marginBottom: 15}}>
                  <InputLabel>
                    Observações
                  </InputLabel>
                  <Typography>
                    {props.demand.observations ? props.demand.observations : 'Nenhuma observação feita'}
                  </Typography>
                </div>
              </Grid>
            </>
          }
        </Grid>

        <TableContainer component={Paper} style={{marginTop: 20, marginBottom: 20}}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Produto</TableCell>
                <TableCell align="center">Quantidade</TableCell>
                <TableCell align="center">Valor unidade</TableCell>
                <TableCell align="center">Valor total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                props.demand.products.map((product, index) => (
                  <TableRow>
                    <TableCell component="th" scope="row" align="center"> {index + 1} </TableCell>
                    <TableCell align="center">{product.name}</TableCell>
                    <TableCell align="center">{product.pivot.qtd}</TableCell>
                    <TableCell align="center">R${product.pivot.qtd >= 10 ? product.pivot.promo_price.toFixed(2).toString().replace('.', ',') : product.pivot.price.toFixed(2).toString().replace('.', ',')}</TableCell>
                    <TableCell align="center">R${product.pivot.qtd >= 10 ? (product.pivot.qtd * product.pivot.promo_price).toFixed(2).toString().replace('.', ',') : (product.pivot.qtd * product.pivot.price).toFixed(2).toString().replace('.', ',')}</TableCell>
                  </TableRow>
                ))
              }
              <TableRow>
                <TableCell component="th" scope="row" align="center"> - </TableCell>
                <TableCell align="center">Taxa de entrega</TableCell>
                <TableCell align="center"> </TableCell>
                <TableCell align="center">R${props.deliveryTax.toFixed(2).toString().replace('.', ',')}</TableCell>
                <TableCell align="center">R${props.deliveryTax.toFixed(2).toString().replace('.', ',')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

      </DialogContent>
      <DialogActions>
        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Button onClick={props.handleClose} color="primary">
            Fechar
          </Button>

          {
            {
              'received': 
                <div>
                  <Button onClick={() => confirmation('refused')} color="primary">
                    Recusar pedido
                  </Button>
                  <Button onClick={() => confirmation('accepted')} color="primary" variant="contained">
                    Aceitar pedido
                  </Button>
                </div>,
              'accepted': 
                <div>
                  <Button onClick={() => confirmation('delivered')} color="primary" variant="contained">
                    Pedido entregue
                  </Button>
                </div>,
            }[props.status]
          }
        </div>
      </DialogActions>

      <ConfirmationDialog open={openConfirmationDialog} handleClose={closeConfirmation} status={confirmationStatus} confirm={updateStatus} loading={loading}/>
    </Dialog>
  );
};

export default DemandDialog;
