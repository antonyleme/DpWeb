import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const GenericDialog = (props) => {
  return (
    <Dialog
      fullWidth={true}
      maxWidth={props.size}
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="max-width-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
          {props.children}
      </DialogContent>
      <DialogActions>
        {props.actions}
      </DialogActions>
    </Dialog>
  );
};

export default GenericDialog;
