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
import VisibilityIcon from '@material-ui/icons/Visibility';
import DemandDialog from '../../../components/DemandDialog';

const useStyles = makeStyles(({
  root: {
    height: '100%'
  },
  image: {
    height: 48,
    width: 48
  }
}));

const Demands = ({ updateStatus, demands, className, title, status, deliveryTax, ...rest }) => {
  const classes = useStyles();

  const [openDialog, setOpen] = useState(false);
  const [openDemand, setOpenDemand] = useState(false);

  const handleClickOpenDialog = (demand) => {
    setOpen(true);
    setOpenDemand(demand);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        subtitle={`${demands.length} in total`}
        title={title}
      />
      <Divider />
      <List>
        {demands.map((demand, i) => (
          <ListItem
            divider={i < demands.length - 1}
            key={demand.id}
          >
            <ListItemText
              primary={`#${demand.id}`}
              secondary={`Às ${demand.time}`}
            />
            <Button
              color="primary"
              endIcon={<VisibilityIcon />}
              size="small"
              variant="contained"
              onClick={() => handleClickOpenDialog(demand)}
            >
              Visualizar
            </Button>
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

      <DemandDialog deliveryTax={deliveryTax} open={openDialog} handleClickOpen={handleClickOpenDialog} handleClose={handleCloseDialog} status={status} demand={openDemand} updateStatus={updateStatus}/>
    </Card>
  );
};

Demands.propTypes = {
  className: PropTypes.string
};

export default Demands;
