import { Accounts } from 'meteor/accounts-base'
import { EJSON } from 'meteor/ejson'
import { Todos } from '../todos/todos.js'
import { Lists } from '../lists/lists.js'

const baby = require('babyparse')

function initUserProject (user, data) {

  let timestamp = (new Date()).getTime()

  data.forEach((list) => {

    const listId = Lists.insert({
      name: list.name,
      incompleteCount: list.items.length,
      completed: false,
      userId: user._id,  // ja makes all lists private to user
    })

    list.items.forEach((listItem) => {
      let itemType = listItem.type;
      let itemNoLevel = listItem.itemNo;
      switch (true) {
        case (itemType[0] === 'L'):
          Todos.insert({
            listId,
            itemNo: (parseFloat(listItem.itemNo) + (parseFloat(itemType[1]) * 0.1)).toString(),
            itemType: listItem.type,
            description: listItem.description,
            /* nominalSize: listItem.nominalSize.replace(',', '.'),
            upperDeviation: listItem.upperDeviation.replace(',', '.'),
            lowerDeviation: listItem.lowerDeviation.replace(',', '.'),
            relevance: listItem.relevance,
             measuredValue: '>',  // '>'
            measuredValueState: 'not_yet_measured', */
            checked: true,
            /* gaugeResult: listItem.gaugeResult,
            b1: listItem.b1,
            b2: listItem.b2,
            d: listItem.d,
            calcResult: listItem.calcResult, */
            createdAt: new Date(timestamp),
          });
          break;
        case (itemType === 'production time in minutes'):
          Todos.insert({
            listId,
            itemNo: itemNoLevel,
            itemType: listItem.type,
            description: listItem.description,
            /* nominalSize: listItem.nominalSize.replace(',', '.'),
            upperDeviation: listItem.upperDeviation.replace(',', '.'),
            lowerDeviation: listItem.lowerDeviation.replace(',', '.'), */
            relevance: listItem.relevance,
            measuredValue: '>',  // '>'
            measuredValueState: 'not_yet_measured',
            checked: false,
            /* gaugeResult: listItem.gaugeResult,
            b1: listItem.b1,
            b2: listItem.b2,
            d: listItem.d,
            calcResult: listItem.calcResult, */
            createdAt: new Date(timestamp),
          });
          break;
        case (itemType === 'image'):
          Todos.insert({
            listId,
            itemNo: itemNoLevel,
            itemType: listItem.type,
            description: listItem.description,
            url: listItem.url,
            // ja müsste raus und im schema in todos.js optional gesetzt werden oder ein ganz eigenes Objekt werden
            /* nominalSize: listItem.nominalSize.replace(',', '.'),
            upperDeviation: listItem.upperDeviation.replace(',', '.'),
            lowerDeviation: listItem.lowerDeviation.replace(',', '.'),
            relevance: listItem.relevance,
            /* measuredValue: '>',  // '>'
            measuredValueState: 'not_yet_measured', */
            checked: true,
            /* gaugeResult: listItem.gaugeResult,
            b1: listItem.b1,
            b2: listItem.b2,
            d: listItem.d,
            calcResult: listItem.calcResult, */
            createdAt: new Date(timestamp),
          });
          break;
        case (itemType === 'href'):
          Todos.insert({
            listId,
            itemNo: itemNoLevel,
            itemType: listItem.type,
            description: listItem.description,
            url: listItem.url,
            // ja müsste raus und im schema in todos.js optional gesetzt werden oder ein ganz eigenes Objekt werden
            /* nominalSize: listItem.nominalSize.replace(',', '.'),
            upperDeviation: listItem.upperDeviation.replace(',', '.'),
            lowerDeviation: listItem.lowerDeviation.replace(',', '.'),
            relevance: listItem.relevance,
            /* measuredValue: '>',  // '>'
            measuredValueState: 'not_yet_measured', */
            checked: true,
            /* gaugeResult: listItem.gaugeResult,
            b1: listItem.b1,
            b2: listItem.b2,
            d: listItem.d,
            calcResult: listItem.calcResult, */
            createdAt: new Date(timestamp),
          });
          break;
        case (itemType === 'html'):
          Todos.insert({
            listId,
            itemNo: itemNoLevel,
            itemType: listItem.type,
            description: listItem.description,
            text: listItem.text,
            checked: true,
            createdAt: new Date(timestamp),
          });
          break;        default:
          Todos.insert({
            listId,
            itemNo: itemNoLevel,
            itemType: listItem.type,
            description: listItem.description,
            nominalSize: listItem.nominalSize.replace(',', '.'),
            upperDeviation: listItem.upperDeviation.replace(',', '.'),
            lowerDeviation: listItem.lowerDeviation.replace(',', '.'),
            relevance: listItem.relevance,
            measuredValue: '>',  // '>'
            measuredValueState: 'not_yet_measured',
            checked: false,
            /* gaugeResult: listItem.gaugeResult,
            b1: listItem.b1,
            b2: listItem.b2,
            d: listItem.d,
            calcResult: listItem.calcResult, */
            createdAt: new Date(timestamp),
          })
      }

      timestamp += 1 // ensure unique timestamp.
    })
  })
}

// Support for playing D&D: Roll 3d6 for dexteritypwd

Accounts.onCreateUser((options, user) => {
  // user.accountId = "Fritz!";
  // We still want the default hook's 'profile' behavior.
  // console.log(options);

  if (options.profile) { user.profile = options.profile }
  // user.city = options.profile.city;

  // console.log("Importing protocol items to db")

  //  var csvText = Assets.getText('data/Pos1-Ar-neu.csv');
  // console.log(csvText);
  //  var parsed = baby.parse(csvText, { header: true, delimiter: ';' });
  // console.log(parsed);

  const data = JSON.parse(Assets.getText('data/data.json'))
  // var data = Assets.getText("data/protocolItems.json");
  // console.log(data);

  // console.log("");

  initUserProject(user, data)

  /* data.forEach(function (item, index, array) {
    Todos.insert(item);
  });
*/

  return user
})

/*
 console.log("Importing protocol items to db")

 var data = JSON.parse(Assets.getText("data/protocolItemsAll.json"));
 //var data = Assets.getText("data/protocolItems.json");
 console.log(data);

 data.forEach(function (item, index, array) {
 ProtocolItemCollection.insert(item);
 })
 */

/*
var citiesCount = Cities.find().count();
// if we already have entries in the db, don't insert again.
if (citiesCount > 0)
  return;

// code to run on server at startup
Assets.getText('cities.txt', function(err, data) {
  var content = EJSON.parse(data);

  for(country in content){
    console.log('inserting', country);
    Cities.insert({country: country, cities: content[country]});
  }
});

// the cities.txt file must be insite a directory named "private" in your root directory of the app
// you have to run it in the server portion of the code in meteor.
*/
