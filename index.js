const admin = require('firebase-admin');
const firebase = require('@google-cloud/firestore');

const serviceAccount = require('../cross-platform-test-firebase-adminsdk-o06sj-875d18d8dd');

const data = require('./assets/data/MOCK_DATA.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cross-platform-test.firebaseio.com"
});

const firestore = admin.firestore();

addUsers = () => {
    /*firestore.collection('/users').get().then(snapshot => {
        snapshot.forEach(doc => {
            doc.ref.update({ ponderatedValues: { true: 1, false: 0 } }).catch(console.error);
        });
    });*/
    const promises = [];
    data.forEach(element => {
        const elt = element;
        elt.address = new firebase.GeoPoint(
            typeof elt.latitude === 'number' ? elt.latitude : Number(elt.latitude),
            typeof elt.longitude === 'number' ? elt.longitude : Number(elt.longitude)
        );
        delete elt.latitude;
        delete elt.longitude;
        promises.push(firestore.collection('/users').add(elt));
    });
    Promise.all(promises).then(() => console.log('users added')).catch((err) => console.error('An error occurred: ', err));
};

addUsers();

