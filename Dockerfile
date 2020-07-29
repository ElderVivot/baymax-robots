FROM node:12
WORKDIR /usr/programming/baymax-new/robots/backend
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 3331
CMD npm start