FROM node:10.16-stretch

WORKDIR /app

COPY *.js ./
COPY *.json ./
COPY src ./src/
COPY db ./db/
RUN npm ci
EXPOSE 3000

CMD ["npm","run","dev"]