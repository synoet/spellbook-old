FROM node:16-alpine

COPY . ./app

WORKDIR /app

RUN npm install -g @swc/core @swc/cli
RUN npm install
ENV NODE_ENV production

CMD ["npm", "run", "start"]