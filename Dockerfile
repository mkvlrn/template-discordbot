FROM node:24.18.1-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
RUN npm i -g corepack
RUN corepack enable && corepack prepare --activate
COPY pnpm-*.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts
COPY src/ ./src/
COPY .env.schema env.d.ts ./
USER node

CMD ["node", "src/main.ts"]
