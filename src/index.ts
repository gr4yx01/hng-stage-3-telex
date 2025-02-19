import express, { json, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import crypto from 'crypto'

const GITHUB_SECRET = 'Pyr_hornet0101'; // Replace with your secret

function verifyGitHubSignature(req: Request, res: Response, next: NextFunction) {
  const signature = req.headers['x-hub-signature'];
  const payload = JSON.stringify(req.body);

  const hmac = crypto.createHmac('sha1', GITHUB_SECRET);
  hmac.update(payload);

  const expectedSignature = `sha1=${hmac.digest('hex')}`;

  if (signature !== expectedSignature) {
    res.status(401).send('Invalid signature');
    return;
  }

  next(); // Proceed to the next middleware or route handler
}

const app = express()



app.use(json())

app.use(cors())

app.get('/', (req, res) => {
    res.json({
        'message': "Hello world"
    })
})

app.use(verifyGitHubSignature);

app.post('/github-webhook', (req, res) => {
    const event = req.headers['x-github-event'];
    const payload = req.body;
  
    // Check if the event is a "starred" event
    if (event === 'star') {
      const repoName = payload.repository.name;
      const userName = payload.sender.login;
  
      console.log(payload.sender);

      res.status(200).send('Notification sent!');
    } else {
      res.status(400).send('Event not recognized.');
    }
  });

app.listen('3000', () => {
    console.log('Server running on port 3000')
})