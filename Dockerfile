FROM node:16.14

# RUN apk add xhost
# RUN apk add --no-cache tini &&  mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY . .

# COPY package.json .
# COPY package-lock.json .
# RUN npm install 
# RUN xhost local:root

EXPOSE 3030

CMD ["npm", "run", "server"]