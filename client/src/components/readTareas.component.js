import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import { useHistory } from "react-router-dom";
import getTarea from "../actions/readTareas.action";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import { grey, green } from "@material-ui/core/colors";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import CancelIcon from "@material-ui/icons/Cancel";
import deleteTarea from "../actions/deleteTarea.action";
import addTarea from "../actions/createTarea.action";
import updateTarea from "../actions/updateTarea.action";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SaveIcon from "@material-ui/icons/Save";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import { format } from "date-fns";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { Cookies } from "react-cookie";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 20,
    fontFamily: "Segoe UI",
    fontStyle: "normal",
    width: 500,
  },
  body: {
    fontSize: 18,
    fontFamily: "Segoe UI",
    fontStyle: "normal",
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(10),
    backgroundColor: "#E8E7E7",
    margin: "auto",
  },
  title: {
    flexGrow: 1,
  },
  submit: {
    margin: theme.spacing(1, 1, 1, 0),
    fontSize: 10,
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: grey[600],
    },
  },
  table: {
    minWidth: 700,
  },
}));

export default function Orders() {
  const [alertError, setAlertError] = useState(true);
  const [alertMessages, setAlertMessages] = useState();

  const onSubmitAdd = async (e) => {
    e.preventDefault();
    setAlertError(true);
    const form = e.target.closest("form");
    const formData = new FormData(form);
    const arr = {};
    for (const [key, value] of formData.entries()) arr[key] = value;
    const payload = {
      email: window.localStorage.getItem("email"),
      nombre: arr.nombre,
      descripcion: arr.descripcion,
      fecha: arr.fecha,
    };
    console.log(payload);
    const { success, data } = await addTarea(payload);
    if (success) {
      //window.alert(data.mensaje);
      form.querySelectorAll("input").forEach((input) => (input.value = ""));
      setOpenAdd(false);
      setState(state + 1);
      setAlertMessages(data.mensaje);
    } else {
      //window.alert(data[0].message);
      setAlertError(false);
      setAlertMessages(data[0].message);
    }
  };

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    const form = e.target.closest("form");
    const formData = new FormData(form);
    const arr = {};
    for (const [key, value] of formData.entries()) arr[key] = value;
    const payload = {
      email: window.localStorage.getItem("email"),
      nombre: window.localStorage.getItem("nombre"),
      descripcion: arr.descripcion,
      fecha: arr.fecha,
    };
    console.log(payload);
    const { success, data } = await updateTarea(payload);
    if (success) {
      //window.alert(data.mensaje);
      form.querySelectorAll("input").forEach((input) => (input.value = ""));
      setOpenEdit(false);
      setState(state + 1);
      setAlertMessages(data.mensaje);
    } else {
      //window.alert(data[0].message);
      setAlertMessages(data[0].message);
    }
  };

  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  const handleClickOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    setAlertError(true);
  };

  const handleClickOpenEdit = (nombre, descripcion, fecha) => {
    setOpenEdit(true);
    window.localStorage.setItem("nombre", nombre);
    window.localStorage.setItem("descripcion", descripcion);
    window.localStorage.setItem("fecha", fecha);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setAlertError(true);
  };

  const history = useHistory();
  const classes = useStyles();

  const [tareas, setTareas] = useState([]);
  const [state, setState] = useState(0);

  useEffect(() => {
    const payload = {
      email: window.localStorage.getItem("email"),
    };
    console.log(payload);
    const getAllTareas = async () => {
      const { success, data } = await getTarea(payload);
      if (success) {
        const array = data.allTareas;
        array.sort(function (a, b) {
          if (a.type > b.type) {
            return 1;
          }
          if (a.type < b.type) {
            return -1;
          }
          return 0;
        });
        setTareas(array);
      }
    };
    getAllTareas();
  }, [state]);

  const cerrar = () => {
    history.push("/");
    window.localStorage.clear();

  };

  const delTarea = async (nombre) => {
    const payload = {
      email: window.localStorage.getItem("email"),
      nombre: nombre,
    };
    console.log(payload);
    const { success, data } = await deleteTarea(payload);
    if (success) {
      setState(state + 1);
    } else {
      alertError(data[0].message);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={10}>
              <h1>
                <AssignmentTurnedInIcon fontSize="large" /> Lista de tareas pendientes{" "}
              </h1>
            </Grid>
            <Grid item xs={2}>
              <Button onClick={cerrar} type="button" variant="contained" color="primary" className={classes.submit} startIcon={<ExitToAppIcon />}>
                <h3>{window.localStorage.getItem("nombreUsuario")}</h3>
              </Button>
            </Grid>
            <Grid item xs={9}>
              <h3>Tareas que debes hacer...</h3>
            </Grid>
            <Grid item xs={3}>
              <Dialog open={openAdd} onClose={handleCloseAdd} aria-labelledby="form-dialog-title">
                <form onSubmit={onSubmitAdd}>
                  <DialogTitle id="form-dialog-title">Agregar Nueva Tarea</DialogTitle>
                  <DialogContent>
                    <DialogContentText>Para agregar una nueva tarea, ingresa un nombre, una descripcion y fecha de ejecucuion en el siguiente formulario</DialogContentText>
                    {alertError ? (
                      ""
                    ) : (
                      <Alert severity="warning">
                        <AlertTitle>Advertencia</AlertTitle>
                        {alertMessages} — <strong>Intenta Nuevamente!</strong>
                      </Alert>
                    )}
                    <TextField margin="dense" id="nombre" name="nombre" label="Nombre Tarea" type="text" fullWidth />
                    <TextField margin="dense" id="descripcion" name="descripcion" label="Descripcion Tarea" type="text" fullWidth />
                    <TextField margin="dense" id="fecha" name="fecha" type="date" fullWidth />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseAdd} type="button" variant="contained" color="primary" className={classes.submit} startIcon={<CancelIcon />}>
                      Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="primary" className={classes.submit} startIcon={<SaveIcon />}>
                      Guardar
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              <TableContainer className={classes.table} component={Paper}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>Nombre</StyledTableCell>
                      <StyledTableCell>Descripcion</StyledTableCell>
                      <StyledTableCell>Fecha</StyledTableCell>
                      <StyledTableCell>Acciones</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {tareas.map((row) => (
                      <StyledTableRow key={row._id}>
                        <StyledTableCell>{row.nombre}</StyledTableCell>
                        <StyledTableCell>{row.descripcion}</StyledTableCell>
                        <StyledTableCell>{format(new Date(row.fecha), "dd/MM/yyyy")}</StyledTableCell>
                        <StyledTableCell>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            startIcon={<EditIcon />}
                            onClick={(e) => {
                              handleClickOpenEdit(row.nombre, row.descripcion, row.fecha);
                            }}
                          >
                            Editar
                          </Button>
                          <Dialog open={openEdit} onClose={handleCloseEdit} aria-labelledby="form-dialog-title">
                            <form onSubmit={onSubmitEdit}>
                              <DialogTitle id="form-dialog-title">Editar Tarea</DialogTitle>
                              <DialogContent>
                                <DialogContentText>Para editar esta tarea, modifica los en el siguiente formulario</DialogContentText>
                                {alertError ? (
                                  ""
                                ) : (
                                  <Alert severity="warning">
                                    <AlertTitle>Advertencia</AlertTitle>
                                    {alertMessages} — <strong>Intenta Nuevamente!</strong>
                                  </Alert>
                                )}
                                <TextField margin="dense" id="name" name="nombre" label="Nombre Tarea" type="text" fullWidth value={window.localStorage.getItem("nombre")} />
                                <TextField margin="dense" id="descripcion" name="descripcion" label="Descripcion Tarea" type="text" fullWidth defaultValue={window.localStorage.getItem("descripcion")} />
                                <TextField margin="dense" id="fecha" name="fecha" type="date" fullWidth defaultValue={window.localStorage.getItem("fecha")} />
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={handleCloseEdit} type="button" variant="contained" color="primary" className={classes.submit} startIcon={<CancelIcon />}>
                                  Cancelar
                                </Button>
                                <Button type="submit" variant="contained" color="primary" className={classes.submit} startIcon={<SaveIcon />}>
                                  Guardar
                                </Button>
                              </DialogActions>
                            </form>
                          </Dialog>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            startIcon={<CheckCircleIcon />}
                            onClick={(e) => {
                              delTarea(row.nombre);
                            }}
                          >
                            Listo
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid container direction="row" justifyContent="flex-end" alignItems="center">
                <Button type="submit" variant="contained" color="primary" className={classes.submit} startIcon={<AddIcon />} onClick={handleClickOpenAdd}>
                  Agregar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Container>
    </React.Fragment>
  );
}
