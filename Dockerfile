# Usamos una imagen de node como base
FROM node:14-alpine

# Establecemos el directorio de trabajo en /app
WORKDIR /app

# Copiamos el archivo package.json y el archivo package-lock.json
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos todos los archivos del backend al directorio de trabajo
COPY . .

# Exponemos el puerto 8000 en el contenedor
EXPOSE 4001

# Comando para iniciar la aplicación backend
CMD ["npm", "start"]
