FROM node:12-alpine
WORKDIR /
COPY . .
RUN npm install --production
CMD ["node", "server.js"]