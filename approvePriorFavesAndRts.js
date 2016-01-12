// grab my most recent faves, add all users to the friends list
// grab my most recently RT'd tweets, add them to the goodTweets list
// grab my blocklist and add it to the foes list for {reason: priorAssholery}








GET statuses/retweets_of_me
count: 100
id_str


GET favorites/list
count: 200
include_entities: true
user.id_str


GET friends/list
count: 200
cursor: next_cursor || -1
users.forEach (u.id_str)

GET followers/list
count: 200
cursor: next_cursor || -1
users.forEach (u.id_str)
