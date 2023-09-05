FROM node:lts as dependencies
WORKDIR /app
# Set the HOST environment variable to 0.0.0.0
ENV HOST 0.0.0.0
COPY package.json yarn.lock ./
RUN yarn install

FROM node:lts as builder
# Set the HOST environment variable to 0.0.0.0
ENV HOST 0.0.0.0
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /app
ENV NODE_ENV production
# Set the HOST environment variable to 0.0.0.0
ENV HOST 0.0.0.0
# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]
