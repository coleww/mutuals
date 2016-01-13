# mutuals

:fist: a blockbot for twitter

### DEVELOPMENT

- *_this bot is a work in progress_*. 

if you want to try it out or contribute, the best way to get involved is to open an issue over there =>

or is it up top now? idk gl.

### MONGODB

  // COLLECTIONS include:
  // friends {id_str: true} // because i faved/RT'd/followed them, or they are 1 hop from a mutual friend
  // foes {id_str: true, reason: [str, ...]}
  // goodTweets {id_str: true}