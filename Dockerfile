# Step 1: Build stage
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the application files
COPY . .

# Build the Next.js app
RUN npm run build

# Step 2: Run stage
FROM node:18-slim as run

WORKDIR /app
COPY --from=build /app ./

RUN npm install --production

EXPOSE 3000

CMD ["npm", "start"]
