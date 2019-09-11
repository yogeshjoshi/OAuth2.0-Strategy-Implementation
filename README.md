# OAuth2.0-Strategy-Implementation
OAuth2.0 strategy implementation and Validation API for Google and Facebook

Change Facebook Validation GRAPH API according to Data you want to retrive from USER Profile.

Create .env (Process Environment File in Project)

.Env File Configuration 

PORT=3001
OAUTH2_CLIENT_ID=CLIENT_ID.apps.googleusercontent.com
OAUTH2_CLIENT_SECRET=SECRET@OAuth
OAUTH2_CALLBACK=http://localhost:3001/auth/google/callback
GOOGLE_OAUTH_VALIDATE_URL=https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=
FACEBOOK_APP_ID=FACEBOOK_APP_ID_HERE
FACEBOOK_APP_SECRET=SECRE_OF_APP_HERE
FACEBOOK_CALLBACK=http://localhost:3001/auth/facebook/callback
FACEBOOK_VALIDATE_URL=https://graph.facebook.com/v4.0/me?fields=id,last_name,email,name,gender,first_name&access_token=
GOOGLE_OAUTH_VALIDATE_PLUS_PROFILE=https://www.googleapis.com/oauth2/v1/userinfo?alt=json
