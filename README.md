# testDataRepo
A small nodejs application to manage test data. You can create test data sets either manually, mass upload or use provided REST API.


PRECONDITIONS:
+ MONGO DB is available either local or online e.g. mLab.


Steps:

1. Create a .env file like this

SECRET="my-super-secret"
DOMAIN="localhost"
PORT="8080"
DB_URI="mongodb://.../test-data"

2. npm init

3. node server.js

4. enjoy

