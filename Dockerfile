FROM node:26.8.1-alpine@sha256:2d984a15c9b54fd0aeb608b8e0d0d83529eb34d2966db27a1fb4f1edc3d298a3

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
RUN npm i -g pnpm
COPY pnpm-*.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts
COPY src/ ./src/
USER node

CMD ["node", "src/main.ts"]
