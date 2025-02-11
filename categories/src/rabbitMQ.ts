import amqp from "amqplib";
import CategoryService from "./service/service";
const categoryService = new CategoryService();

interface requestData {
  action: string;
  replyServiceName: string;
  body?: any;
}

async function startRabbit() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = connection.createChannel();
    const queueName = "CATEGORY";

    (await channel).assertQueue(queueName, {
      durable: false,
    });

    (await channel).consume(queueName, async (msg) => {
      const content = msg?.content.toString();
      if (!content || !isRequestData(content)) {
        console.log(content);
        return;
      }

      const wantedData = JSON.parse(content) as requestData;

      switch (true) {
        case wantedData.action === "getSingle":
          const categoryID = wantedData.body?.id || "0";
          const category = await categoryService.getSingle(categoryID);

          (await channel).sendToQueue(
            wantedData.replyServiceName,
            Buffer.from(JSON.stringify(category))
          );

          break;

        case wantedData.action === "getAll":
          const categories = await categoryService.getAll();

          (await channel).sendToQueue(
            wantedData.replyServiceName,
            Buffer.from(JSON.stringify(categories))
          );
          break;

        case wantedData.action === "remove":
          const catID = wantedData.body.id;
          const removedResult = await categoryService.remove(catID);

          (await channel).sendToQueue(
            wantedData.replyServiceName,
            Buffer.from(JSON.stringify(removedResult))
          );
          break;

        default:
          (await channel).sendToQueue(
            wantedData.replyServiceName,
            Buffer.from(
              JSON.stringify({ status: 404, result: "no clear action." })
            )
          );
          break;
      }
    });
  } catch (error) {
    throw error;
  }
}

async function callService(sendToService: string, data: requestData) {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue(data.replyServiceName, {
      durable: false,
    });

    const result = await new Promise((resolve) => {
      channel.consume(
        data.replyServiceName,
        async (msg) => {
          const result: { status: string; result: any } = JSON.parse(
            msg?.content.toString() ||
              '{"status":500,"result":"no clear result."}'
          );

          resolve(result);
        },
        {
          noAck: true,
        }
      );

      channel.sendToQueue(sendToService, Buffer.from(JSON.stringify(data)));
    });

    await channel.close();
    return result;
  } catch (error) {
    throw error;
  }
}

function isRequestData(data: any): boolean {
  try {
    data = JSON.parse(data);
    return (
      typeof data === "object" &&
      data !== null &&
      typeof data.action === "string" &&
      typeof data.replyServiceName === "string" &&
      (data.body === undefined || typeof data.body === "object")
    );
  } catch (error) {
    return false;
  }
}

export { startRabbit, callService };
