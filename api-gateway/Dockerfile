FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

CMD ["yarn", "start:prod"]
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/knexfile.js /usr/src/app/dist/knexfile.js