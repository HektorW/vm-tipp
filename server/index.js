const { join, extname, basename } = require('path')
const { readdirSync, readFileSync } = require('fs')
const fetch = require('node-fetch')

const apiUrl = 'https://world-cup-json.herokuapp.com/matches'
const jsonFilesDir = join(__dirname, '../parser/json-files')

const fetchMatches = async () => {
  const response = await fetch(apiUrl)
  if (response.ok) {
    return response.json()
  }
}

const getPlayers = () => {
  const playerFiles = readdirSync(jsonFilesDir)
  return playerFiles
    .filter(playerFile => extname(playerFile) === '.json')
    .map(playerFile => ({
      name: basename(playerFile, '.json'),
      content: JSON.parse(readFileSync(join(jsonFilesDir, playerFile)))
    }))
}

const didGuessRight = (match, playerGuess) => {
  switch (`${playerGuess}`.toLowerCase()) {
    case '1':
      return match.home_team.goals > match.away_team.goals
    case '2':
      return match.away_team.goals > match.home_team.goals
    case 'x':
      return match.home_team.goals === match.away_team.goals
  }
}

const getPlayerMatchScores = (player, matches) =>
  matches.map(match => {
    const playerMatch = player.matchResults.find(
      matchResult =>
        match.home_team.code === matchResult.homeCode &&
        match.away_team.code === matchResult.awayCode
    )

    let points = null
    if (playerMatch) {
      points = didGuessRight(match, playerMatch.guessedResult) ? 2 : 0
    }

    return {
      points,
      guessed: playerMatch ? playerMatch.guessedResult : null,
      homeTeam: match.home_team,
      awayTeam: match.away_team
    }
  })

fetchMatches().then(matches => {
  const players = getPlayers()
  const finishedMatches = matches.filter(match => match.status === 'completed')

  players.forEach(player => {
    const totalPoints = getPlayerMatchScores(
      player.content,
      finishedMatches
    ).reduce((total, match) => total + match.points, 0)
    console.log(player.name, totalPoints)
  })
})
