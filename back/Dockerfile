FROM node:lts
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
#ajouter une ligne pour copier .env d'avant
EXPOSE 5434
EXPOSE 5432
EXPOSE 8080
EXPOSE 3002
CMD [ "tail",  "-f"]