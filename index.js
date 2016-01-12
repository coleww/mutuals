var Twit = require('twit')
var T = new Twit({consumer_key: process.env.consumer_key, consumer_secret: process.env.consumer_secret, access_token: process.env.access_token, access_token_secret: process.env.access_token_secret})
var pg = require('pg')
var client = new pg.Client("postgres://username:password@localhost/database")

client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err)
  } else {
    var stream = T.stream('user')
    stream.on('message', function (t) {
      console.log(t)
      if (t.user.screen_name == 'coleseadubs') {
        handleMyAction(t, client)
      } else {
        handleInteraction(t, client)
      }
    })
  }
})

function handleMyAction (t, db) {
  switch (t.event) {
    case 'follow':
      sdg
      break;
    case 'etc':
      sdg
      break;
    case 'etc':
      sdg
      break;
  }
}

function handleInteraction (t, db) {
  switch (t.event) {
    case 'follow':
      sdg
      break;
    case 'etc':
      sdg
      break;
    case 'etc':
      sdg
      break;
  }
}

function examineUser (u) {
  // check bio for bs words
  // check if i follow them
  // ummm, check if they follow bullshit?
  // check their recent tweets for bullshit
  // check username against reggies, facial rec their background image for that 1 pattern of faces?/collage images
}



