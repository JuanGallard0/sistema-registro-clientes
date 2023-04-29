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

const ModalDocumento = ({
  showModalDocumento,
  handleCloseModalDocumento,
  documentoToEdit,
  editModal,
  getDocumentos,
}) => {
  const [newDocumento, setNewDocumento] = useState({
    id_documento: editModal ? documentoToEdit.id_documento : null,
    id_cliente: documentoToEdit.id_cliente,
    tipo: editModal ? documentoToEdit.tipo : "",
    numero: editModal ? documentoToEdit.numero : "",
  });
  const tipoDocumento = [
    {
      value: "DUI",
      label: "DUI",
    },
    {
      value: "NIT",
      label: "NIT",
    },
    {
      value: "Pasaporte",
      label: "Pasaporte",
    },
    {
      value: "Licencia de conducir",
      label: "Licencia de conducir",
    },
    {
      value: "Partida de nacimiento",
      label: "Partida de nacimiento",
    },
    {
      value: "Carnet de minoridad",
      label: "Carnet de minoridad",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewDocumento((newDocumento) => ({
      ...newDocumento,
      [name]: value,
    }));

    console.log(newDocumento);
  };

  const createDocumento = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/documentos/createdocumento`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDocumento),
        }
      );
      if (resp.status === 200) {
        console.log("Ok!");
        const json = await resp.json();
        getDocumentos();
        handleCloseModalDocumento();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateDocumento = async (e) => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/documentos/updatedocumento/${newDocumento.id_documento}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newDocumento),
        }
      );
      if (resp.status === 200) {
        console.log("Ok!");
        const json = await resp.json();
        getDocumentos();
        handleCloseModalDocumento();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeDocumento = () => {
    if (window.confirm("¿Estás seguro que quieres eliminar este documento?")) {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/documentos/removedocumento/${documentoToEdit.id_documento}`,
        {
          method: "DELETE",
        }
      )
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            getDocumentos();
            handleCloseModalDocumento();
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
        open={showModalDocumento}
        onClose={handleCloseModalDocumento}
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
            {editModal ? "Editando documento..." : "Nuevo documento"}
          </Typography>

          <FormControl sx={{ m: 2 }} variant="outlined">
            <TextField
              required
              name="tipo"
              select
              label="Tipo de documento"
              value={newDocumento.tipo}
              helperText="Selecciona una de las opciones"
              variant="outlined"
              onChange={handleChange}
            >
              {tipoDocumento.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl sx={{ m: 2 }} variant="outlined">
            <TextField
              required
              name="numero"
              type="text"
              label="Número de documento"
              value={newDocumento.numero}
              variant="outlined"
              onChange={handleChange}
            />
          </FormControl>
          <div className="flex justify-between">
            <FormControl sx={{ m: 2 }} variant="outlined">
              <Button
                variant="contained"
                type="submit"
                onClick={editModal ? updateDocumento : createDocumento}
              >
                Guardar
              </Button>
            </FormControl>
            {editModal && (
              <FormControl sx={{ m: 2 }} variant="outlined">
                <Button
                  variant="contained"
                  type="submit"
                  onClick={removeDocumento}
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

export default ModalDocumento;
