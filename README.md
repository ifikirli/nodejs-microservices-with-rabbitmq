### **Node.js Microservices with Rabbitmq**

The project was developed for meeting calendar case. To develop it, there are some prerequisites.

    - node version : v14.17.0
    - yarn version : 1.22.5
    - docker version : 20.10.2
    - docker-compose version : 1.27.4

This project focuses on microservice architecture. It means that there is one api gateway where clients can send request and services processing request coming from api gateway.

Api gateway follows responsibilities below:

    - validating token if required,
    - handling pagination in middleware if required,
    - validating request,
    - send service request on rabbitmq.

Services follows responsibilities below:

    - consuming messages in rabbitmq queue,
    - validating request coming from api gateway,
    - send customized response if api gateway waits response.

Postgresql was used as database. Api gateway is responsible on database migration and services have only connection with database to process data. Knex.js was used as query builder. You can see more details from link https://knexjs.org/.

Rabbitmq was used with messaging between services or between api gateway and services. you can see more details from link https://www.rabbitmq.com/getstarted.html. **Amqlib** npm package was used for rabbitmq operation. If you wonder details of amqlib methods you can find out them from link http://www.squaremobius.net/amqp.node/channel_api.html. Api gateway and services used different messaging types that are below:

    - remote procedure call(RPC), it is used if response must be waited. Specific queue waits a message and then processes message. Client waits response.
    - worker queue, message is sent to queue and response must not be waited.
    - exchange, there are different echange types in rabbitmq. Topic exchange type was used here.

Which queue or exchange must be listened is identified during starting app gateway or services under src/app. 

If you meet prerequisites above, you can run and test all rest apis on **postman** by only running one command.

    docker-compose up -d

You can reach **postman collection** from this url https://documenter.getpostman.com/view/16080504/UVJhDaAA.

