<!-- <p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)--> 
# 
This project is not runnable. Just for the reference. 

## Description

[Changer-API](https://changer.io/) repository.  

This project provides the following the functions, which is like WAS.  
  + Changer-API : This is for the Changer-Pro Service. 
  + Admin : This is for the administrator Page. 
  + Batch : This is for the particular purpose as liquidation, settelment, and something like that. 
  

## Installation

```bash
$ yarn install
```

## Preparation
- Get MongoDB Authorization.(To. Kyungmin)
- Get Env files.(To. Hyungmin)
- Attach the env file to the project root folder.


## Running the app
> You should provide the env file according to the deployment env.  
> These files can be obtained by the repo. admin.

```bash
# local env.(Changer-Api was + batch)
$ yarn start

# dev env.(Changer-Api was + batch)
$ yarn start:dev

# admin.local env.(admin was)
$ yarn admin

# production mode(api was) *Not yet provided*
$ yarn start:prod : api was
$ yarn start:???: batch
```

## Test

```bash
# unit tests  *Not yet provided*
$ npm run test

# e2e tests  *Not yet provided*
$ npm run test:e2e

# test coverage  *Not yet provided*
$ npm run test:cov
```

## Stay in touch

- You can touch in any person in Cefi team members. 

## Documentation

- You can find the documentations on [the following link](https://github.com/chain-partners/changer-pro-api/wiki)

## ETC
- Swagger(when you run the app as local)
   + Changer-API : http://localhost:8800/api-docs/ 
   + Admin : http://localhost:8801/api-docs/ 
- Postman Link : email to hyungmin.kang@chainpartners.net



