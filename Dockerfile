FROM oven/bun:1.4.2-alpine@sha256:d888c0ae6c86d7866ff10c5aafdd9077b36aee6455b33dd270fb93c0dd5cef6f

WORKDIR /app
ENV NODE_ENV=production

COPY package.json tsconfig.json bun.lock bunfig.toml ./
RUN bun install --frozen-lockfile --production --ignore-scripts
COPY src/ ./src/
COPY .env.schema ./
COPY env.d.ts ./
USER bun

CMD ["bun", "src/main.ts"]
