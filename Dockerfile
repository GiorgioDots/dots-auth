FROM --platform=linux/amd64 node:22-alpine AS build
WORKDIR /app
COPY ./package*.json ./
COPY ./.env.example ./.env
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
COPY --from=build /app/build ./build
COPY --from=build /app/.env.example .env
COPY --from=build /app/package.json .
COPY --from=build /app/package-lock.json .
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/drizzle ./drizzle
RUN npm ci --omit dev
EXPOSE 3000
CMD ["node", "--env-file=.env", "build"]

