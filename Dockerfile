FROM node:0.12.7

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install --production
COPY . /usr/src/app
RUN npm run build:prod
EXPOSE 5000
CMD [ "npm", "run", "start:prod" ]
