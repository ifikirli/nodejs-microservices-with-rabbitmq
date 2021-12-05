/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import amqp, { Connection, Options } from "amqplib";
import { v4 as uuid } from "uuid";
import config from "../config";
import { Queues } from "../enum/queues";
import { BusinessException, CustomException } from "../exception/custom.exception";
import CustomResponse from "../response/custom.response";
import PaginatedCustomResponse from "../response/paginated-custom.response";
import commonUtil from "./common.util";

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

    static async sendMessageToRPC (queue: Queues, queueOptions: Options.AssertQueue, consumeOptions: Options.Consume,  message?: any): Promise<CustomResponse | PaginatedCustomResponse> {
        
        return new Promise(async (resolve, reject) => {

            try {
                const connection = await this.connect();
                const channel = await connection.createChannel();
                await channel.assertQueue(queue, queueOptions);
                const assertQueue = await channel.assertQueue("", { exclusive : true });
                const correlationId = uuid();
                channel.sendToQueue(queue, Buffer.from(message ? JSON.stringify(message) : ""), { replyTo : assertQueue.queue, correlationId : correlationId });
                channel.consume(assertQueue.queue, consumeMessage => {
                    if (consumeMessage?.properties?.correlationId == correlationId) {
                        setTimeout(async () => {
                            await connection.close();
                        }, 500)
                        const messageContent = JSON.parse(consumeMessage.content.toString());
                        const statusCode = messageContent["status_code"] as number;
                        if (!statusCode)
                            reject(new BusinessException());
                        else if (commonUtil.getSuccessfulResponseCodes().includes(statusCode))
                            resolve(messageContent);
                        else
                            reject(messageContent as CustomException);
                    }
                }, consumeOptions);
            } catch (error) {
                reject(error);
            }
        })
    }
}