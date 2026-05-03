# FROM node:20-alpine

# WORKDIR /myapp

# COPY . .

# RUN npm install

# EXPOSE 3000

# CMD [ "npm" , "run" , "dev" ]


FROM node:20-alpine

WORKDIR /myapp

COPY . .

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]