FROM node:22-alpine
WORKDIR /app
COPY package.json server.js mbcolumn-core.js ./
ENV NODE_ENV=production
EXPOSE 8787
CMD ["node", "server.js"]
