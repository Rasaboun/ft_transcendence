FROM node:lts
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
#ajouter une ligne pour copier .env d'avant
CMD [ "tail",  "-f"]