const { join, extname, basename } = require('path')
const { readdirSync, readFileSync, writeFileSync } = require('fs')
const nodeXlsx = require('node-xlsx')
const countryCodes = require('./country-codes')

const sourceDir = join(__dirname, 'excel-files')
const outputDir = join(__dirname, 'json-files')

const parseConfig = {
  matchesPerGroup: 6,
  homeTeamColumn: 0,
  awayTeamColumn: 1,
  resultColumn: 2,
  groups: [
    { row: 6 },
    { row: 15 },
    { row: 24 },
    { row: 33 },
    { row: 42 },
    { row: 51 },
    { row: 60 },
    { row: 69 }
  ],
  quizQuestions: {
    bestScorer: { row: 2, col: 6 },
    mostYellowCards: { row: 4, col: 6 },
    mostCleanSheets: { row: 6, col: 6 },
    biggestWin: { row: 8, col: 6 },
    varDisqualifiedGoals: { row: 10, col: 6 },
    firstFreekickGoal: { row: 13, col: 6 },
    finalsOnOvertime: { row: 15, col: 6 },
    silver: { row: 17, col: 6 },
    clubWithMostPlayersInFinal: { row: 19, col: 6 },
    willSwedenAdvance: { row: 23, col: 6 },
    finalDecidedInregularTime: { row: 25, col: 6 },
    winner: { row: 2, col: 10 }
  }
}

const files = readdirSync(sourceDir)
files.forEach(file => {
  if (extname(file) !== '.xlsx') {
    return
  }

  const [{ data: excelData }] = nodeXlsx.parse(join(sourceDir, file))
  const matchResults = parseConfig.groups
    .map(({ row: groupRow }) =>
      Array(parseConfig.matchesPerGroup)
        .fill()
        .map((_, rowIndex) => ({
          home: excelData[groupRow + rowIndex][parseConfig.homeTeamColumn],
          away: excelData[groupRow + rowIndex][parseConfig.awayTeamColumn],
          guessedResult:
            excelData[groupRow + rowIndex][parseConfig.resultColumn]
        }))
        .map(match => ({
          ...match,
          homeCode: countryCodes[match.home],
          awayCode: countryCodes[match.away]
        }))
    )
    .reduce((flattened, group) => [...flattened, ...group], [])

  const quizQuestions = Object.entries(parseConfig.quizQuestions).reduce(
    (result, [questionKey, { row, col }]) => ({
      ...result,
      [questionKey]: excelData[row][col]
    }),
    {}
  )

  writeFileSync(
    join(outputDir, `${basename(file, '.xlsx')}.json`),
    JSON.stringify({ matchResults, quizQuestions }, null, 2)
  )
})
