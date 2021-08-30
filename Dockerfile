######  envar on docker image  #######
#FROM node:alpine
#comment arg env kalau infra udah update deployment file
#ARG NEXT_PUBLIC_API_BASE_URL
#ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
#WORKDIR alterra/www/
#ADD . /alterra/www/
#RUN npm install && \
#    npm run build
#EXPOSE 3000
#CMD ["npm", "run", "start"]

######  build on dockerfile  #######
#FROM node:alpine
#
#ARG NEXT_PUBLIC_API_BASE_URL
#ARG NEXT_PUBLIC_API_FLAGR_URL
#ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
#
#ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
#ENV NEXT_PUBLIC_API_FLAGR_URL=${NEXT_PUBLIC_API_FLAGR_URL}
#ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
#
#WORKDIR /alterra/www
#COPY package*.json ./
#RUN npm install
#
#COPY . .
#
#RUN npm run build
#EXPOSE 3000
#
#CMD [ "npm", "start" ]

######  build on entrypoint  #######
#FROM node:14.8.0-stretch-slim
#FROM node:alpine
#WORKDIR '/alterra/www'
#
#COPY package.json .
#COPY yarn.lock .
#RUN yarn install
#
#COPY . .
#EXPOSE 3000
#
#ENTRYPOINT ["sh", "./entrypoint.sh"]

## reduce size ##
FROM node:lts-alpine AS deps

WORKDIR /alterra/www
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts-alpine AS builder

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_API_FLAGR_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_API_FLAGR_URL=${NEXT_PUBLIC_API_FLAGR_URL}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}

ENV NODE_ENV=production
WORKDIR /alterra/www
COPY . .
COPY --from=deps /alterra/www/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:lts-alpine AS runner
WORKDIR /alterra/www
ENV NODE_ENV=production
COPY --from=builder /alterra/www/next.config.js ./
COPY --from=builder /alterra/www/public ./public
COPY --from=builder /alterra/www/.next ./.next
COPY --from=builder /alterra/www/node_modules ./node_modules
CMD ["node_modules/.bin/next", "start"]

