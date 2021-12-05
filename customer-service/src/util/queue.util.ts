/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import amqp, { Connection, Options } from "amqplib";
import config from "../config";
import { Queues } from "../enum/queues";
import { BusinessException } from "../exception/custom.exception";
import ResponseStatusCodes from "../response/response-status-codes";

export default class QueueUtil {
    
    static async connect (): Promise<Connection> {
        
        return new Promise(async (resolve, reject) => {

            try {
                resolve(await amqp.connect(config.RABBITMQ_URL));
            } catch (error) {
                reject(error);
            }
        });
    }

    static async consumeRPC (queue: Queues, queueOptions: Options.AssertQueue, consumeOptions: Options.Consume, consumerService: (params?: any) => any): Promise<void> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                const connection =await this.connect();
                const channel = await connection.createChannel();
                await channel.assertQueue(queue, queueOptions);
                channel.prefetch(1);
                await channel.consume(queue, async consumeMessage => {
                    if (consumeMessage) {
                        await consumerService(consumeMessage.content && consumeMessage.content.length > 0 ? JSON.parse(consumeMessage.content.toString()) : {})
                            .then((response: any) => {
                                channel.sendToQueue(consumeMessage.properties.replyTo, Buffer.from(JSON.stringify(response)), { correlationId : consumeMessage.properties.correlationId });
                            })
                            .catch((error: any) => {
                                channel.sendToQueue(consumeMessage.properties.replyTo, Buffer.from(JSON.stringify(error)), { correlationId : consumeMessage.properties.correlationId });
                            });
                        channel.ack(consumeMessage);   
                    } else
                        reject(new BusinessException(ResponseStatusCodes.MESSAGE_NOT_FOUND_TO_CONSUME.code));
                }, consumeOptions)
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    static async sendMessageToQueue (queue: Queues, queueOptions: Options.AssertQueue, publishOptions: Options.Publish, message?: any): Promise<void> {
        
        return new Promise(async (resolve, reject) => {

            try {
                const connection =await this.connect();
                const channel = await connection.createChannel();
                await channel.assertQueue(queue, queueOptions);
                channel.sendToQueue(queue, Buffer.from(message ? JSON.stringify(message) : ""), publishOptions);
                setTimeout(async () => {
                    await connection.close();
                }, 500);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}