FROM node:6.9.2-alpine

ARG APP_DIR=/opt/app
WORKDIR $APP_DIR

COPY package.json $APP_DIR/
RUN npm install

COPY lib/ $APP_DIR/lib/
COPY app.js $APP_DIR/
COPY config.example.js $APP_DIR/config.js

CMD ["node", "./app.js"]
