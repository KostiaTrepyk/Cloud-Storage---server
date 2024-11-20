ARG NODE_VERSION=20.13.1

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /app

FROM base as deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

FROM base as final
ENV NODE_ENV development
RUN chown node:node /app
USER node
COPY package.json .
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 5000

CMD npm run start:dev
