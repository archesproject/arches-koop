# Based on the latest Node.js LTS version
FROM node:16

# Create app directory in docker
WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/arches-koop
RUN yarn install

# Expose the server port. This must be the same as the one in the config (config/default.json)
EXPOSE ${KOOP_PORT}

CMD yarn start

