import amqp from "amqplib";

interface requestData {
  action: string;
  replyServiceName: string;
  body?: any;
}

async function startRabbit() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = connection.createChannel();
    const queueName = "PURCHASE";

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

      // todo
    });
  } catch (error) {
    throw error;
  }
}

async function callService(sendingTo: string, data: requestData): Promise<any> {
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

      channel.sendToQueue(sendingTo, Buffer.from(JSON.stringify(data)));
    });

    await channel.close();
    return result;
  } catch (error) {
    throw error;
  }
}

function isRequestData(data: any): data is requestData {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.action === "string" &&
    typeof data.replyServiceName === "string" &&
    (data.body === undefined || typeof data.body === "object")
  );
}

export { startRabbit, callService };
