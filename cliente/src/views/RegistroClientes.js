import { useState, useEffect } from "react";
import TableClientes from "../components/TableClientes";
import FormCliente from "../components/FormCliente";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grow from "@mui/material/Grow";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

const RegistroClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteToEdit, setClienteToEdit] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [showFormCliente, setShowFormCliente] = useState(false);
  const handleOpenFormCliente = () => setShowFormCliente(true);
  const handleCloseFormCliente = () => setShowFormCliente(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const getAllClientes = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/clientes/getallclientes`
      );
      const json = await resp.json();
      setClientes(json);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadClientesCSV = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/clientes/downloadclientes`
      );
      console.log(resp);
      let data = await resp.text();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "clientes.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
    }
  };

  const downloadDocumentosCSV = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/documentos/downloaddocumentos`
      );
      console.log(resp);
      let data = await resp.text();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "documentos.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
    }
  };

  const downloadDireccionesCSV = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/direcciones/downloaddirecciones`
      );
      console.log(resp);
      let data = await resp.text();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "direcciones.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllClientes();
  }, []);

  return (
    <>
      <Stack spacing={2} direction="row" className="m-8 flex justify-between">
        <Button
          variant="contained"
          onClick={() => {
            setEditMode(false);
            showFormCliente
              ? handleCloseFormCliente()
              : handleOpenFormCliente();
          }}
        >
          {!showFormCliente ? "Agregar cliente" : "Regresar"}
        </Button>
        {!showFormCliente && (
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Descargar datos">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                key={1}
                onClick={() => {
                  handleCloseUserMenu();
                  downloadClientesCSV();
                }}
              >
                <Typography textAlign="center">Clientes</Typography>
              </MenuItem>
              <MenuItem
                key={2}
                onClick={() => {
                  handleCloseUserMenu();
                  downloadDocumentosCSV();
                }}
              >
                <Typography textAlign="center">Documentos</Typography>
              </MenuItem>
              <MenuItem
                key={3}
                onClick={() => {
                  handleCloseUserMenu();
                  downloadDireccionesCSV();
                }}
              >
                <Typography textAlign="center">Direcciones</Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Stack>
      <Grow in={showFormCliente} mountOnEnter unmountOnExit>
        <div>
          {
            <FormCliente
              editMode={editMode}
              setEditMode={setEditMode}
              clienteToEdit={clienteToEdit}
              setClienteToEdit={setClienteToEdit}
              getAllClientes={getAllClientes}
              handleCloseFormCliente={handleCloseFormCliente}
            />
          }
        </div>
      </Grow>
      <Grow in={!showFormCliente} mountOnEnter unmountOnExit>
        <div>
          {
            <TableClientes
              clientes={clientes}
              handleOpenFormCliente={handleOpenFormCliente}
              setEditMode={setEditMode}
              clienteToEdit={clienteToEdit}
              setClienteToEdit={setClienteToEdit}
              getAllClientes={getAllClientes}
            />
          }
        </div>
      </Grow>
    </>
  );
};

export default RegistroClientes;
