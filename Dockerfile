FROM node:26.9.0-alpine@sha256:dbaa92e5758cbbcf85d65d5403fdb530fe3442cbe8c6dbfb7ef23365450d5070

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
RUN npm i -g pnpm
COPY pnpm-*.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts
COPY src/ ./src/
USER node

CMD ["node", "src/main.ts"]
