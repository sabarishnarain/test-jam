FROM node:10.16-stretch

WORKDIR /app

COPY *.js ./
COPY *.json ./
COPY src ./src/
COPY db ./db/
ENV JDAM_ENV_PROD true
RUN npm ci
EXPOSE 80

CMD ["npm","run","prod"]