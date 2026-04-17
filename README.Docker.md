### Building and running your application
File pointer?
./frontend/SafeBitesReactApp/app/login.tsx

### Environment Setup
Before running the application. 

**Windows**
copy backend\server\configA.env.example backend\server\configA.env

**Mac**
cp backend/server/configA.env.example backend/server/configA.env

When you're ready, start your application by running:
`docker compose up --build`.

### Important Notes
- The app connects to the live backend at https://safebites-03ek.onrender.com
- No IP configuration needed
- The backend may take ~30 seconds to wake up on first request


### Deploying your application to the cloud

First, build your image, e.g.: `docker build -t myapp .`.
If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:
`docker build --platform=linux/amd64 -t myapp .`.

Then, push it to your registry, e.g. `docker push myregistry.com/myapp`.

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.

