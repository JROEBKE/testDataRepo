# testDataRepo
A small nodejs application to manage test accounts. You can create test accounts either manually, mass upload or use provided REST API.


PRECONDITIONS:
+ MONGO DB is available either local or online e.g. mLab.
+ For token validation you need to have an token provider e.g. Auth0

Steps:

1. Create a .env file like this

SECRET="" //Add your secret
DOMAIN="localhost"
PORT="8080"
DB_URI="mongodb://.../test-data"

2. If you want basic auth as part of your project for websites just add to env file following parameters

USER="" //Add your user
PASSWORD=""  //Add your user
BASICAUTH="true"  //only if true as value is provided it will activate

3. If you want to active OAuth token protection for API endpoints add following parameter to env file. If you have no

JWT="true"
JWTAUDIENCE="" //Add audience
JWTISSUER="" //Add your issuer URL

4. npm init

5. node server.js

6. enjoy


Known issues:
- GUI is ugly, but I do not care
- csv export does not work properly
- csv bulk update instead create
- show specific errors in bulk upload
- bulk upload validation
- automated template download not working
- error handling in API not yet finalized
- update to Swagger OpenApi 3.0 is overdue
