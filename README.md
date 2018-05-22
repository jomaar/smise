# Smise
This is the core app of smise.net supporting companies and teams to cast globally distributed agile project webs [smise](http://smise.net). This app is based on the meteor framework with a react frontend.
## App Structure																		 
### call chain client (browser)
#### client/main.js
```
{ renderRoutes } from '../imports/startup/client/routes.jsx
render(renderRoutes(), document.getElementById('app’));
```

#### imports/startup/client/routes.jsx

```
export const renderRoutes = () => (
<Router history={browserHistory}>
 <Route path="/" component={AppContainer}>
   <Route path="lists/:id" component={ListPageContainer} />
   <Route path="signin" component={AuthPageSignIn} />
   <Route path="join" component={AuthPageJoin} />
   <Route path="welcome" component={WelcomePage} />
   <Route path="*" component={NotFoundPage} />
 </Route>
</Router>
 );
```

#### imports/ui/containers/AppContainer.jsx

The first argument to createContainer is a reactive function that will get re-run whenever its reactive inputs change.

The returned component will, when rendered, render the second argument (the "lower-order" component) with its provided props in addition to the result of the reactive function. So Foo will receive FooContainer's props as well as {currentUser, listLoading, tasks}.
```
 export default createContainer(() => {
   const publicHandle = Meteor.subscribe('lists.public');
   const privateHandle = Meteor.subscribe('lists.private');
   return {
	 user: Meteor.user(),
	 loading: !(publicHandle.ready() && privateHandle.ready()),
	 connected: Meteor.status().connected,
	 menuOpen: Session.get('menuOpen'),
	 validateInputOnChange: Session.get('validateInputOnChange'),
	 lists: Lists.find({ $or: [
	   { userId: { $exists: false } },
	   { userId: Meteor.userId() },
	 ] }).fetch(),
   };
 }, App);
```

#### imports/ui/layouts/App.jsx
Here we have the first React.component with a render() method. `componentWillReceiveProps` is called whenever props of the App component are changed and will re-route accordingly. 


### call chain server (nodejs)

# Debian Server Admin
Debian version: `lsb_release -da`  
Installed Version: 8.6

### Passenger
`sudo /usr/bin/passenger-config validate-install`  
`sudo /usr/sbin/passenger-memory-stats`

### Shutdown Apache
Stop Apache: `sudo service apache2 stop`
disable Apache: `sudo update-rc.d apache2 disable`  
sudo apt-get install rcconf
sudo rcconf


### nginx
Restart nginx: `sudo service nginx restart`

### mongo
Start mongo server:  
version: `mongo --version`  
dump: `mongodump --db meteor`  
zip: `mongodump --gzip --db test`  

Export json

```
mongoexport --db meteor --collection Lists --out Lists.json
mongoexport --db meteor --collection users --out users.json
mongoexport --db meteor --collection roles --out roles.json
mongoexport --db meteor --collection Todos --out Todos.json
```

Export csv


```
mongoexport --db meteor --collection Lists --type=csv --fields _id,listNo,name,incompleteCount,userId --out Lists.csv
mongoexport --db meteor --collection users --type=csv --fields _id,createdAt,username,profile.organization --out users.csv
mongoexport --db meteor --collection roles --out roles.json
mongoexport --db meteor --collection Todos --type=csv --fields _id,listId,itemNo,itemType,description,measuredValue,measuredValueState,checked,createdAt,nominalSize,upperDeviation,lowerDeviation --out Todos.csv
```

test
