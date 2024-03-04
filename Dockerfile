FROM node:18

WORKDIR /encuestasapp
COPY package.json .
RUN npm install

COPY . .
CMD npm start