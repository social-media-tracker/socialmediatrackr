var options = {
	mail_options: {
		from: "SocialMediaTrackr.com <info@socialmediatrackr.com>",
		// cc: "", // optionally CC an email address on every email
		// bcc: "",  // optionally BCC an email address on every email
		// replyTo: "", // optionally set a reply to email (will use from email otherwise.)
	},

	subjects: {
		activity: "SocialMediaTrackr.com Activity Log Update",
	},

	smtp_options: {
	  host: 'localhost',
	  port: 25,
	  auth: {
	    user: 'username',
	    password: 'password'
	  },
	  maxConnections: 5,
	  maxMessages: 10,
	}
};

// don't mess with this. =)
module.exports = options;
