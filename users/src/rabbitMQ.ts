import amqp from "amqplib";
import UsersService from "./services/service";
const userService = new UsersService();

interface requestData {
  action: string;
  replyServiceName: string;
  body?: any;
}

async function startRabbit() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = connection.createChannel();
    const queueName = "USER";

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
          const userID = wantedData.body.id;
          const user = await userService.getSingle(userID);

          (await channel).sendToQueue(
            wantedData.replyServiceName,
            Buffer.from(JSON.stringify(user))
          );

          break;

        case wantedData.action === "getTeachers":
          const teachers = await userService.getTeachers();

          (await channel).sendToQueue(
            wantedData.replyServiceName,
            Buffer.from(JSON.stringify(teachers))
          );
          break;

        case wantedData.action === "auth":
          const currentUser = await userService.getMe(wantedData.body);
          (await channel).sendToQueue(
            wantedData.replyServiceName,
            Buffer.from(JSON.stringify(currentUser))
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

function isRequestData(data: any): data is requestData {
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

export default startRabbit;
