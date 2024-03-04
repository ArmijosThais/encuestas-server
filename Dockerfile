FROM node:18

WORKDIR /servencuestas

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 80

CMD [ "npm", "start" ]