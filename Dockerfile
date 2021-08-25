FROM node:14

# Create and change to the app directory.
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

USER node

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY --chown=node:node . .
EXPOSE 3000

# Run the web service on container startup.
CMD [ "npm", "run", "start" ]
