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
import DeleteIcon from '@material-ui/icons/Delete';
import { Search as SearchIcon } from 'react-feather';
import ProductDialog from '../../../components/ProductDialog';
import Dialog from '../../../components/Dialog';
import api from '../../../services/api';

const useStyles = makeStyles((theme) => ({
  margin: {
    marginBottom: theme.spacing(3),
  },
  marginRight10: {
    marginRight: 10,
  }
}));

const Toolbar = ({ className, delivered, accepted, products, setNotPaidBills, notPaidBills, setTotalReceived, setTotalBills, setTotalBalcony, setTotalApp, setMonthPaidBills, ...rest }) => {
  const classes = useStyles();

  const [openDialog, setOpen] = useState(false);

  const [submiting, setSubmiting] = useState(false);

  const handleClickOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  /*
  const [saleType, setSaleType] = useState('balcony');

  const [clientName, setClientName] = useState();
  const [clientCEP, setClientCEP] = useState();
  const [clientNeighborhood, setClientNeighborhood] = useState();
  const [clientStreet, setClientStreet] = useState();
  const [clientNumber, setClientNumber] = useState();
  const [clientComplement, setClientComplement] = useState();
  */

  const [description, setDescription] = useState();
  const [value, setValue] = useState();
  const [due, setDue] = useState();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1); 

  const [selectedProducts, setSelectedProducts] = useState([]);

  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorDialogTitle, setErrorDialogTitle] = useState('');
  const [errorDialogMessage, setErrorDialogMessage] = useState('');

  const [viewType, setViewType] = useState('day');

  const handleClickOpenErrorDialog = () => {
    setOpenErrorDialog(true);
  };

  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false);
  };

  const submit = () => {
    if(description && value && due){
      setSubmiting(true);
      api.post('bills', {
        description,
        value,
        due
      }).then(res => {
        handleCloseDialog();
        setSubmiting(false);
        setNotPaidBills([...notPaidBills, res.data.bill]);
      }).catch(err => {
        console.log(err);
        setSubmiting(false);
      });
    }
  };

  const [month, setMonth] = useState();
  const [year, setYear] = useState();

  useEffect(() => {
    setStatsByMonth();
  }, [month, year]);

  function setStatsByMonth(){
    if(month && year){
      api.get(`finance/stats/${month}/${year}`).then(res => {
        setTotalReceived(res.data.totalReceived);
        setTotalBills(res.data.totalBills);
        setTotalBalcony(res.data.totalBalcony);
        setTotalApp(res.data.totalApp);
      });
  
      api.get(`bills/${month}/${year}`).then(res => {
        setMonthPaidBills(res.data.bills);
      });
    }
  }

  function setStatsByDate(date){
    api.get(`finance/stats/${date}`).then(res => {
      setTotalReceived(res.data.totalReceived);
      setTotalBills(res.data.totalBills);
      setTotalBalcony(res.data.totalBalcony);
      setTotalApp(res.data.totalApp);
    });

    var d = new Date(date);
    var month = d.getMonth();
    var year = d.getFullYear();
    api.get(`bills/${month + 1}/${year}`).then(res => {
      setMonthPaidBills(res.data.bills);
    });
  }

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="space-between"
      >
        <Button
          color="primary"
          variant="contained"
          onClick={handleClickOpenDialog}
        >
          INSERIR DESPESA
        </Button>
        <div>
          <TextField
            id="standard-select-currency"
            select
            defaultValue={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className={classes.marginRight10}
          >
            <MenuItem value={'day'}>
              Dia
            </MenuItem>
            <MenuItem value={'month'}>
              Mês
            </MenuItem>
          </TextField>


          {
            viewType == 'day' ?
            <TextField
              id="date"
              type="date"
              onChange={(e) => setStatsByDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            :
            <>
            <TextField
              id="standard-select-currency"
              select
              onChange={(e) => setMonth(e.target.value)}
              className={classes.marginRight10}
            >
              <MenuItem value={'1'}>
                Janeiro
              </MenuItem>
              <MenuItem value={'2'}>
                Fevereiro
              </MenuItem>
              <MenuItem value={'3'}>
                Março
              </MenuItem>
              <MenuItem value={'4'}>
                Abril
              </MenuItem>
              <MenuItem value={'5'}>
                Maio
              </MenuItem>
              <MenuItem value={'6'}>
                Junho
              </MenuItem>
              <MenuItem value={'7'}>
                Julho
              </MenuItem>
              <MenuItem value={'8'}>
                Agosto
              </MenuItem>
              <MenuItem value={'9'}>
                Setembro
              </MenuItem>
              <MenuItem value={'10'}>
                Outubro
              </MenuItem>
              <MenuItem value={'11'}>
                Novembro
              </MenuItem>
              <MenuItem value={'12'}>
                Dezembro
              </MenuItem>
            </TextField>
            <TextField
              id="standard-select-currency"
              select
              onChange={(e) => setYear(e.target.value)}
            >
              <MenuItem value={'2020'}>
                2020
              </MenuItem>
              <MenuItem value={'2021'}>
                2021
              </MenuItem>
              <MenuItem value={'2022'}>
                2022
              </MenuItem>
              <MenuItem value={'2023'}>
                2023
              </MenuItem>
              <MenuItem value={'2024'}>
                2024
              </MenuItem>
              <MenuItem value={'2025'}>
                2025
              </MenuItem>
              <MenuItem value={'2026'}>
                2026
              </MenuItem>
              <MenuItem value={'2027'}>
                2027
              </MenuItem>
              <MenuItem value={'2028'}>
                2028
              </MenuItem>
              <MenuItem value={'2029'}>
                2029
              </MenuItem>
              <MenuItem value={'2030'}>
                2030
              </MenuItem>
              <MenuItem value={'2031'}>
                2031
              </MenuItem>
            </TextField>
            </>
          }

          
        </div>
      </Box>

      <Dialog 
        open={openDialog} 
        handleClickOpen={handleClickOpenDialog} 
        handleClose={handleCloseDialog}
        title="Inserir despesa"
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
                Inserir
              </Button>
            }
          </>
        }
      >
        <form>
          <Grid container spacing={3}>
            <Grid item lg={12} sm={12} xl={12} xs={12}>
              <FormControl fullWidth className={classes.margin}>
                <TextField label="Descrição" helperText="Descriçao da despesa" onChange={(e) => setDescription(e.target.value)} required />
              </FormControl>
            </Grid>
            <Grid item lg={6} sm={12} xl={8} xs={12}>
              <FormControl fullWidth className={classes.margin}>
                <TextField label="Valor" helperText="Valor da despesa" onChange={(e) => setValue(e.target.value)} required />
              </FormControl>
            </Grid>
            <Grid item lg={6} sm={12} xl={8} xs={12}>
              <FormControl fullWidth className={classes.margin}>
                <TextField label="Vencimento" type="date" helperText="Data de vencimento" onChange={(e) => setDue(e.target.value)} required />
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </Dialog>
      
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
