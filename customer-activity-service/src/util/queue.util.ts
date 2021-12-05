/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import amqp, { Connection, Options } from "amqplib";
import config from "../config";
import { ExchangeTypes } from "../enum/exchange-types";
import { Exchanges } from "../enum/exchanges";
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

    static async consumeQueue (queue: Queues, prefetchCount: number, queueOptions: Options.AssertQueue, consumeOptions: Options.Consume, consumerService: (params?: any) => any): Promise<void> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                const connection =await this.connect();
                const channel = await connection.createChannel();
                await channel.assertQueue(queue, queueOptions);
                await channel.prefetch(prefetchCount);
                channel.consume(queue, async consumeMessage => {
                    if (consumeMessage) {
                        consumerService(consumeMessage.content && consumeMessage.content.length > 0 ? JSON.parse(consumeMessage.content.toString()) : {});
                    } else
                        reject(new BusinessException(ResponseStatusCodes.MESSAGE_NOT_FOUND_TO_CONSUME.code));
                }, consumeOptions);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    static async consumeExchange (exchange: Exchanges, exchangeType: ExchangeTypes, pattern: string, exchangeOptions: Options.AssertExchange, consumeOptions: Options.Consume, consumerService: (params?: any) => any): Promise<void> {
        
        return new Promise(async (resolve, reject) => {
            
            try {
                const connection =await this.connect();
                const channel = await connection.createChannel();
                await channel.assertExchange(exchange, exchangeType, exchangeOptions);
                const assertQueue = await channel.assertQueue("", { exclusive : true });
                await channel.bindQueue(assertQueue.queue, exchange, pattern);
                channel.consume(assertQueue.queue, async consumeMessage => {
                    if (consumeMessage) {
                        consumerService(consumeMessage.content && consumeMessage.content.length > 0 ? JSON.parse(consumeMessage.content.toString()) : {});
                    } else
                        reject(new BusinessException(ResponseStatusCodes.MESSAGE_NOT_FOUND_TO_CONSUME.code));
                }, consumeOptions);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}