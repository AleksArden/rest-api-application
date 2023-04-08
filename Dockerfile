FROM node:18-alpine

WORKDIR /home 

COPY ./package*.json ./

RUN npm install

COPY ./ ./

EXPOSE 3000

CMD ["npm", "start" ]