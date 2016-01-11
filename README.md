# mutuals

:fist: a blockbot for twitter

===================

Mutuals has 1 basic rules:

1. if you don't follow a user and they interact with you, block them.
2. if a user follows you, the bot will wait SPAN_OF_TIME before blocking them, thus giving you a chance to follow them back.
3. ????????????????



### DEVELOPMENT

- *_this bot is a work in progress_*. if you want to try it out or contribute, the best way to get involved is to open an issue.

## WITH THAT SAID: installation

1. make a heroku account. it will cost 0$. u prbly don't need to enter a credit card i don't think. (unless u do now)
2. click this button: [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
3. cool! u have a copy of the bot now. go to the app on heroku 
3.5 login to the twitter account u wanna run the bot on. apps.twitter.com. api keys, phone number magics, etc.
3.75 click the button to edit environment variables and add yr API keys to the corresponding thingy. 
3.95 this is also where you would add configuration settings if there were any
4. ok so now visit the scheduler set the bot script to run at INTERVAL_OF_TIME. too often and yr api keys will be revoked, too rarely and the spam will get through to yr eyes/brain
5. MAGIC! the bot will block/soft-block as appropriate!

