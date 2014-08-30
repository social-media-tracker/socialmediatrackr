# SocialMediaTrackr.com 

There are 2 apps here, the "front" app for 
[www.socialmediatrackr.com](http://www.socialmediatrackr.com)
and the "admin" app 
for [admin.socialmediatrackr.com](http://admin.socialmediatrackr.com)

To get them setup:

	git clone git@github.com:thomporter/socialmediatrackr.git
	cd socialmediatrackr/front
	npm install
	bower install
	cd ../admin
	npm install
	bower install


## In-Browser Testing

You can only run one app at a time locally.  To run either of them, go into the `front` or `admin`
folders and then run:

	grunt serve

Give it a few seconds and it should open your default browser to the site.

## Tests

To run tests, go into one of the 2 folders and run:

	grunt test # run all tests (client & server)

	grunt test:server # test the server (api) only

	grunt test:client # test the client only

## Requirements

### NodeJS
The app requires [Node.JS](http://nodejs.org/download/).  32 or 64 bit is fine. The app 
is being written against version  v0.10.31.
Linux/Mac users should use the [Node Version Manager](https://github.com/creationix/nvm) to manage
NodeJS versions.

### Node Module Dependencies

Once Node is installed, open up a command prompt and type:

	npm install -g grunt bower

This will install Grunt and Bower globally on the machine.

### MongoDB

You'll need a [MongoDB](http://www.mongodb.org/downloads) server up and running locally to test.
A default install is fine, the app will setup the DB from there.