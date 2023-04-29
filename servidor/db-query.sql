CREATE DATABASE 'sistema-registro-clientes';

CREATE TABLE clientes (
	id_cliente SERIAL PRIMARY KEY,
  	nombre VARCHAR(255) NOT NULL,
	apellido VARCHAR(255) NOT NULL,
	genero CHAR(1),
	telefono VARCHAR(255),
	email VARCHAR(255),
	fecha_nacimiento DATE
);

CREATE TABLE documentos (
	id_documento SERIAL PRIMARY KEY,
	id_cliente INT NOT NULL,
	tipo VARCHAR(255),
	numero VARCHAR(255),
	CONSTRAINT fk_cliente FOREIGN KEY(id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE
);

CREATE TABLE direcciones (
  	id_direccion SERIAL PRIMARY KEY,
	id_cliente INT NOT NULL,
  	direccion_1 VARCHAR(255),
  	direccion_2 VARCHAR(255),
	pais VARCHAR(255),
	departamento VARCHAR(255),
	municipio VARCHAR(255),
	CONSTRAINT fk_cliente FOREIGN KEY(id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE
);