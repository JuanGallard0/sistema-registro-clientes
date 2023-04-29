import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList } from "react-window";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import ModalDocumento from "./ModalDocumento";
import Grow from "@mui/material/Grow";
import Stack from "@mui/material/Stack";
import ModalDireccion from "./ModalDireccion";

const FormCliente = ({
  editMode,
  setEditMode,
  clienteToEdit,
  setClienteToEdit,
  getAllClientes,
  handleCloseFormCliente,
}) => {
  const [documentos, setDocumentos] = useState([]);
  const [documentoToEdit, setDocumentoToEdit] = useState({
    id_documento: null,
    id_cliente: editMode ? clienteToEdit.id_cliente : null,
    tipo: "",
    numero: "",
  });
  const [direcciones, setDirecciones] = useState([]);
  const [direccionToEdit, setDireccionToEdit] = useState({
    id_direccion: null,
    id_cliente: editMode ? clienteToEdit.id_cliente : null,
    direccion_1: "",
    direccion_2: "",
    pais: "",
    departamento: "",
    municipio: "",
  });
  const [newCliente, setNewCliente] = useState({
    id_cliente: editMode ? clienteToEdit.id_cliente : null,
    nombre: editMode ? clienteToEdit.nombre : "",
    apellido: editMode ? clienteToEdit.apellido : "",
    genero: editMode ? clienteToEdit.genero : "",
    telefono: editMode ? clienteToEdit.telefono : "",
    email: editMode ? clienteToEdit.email : "",
    fecha_nacimiento: editMode ? clienteToEdit.fecha_nacimiento : new Date(),
  });
  const [editModal, setEditModal] = useState(false);
  const [showModalDocumento, setShowModalDocumento] = useState(false);
  const handleOpenModalDocumento = () => setShowModalDocumento(true);
  const handleCloseModalDocumento = () => setShowModalDocumento(false);
  const [showModalDireccion, setShowModalDireccion] = useState(false);
  const handleOpenModalDireccion = () => setShowModalDireccion(true);
  const handleCloseModalDireccion = () => setShowModalDireccion(false);
  const currencies = [
    {
      value: "M",
      label: "Masculino",
    },
    {
      value: "F",
      label: "Femenino",
    },
  ];

  function renderRowDocumentos(props) {
    const { data, index, style } = props;
    const item = data[index];

    return (
      <ListItem
        style={style}
        key={item.id_documento}
        component="div"
        disablePadding
      >
        <ListItemButton
          onClick={(e) => {
            e.preventDefault();
            setEditModal(true);
            setDocumentoToEdit({
              ...documentoToEdit,
              id_documento: item.id_documento,
              tipo: item.tipo,
              numero: item.numero,
            });
            handleOpenModalDocumento();
          }}
        >
          <CircleIcon sx={{ fontSize: "50%", mr: 2 }} />
          <ListItemText primary={`${item.tipo}: ${item.numero}`} />
        </ListItemButton>
      </ListItem>
    );
  }

  function renderRowDirecciones(props) {
    const { data, index, style } = props;
    const item = data[index];

    return (
      <ListItem
        style={style}
        key={item.id_direccion}
        component="div"
        disablePadding
      >
        <ListItemButton
          onClick={(e) => {
            e.preventDefault();
            setEditModal(true);
            setDireccionToEdit({
              ...direccionToEdit,
              id_direccion: item.id_direccion,
              id_cliente: item.id_cliente,
              direccion_1: item.direccion_1,
              direccion_2: item.direccion_2,
              pais: item.pais,
              departamento: item.departamento,
              municipio: item.municipio,
            });
            handleOpenModalDireccion();
          }}
        >
          <CircleIcon sx={{ fontSize: "50%", mr: 2 }} />
          <ListItemText primary={item.direccion_1} />
        </ListItemButton>
      </ListItem>
    );
  }

  const getDocumentos = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/documentos/getdocumentosbyidcliente/${clienteToEdit.id_cliente}`
      );
      const json = await resp.json();
      setDocumentos(json);
    } catch (error) {
      console.log(error);
    }
  };

  const getDirecciones = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/direcciones/getdireccionesbyidcliente/${clienteToEdit.id_cliente}`
      );
      const json = await resp.json();
      setDirecciones(json);
    } catch (error) {
      console.log(error);
    }
  };

  const createCliente = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/clientes/createcliente`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCliente),
        }
      );
      if (resp.status === 200) {
        console.log("Ok!");
        const json = await resp.json();
        setEditMode(true);
        setClienteToEdit(json[0]);
        setNewCliente({ ...newCliente, id_cliente: json[0].id_cliente });
        setDocumentoToEdit({
          ...documentoToEdit,
          id_cliente: json[0].id_cliente,
        });
        setDireccionToEdit({
          ...direccionToEdit,
          id_cliente: json[0].id_cliente,
        });
        getAllClientes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateCliente = async (e) => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/clientes/updatecliente/${newCliente.id_cliente}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCliente),
        }
      );
      if (resp.status === 200) {
        console.log("Ok!");
        const json = await resp.json();
        getAllClientes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewCliente((newCliente) => ({
      ...newCliente,
      [name]: value,
    }));

    console.log(newCliente);
  };

  useEffect(() => {
    if (editMode) {
      getDocumentos(clienteToEdit.id_cliente);
      getDirecciones();
    }
  }, []);

  return (
    <>
      {showModalDocumento && (
        <ModalDocumento
          showModalDocumento={showModalDocumento}
          handleCloseModalDocumento={handleCloseModalDocumento}
          documentoToEdit={documentoToEdit}
          editModal={editModal}
          getDocumentos={getDocumentos}
        />
      )}
      {showModalDireccion && (
        <ModalDireccion
          showModalDireccion={showModalDireccion}
          handleCloseModalDireccion={handleCloseModalDireccion}
          direccionToEdit={direccionToEdit}
          editModal={editModal}
          getDirecciones={getDirecciones}
        />
      )}

      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 0, width: "35ch" },
        }}
        noValidate
        autoComplete="off"
        className="max-w-screen-lg m-10"
      >
        <div className="border-l-2 ">
          <Typography variant="h5" sx={{ m: 2 }}>
            Información general del cliente
          </Typography>
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3">
            <FormControl sx={{ m: 2 }} variant="outlined">
              <TextField
                required
                name="nombre"
                label="Nombre"
                value={newCliente.nombre}
                variant="outlined"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ m: 2 }} variant="outlined">
              <TextField
                required
                name="apellido"
                label="Apellido"
                value={newCliente.apellido}
                variant="outlined"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ m: 2 }} variant="outlined">
              <TextField
                name="genero"
                select
                label="Género"
                value={newCliente.genero}
                helperText="Selecciona una de las opciones"
                variant="outlined"
                onChange={handleChange}
              >
                {currencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <FormControl sx={{ m: 2 }} variant="outlined">
              <TextField
                name="telefono"
                label="Teléfono"
                value={newCliente.telefono}
                type="tel"
                variant="outlined"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ m: 2 }} variant="outlined">
              <TextField
                name="email"
                label="Email"
                value={newCliente.email}
                type="email"
                variant="outlined"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl sx={{ m: 2 }} variant="outlined">
              <TextField
                name="fecha_nacimiento"
                type="date"
                value={newCliente.fecha_nacimiento}
                helperText="Fecha de nacimiento"
                variant="outlined"
                onChange={handleChange}
              />
            </FormControl>
          </div>
          <Stack spacing={2} direction="row" className="flex justify-end">
            <Button
              color="success"
              variant="contained"
              sx={{ m: 2 }}
              onClick={editMode ? updateCliente : createCliente}
            >
              {editMode ? "Guardar cambios" : "Guardar"}
            </Button>
          </Stack>
        </div>
        <Grow in={editMode} mountOnEnter unmountOnExit>
          <div className="border-l-2 border-t-2">
            <Typography variant="h5" sx={{ m: 2 }}>
              Documentos y direcciones del cliente
            </Typography>
            <div className="flex flex-wrap justify-around">
              <div>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ maxWidth: 220 }}
                  onClick={() => {
                    setEditModal(false);
                    handleOpenModalDocumento();
                  }}
                >
                  Agregar Documento
                </Button>
                <Box
                  sx={{
                    width: "100%",
                    height: 300,
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                  className="border-l-2"
                >
                  <FixedSizeList
                    height={250}
                    width={360}
                    itemSize={46}
                    itemData={documentos}
                    itemCount={documentos.length}
                    overscanCount={5}
                  >
                    {renderRowDocumentos}
                  </FixedSizeList>
                </Box>
              </div>
              <div>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ maxWidth: 220 }}
                  onClick={() => {
                    setEditModal(false);
                    handleOpenModalDireccion();
                  }}
                >
                  Agregar Dirección
                </Button>
                <Box
                  sx={{
                    width: "100%",
                    height: 300,
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                  className="border-l-2"
                >
                  <FixedSizeList
                    height={250}
                    width={360}
                    itemSize={46}
                    itemData={direcciones}
                    itemCount={direcciones.length}
                    overscanCount={5}
                  >
                    {renderRowDirecciones}
                  </FixedSizeList>
                </Box>
              </div>
            </div>
            <Stack spacing={2} direction="row" className="flex justify-end">
              <Button
                color="success"
                variant="contained"
                sx={{ m: 2 }}
                onClick={handleCloseFormCliente}
              >
                Finalizar
              </Button>
            </Stack>
          </div>
        </Grow>
      </Box>
    </>
  );
};

export default FormCliente;
