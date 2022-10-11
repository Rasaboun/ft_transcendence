FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5434
EXPOSE 5432
EXPOSE 8080
EXPOSE 3002
CMD [ "tail",  "-f"]