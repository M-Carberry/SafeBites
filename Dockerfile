FROM node:22.11

COPY ./frontend/SafeBitesReactApp /frontend/SafeBitesReactApp
RUN rm -rf /frontend/SafeBitesReactApp/node_modules

WORKDIR /frontend/SafeBitesReactApp
RUN npm install
RUN npm install react-native-maps
RUN npm install -g @expo/ngrok@^4.1.0
RUN npx expo install react-native-maps expo-location

CMD ["npx", "expo", "start", "--tunnel"]