FROM node:20-alpine
# Step 2: Set working directory
WORKDIR /usr/src/app

# Step 3: Copy package files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# If you want to install global packages, you can use:
RUN npm install -g typescript

# Step 5: Copy source code
COPY . .

COPY src/.env ./dist/.env

ENV PORT=80
# Step 6: Compile TypeScript to JavaScript
RUN npm run build
EXPOSE 80


# Step 7: Start the application
CMD [ "node", "dist/index.js" ]


### az login
### az acr login --name firarepo.azurecr.io
### docker tag fira-backend:v0.05 firarepo.azurecr.io/fira-backend:v0.05
### docker push firarepo.azurecr.io/fira-backend:v0.05