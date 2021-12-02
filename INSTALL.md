## How to run the project on Local machine?

- clone this repository by running command this your terminal `git clone https://github.com/spartanHarvey/Homiefy.git` or download the tag homiefy
- run `cd Homiefy`
- You need to have _NodeJS_ installed in your machine then run `npm install` to download all of the dependecies
- Then create a `.env` file which should look the same as `.env.example` file in this repo
- The `.env` should have a `PORT` number, and links to your MongoDB databases stored in `DATABASE_URL` and `TEST_DATABASE_URL`
- Now you can run `npm start` and it should launch your application on port `8001`
- Or run `npm test` to run unit tests and integration tests (You need a separate `TEST_DATABASE_URL` link before running tests)

## How to run the project on Docker container?

### Run the application

- run `docker build -t homiefy-app-image .`
- then run `docker run -p 8001:8001 -d --name homiefy-app-container homiefy-app-image`
- and it should launch your application on port `8001`

### Run unit Tests

- run `docker build -t homiefy-app-image-test .`
- then run `docker run -p 8002:8002 -it --name homiefy-app-container-test homiefy-app-image`
- and you should be able to see the unit tests output
