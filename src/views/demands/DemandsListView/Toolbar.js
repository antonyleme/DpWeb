import React, {useState} from 'react';
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
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  flex: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
}));

const Toolbar = ({ className, changeDate, searchId, setSearchId, ...rest }) => {
  const classes = useStyles();

  const [date, setDate] = useState(new Date());

  function setNewDate(date){
    setDate(date);

    var newDate = date.replace('/', '-');

    changeDate(newDate);
  }

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box mt={3}>
        <Card>
          <CardContent>
            <div className={classes.flex}>
              <Box maxWidth={500}>
                <TextField
                  fullWidth
                  defaultValue={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon
                          fontSize="small"
                          color="action"
                        >
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    )
                  }}
                  placeholder="Pesquisar pedido"
                  variant="outlined"
                />
              </Box>
              <TextField
                id="date"
                label="Data"
                type="date"
                defaultValue={date}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
