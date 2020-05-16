FROM node:12.14.1 as base
WORKDIR /code
EXPOSE 80

COPY package.json .

FROM base AS dependencies
COPY package-lock.json .nvmrc ./
RUN rm -rf node_modules && npm install --silent

FROM dependencies AS develop
ENV NODE_ENV=development
COPY . .
RUN npm run build

FROM base AS release
ENV NODE_ENV=production
COPY --from=dependencies /code/node_modules /code/node_modules
COPY --from=develop /code/build ./build
COPY --from=develop /code/config ./config

CMD ["npm", "run", "start"]
