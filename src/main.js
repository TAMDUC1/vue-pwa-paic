import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import idb from 'idb'
import firebase from 'firebase'
import JQuery from 'jquery'
let $ = JQuery

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

const dbPromise1 = idb.open('keyval-store', 1, upgradeDB => {
  upgradeDB.createObjectStore('keyval');
})

const idbKeyval = {
  // cust(){
  //   return dbPromise1.then(function(db) {
  //     var tx = db.transaction('keyval', 'readonly');
  //     var store = tx.objectStore('keyval');
  //    // var index = store.index('content');
  //     // return index.get(key);
  //     return store;
  //
  //   });
  // },
  get(key) {
    return dbPromise1.then(db => {
      return db.transaction('keyval')
        .objectStore('keyval').get(key);
    });
  },
  set(key, val) {
    return dbPromise1.then(db => {
      const tx = db.transaction('keyval', 'readwrite');
      tx.objectStore('keyval').put(val, key);
      return tx.complete;
    });
  },
  delete(key) {
    return dbPromise1.then(db => {
      const tx = db.transaction('keyval', 'readwrite');
      tx.objectStore('keyval').delete(key);
      return tx.complete;
    });
  },
  clear() {
    return dbPromise1.then(db => {
      const tx = db.transaction('keyval', 'readwrite');
      tx.objectStore('keyval').clear();
      return tx.complete;
    });
  },
  keys() {
    return dbPromise1.then(db => {
      const tx = db.transaction('keyval');
      const keys = [];
      const store = tx.objectStore('keyval');

      // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
      // openKeyCursor isn't supported by Safari, so we fall back
      (store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
        if (!cursor) return;
        keys.push(cursor.key);
        cursor.continue();
      });

      return tx.complete.then(() => keys);
    });
  }
};

var dbPromise = idb.open('couches-n-things', 1);

var config = {
  apiKey: "AIzaSyCB74UX3r37sWkWxw8H3kfMKqG3ffY2oXY",
  authDomain: "paic-f8f1a.firebaseapp.com",
  databaseURL: "https://paic-f8f1a.firebaseio.com",
  projectId: "paic-f8f1a",
  storageBucket: "paic-f8f1a.appspot.com",
  messagingSenderId: "328706496906"
};
firebase.initializeApp(config);

var ref = firebase.database().ref("news");
  var url = "https://paic-f8f1a.firebaseio.com/news.json";
  ref.once("value")
      .then(function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                idbKeyval.set(childKey,childData);
                var div = document.createElement("div");
                div.innerHTML = childData.content;
                document.getElementById("blog").appendChild(div);
            });
        });

function createIndexedDB() {
  if (!('indexedDB' in window)) {return null;}
  return idb.open('dashboardr', 1, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains('events')) {
      const eventsOS = upgradeDb.createObjectStore('events', {keyPath: 'id'});
    }
  });
}

const dbPromise = createIndexedDB();
$(document).ready(function() {
      if(navigator.onLine){
        console.log('online');
    } else {
      console.log('offline');
      console.log(idbKeyval.get('2'));
      idbKeyval.delete('2').then(function(result){
        console.log(result);
      });


    }
});

