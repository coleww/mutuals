# mutuals

:fist: a blockbot for twitter

### DEVELOPMENT

- *_this bot is a work in progress_*. if you want to try it out or contribute, the best way to get involved is to open an issue.



create table friend (string name) // ???


create table foe (string name) // ???


//   client.query('SELECT NOW() AS "theTime"', function(err, result) {
//     if(err) {
//       return console.error('error running query', err);
//     }
//     console.log(result.rows[0].theTime);
//     //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
//     client.end();
//   });


if a tweet was faved because it was RT'd by someone I follow, OK
if a tweet was faved/RTd by someone who followed me recently, OK fine
ANY mention from someone i don;t follow is a block
ANY adding to a list from someone i don't follow is a block
any interaction with people with [husband father christian, CEO, founder, entrepeneur, etc.] is a block