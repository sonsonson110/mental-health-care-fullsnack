FROM node:alpine
LABEL authors="Pson"

WORKDIR /app
COPY . /app

RUN npm install -g @angular/cli@18.2
RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0"]
