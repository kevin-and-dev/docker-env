FROM node:14-slim

ENV TERM="xterm-256color"


# VOLUME /usr/node/app
WORKDIR /usr/node/app
# COPY . .

EXPOSE 8080

RUN yarn global add pm2 && yarn install

CMD ["pm2-runtime", "--watch", "src/app.js"]
