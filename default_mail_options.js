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
	  host: 'server.bluby.com',
	  port: 465,
	  secure: true,
	  auth: {
	    user: 'info@socialmediatrackr.com',
	    password: 'Guardme1!'
	  },
	  maxConnections: 5,
	  maxMessages: 10,
	}
};

// don't mess with this. =)
module.exports = options;
