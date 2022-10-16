FROM node:12.20-slim

WORKDIR /app
COPY package.json /app/package.json

RUN npm install
RUN npm install -g @angular/cli@7.3.10

COPY . /app
EXPOSE 80

CMD ng serve --host 0.0.0.0 -c production --port 80 --disable-host-check
