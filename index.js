const amqp = require('amqplib/callback_api');

const CONN_URL =
  'amqp://szfhfngd:a5kKGzXCpV8bAdDIb3dGflSSWbxus4I0@cougar.rmq.cloudamqp.com/szfhfngd';
amqp.connect(CONN_URL, function (err, conn) {
  conn.createChannel(function (err, ch) {
    ch.consume(
      'division',
      async function (msg) {
        const publishToQueue = async (queueName, data) => {
            ch.sendToQueue(queueName, new Buffer(data));
        };

        const numArray = msg.content.toString().split(',')
        const quotient = Number(numArray[0]) / Number(numArray[1])

        console.log('.....');
        await publishToQueue('quotient', quotient.toString());
        console.log('published division');
      },
      {
        noAck: true,
      }
    );
  });
});

console.log('Division microservice is running')
