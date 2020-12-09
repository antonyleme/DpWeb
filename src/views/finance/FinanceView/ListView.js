import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DoneIcon from '@material-ui/icons/Done';
import DemandDialog from '../../../components/DemandDialog';
import api from '../../../services/api';

const useStyles = makeStyles(({
  root: {
    height: '100%'
  },
  image: {
    height: 48,
    width: 48
  }
}));

const Bills = ({ bills, setNotPaidBills, setMonthPaidBills, monthPaidBills, className, title, ...rest }) => {
  const classes = useStyles();

  const handleSetBillPaid = (bill) => {
    api.put(`bills/${bill.id}`).then(res => {
      setMonthPaidBills([...monthPaidBills, res.data.bill]);
      setNotPaidBills(bills.filter(b => b.id != bill.id));
    });
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        title={title}
      />
      <Divider />
      <List>
        {bills.map((bill, i) => (
          <ListItem
            divider={i < bills.length - 1}
            key={bill.id}
          >
            <ListItemText
              primary={`${bill.description} (R$${parseFloat(bill.value).toFixed(2).replace('.', ',')})`}
              secondary={bill.due && `Vencimento em ${bill.due}`}
            />

            {
              !bill.paid &&
              <Button
                color="primary"
                endIcon={<DoneIcon />}
                size="small"
                variant="contained"
                onClick={() => handleSetBillPaid(bill)}
              >
                Marcar como pago
              </Button>
            }
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
      </Box>

    </Card>
  );
};

Bills.propTypes = {
  className: PropTypes.string
};

export default Bills;
