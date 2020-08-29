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

const DemandDialog = (props) => {
  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="max-width-dialog-title">Pedido</DialogTitle>
      <DialogContent>
        
        <Grid container spacing={3} style={{overflowY: 'hidden'}}>
          <Grid item xs={12}>
            <div style={{marginBottom: 15}}>
              <InputLabel>
                Nome
              </InputLabel>
              <Typography>
                Antony Leme
              </Typography>
            </div>
          </Grid>

          <Grid item xs={3}>
            <div style={{marginBottom: 15}}>
              <InputLabel>
                Bairro
              </InputLabel>
              <Typography>
                Taquara Preta
              </Typography>
            </div>
          </Grid>
          <Grid item xs={9}>
            <div style={{marginBottom: 15}}>
              <InputLabel>
                Rua
              </InputLabel>
              <Typography>
                Rua Governador Francelino Pereira dos Santos
              </Typography>
            </div>
          </Grid>
          <Grid item lg={3} xs={12}>
            <div style={{marginBottom: 15}}>
              <InputLabel>
                Número
              </InputLabel>
              <Typography>
                15
              </Typography>
            </div>
          </Grid>
          <Grid item lg={3} xs={12}>
            <div style={{marginBottom: 15}}>
              <InputLabel>
                Complemento
              </InputLabel>
              <Typography>
                Apto 305
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
                Em dinheiro
              </Typography>
            </div>
          </Grid>
          <Grid item lg={3} xs={12}>
            <div style={{marginBottom: 15}}>
              <InputLabel>
                Troco para
              </InputLabel>
              <Typography>
                R$50,00
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
                <TableCell align="center">Valor total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row" align="center"> 1 </TableCell>
                <TableCell align="center">Cerveja 600ml apenas líquido</TableCell>
                <TableCell align="center">2</TableCell>
                <TableCell align="center">R$8,99</TableCell>
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
          <div>
            <Button onClick={props.handleClose} color="primary">
              Recusar pedido
            </Button>
            <Button onClick={props.handleClose} color="primary" variant="contained">
              Aceitar pedido
            </Button>
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default DemandDialog;
