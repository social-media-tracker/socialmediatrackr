# SocialMediaTrackr.com Front-End App

To get this running:

	git clone git@github.com:thomporter/socialmediatrackr.git
	cd socialmediatrackr/front
	npm install
	bower install

## In-Browser Testing

If you want to test it locally:

	grunt serve

Any saved changes to the source will automatically refresh the browser.

## Tests

To run tests:

	grunt test # run all tests (client & server)
	grunt test:server # test the server (api) only
	grunt test:client # test the client only

## Requirements
The app requires [Node.JS](http://nodejs.org/download/).  32 or 64 bit is fine. The app 
is being written against version  v0.10.31.
Linux/Mac users should use the [Node Version Manager](https://github.com/creationix/nvm) to manage
NodeJS versions.

