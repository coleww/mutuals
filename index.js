var Twit = require('twit')
var T = new Twit(require('./config'))
var sentiment = require('sentiment')
var wf = require('wordfilter')
var ic = require('iscool')()
var tipots = require('this-is-probably-ok-to-say')
var WARNINGS = ['startups', 'investing', 'ceo', 'founder', 'entrepeneur', 'christian', 'husband', 'father', 'big data', 'data vis', 'uber', 'google', 'paypal', 'amazon', 'microsoft', 'gamer', 'gate', 'free speech', 'first amendment', 'gun', 'second amendment']
var BOTUNAMEREGGIE = /\w+\_?\w+\d*/i

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
              approve(db, t.target.id_str, 'friends')
            } else {
              // someone followed me
              examineUser(db, t.source, function (err, res) {
                if (res.is_probably_a_turd) {
                  deapprove(db, t.source.id_str, res.why)
                } else {
                  // schedule a time to block them at if i don't positively interact with them first?
                }
              })
            }
            break;
          case 'block':
            // i blocked someone
            deapprove(db, t.target.id_str, 'blocked on ' + Date.now())
            break;
          case 'unfollow':
            // i unfollowed someone
            deapprove(db, t.target.id_str, 'unfollowed on ' + Date.now())
            break;
          case 'favorite':
            if (t.source.screen_name == 'coleseadubs') {
              // i fave someones tweet (dig for the RT op?)
              approve(db, t.target.id_str, 'user')
            } else {
              // someone faves my tweet
              examineFavorite(t.source, t.target_object)
            }
            break;
          case 'quoted_tweet':
            // someone quote RTs my tweet
            examineRT(db, t.source, t.target_object)
            break;
        }
      } else if (t.user && t.user.screen_name !== 'coleseadubs') {
        // i am being RTd or mentioned i guess
        if (t.retweeted_status) {
          examineRT(db, t.user, t.retweeted_status)
        } else {
          examineMention(db, t)
        }
      } else {
        console.log('boop idk whatever', t)
      }
    })
  }
})

function examineMention (db, tweet) {
  var userObj = {}
  userObj[tweet.user.id_str] = true
  getData(db, {type: 'friends', data: userObj}, function (err, res) {
    if (!res.length) {
      deapprove(db, tweet.user.id_str, 'sliding into ' + tweet.id_str)
    }
  })
}


function examineRT (db, user, tweet) {
  getData(db, {type: 'friends', data: {user.id_str: true}}, function (err, res) {
    if (res.length) {
      approve(db, 'goodTweets', tweet.id_str})
    } else {
      deapprove(db, user.id_str, 'random RT of ' + tweet.id_str + ' at ' + Date.now())
    }
  })
}

function examineUser (db, user, cb) {
  var reasons = []
  var userObj = {}
  userObj[user.id_str] = true
  getData(db, {type: 'friends', data: userObj}, function (err, res) {
    if (res.length) {
      // call that callback positively!
      // they are a friend! it's chill!
    } else {
      T.get('users/show', {user_id: user.id_str}, function (err, res) {
        if (res.favourites_count < 100) reasons.push('like more stuff')
        if (!res.listed_count) reasons.push('y no one list u? huh?')
        if (res.verified) reasons.push('fuck u celebrity jerk')
        if (res.statuses_count < 100) reasons.push('tweet more')
        if (res.followers_count > 17500) reasons.push('too many followers')
        if (res.friends_count < 50) reasons.push('make more friends')
        if (res.default_profile || res.default_profile_image) reasons.push('egg profile')
        WARNINGS.filter(function (word) {return res.description.match(new RegExp(word, 'i'))}).forEach(function (match) {
          reasons.push('bio contains ' + match[0])
        })
        if (user.screen_name.match(BOTUNAMEREGGIE)) reasons.push('name matches the reggie')

        T.get('statuses/user_timeline', {user_id: user.id_str, count: 200}, function (err, res) {
          var the_tweets = JSON.parse(res).map(function (l) {return l.text})
          var total = the_tweets.map(function (t) {
            return sentiment(t).score
          }).reduce(function (a, b) {
            return a + b
          }, 0)
          var averageSentiment = total / the_tweets.length
          if (averageSentiment < -5) reasons.push('why so negative?')

          var red = []
          var yellow = []
          var green = []

          the_tweets.forEach(function (tweet) {
            if (wordfilter.blacklisted(tweet)) red.push(tweet)
            tweet.split(' ').forEach(function (word) {
              if (!iscool(word)) yellow.push(tweet)
            })
            if (!tipots(tweet)) green.push(tweet)
          })
          // violating wordfilter is an auto no. the next 2 if's will get added and the user will be blocked
          if (red.length) reasons.push('unacceptable isms')
          // violating just iscool probably means they tweet about tragic stuff a lot maybe idk
          if (yellow.length > (the_tweets.length * 0.025)) reasons.push('probably super problematic')
          // violating tipots alone is not as bad, but maybe is, idk, we'll see, sure
          if (!yellow.length && green.length > (the_tweets.length * 0.05)) reasons.push('probably shitty')





// hrmmmm
// ummm, check if they follow bullshit?
// check their recent tweets for bullshit
// check username against reggies, facial rec their background image for that 1 pattern of faces?/collage images



// check backround image for that collage image thing of the fake women accounts with the /first_last/d+/ kinda usernames
// profile_background_image_url
// profile_image_url // idk if there are avi patterns









          var results = {}
          results.is_probably_a_turd = reasons.length > 1
          results.reason = reasons.join()
          cb(err, results)
        })
      })
    }
  })
}


function examineFavorite (db, user, tweet) {
  // check if the tweet is a good tweet. if so, it's ok
  // check if the user is a friend/ if so it's ok
  // THEN examine that user. Then maybe do the same "follower approved" timer thing
}

function approve (db, id_str, type) {
  var thingObj = {}
  thingObj[id_str] = true
  saveData(db, {type: type, data: thingObj}, function (err, res) {
    console.log('added:', type, id_str)
  })
}

function deapprove (db, id_str, reason) {
  // will always be blocking a user i think...
  var thingObj = {}
  thingObj[id_str] = true
  T.post('blocks/create', {user_id: id_str}, function (err, res) {
    deleteData (db, {type: 'friends', data: thingObj}, function (err, res) {
      thingObj[id_str] = 'reason'
      saveData (db, {type: 'foes', data: thingObj}, function (err, res) {
        console.log('deleted:', id_str, reason)
      })
    })
  })
}


function getData (db, data, cb) {
  db.collection(data.type).find(data.data).toArray(function (err, result) {
    if (err) console.log(err)
    cb(err, result)
  })
}

function saveData (db, data, cb) {
  db.collection(data.type).insertOne(data.data, function (err, result) {
    if (err) console.log(err)
    cb(err, result)
  })
}

function deleteData (db, data, cb) {
  db.collection(data.type).deleteDocument(data.data, function (err, result) {
    if (err) console.log(err)
    cb(err, result)
  })
}
