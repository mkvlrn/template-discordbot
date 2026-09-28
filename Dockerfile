FROM node:26.10.0-alpine@sha256:0b36e8c136b94cd4fcf02188228e76c31ad5872eef3fec8cbd2eee500cfd9e80

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
RUN npm i -g pnpm
COPY pnpm-*.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts
COPY src/ ./src/
COPY .env.schema ./
COPY env.d.ts ./
USER node

CMD ["node", "src/main.ts"]
