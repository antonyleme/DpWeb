import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  makeStyles,
  Button,
  TextField,
  FormControl,
  MenuItem,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import ProductDialog from '../../components/ProductDialog';
import api from '../../services/api';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  statsItem: {
    alignItems: 'center',
    display: 'flex'
  },
  statsIcon: {
    marginRight: theme.spacing(1)
  },
  margin: {
    marginBottom: theme.spacing(3),
  },
  coldIcon: {
    marginRight: theme.spacing(1),
    color: 'blue',
  }
}));

const BannerCard = ({ className, categories, banner, removeBanner, ...rest }) => {
  const classes = useStyles();

  const deleteBanner = () => {
    api.delete(`banners/${banner.id}`);
    removeBanner(banner.id);
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="center"
          mb={3}
        >
          <img src={`https://api.dp.codenative.com.br/${banner.imgPath}`} style={{maxWidth: 300, maxHeight: 300}}/>
        </Box>
      </CardContent>
      <Box flexGrow={1} />
      <Divider />
      <Box p={2}>
        <Grid
          container
          justify="space-between"
          spacing={2}
        >
          <Grid
            className={classes.statsItem}
            item
          >
          </Grid>
          <Grid
            className={classes.statsItem}
            item
          >
            <Button
              color="primary"
              endIcon={<DeleteIcon />}
              size="small"
              variant="text"
              onClick={deleteBanner}
            >
              Deletar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

BannerCard.propTypes = {
  className: PropTypes.string,
  banner: PropTypes.object.isRequired
};

export default BannerCard;
