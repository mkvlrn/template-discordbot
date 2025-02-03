FROM node:23-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install
COPY src/ ./src/
COPY tsconfig.json ./
COPY tsup.config.json ./
RUN yarn build

FROM node:23-alpine AS runner

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

CMD ["npm", "run", "start"]
