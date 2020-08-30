import React, { useState } from 'react';
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

  function confirmation(status){
    setOpenConfirmation(true);
    setConfirmationStatus(status);
  }

  function closeConfirmation(){
    setOpenConfirmation(false);
  }

  function updateStatus(status){
    api.put(`dashboard/demands/${props.demand.id}/${status}`).then(res => {
      props.updateStatus(res.data.demand);
        props.handleClose();
        closeConfirmation();
    });
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

        <Grid container spacing={3} style={{overflowY: 'hidden'}}>
          <Grid item lg={3} xs={12}>
            <div style={{marginBottom: 15}}>
              <InputLabel>
                Valor total
              </InputLabel>
              <Typography>
                R$34,00
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
                    'delivery': 'Na entrega'
                  }[props.demand.payment_type]
                }
              </Typography>
            </div>
          </Grid>
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
        </Grid>

        <TableContainer component={Paper} style={{marginTop: 20, marginBottom: 20}}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Produto</TableCell>
                <TableCell align="center">Quantidade</TableCell>
                <TableCell align="center">Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                props.demand.products.map((product, index) => (
                  <TableRow>
                    <TableCell component="th" scope="row" align="center"> {index + 1} </TableCell>
                    <TableCell align="center">{product.name}</TableCell>
                    <TableCell align="center">{product.pivot.qtd}</TableCell>
                    <TableCell align="center">R${product.pivot.price}</TableCell>
                  </TableRow>
                ))
              }
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

      <ConfirmationDialog open={openConfirmationDialog} handleClose={closeConfirmation} status={confirmationStatus} confirm={updateStatus}/>
    </Dialog>
  );
};

export default DemandDialog;
