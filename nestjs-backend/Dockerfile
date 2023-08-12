FROM node:16

COPY ./package.json /nestjs-backend/
COPY ./package-lock.json /nestjs-backend/

WORKDIR /nestjs-backend/

RUN npm install

COPY . /nestjs-backend/

CMD npm run start:dev