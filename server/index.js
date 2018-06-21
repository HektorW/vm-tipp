const Koa = require('koa')
const getScores = require('./getScores')

const app = new Koa()

app.use(async ctx => {
  const playerScores = await getScores()

  ctx.body = `
    <!doctype html>
    <head>
      <title>Vm-tipp 2018</title>

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <style>
        html {
          font-family: monospace;
        }

        body {
          margin: 0 auto;
          max-width: 600px;
        }
      </style>
    </head>
    <body>
      <h1>Vm-Tipp!</h1>
      <ol>
        ${playerScores
          .map(
            playerScore => `
          <li>
            <span>${playerScore.name}</span>
            -
            <span>${playerScore.points}</span>
          </li>
        `
          )
          .join('')}
      </ol>

      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-38222622-2"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-38222622-2');
      </script>
    </body>
    </html>
  `
})

app.listen(process.env.PORT || 4004)
