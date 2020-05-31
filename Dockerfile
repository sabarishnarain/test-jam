FROM node:10.16-stretch

WORKDIR /app

COPY *.js ./
COPY *.json ./
COPY src ./src/
COPY db ./db/
ENV TESTJAM_ENV prod
RUN npm ci
EXPOSE 80

CMD ["npm","run", "demo"]