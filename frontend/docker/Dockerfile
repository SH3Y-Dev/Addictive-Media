FROM node:20.15.1 AS development

WORKDIR /home/dev/frontend

COPY ./frontend/package*.json ./
RUN npm install

COPY ./frontend .

CMD ["npm", "run", "dev"]
