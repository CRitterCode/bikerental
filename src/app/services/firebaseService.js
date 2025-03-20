const { initializeApp, getApps } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
} = require("firebase/auth");

const admin = require("firebase-admin");

if (!admin.apps.length) {
  const adminServiceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(adminServiceAccount),
  });
}

let firebaseApp;
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
  firebaseApp = initializeApp(serviceAccount, "clientApp");
} else {
  firebaseApp = getApps()[0];
}

const firebaseAuth = getAuth(firebaseApp);

class FirebaseService {
  constructor() {

    this.app = firebaseApp;
    this.auth = firebaseAuth;
  }

  async createUser(userModel) {
    return await createUserWithEmailAndPassword(this.auth, userModel.email, userModel.password)
        .catch(() => {
          throw new Error("Email is already registered.");
        });
  }

  async signIn(userModel) {
    let token;
    await signInWithEmailAndPassword(this.auth, userModel.email, userModel.password)
        .then(userCredential => {
          token = userCredential._tokenResponse.idToken
    }).catch(err => {
      throw new Error("Given user credentials not valid.");
    });
    return token;
  }


  async signOut() {
    return await signOut(this.auth).catch(err => {
      throw new Error("Can't logout.");
    });
  }

  async sendVerificationEmail() {
      return await sendEmailVerification(this.auth.currentUser).catch(_ => {
        throw new Error("Can't send email verification.");
      });
  }

  async sendPasswordReset(email) {
    return await sendPasswordResetEmail(this.auth, email);
  }

  getCurrentUser(){
    return this.auth.currentUser;
  }

  getAdmin(){
    return admin;
  }
}

module.exports = new FirebaseService();
