var Twit = require('twit')
var T = new Twit(require('./config'))

var sentiment = require('sentiment')
var wf = require('wordfilter')
var ic = require('iscool')()
var tipots = require('this-is-probably-ok-to-say')
var warnings = ['ceo', 'founder', 'entrepeneur', 'christian', 'husband', 'father', 'big data', 'data vis', 'uber', 'google', 'paypal', 'amazon', 'microsoft', 'gamer', 'gate', 'free speech', 'first amendment', 'gun', 'second amendment']
var botUnameReggie = /\w+\_?\w+\d*/i




// var MongoClient = require('mongodb').MongoClient

// Connection URL
// var url = 'mongodb://localhost:27017/myproject'; // um hrm grep herokus?

// if a tweet was faved because it was RT'd by someone I follow, OK
// if a tweet was faved/RTd by someone who followed me recently, OK fine
// ANY mention from someone i don;t follow is a block
// ANY adding to a list from someone i don't follow is a block
// any interaction from people with [husband father christian, CEO, founder, entrepeneur, etc.] is a block


// Use connect method to connect to the Server
// MongoClient.connect(url, function(err, db) {
//   if(err) {
//     return console.error('could not connect to postgres', err)
//   } else {
    var stream = T.stream('user', {with: 'user', stringify_friend_id: true})
    stream.on('message', function (t) {
      console.log(t)
      if (t.friends) {
        // it's the friends preamble! lets update the list why the heck not?
      } else if (t.event) {
        switch (t.event) {
          // Description Event Name  Source  Target  Target Object
          case 'follow':
            if (t.source.screen_name == 'coleseadubs') {
              // User follows someone  follow  Current user  Followed user Null
            } else {
              // User is followed  follow  Following user  Current user  Null
            }
            break;
          case 'unfollow':
            // User unfollows someone  unfollow  Current user  Followed user Null
            break;
          case 'favorite':
            if (t.source.screen_name == 'coleseadubs') {
              // User likes a Tweet  favorite  Current user  Tweet author  Tweet
            } else {
              // User’s Tweet is liked favorite  Liking user Current user  Tweet
            }
            break;
          case 'quoted_tweet':
            // User’s Tweet is quoted  quoted_tweet  quoting User  Current User  Tweet
            break;
        }












      } else if (t.user) {
        // if (t.user.screen_name == 'coleseadubs') {
        //   handleMyAction(t, db)
        // } else {
        //   handleInteraction(t, db)
        // }
      } else {
        console.log('boop', t)
      }
    })
//   }
// })


function handleMyAction (t, db) {
  // if i fave a tweet by someone, add them to the thing
  // if i block someone, add them to the foes list and remove them from friends if they were

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


// for grabbing bios:
// GET users/lookup
// Returns fully-hydrated user objects for up to 100 users per request, as specified by comma-separated values passed to the user_id and/or screen_name parameters.

function examineUser (u) {
  // check bio for bs words
  // check if i follow them
  // ummm, check if they follow bullshit?
  // check their recent tweets for bullshit
  // check username against reggies, facial rec their background image for that 1 pattern of faces?/collage images



  // check backround image for that collage image thing of the fake women accounts with the /first_last/d+/ kinda usernames
  // profile_background_image_url
  // profile_image_url // idk if there are avi patterns




  // GET statuses/user_timeline
  // user_id: id_str
  // check with wordfilters, sentiment analysis, ummmmm


  // T.get('statuses/user_timeline', {screen_name: un, count: 200}, function(err, targ) {
  //   // console.log(err, targ)
  //   var the_tweets = JSON.parse(targ).map(function (l) {return l.text})
  //   var total = the_tweets.map(function (t) {
  //     return sentiment(t).score
  //   }).reduce(function (a, b) {
  //     return a + b
  //   }, 0)

  //   console.log(total, the_tweets.length)
  //   cb(total / the_tweets.length)
  // })




}

function checkIfGood (db, data, cb) {
  var collection = db.collection(data.type);
   // Find some documents
  collection.find(data.data).toArray(function(err, docs) {
    if (err) {
      return console.error(err)
    } else {
      cb(docs)
    }
  })
}

function saveData (db, data, cb) {
  // COLLECTIONS include:
  // friends {id_str: true} // because i faved/RT'd/followed them, or they are 1 hop from a mutual friend
  // foes {id_str: true, reason: [str, ...]}
  // goodTweets {id_str: true}
  var collection = db.collection(data.type);
  // Insert some documents
  collection.insertMany(data.data, function(err, result) {
    if (err) {
      return console.error(err)
    } else {
      cb(result)
    }
  })
}
