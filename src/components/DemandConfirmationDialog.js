import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import {
  CircularProgress
} from '@material-ui/core';

const DemandConfirmationDialog = (props) => {

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'xs'}
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="max-width-dialog-title">Confirmar ação</DialogTitle>
      <DialogContent>
        <Typography>
          Você tem certeza que deseja 
          <strong>
            {
              {
                'accepted': ' aceitar ',
                'refused': ' recusar ',
                'delivered': ' marcar como entregue ',
              }[props.status]
            }
          </strong> 
          esse pedido?
        </Typography>

      </DialogContent>
      <DialogActions>
        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <Button onClick={props.handleClose} color="primary">
            Fechar
          </Button>

          <div>
            {
              props.loading ?
              <CircularProgress/>
              :
              <Button onClick={() => props.confirm(props.status)} color="primary" variant="contained">
                {
                  {
                    'accepted': 'Aceitar pedido',
                    'refused': 'Recusar pedido',
                    'delivered': 'Marcar como entregue',
                  }[props.status]
                }
              </Button>
            }
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default DemandConfirmationDialog;
