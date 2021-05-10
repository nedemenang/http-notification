# HTTP NOTIFICATION SYSTEM

## Background Information

A server that keeps track of topics and subscribers, where a topic is a string and a subscriber is a HTTP endpoint. When a message is published on a topic, it is forwarded to all subscriber endpoints.

## Features

Users can subscribe to a topic: [POST] `/subscribe/:topic`

Users can publish to a topic: [POST] `/publish/:topic`

## Dependencies

- NodeJs
- ExpressJS

## Installing and setup

- Navigate to directory of choice on terminal.

- Clone this repository on that directory.

- Ensure node is installed

- Install all app Dependencies by running npm install

- Run the application using `npm start`

- Run tests by using `npm run tests`

- Send requests to `http://localhost:3128`

## Built With

- NodeJs
- ExpressJS
