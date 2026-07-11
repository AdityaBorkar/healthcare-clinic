FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS cache
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS build
COPY --from=cache /app/node_modules ./node_modules
COPY . .
RUN for script in $(node -p "Object.keys(require('./package.json').scripts).filter(s => s.startsWith('gen:')).join(' ')"); do bun run "$script"; done
RUN bun --bun run build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=cache /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

EXPOSE 3000
CMD ["bun", "run", "dist/server/index.mjs"]
