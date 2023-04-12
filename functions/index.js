const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.createUserDoc = functions.auth.user().onCreate(async (user) => {
  const account = {
    uid: user.uid,
    email: user.email,
  };
  await admin.firestore().doc(`users/${user.uid}`).set(account);
});

exports.addTestTransactions = functions.pubsub.schedule("every 24 hours").onRun(async (context) => {
  await addTransactions("P0PAnXQ77PeBIFUtgnNsnHXN5J52");
});

/**
 * Gets random integer
 * @param {int} min minimum number inclusive.
 * @param {int} max maximum number exclusiv.
 * @return {int} number between min and max
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Subtracts minutes to current datetime
 * @param {int} minutes minutes to add.
 * @return {int} date with minutes added
 */
function getDateTime(minutes) {
  return new Date(Date.now() - (minutes * 60000));
}

/**
 * Transactions to userId
 * @param {string} userId to add transactions to
 */
async function addTransactions(userId) {
  const wines = ["Sauvignon Blanc", "Pinot Noir", "Cabernet Sauvignon", "Zinfandel", "Pinot Grigio", "Chardonnay"];
  const kegIds = ["red", "green"];
  const pourTypes = [{type: "small", size: 1.5, price: 3.50}, {type: "full", size: 5, price: 9.00}];
  const timeDiff = getRandomInt(1, 11);
  for (let i = 0; i < 50; i++) {
    const pourType = pourTypes[getRandomInt(0, pourTypes.length)];
    await admin.firestore().collection("users/"+userId+"/transactions").add({
      glass_id: "1",
      kegId: kegIds[getRandomInt(0, kegIds.length)],
      name: wines[getRandomInt(0, wines.length)],
      ouncesPoured: pourType.size,
      pourType: pourType.type,
      price: pourType.price,
      timestamp: getDateTime(timeDiff * i),
    });
  }
}
