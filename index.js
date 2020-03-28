const amqp = require('amqplib/callback_api');

const CONN_URL =
  'amqp://szfhfngd:a5kKGzXCpV8bAdDIb3dGflSSWbxus4I0@cougar.rmq.cloudamqp.com/szfhfngd';
amqp.connect(CONN_URL, function (err, conn) {
  conn.createChannel(function (err, ch) {
    ch.consume(
      'question',
      async function (msg) {
        const publishToQueue = async (queueName, data) => {
            return ch.sendToQueue(queueName, new Buffer(data));
        };

        const numArray = msg.content.toString().split(',')

        let answer = ''

        switch (numArray[2]) {
          case '+':
            answer = Number(numArray[0]) + Number(numArray[1])
            break;

          case '-':
            answer = Number(numArray[0]) - Number(numArray[1])
            break;

          case '/':
            answer = Number(numArray[0]) / Number(numArray[1])
            break;

          case 'x':
            answer = Number(numArray[0]) * Number(numArray[1])
            break;
        
          default:
            break;
        }

        console.log('.....');
        const pubResponse = await publishToQueue('answer', answer.toString());
        console.log({pubResponse})
        console.log('published answer: ' + answer.toString());
      },
      {
        noAck: true,
      }
    );
  });
});

console.log('Division microservice is running')
