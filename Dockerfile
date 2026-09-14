FROM node:26.8.2-alpine@sha256:ef24c5053d50fdc3e4e56eb4e7ddb7861874ab0fdc797046ba897581deb8e868

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
RUN npm i -g pnpm
COPY pnpm-*.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts
COPY src/ ./src/
USER node

CMD ["node", "src/main.ts"]
