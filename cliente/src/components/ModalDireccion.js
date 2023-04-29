import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ModalDireccion = ({
  showModalDireccion,
  handleCloseModalDireccion,
  direccionToEdit,
  editModal,
  getDirecciones,
}) => {
  const [newDireccion, setNewDireccion] = useState({
    id_direccion: editModal ? direccionToEdit.id_direccion : null,
    id_cliente: direccionToEdit.id_cliente,
    direccion_1: editModal ? direccionToEdit.direccion_1 : "",
    direccion_2: editModal ? direccionToEdit.direccion_2 : "",
    pais: editModal ? direccionToEdit.pais : "",
    departamento: editModal ? direccionToEdit.departamento : "",
    municipio: editModal ? direccionToEdit.municipio : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewDireccion((newDireccion) => ({
      ...newDireccion,
      [name]: value,
    }));

    console.log(newDireccion);
  };

  const createDireccion = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/direcciones/createdireccion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDireccion),
        }
      );
      if (resp.status === 200) {
        console.log("Ok!");
        const json = await resp.json();
        getDirecciones();
        handleCloseModalDireccion();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateDireccion = async (e) => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/direcciones/updatedireccion/${newDireccion.id_direccion}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDireccion),
        }
      );
      if (resp.status === 200) {
        console.log("Ok!");
        const json = await resp.json();
        getDirecciones();
        handleCloseModalDireccion();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeDireccion = () => {
    if (window.confirm("¿Estás seguro que quieres eliminar esta dirección?")) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/direcciones/removedireccion/${direccionToEdit.id_direccion}`,
        {
          method: "DELETE",
        }
      )
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            getDirecciones();
            handleCloseModalDireccion();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
      <Modal
        open={showModalDireccion}
        onClose={handleCloseModalDireccion}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ m: 2 }}
            id="modal-modal-title"
            variant="h4"
            component="h2"
          >
            {editModal ? "Editando dirección..." : "Nueva dirección"}
          </Typography>

          <FormControl sx={{ m: 2 }} variant="outlined">
            <TextField
              name="direccion_1"
              type="text"
              label="Dirección 1"
              value={newDireccion.direccion_1}
              variant="outlined"
              onChange={handleChange}
            />
          </FormControl>
          <FormControl sx={{ m: 2 }} variant="outlined">
            <TextField
              name="direccion_2"
              type="text"
              label="Dirección 2"
              value={newDireccion.direccion_2}
              variant="outlined"
              onChange={handleChange}
            />
          </FormControl>
          <FormControl sx={{ m: 2 }} variant="outlined">
            <TextField
              name="pais"
              type="text"
              label="País"
              value={newDireccion.pais}
              variant="outlined"
              onChange={handleChange}
            />
          </FormControl>
          <FormControl sx={{ m: 2 }} variant="outlined">
            <TextField
              name="departamento"
              type="text"
              label="Departamento"
              value={newDireccion.departamento}
              variant="outlined"
              onChange={handleChange}
            />
          </FormControl>
          <FormControl sx={{ m: 2 }} variant="outlined">
            <TextField
              name="municipio"
              type="text"
              label="Municipio"
              value={newDireccion.municipio}
              variant="outlined"
              onChange={handleChange}
            />
          </FormControl>
          <div className="flex justify-between">
            <FormControl sx={{ m: 2 }} variant="outlined">
              <Button
                variant="contained"
                type="submit"
                onClick={editModal ? updateDireccion : createDireccion}
              >
                Guardar
              </Button>
            </FormControl>
            {editModal && (
              <FormControl sx={{ m: 2 }} variant="outlined">
                <Button
                  variant="contained"
                  type="submit"
                  onClick={removeDireccion}
                  color="error"
                >
                  Eliminar
                </Button>
              </FormControl>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalDireccion;
