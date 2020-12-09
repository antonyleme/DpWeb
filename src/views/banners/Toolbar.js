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
import Dialog from '../../components/Dialog';
import api from '../../services/api';

const useStyles = makeStyles((theme) => ({
  margin: {
    marginBottom: theme.spacing(3),
  },
}));

const Toolbar = ({ className, setBanners, banners, ...rest }) => {
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
  const [cold, setCold] = useState(false);

  const submit = () => {
    let file = document.getElementById('file').files[0];

    if(file){
      setSubmiting(true);
      var formData = new FormData();
      formData.append('img', file);
      api.post('banners', formData).then(res => {
        setBanners([res.data.banner, ...banners]);
        handleCloseDialog();
        setSubmiting(false);
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
          NOVO BANNER
        </Button>
      </Box>

      <Dialog 
        open={openDialog} 
        handleClickOpen={handleClickOpenDialog} 
        handleClose={handleCloseDialog}
        size="xs"
        title={'NOVO BANNER'}
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
            <Typography>Banner</Typography>
            <input type="file" id="file" required/>
          </FormControl>
        </form>
      </Dialog>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
