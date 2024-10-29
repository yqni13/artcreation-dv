# Build phase
FROM node:20.12.1-alpine AS build
WORKDIR /app

RUN npm install -g @angular/cli

# dependencies
COPY package*.json ./
RUN npm install
RUN npm cache clean --force

# copy source code into image
COPY . .

# provide compatibility of build for different browsers
RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points

# parameter to adapt api url on prod
ARG API_URL
ENV API_URL=${API_URL}

# run js-script to replace env var(s) and build application
RUN node replace-env.js
RUN npm run build --prod


# nginx static webserver phase
FROM nginx:alpine

# copy nginx config file
COPY ./default.conf /etc/nginx/conf.d/default.conf
# copy from build phase
COPY --from=build /app/dist/artcreation-dv/browser /usr/share/nginx/html

# nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]