#########################
install project:
create folder

/root/prod/HairDresser
ili
/root/mark(i)/HairDresser

git clone http://ivan@dev.gotcourts.com:8080/git/HairDresser.git

cd HairDresser

npm install

grunt install
// grunt devInstall

path: /root/mark(i)/HairDresser
service name: mark(i)
pid: 3002
port: 3002

engine: mysql
server address: localhost
database name: mark(i)
port: 3306
user: root ili cshd
password: cshd

grunt redeploy

#########################
redeploy:

go to:
/root/mark(i)/HairDresser

run:
grunt redeploy(taskName) e.g. grunt redeployFrontend



#########################

for dev use:

if you want to rebuild:

goto:
/frontend/build
run:
grunt watchDog

goto:
/database
run:
grunt devInstall

goto:
/backend/src/
run:
npm start

http://localhost:3000/#/

#########################

custom actions

take look at gruntfile of project

#########################