import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import FacebookIcon from 'src/icons/Facebook';
import GoogleIcon from 'src/icons/Google';
import Page from 'src/components/Page';
import { TextFields } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { loginAction } from '../../store/modules/auth/actions';

import api from '../../services/api';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [submiting, setSubmiting] = useState(false);

  const [error, setError] = useState(false);

  const [logged, setLogged] = useState(false);

  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if(token)
      navigate('/app/dashboard');
  }, [token]);

  function submit(e){
    e.preventDefault();
    setSubmiting(true);

    api.post('auth/admin/login', {
      email,
      password
    }).then(res => {
      dispatch(loginAction(res.data.access_token));
      navigate('/app/dashboard');
    }).catch(err => {
      setError(true);
      setSubmiting(false);
    })
  }

  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <form onSubmit={submit}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              value={email}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Senha"
              margin="normal"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
              variant="outlined"
            />
            <Box my={2}>
              <Button
                color="primary"
                disabled={submiting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                ENTRAR
              </Button>
            </Box>
          </form>
          {
            error &&
            <Typography style={{textAlign: 'center', color: '#A7110D'}}>Acesso não autorizado</Typography>
          }
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
