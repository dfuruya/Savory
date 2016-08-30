# MadeWithLove
Home cooked food delivered/pickup for busy people

## Team

  - __Product Owner__: Dan Sajjad
  - __Scrum Master__: Shinji Furuya
  - __Development Team Members__: Andrew Fung, Alex Wong

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> Initial Postgres Database Setup

- If you don't have Postgres.app, point to http://postgresapp.com/, download,
and install the app
- Open Postgres.app from your Applications folder
- Click on the Postgres elephant icon on the menu bar and select 'Open psql'
to start the Postgres instance (a psql terminal window should open up)
- In the window, create the database table by typing:
```sh
CREATE DATABASE mwl_db;
```

###Elastic search
- Download elasticsearch zip (https://www.elastic.co/downloads/elasticsearch)
- Unzip the file
- Copy *elasticsearch.yml* file from mwl root folder into the config folder of the unzipped file
- To start elasticsearch, in the terminal, go to the root folder of the unzipped file and type:
```sh
./bin/elasticsearch & hit enter
```
- This will start elastic search on localhost:9200

####Seed elastic search for meals generated by chefs
- From your application folder, copy "meals.json" file
- Go to the root folder of the unzipped elasticsearch file
- Paste the copied file into the folder
- To drop the data run the following command from anywhere in the terminal:  
```sh
curl -XDELETE 'http://localhost:9200/_all'
```
- In the terminal, from inside the elasticsearch folder run the following command:
```sh
curl -XPOST 'localhost:9200/mwl/meal/_bulk?pretty' --data-binary "@meals.json";
```

## Requirements

- Node 0.10.x
- Express
- Elasticsearch 2.3.x
- Postgresql 9.1.x

## Development

## Deployment

The production application version was deployed to AWS with a multiple EC2 container set-up.
For development, Docker containers separately encapsulated the Postgres database
and the server/client processes. The containers were boostrapped and linked together
using a docker-compose yaml file, with the necessary port exposures
and environment settings to allow communication between the running containers.
Elasticsearch was initially considered as another container, but due to the nature
of both the client and the server making calls to Elasticsearch, it was not feasible
to control the client environment for production purposes, thus switching to
the AWS Elasticsearch service instead. 

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

###Starting the application

- From project root folder
```sh
npm start
npm run watch

- To start ElasticSearch db: from elasticsearch's unzipped folder
```sh
./bin/elasticsearch
```
- To start postgres: run Postgres application
- Install Postgres globally
```sh
npm install -g pg
npm install -g sequelize sequelize-cli
```
- Creating tables with seed data
```sh
sequelize model:create --name users --force --attributes firstName:string,lastName:string,email:string,description:string,phone:string,password:string,address:string,zip:string,profile:string,chef:boolean,numOrders:integer,avgRating:float,stripe:string
```
```sh
sequelize model:create --name orders --force --attributes userId:integer,chefId:integer,mealId:string,food:string,cuisine:string,description:string,quantity:integer,price:float,userAddress:string,orderDate:date,rating:float,review:string,image:string,delivered:boolean
```
```sh
sequelize db:migrate
```
```sh
sequelize db:seed:all
```
- With everything running visit your *localhost:3000* to view the application

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
