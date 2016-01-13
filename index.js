var Twit = require('twit')
var T = new Twit(require('./config'))
var sentiment = require('sentiment')
var wf = require('wordfilter')
var ic = require('iscool')()
var tipots = require('this-is-probably-ok-to-say')
var warnings = ['startups', 'investing', 'ceo', 'founder', 'entrepeneur', 'christian', 'husband', 'father', 'big data', 'data vis', 'uber', 'google', 'paypal', 'amazon', 'microsoft', 'gamer', 'gate', 'free speech', 'first amendment', 'gun', 'second amendment']
var botUnameReggie = /\w+\_?\w+\d*/i

require('mongodb').MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
  if(err) {
    return console.error('could not connect to postgres', err)
  } else {
    var stream = T.stream('user', {with: 'user', stringify_friend_id: true})
    stream.on('message', function (t) {
      console.log(t)
      if (t.event) {
        switch (t.event) {
          case 'follow':
            if (t.source.screen_name == 'coleseadubs') {
              // i followed someone
              approve(t.target.id_str, 'user')
            } else {
              // someone followed me
              examineUser(t.source)
            }
            break;
          case 'block':
            // i blocked someone
            deapprove(t.target.id_str, 'user')
            break;
          case 'unfollow':
            // i unfollowed someone
            deapprove(t.target.id_str, 'user')
            break;
          case 'favorite':
            if (t.source.screen_name == 'coleseadubs') {
              // i fave someones tweet (dig for the RT op?)
              approve(t.target.id_str, 'user')
            } else {
              // someone faves my tweet
              examineFaver(t.source, t.target_object)
            }
            break;
          case 'quoted_tweet':
            // someone quote RTs my tweet
            examineRT(t.source, t.target_object)
            break;
        }
      } else if (t.user && t.user.screen_name !== 'coleseadubs') {
        // i am being RTd or mentioned i guess
        if (t.retweeted_status) {
          examineRT(t.user, t.retweeted_status)
        } else {
          examineMention(t)
        }
      } else {
        console.log('boop idk whatever', t)
      }
    })
  }
})

function examineUser (user) {

}

function examineMention (tweet) {
  // check if user is a friend
  // if not, block'em
}


function examineRT (user, tweet) {
  // if user is on friends list
  // the tweet is chill to get faved
  // otherwise block'em
}

// for grabbing bios:
// GET users/lookup
// Returns fully-hydrated user objects for up to 100 users per request, as specified by comma-separated values passed to the user_id and/or screen_name parameters.

function examineFavorite (user, tweet) {
  // check bio for bs words
  // check if i follow them
  // ummm, check if they follow bullshit?
  // check their recent tweets for bullshit
  // check username against reggies, facial rec their background image for that 1 pattern of faces?/collage images



  // check backround image for that collage image thing of the fake women accounts with the /first_last/d+/ kinda usernames
  // profile_background_image_url
  // profile_image_url // idk if there are avi patterns


// if a tweet was faved because it was RT'd by someone I follow, OK
// if a tweet was faved/RTd by someone who followed me recently, OK fine
// ANY mention from someone i don;t follow is a block
// ANY adding to a list from someone i don't follow is a block
// any interaction from people with [husband father christian, CEO, founder, entrepeneur, etc.] is a block



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

function approve (id_str, type) {

}

function deapprove (id_str, type) {

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
