import amqp from "amqplib";
import CourseService from "./services/services";

interface requestData {
  action: string;
  replyServiceName: string;
  body?: any;
}

async function startRabbit() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = connection.createChannel();
    const queueName = "COURSE";

    (await channel).assertQueue(queueName, {
      durable: false,
    });

    (await channel).consume(queueName, async (msg) => {
      const content = msg?.content.toString();
      if (!content) {
        console.log("recived content is not valid, courses rabbit =>", content);
        return;
      }

      const wantedData = JSON.parse(content) as requestData;
      if (!isRequestData(wantedData)) {
        console.log("courses rabbitmq =>", content);
        return;
      }

      const courseService = new CourseService();

      switch (true) {
        case wantedData.action === "getSingle":
          const data = await courseService.getSingle(wantedData.body?.id);
          if (!wantedData.body?.id) {
            await sendFailedResult(
              channel,
              400,
              "you must send course id to me.",
              wantedData.replyServiceName
            );
            return;
          }

          (await channel).sendToQueue(
            wantedData.replyServiceName,
            Buffer.from(JSON.stringify(data))
          );
          break;

        default:
          await sendFailedResult(
            channel,
            404,
            "you have an unknown action for course service.",
            wantedData.replyServiceName
          );
          break;
      }
    });
  } catch (error) {
    // await sendFailedResult(
    //   channel,
    //   404,
    //   "you have an unknown action for course service.",
    //   wantedData.replyServiceName
    // );
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

async function sendFailedResult(
  channel: Promise<amqp.Channel>,
  status: Number,
  result: string,
  replyServiceName: string
) {
  (await channel).sendToQueue(
    replyServiceName,
    Buffer.from(
      JSON.stringify({
        status,
        result,
      })
    )
  );

  return;
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
