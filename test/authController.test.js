const path = require("path");

require("dotenv").config();

const firebaseService = require(path.join(__dirname, "../src/app/services/FirebaseService"));
const AuthController = require(path.join(__dirname, "../src/app/controllers/AuthController"));

const admin = firebaseService.getAdmin();
let authController;
let req, res, next;
const testEmail = "registrationunittestemail@testme.com";


function initTestSuit(){
    authController = new AuthController();
    req = { body: { email: testEmail, password: "password", username: "testuser", birthdate: new Date().setFullYear(new Date().getFullYear()-18) } };
    res = {
        render: jest.fn(),
        redirect: jest.fn(),
        cookie: jest.fn(),
        clearCookie: jest.fn(),
        locals: {user: null}
    };
    next = jest.fn();
}

async function deleteTestUser() {
    try{
        const userRecord = await admin.auth().getUserByEmail(testEmail);
        if (userRecord){
            await admin.auth().deleteUser(userRecord.uid);
        }
    }
    catch (err){
        console.log("deleteTestUser" + err.message);
    }
}

async function createTestUser(isVerified = false) {
    try{
        let user = await admin.auth().createUser({email: req.body.email, password: req.body.password});

        if (isVerified){
        await admin.auth().updateUser(user?.uid, {
            emailVerified: true
        });
        }
    }catch (err) {
        console.log("createTestUser " + err.message);
    }
}

describe("Test AuthController Registration with Firebase", () => {

    beforeAll(async () => {
        initTestSuit();
        deleteTestUser();
    })

    beforeEach(async () => {
        initTestSuit();
    });

    afterEach(async () => {
        await deleteTestUser();
    });

    test("should succeed to create a user if the email does not exist", async () => {

        await authController.register(req, res, next);

        expect(res.render).toHaveBeenCalledWith("auth", {
            title: "Login",
            error: "Success, check your email to verify your account."
        });

        const userRecord = await admin.auth().getUserByEmail(testEmail);
        expect(userRecord).toBeDefined();
        expect(userRecord.email).toBe(testEmail);
    });

    test("should fail to create a user if the email already exists", async () => {
        //create
        await authController.register(req, res, next);
        //check
        await authController.register(req, res, next);

        expect(res.render).toHaveBeenCalledWith("auth", {
            title: "Register",
            error: "Email is already registered."
        });
    });

    test("should fail if there is no req.body set", async () => {
        req = {};

        await authController.register(req, res, next);

        expect(res.render).toHaveBeenCalledWith("auth", {
            title: "Register",
            error: "No Credentials."
        });
    });

    test("should fail if there is an issue with sending the email with faulty user", async () => {
        await expect(firebaseService.sendVerificationEmail()).rejects.toThrow("Can't send email verification.");
    });

    test("should fail if under aged user tries to register for an account", async () => {
        req = {body: {birthdate: new Date().setFullYear(new Date().getFullYear()-17)}};

        await authController.register(req, res, next);

        expect(res.render).toHaveBeenCalledWith("auth", {
            title: "Register",
            error: "Must be at least 18 years old"
        });
    });


});

describe("Test AuthController Login with Firebase", () => {

    beforeAll(async () =>  {
        initTestSuit();
    })

    afterAll(async () =>  {
        await deleteTestUser();
    })

    beforeEach(async () => {
        initTestSuit();
    });


    test("should fail if there is no req.body set", async () => {
        req = {};

        await authController.login(req, res, next);

        expect(res.render).toHaveBeenCalledWith("auth", {
            title: "Login",
            error: "No Credentials."
        });
    });

    test("should fail if user email not available", async () => {
        req = {body: {email: testEmail+"fail", password:""}};

        await authController.login(req, res, next);

        expect(res.render).toHaveBeenCalledWith("auth", {
            title: "Login",
            error: "Given user credentials not valid."
        });
    });

    test("should fail if user email is correct but password ist wrong", async () => {
        req = {body: {email: testEmail, password:""}};

        await authController.login(req, res, next);

        expect(res.render).toHaveBeenCalledWith("auth", {
            title: "Login",
            error: "Given user credentials not valid."
        });
    });

    test("should succeed if credentials are right and token is set", async () => {
        await createTestUser(true);
        await authController.login(req, res, next);

        expect(res.render).toHaveBeenCalledWith("home", {
            title: "Home"
        });
        await deleteTestUser();
    });

    test("should fail if user hasn't confirmed email verification", async () => {
        await authController.register(req,res,next);
        await authController.login(req, res, next);

        expect(res.render).toHaveBeenCalledWith("auth", {
            title: "Login",
            error: "Email not verified."
        });
        await deleteTestUser();
    });



})

describe("Test AuthController Logout with Firebase", () => {

    beforeAll(async () => {
       initTestSuit();
    });

    afterAll(async () => {
        await deleteTestUser();
    })

    test("should success if cookie has been removed from user", async () => {
        await createTestUser(true);
        await authController.login(req,res,next);

        await authController.logout(req, res, next);

        expect(res.clearCookie).toHaveBeenCalledWith("access_token");
        expect(res.render).toHaveBeenCalledWith("home", {
            title: "Home"
        });
    });

    test("should fail if there is no user available", async () => {
        await authController.logout(req, res, next);

        expect(res.render).toHaveBeenCalledWith("home", {
            title: "Home",
            error: "No user available."
        });
    });
});
