A simple REST API written with Node.js/Express for performing CRUD operations

## Prerequisites
Clone down this repository. You will need `node` and `npm` installed globally on your machine.

## Dependencies installation:
```
npm install
```

## .env file configuration:
Copy content of the .env.example file to project directory as .env file and make changes where necessary
```
# choose port from where to launch app
PORT='3001'

# database configuration
DB_DATABASE='mydatabaseName'
DB_USER='mydatabaseUsername'
DB_PASSWORD='mydatabasePassword'
DB_HOST='mydatabaseAddress'
```

## Starting the app:
```
npm start
```

## Accessing API documentation:
After starting the app, go to URL serverAddress/docs to view the API documentation (powered by Swagger)
```
Example:
http://localhost:3001/docs
```
