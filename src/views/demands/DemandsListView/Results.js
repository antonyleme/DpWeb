import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  Button
} from '@material-ui/core';
import getInitials from 'src/utils/getInitials';
import DemandDialog from '../../../components/DemandDialog';
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, demands, ...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const [open, setOpen] = useState(false);
  function handleClickOpenDialog(demand){
    selectDemand(demand);
    setOpen(true);
  }
  function handleClose(){
    setOpen(false);
  }
  const [selectedDemand, selectDemand] = useState(null);

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = demands.map((demand) => demand.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  ID
                </TableCell>
                <TableCell>
                  Nome
                </TableCell>
                <TableCell>
                  Endereço
                </TableCell>
                <TableCell>
                  Celular
                </TableCell>
                <TableCell>
                  Data
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {demands.slice(0, limit).map((demand) => (
                <TableRow
                  hover
                  key={demand.id}
                  selected={selectedCustomerIds.indexOf(demand.id) !== -1}
                >
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        #{demand.id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {demand.user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {demand.street + ', ' + demand.number + ', ' + (demand.complement ? demand.complement + ', ' : '') + demand.neighborhood}
                  </TableCell>
                  <TableCell>
                    {demand.user.tel}
                  </TableCell>
                  <TableCell>
                    {moment(demand.created_at).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      endIcon={<VisibilityIcon />}
                      size="small"
                      variant="contained"
                      onClick={() => handleClickOpenDialog(demand)}
                    >
                      Visualizar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>

      <DemandDialog open={open} demand={selectedDemand} handleClose={handleClose}/>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  demands: PropTypes.array.isRequired
};

export default Results;
