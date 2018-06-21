const Koa = require('koa')
const getScores = require('./getScores')

const app = new Koa()

app.use(async ctx => {
  const playerScores = await getScores()

  ctx.body = `
    <!doctype html>
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
    </body>
    </html>
  `
})

app.listen(process.env.PORT || 4004)
