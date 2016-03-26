FROM ubuntu:14.04

# Install Node.js and npm

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_5.x | bash -
RUN apt-get install -y build-essential python nodejs

# Install app dependencies
COPY package.json /src/package.json

RUN cd /src; npm install

# Bundle app source
COPY configs /src/configs
COPY controllers /src/controllers
COPY public /src/public
COPY views /src/views
COPY server.js /src/server.js

ENV MONGO_ACCESS 'not provided'

RUN sed -i -- 's/mongo_access/$MONGO_ACCESS/g' /src/configs/config.js

EXPOSE  3000
CMD ["node", "/src/server.js"]