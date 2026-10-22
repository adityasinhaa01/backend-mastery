# Authentication and Authorization in Node.js --- Detailed Notes

These notes explain the authentication and authorization system built in
the Node.js course. The explanations use simple English, detailed bullet
points, and code snippets to show how the pieces fit together.

## Contents

-   [1. Big Picture](#1-big-picture)
-   [2. Authentication
    vs. Authorization](#2-authentication-vs-authorization)
-   [3. Project Structure and
    Packages](#3-project-structure-and-packages)
-   [4. User Model and Roles](#4-user-model-and-roles)
-   [5. Registration](#5-registration)
-   [6. Password Hashing with
    bcryptjs](#6-password-hashing-with-bcryptjs)
-   [7. Login](#7-login)
-   [8. JWT and Access Tokens](#8-jwt-and-access-tokens)
-   [9. Authentication Middleware](#9-authentication-middleware)
-   [10. Protecting Routes](#10-protecting-routes)
-   [11. Role-Based Authorization and Admin
    Middleware](#11-role-based-authorization-and-admin-middleware)
-   [12. Complete Authentication
    Flowchart](#12-complete-authentication-flowchart)
-   [13. Important Terms Explained](#13-important-terms-explained)
-   [14. Testing with Postman](#14-testing-with-postman)
-   [15. Common Mistakes and Security
    Tips](#15-common-mistakes-and-security-tips)
-   [16. Quick Revision](#16-quick-revision)

------------------------------------------------------------------------

## 1. Big Picture

-   The application needs a way to identify users and decide which parts
    of the application they may access.
-   The implementation uses:
    -   **Node.js** to run JavaScript on the server.
    -   **Express** to create API routes and middleware.
    -   **MongoDB** to store user records.
    -   **Mongoose** to define the user model and query MongoDB.
    -   **bcryptjs** to hash passwords and compare passwords during
        login.
    -   **jsonwebtoken** to create and verify JSON Web Tokens (JWTs).
    -   **dotenv** to load environment variables such as the JWT secret.
    -   **Postman** to test API requests without needing a frontend.
-   The overall process has three main stages:
    -   **Registration:** a new user creates an account.
    -   **Login:** the server checks the user's credentials and issues
        an access token.
    -   **Protected requests:** the client sends the token with later
        requests, and the server checks it before returning protected
        information.
-   Some routes are intended for all logged-in users. Other routes, such
    as an admin route, require a specific role.

### The basic idea

``` text
Register -> Store password hash -> Login -> Receive JWT
                                      |
                                      v
Send JWT with protected request -> Verify JWT
                                      |
                                      v
                          Check permission if needed
                                      |
                                      v
                                Return response
```

------------------------------------------------------------------------

## 2. Authentication vs. Authorization

### Authentication: "Who are you?"

-   Authentication means checking whether a user or request has proved
    its identity.
-   In this example, the user provides a username or email and a
    password.
-   The server finds the account and checks the submitted password
    against the stored password hash.
-   If the credentials are correct, the server creates a JWT access
    token.
-   Later, the server verifies that token when the user requests a
    protected route.
-   Example: checking that a valid token is present before showing the
    home page.

### Authorization: "What are you allowed to do?"

-   Authorization means deciding which resources or actions a user is
    allowed to access.
-   The application uses roles such as `user` and `admin`.
-   A regular user may access normal user routes.
-   An admin may access admin-only routes.
-   A user must still be authenticated before the server can safely
    check their role.

### Main difference

-   **Authentication** checks identity.
-   **Authorization** checks permission.
-   **Role-based access control (RBAC)** is an approach where
    permissions depend on a user's role.
-   The course sometimes calls the role check "role-based
    authentication." More precisely, verifying the token is
    authentication, while checking whether the role is `admin` is
    authorization.

### Example

``` text
Request to /api/home
    -> Is the token valid?
       -> Yes: allow the protected home handler.

Request to /api/admin
    -> Is the token valid?
       -> Yes: is the user's role "admin"?
          -> Yes: allow the admin handler.
          -> No: deny access.
```

------------------------------------------------------------------------

## 3. Project Structure and Packages

A structure similar to the one demonstrated in the course may look like
this:

``` text
project/
├── server.js
├── database/
│   └── db.js
├── models/
│   └── user.js
├── controllers/
│   └── auth-controller.js
├── routes/
│   ├── auth-routes.js
│   ├── home-routes.js
│   └── admin-routes.js
├── middleware/
│   ├── auth-middleware.js
│   └── admin-middleware.js
└── .env
```

-   **`server.js`**
    -   Creates the Express application.
    -   Connects to the database.
    -   Enables JSON request-body parsing.
    -   Mounts the routers.
    -   Starts the server.
-   **Database connection file**
    -   Connects Mongoose to MongoDB.
-   **Model**
    -   Defines which fields a user record contains and any schema
        rules.
-   **Controller**
    -   Contains the main registration and login logic.
-   **Routes**
    -   Connect URL paths and HTTP methods to controller functions or
        middleware.
-   **Authentication middleware**
    -   Reads the token, verifies it, and attaches verified user
        information to the request.
-   **Admin middleware**
    -   Checks whether the authenticated user's role is `admin`.

### Packages

Install the packages used in this example if they are not already
installed:

``` bash
npm install express mongoose bcryptjs jsonwebtoken dotenv
```

-   `express`: creates the server, routes, and middleware.
-   `mongoose`: works with MongoDB using schemas and models.
-   `bcryptjs`: hashes passwords and compares submitted passwords with
    stored hashes.
-   `jsonwebtoken`: signs and verifies JWTs.
-   `dotenv`: loads variables from a `.env` file.
-   Postman is a separate API testing application; it is not an npm
    package required by the server.

### JSON request-body parsing

-   The client sends data to the API, often as JSON.
-   `express.json()` parses JSON request bodies so controllers can read
    values from `req.body`.
-   Without the appropriate body parser, `req.body` may be `undefined`
    for a JSON request.

``` js
const express = require('express');
const app = express();

app.use(express.json());
```

------------------------------------------------------------------------

## 4. User Model and Roles

-   The user model in the course contains fields such as:
    -   `username`: the account's username.
    -   `email`: the account's email address.
    -   `password`: the hashed password.
    -   `role`: the user's access role.
-   The role is a string with allowed values such as `user` and `admin`.
-   The model sets `user` as the default role if a role is not provided.
-   A schema's `enum` option limits a field to a list of allowed values.
-   The model is used to create, find, and save user records in MongoDB.

### Example Mongoose user model

``` js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
```

-   `required: true` means the field must be supplied.
-   `unique: true` asks MongoDB to enforce uniqueness through an index
    when that index exists. It is not a replacement for handling
    duplicate-key errors.
-   `enum` restricts the role to the listed values.
-   `default: 'user'` assigns the regular-user role when no role is set.
-   `timestamps: true` makes Mongoose add `createdAt` and `updatedAt`
    fields.

**Security note about roles:**

-   The course demonstrates accepting a role in the registration request
    to show how it is saved.
-   In a real public application, do **not** let a user choose their own
    role during public registration.
-   Otherwise, a user might send `"role": "admin"` and give themselves
    admin privileges.
-   Set the role on the server to `user` during public registration.
    Grant admin privileges only through a trusted administrative
    process.

------------------------------------------------------------------------

## 5. Registration

Registration creates a new account and saves its information in the
database.

### Registration steps

-   The client sends a `POST` request with the username, email, and
    password.
-   Express parses the JSON body.
-   The registration controller reads the values from `req.body`.
-   The controller checks whether the username or email is already in
    use.
-   If a matching account exists, the controller returns an error
    instead of creating a duplicate.
-   If the account does not exist, the controller hashes the submitted
    password using bcryptjs.
-   The controller creates a new user record using the username, email,
    hashed password, and server-assigned role.
-   The record is saved in MongoDB.
-   The server returns a success response if saving succeeds.

### Reading data from `req.body`

``` js
const { username, email, password } = req.body;
```

-   This is called **object destructuring**.
-   It extracts the `username`, `email`, and `password` properties from
    the request body.
-   The property names must match the names expected by the application.
-   In a real API, validate that these values exist and have acceptable
    formats before using them.

### Checking for an existing username or email

``` js
const existingUser = await User.findOne({
  $or: [
    { username: username },
    { email: email }
  ]
});

if (existingUser) {
  return res.status(400).json({
    success: false,
    message: 'Username or email already exists'
  });
}
```

-   `findOne()` searches for one matching document.
-   `$or` means that at least one of the listed conditions may match.
-   The query checks for a matching username **or** email.
-   If a matching document is found, `existingUser` contains that
    document; otherwise, it is usually `null`.
-   The controller returns early so it does not continue creating the
    account after finding a duplicate.
-   A database-level unique index should also be used because two
    registration requests could pass the check at nearly the same time.

### Hashing and saving the new user

``` js
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

const newUser = new User({
  username,
  email,
  password: hashedPassword,
  role: 'user'
});

await newUser.save();
```

-   The original `password` is used only as input to the hashing
    function.
-   `hashedPassword` is saved in the database instead of the plain-text
    password.
-   The example assigns `role: 'user'` on the server. This is safer than
    trusting a role sent by the client.
-   `save()` writes the new document to MongoDB.

### Returning a response

``` js
return res.status(201).json({
  success: true,
  message: 'User registered successfully'
});
```

-   `201 Created` is a suitable status for successful account creation.
-   `res.status(201)` sets the HTTP status code.
-   `.json()` sends a JSON response.
-   Do not include the user's password or password hash in the response.

### A complete registration controller example

This combines the main steps into one simplified example. It assumes
`User` and `bcrypt` have been imported.

``` js
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to register user'
    });
  }
};

module.exports = { registerUser };
```

-   This is a learning example, not a complete production-ready
    controller.
-   Production code should also validate input, handle duplicate-key
    database errors, and log unexpected server errors safely without
    exposing sensitive details.

------------------------------------------------------------------------

## 6. Password Hashing with bcryptjs

### Why password hashing is necessary

-   A database should not store the original password as plain text.
-   If an attacker gains access to a database containing plain-text
    passwords, the passwords can be read immediately.
-   A password hash is a one-way result used to check future login
    attempts.
-   The server does not need to recover the original password.
-   **Hashing is not the same as encryption.**
    -   Encryption is designed to be reversible with the right key.
    -   Password hashing is designed to be one-way.

### What is a salt?

-   A salt is a random value used during password hashing.
-   It helps ensure that the same password does not always produce the
    same stored hash.
-   It makes precomputed attacks, such as rainbow-table attacks, harder.
-   bcrypt stores the salt and work-factor information as part of its
    encoded hash, so a separate salt field is not normally required when
    using bcrypt correctly.

### Creating a password hash

``` js
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(plainPassword, salt);
```

-   `genSalt(10)` generates a salt using the demonstrated work factor of
    `10`.
-   The number is the bcrypt cost/work-factor setting; a higher setting
    generally requires more computing time.
-   `hash()` uses the password and salt to create the stored hash.
-   Choose a suitable cost for your application and deployment
    environment.

### Checking a password during login

``` js
const passwordMatches = await bcrypt.compare(
  submittedPassword,
  user.password
);

if (!passwordMatches) {
  return res.status(401).json({
    success: false,
    message: 'Invalid credentials'
  });
}
```

-   `submittedPassword` is what the user entered in the login form.
-   `user.password` is the stored bcrypt hash from MongoDB.
-   `bcrypt.compare()` returns `true` if the submitted password matches
    the hash, and `false` if it does not.
-   Do not hash the submitted password manually and compare strings. Use
    `bcrypt.compare()` for a bcrypt hash.

------------------------------------------------------------------------

## 7. Login

Login checks whether the user already has an account and knows the
correct password.

### Login steps

-   The client sends a login request containing a username or email and
    a password.
-   The controller searches for the account using the identifier chosen
    by the application.
-   If no account is found, the controller rejects the login.
-   If the account is found, the controller uses `bcrypt.compare()` to
    check the password.
-   If the password does not match, the controller rejects the login.
-   If the credentials are correct, the controller creates a JWT.
-   The token includes selected user information, such as the database
    ID, username, and role.
-   The password must not be included in the token.
-   The server returns the access token to the client.

### Finding a user

For an application that logs in with a username:

``` js
const user = await User.findOne({ username });
```

For an application that logs in with an email:

``` js
const user = await User.findOne({ email });
```

-   Use the identifier your login form actually accepts.
-   If the form accepts either username or email, validate and query the
    input accordingly.

### Checking the password

``` js
if (!user) {
  return res.status(401).json({
    success: false,
    message: 'Invalid credentials'
  });
}

const isPasswordCorrect = await bcrypt.compare(
  password,
  user.password
);

if (!isPasswordCorrect) {
  return res.status(401).json({
    success: false,
    message: 'Invalid credentials'
  });
}
```

-   The code checks whether a user exists before comparing passwords.
-   The same general error message for a missing user and a wrong
    password can reduce how much information the login endpoint reveals.
-   A successful comparison allows the controller to continue to token
    creation.

### Why create a token after login?

-   HTTP requests are separate requests; the server does not
    automatically know that every later request belongs to the user who
    logged in.
-   The client sends the access token with later protected requests.
-   The server verifies the token to check its signature and expiration.
-   This example uses JWTs to carry the user's ID, username, and role
    between requests.

------------------------------------------------------------------------

## 8. JWT and Access Tokens

### What is a JWT?

-   JWT stands for **JSON Web Token**.
-   It is a compact token format that can carry claims, which are pieces
    of information about the token or user.
-   The course uses the `jsonwebtoken` package to create and verify
    tokens.
-   After a successful login, the server signs a token and returns it to
    the client.
-   The client sends that token with later requests to protected
    endpoints.

### Creating a JWT with `jwt.sign()`

``` js
const jwt = require('jsonwebtoken');

const accessToken = jwt.sign(
  {
    userId: user._id,
    username: user.username,
    role: user.role
  },
  process.env.JWT_SECRET,
  {
    expiresIn: '15m'
  }
);
```

-   The first argument is the **payload**: the claims to place in the
    token.
-   The second argument is the secret key used to sign the token in this
    example.
-   The third argument contains options.
-   `expiresIn: '15m'` makes the token expire after 15 minutes.
-   The course demonstrates a 15-minute token and later uses a
    one-minute expiry temporarily to show expiration behavior.
-   The password is deliberately left out of the payload.

### What is the payload?

-   The payload is the data carried by the JWT.
-   In the example, it contains:
    -   `userId`: the user's database ID.
    -   `username`: the username.
    -   `role`: the user's role.
-   Only include claims that the application actually needs.
-   **A JWT is not automatically encrypted.** Its payload can generally
    be decoded and read by someone who has the token. Do not put
    passwords, secret keys, or sensitive private information in it.

### What is the JWT secret?

-   The secret is a private server-side value used to sign and verify
    tokens in the demonstrated setup.
-   The example reads it from `process.env.JWT_SECRET`.
-   Keep the secret out of source code and public repositories.
-   Use a strong, unpredictable value in production.
-   The server must use the correct matching configuration when
    verifying a token.

Example `.env` entry:

``` dotenv
JWT_SECRET=replace_this_with_a_long_random_secret
```

-   The value above is a placeholder, not a secret to use in production.
-   Add `.env` to `.gitignore` so real secrets are not committed.
-   Configure the variable in your deployment environment as well as
    locally.

### What does token expiration mean?

-   Expiration limits how long a token remains valid.
-   `expiresIn: '15m'` means the token is valid for approximately 15
    minutes from issuance.
-   Once it expires, `jwt.verify()` rejects it.
-   The client must log in again or use a refresh-token flow if the
    application implements one.
-   The course segment demonstrates expiry but does not implement a
    complete refresh-token system.

### Signing vs. verifying

-   `jwt.sign()` creates and signs a token.
-   `jwt.verify()` checks the token's signature and relevant claims,
    including expiration.
-   Do not trust a token merely because it can be decoded.
-   **Verify the token before trusting the payload.**

### Sending a Bearer token

The practical protected-route example sends the token in the HTTP
`Authorization` header:

``` http
Authorization: Bearer <access-token>
```

-   `Bearer` identifies the type of authorization credential being sent.
-   There is one space between `Bearer` and the token.
-   The backend reads the header and extracts the token.
-   A bearer token must be kept private because anyone who obtains it
    may be able to use it while it is valid.
-   The course mentions cookies during its conceptual explanation, but
    the later Postman implementation uses the Bearer header. These are
    different token-transport approaches.

------------------------------------------------------------------------

## 9. Authentication Middleware

### What is middleware?

-   Middleware is a function that runs while Express processes a
    request.
-   A typical middleware function receives three arguments:
    -   `req`: the incoming request.
    -   `res`: the response object.
    -   `next`: a function used to pass control to the next middleware
        or route handler.
-   Middleware can inspect the request, attach information to it, return
    a response, or call `next()`.
-   The course first creates a simple middleware to confirm that it
    runs, then adds the token-checking logic.

### Basic middleware syntax

``` js
const exampleMiddleware = (req, res, next) => {
  console.log('Middleware called');
  next();
};

module.exports = exampleMiddleware;
```

-   `next()` allows the request to continue.
-   If middleware sends a response and returns, it should not continue
    to the protected handler.
-   Forgetting to call `next()` or send a response can leave a request
    waiting indefinitely.

### Authentication middleware: full process

-   Read the `Authorization` header.
-   Check that it contains a Bearer token.
-   Extract the token from the header.
-   If the token is missing, return an authentication error.
-   Verify the token with `jwt.verify()`.
-   If verification fails, return an error and stop processing the
    request.
-   If verification succeeds, attach the verified claims to a custom
    property such as `req.userInfo`.
-   Call `next()` so the next middleware or route handler can run.

### Reading the header

``` js
const authHeader = req.headers.authorization;
```

-   HTTP header names are case-insensitive, and Express exposes request
    headers in lowercase keys.
-   In this example, the token is expected in
    `req.headers.authorization`.
-   The header should have a format similar to `Bearer eyJ...`.

### Extracting the token safely

A simple split is demonstrated in the course. A slightly more defensive
version checks the format first:

``` js
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({
    success: false,
    message: 'Access denied. No valid token provided.'
  });
}

const token = authHeader.split(' ')[1];
```

-   `startsWith('Bearer ')` checks the expected prefix.
-   `split(' ')[1]` extracts the part after the space.
-   The missing-header check prevents the code from trying to extract a
    token from an absent value.

### Verifying the token and attaching user information

``` js
const decodedToken = jwt.verify(
  token,
  process.env.JWT_SECRET
);

req.userInfo = decodedToken;
next();
```

-   `jwt.verify()` returns the verified token claims if verification
    succeeds.
-   If the token is invalid or expired, verification throws an error.
-   The code must handle that error and return an appropriate response.
-   `req.userInfo` is a custom property created by the application;
    Express does not add it automatically.
-   The next route or middleware can now read `req.userInfo.userId`,
    `req.userInfo.username`, and `req.userInfo.role`.

### Complete authentication middleware example

``` js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userInfo = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;
```

-   This example catches token-verification errors so they do not become
    unhandled errors.
-   It returns `401` for missing, invalid, or expired authentication
    credentials.
-   It calls `next()` only after successful verification.
-   A production implementation may use more detailed internal logging,
    but it should not reveal secret details in the API response.

------------------------------------------------------------------------

## 10. Protecting Routes

### What is a protected route?

-   A protected route is an endpoint that should only be available when
    the request passes authentication.
-   A public route can be accessed without a login token.
-   The course creates a home route and then adds authentication
    middleware before the home handler.
-   If authentication fails, the middleware sends an error and the home
    handler is not executed.
-   If authentication succeeds, the middleware calls `next()` and the
    route handler can respond.

### Example home route

``` js
const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');

const router = express.Router();

router.get('/welcome', authMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to the homepage',
    user: req.userInfo
  });
});

module.exports = router;
```

-   The order is important:
    -   Express receives the request.
    -   `authMiddleware` checks the token.
    -   If the token is valid, it adds verified user information to
        `req.userInfo`.
    -   The route handler then returns the welcome response.
-   If the token is missing or invalid, the middleware returns an error
    and the route handler does not run.

### How Express processes multiple handlers

``` js
router.get('/welcome', middlewareOne, middlewareTwo, routeHandler);
```

-   Express calls `middlewareOne` first.
-   If it calls `next()`, Express continues to `middlewareTwo`.
-   If the second middleware also calls `next()`, Express calls
    `routeHandler`.
-   If any middleware sends a response and returns, later handlers are
    not run for that request.
-   This sequence is the foundation for adding authentication and
    authorization checks.

### Mounting routes in the server

``` js
app.use('/api/home', homeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
```

-   `app.use()` mounts a router under a base path.
-   If a router has a `GET /welcome` handler and is mounted at
    `/api/home`, the full path is `/api/home/welcome`.
-   The exact path depends on both the mounted prefix and the route path
    inside the router.

------------------------------------------------------------------------

## 11. Role-Based Authorization and Admin Middleware

### Why is a second middleware needed?

-   Authentication proves that the request has a valid token.
-   It does not automatically mean that the user can access every route.
-   The course demonstrates that a normal user with a valid token can
    pass authentication but should not be allowed to access the admin
    route.
-   An additional middleware checks the role before allowing access.
-   This is role-based authorization.

### Admin middleware logic

-   Read the role from `req.userInfo`.
-   If the role is not `admin`, return an access-denied response.
-   If the role is `admin`, call `next()`.
-   This middleware depends on authentication middleware having already
    verified the token and attached `req.userInfo`.

### Example admin middleware

``` js
const adminMiddleware = (req, res, next) => {
  if (req.userInfo.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin rights required.'
    });
  }

  next();
};

module.exports = adminMiddleware;
```

-   `req.userInfo.role` is the role from the verified JWT payload.
-   `!== 'admin'` means the role is anything other than `admin`.
-   `403 Forbidden` is appropriate when a user is authenticated but
    lacks permission.
-   The authentication middleware should run first so `req.userInfo`
    exists.

### Applying both middlewares to an admin route

``` js
const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: 'Welcome to the admin route'
    });
  }
);

module.exports = router;
```

### Middleware order: remember this

``` text
Request
  |
  v
authMiddleware
  |
  +-- Missing/invalid/expired token --> 401 response
  |
  v
adminMiddleware
  |
  +-- Role is not admin -------------> 403 response
  |
  v
Admin route handler
  |
  v
Success response
```

-   **Authentication first:** verify who the request belongs to.
-   **Authorization second:** check whether that user has permission.
-   **Route handler last:** perform the protected action only after both
    checks pass.
-   If the admin middleware runs first, it may not have verified user
    information available to check.

### Access matrix

-   **No token:** the protected home route and admin route should deny
    access.
-   **Invalid or expired token:** the protected home route and admin
    route should deny access.
-   **Regular user with a valid token:** may access routes allowed to
    regular users, but should be denied access to the admin route.
-   **Admin with a valid token:** may access the admin route, subject to
    any other application rules.

------------------------------------------------------------------------

## 12. Complete Authentication Flowchart

The flowchart combines registration, login, protected-route
authentication, and the admin role check.

``` mermaid
flowchart TD
    A([Start]) --> B{What does the user want to do?}

    B -->|Register| C[Send username, email, password]
    C --> D[Read and validate request body]
    D --> E{Username or email already exists?}
    E -->|Yes| F[Return duplicate-account error]
    E -->|No| G[Generate bcrypt salt]
    G --> H[Hash the password]
    H --> I[Create user with hashed password and role=user]
    I --> J[Save user in MongoDB]
    J --> K[Return registration success]

    B -->|Log in| L[Send username or email and password]
    L --> M[Find user in MongoDB]
    M --> N{User found?}
    N -->|No| O[Reject login]
    N -->|Yes| P[Compare submitted password with stored hash]
    P --> Q{Password matches?}
    Q -->|No| O
    Q -->|Yes| R[Sign JWT with user ID, username, and role]
    R --> S[Set token expiration]
    S --> T[Return access token]

    B -->|Open protected route| U[Send request with Authorization: Bearer token]
    U --> V[Authentication middleware reads header]
    V --> W{Token present in expected format?}
    W -->|No| X[Return 401 authentication error]
    W -->|Yes| Y[Verify token using JWT secret]
    Y --> Z{Token valid and unexpired?}
    Z -->|No| X
    Z -->|Yes| AA[Attach verified claims to req.userInfo]
    AA --> AB{Is this an admin-only route?}
    AB -->|No| AC[Run protected route handler]
    AB -->|Yes| AD{Is req.userInfo.role admin?}
    AD -->|No| AE[Return 403 permission error]
    AD -->|Yes| AF[Run admin route handler]
```

### Flowchart explained in simple steps

-   **Registration**
    -   Receive the user's details.
    -   Check for an existing username or email.
    -   Hash the password.
    -   Save the user with the hashed password.
    -   Return a registration response.
-   **Login**
    -   Find the account.
    -   Compare the submitted password with the stored hash.
    -   If the credentials are correct, create a JWT.
    -   Return the token to the client.
-   **Protected route**
    -   The client sends the JWT in the `Authorization` header.
    -   Authentication middleware extracts and verifies the token.
    -   The middleware attaches verified claims to `req.userInfo`.
    -   If verification succeeds, the request continues to the protected
        handler.
-   **Admin route**
    -   Authentication middleware runs first.
    -   Admin middleware checks the role.
    -   Only a verified user whose role is `admin` can continue to the
        admin handler.

------------------------------------------------------------------------

## 13. Important Terms Explained

-   **Authentication:** checking that a user/request has proved its
    identity.
-   **Authorization:** deciding whether the authenticated user has
    permission to access a resource.
-   **Role:** a label such as `user` or `admin` that determines the
    user's access level.
-   **Role-based access control (RBAC):** a method of assigning
    permissions based on roles.
-   **Registration / sign-up:** creating a new account.
-   **Login / sign-in:** checking credentials for an existing account.
-   **Credential:** information used to prove identity, such as a
    password or access token.
-   **Username:** an account identifier chosen by the user.
-   **Email:** an email address that can be used as an account
    identifier.
-   **Plain-text password:** the original password before hashing.
-   **Hashing:** converting a value into a derived result using a
    one-way function.
-   **Password hash:** the stored result used to verify a submitted
    password.
-   **bcryptjs:** a JavaScript library used to hash passwords and
    compare submitted passwords with existing bcrypt hashes.
-   **Salt:** a random value used in password hashing so identical
    passwords do not simply have identical stored hashes.
-   **Salt rounds / work factor:** the bcrypt cost setting that controls
    how much work hashing requires.
-   **`bcrypt.hash()`:** creates a password hash.
-   **`bcrypt.compare()`:** checks whether a submitted password matches
    a stored hash.
-   **JWT:** JSON Web Token, a token format that carries claims.
-   **Access token:** a credential sent with later requests to
    demonstrate that the client has a valid token.
-   **Payload / claims:** data inside a JWT, such as the user ID,
    username, and role.
-   **`jwt.sign()`:** creates and signs a JWT.
-   **`jwt.verify()`:** checks a JWT's signature and relevant claims,
    including expiration.
-   **JWT secret:** a private server-side value used to sign and verify
    tokens in this example.
-   **Environment variable:** configuration supplied to the running
    process instead of hard-coded into source code.
-   **`.env`:** a local configuration file often loaded with `dotenv`;
    real secrets in this file should not be committed to a repository.
-   **Token expiration:** the point after which a token is no longer
    accepted.
-   **Bearer token:** a token sent as `Authorization: Bearer <token>`.
-   **HTTP header:** metadata sent with an HTTP request or response.
-   **`Authorization` header:** the request header used to send the
    Bearer token in this implementation.
-   **Cookie:** browser-managed data that can be sent with requests; the
    course mentions cookies conceptually, while the practical
    protected-route demo uses a Bearer header.
-   **Middleware:** an Express function that inspects a request, sends a
    response, or passes control to another handler.
-   **`req`:** the Express request object.
-   **`res`:** the Express response object.
-   **`next()`:** passes control to the next middleware or handler.
-   **`req.body`:** the parsed body data sent by the client.
-   **`req.headers`:** the headers sent with the incoming request.
-   **`req.userInfo`:** a custom property used in the example to store
    verified JWT claims for later handlers.
-   **Route:** an endpoint path and HTTP method handled by the
    application.
-   **Route handler:** the function that produces the route's response.
-   **Protected route:** a route that requires authentication before it
    can be accessed.
-   **Public route:** a route that does not require authentication.
-   **Controller:** code that contains request-handling logic, such as
    registration and login.
-   **Model:** a Mongoose object used to work with a MongoDB collection.
-   **Schema:** the definition of fields and validation rules for a
    document.
-   **Mongoose:** a library that helps Node.js applications work with
    MongoDB.
-   **MongoDB:** the database used to store user records in the course
    example.
-   **`findOne()`:** a Mongoose query method that returns one matching
    document or `null`.
-   **`$or`:** a MongoDB query operator that matches when at least one
    supplied condition is true.
-   **`save()`:** a Mongoose document method that saves a document to
    MongoDB.
-   **`enum`:** a schema option that limits a field to a list of allowed
    values.
-   **Default role:** the role assigned when no role is provided; the
    example's default is `user`.
-   **HTTP `POST`:** a request method used for operations such as
    registration and login in this example.
-   **HTTP `GET`:** a request method used for retrieving information
    from the home/admin routes.
-   **HTTP `200 OK`:** a common success status.
-   **HTTP `201 Created`:** a success status commonly used when a new
    resource has been created.
-   **HTTP `400 Bad Request`:** indicates that the request cannot be
    accepted as submitted, such as a duplicate-registration attempt in
    the example.
-   **HTTP `401 Unauthorized`:** used when authentication is missing or
    has failed.
-   **HTTP `403 Forbidden`:** used when the user is authenticated but
    does not have the required permission.
-   **HTTP `500 Internal Server Error`:** indicates an unexpected
    server-side failure.
-   **Postman:** a tool for sending API requests and inspecting
    responses.
-   **Request-response cycle:** the process from receiving an HTTP
    request, through middleware and handlers, to returning a response.
-   **Decoded token:** the payload extracted from a token. Decoding
    alone does not prove the token is genuine; verify it before trusting
    its claims.
-   **Duplicate-account check:** checking whether a username or email is
    already in use before creating a new account.
-   **Session:** a way to maintain a user's authenticated state across
    requests. The practical example in this section uses JWT access
    tokens rather than a server-side session store.

------------------------------------------------------------------------

## 14. Testing with Postman

Postman lets you test the backend before building a frontend.

### Test registration

-   Create a `POST` request to your registration endpoint.
-   Open **Body → raw → JSON**.
-   Send the required fields. For example:

``` json
{
  "username": "aditya",
  "email": "aditya@example.com",
  "password": "StrongPassword123"
}
```

-   In this example, the server should assign the role as `user`; do not
    add a client-controlled admin role to a public registration request.
-   Check that the API returns a success response.
-   Check MongoDB and confirm that the stored password is a bcrypt hash,
    not the original password.

### Test duplicate registration

-   Send another registration request with the same username or email.
-   The backend should reject the duplicate.
-   A database unique index should also prevent duplicate values if
    concurrent requests arrive.

### Test login

-   Create a `POST` request to the login endpoint.
-   Send the identifier and password expected by your controller.
-   If the credentials are correct, the response should contain an
    access token.
-   Copy the token for the next tests.

### Test a protected route

-   Create a `GET` request to the protected home endpoint.
-   First send it without a token. It should return an authentication
    error.
-   Then open **Authorization → Bearer Token** in Postman and paste the
    access token.
-   Send the request again. If the token is valid, the protected route
    should work.

### Test the admin route

-   Send a regular user's token to the admin route. Authentication
    should succeed, but the role check should deny access.
-   Send an admin user's token to the admin route. The route should
    allow access if the token is valid and the role is trusted.
-   In a real application, admin privileges must be granted by a trusted
    process, not by letting a user set their role during public
    registration.

### Test token expiration

-   Use a short expiration time in a development environment to test the
    expiry behavior.
-   Send a request while the token is valid.
-   Wait for it to expire and send the same request again.
-   `jwt.verify()` should reject the expired token.
-   Restore the intended token lifetime after testing.

------------------------------------------------------------------------

## 15. Common Mistakes and Security Tips

-   **Saving plain-text passwords**
    -   Never save the original password in the database.
    -   Hash it with a suitable password-hashing library before saving.
-   **Putting the password in the JWT**
    -   Do not put passwords or other secrets in the token payload.
    -   JWT payloads are normally readable by whoever has the token.
-   **Using `jwt.decode()` as authentication**
    -   Decoding only reads the payload.
    -   Use `jwt.verify()` to check the signature and expiration before
        trusting claims.
-   **Trusting the role from registration input**
    -   A user could submit `role: "admin"` if the backend accepts it.
    -   Assign the public-registration role on the server and use a
        trusted process for granting admin access.
-   **Forgetting `express.json()`**
    -   If JSON body parsing is not enabled, `req.body` may not contain
        the expected values.
-   **Not checking for missing fields**
    -   Validate the request body before querying the database or
        hashing a password.
-   **Not handling token errors**
    -   Invalid, malformed, and expired tokens should produce a
        controlled response instead of an unhandled exception.
-   **Calling `next()` after returning an error**
    -   If middleware denies a request, return the response and do not
        continue to the protected route.
-   **Using middleware in the wrong order**
    -   Authentication must run before admin authorization because the
        role is read from the verified request information.
-   **Using only an application-level duplicate check**
    -   Use database unique indexes and handle duplicate-key errors as
        well.
-   **Exposing the JWT secret**
    -   Keep it in environment configuration and never commit the real
        secret to a public repository.
-   **Sending tokens over insecure connections**
    -   Use HTTPS in production.
-   **Logging access tokens**
    -   Avoid printing tokens or other credentials in logs.
-   **Assuming a token is safe because it has not expired**
    -   Anyone who steals a bearer token may be able to use it while it
        remains valid. Protect token storage and transmission.
-   **Confusing `401` and `403`**
    -   `401`: authentication is missing or failed.
    -   `403`: authentication succeeded, but the user lacks permission.
-   **Returning sensitive details in error responses**
    -   Give clients useful messages, but do not expose database
        details, secret values, stack traces, or other internal
        information.

------------------------------------------------------------------------

## 16. Quick Revision

### Registration

-   Receive username, email, and password.
-   Validate the values.
-   Check whether the username or email already exists.
-   Hash the password with bcryptjs.
-   Save the user with the hashed password and a server-assigned role.
-   Return a registration response.

### Login

-   Receive the account identifier and password.
-   Find the user in MongoDB.
-   Compare the submitted password with the stored hash using
    `bcrypt.compare()`.
-   If the credentials are correct, sign a JWT.
-   Return the access token.

### Authentication

-   The client sends `Authorization: Bearer <token>`.
-   Middleware extracts the token.
-   `jwt.verify()` validates it.
-   Middleware attaches the verified claims to `req.userInfo`.
-   Middleware calls `next()` only if verification succeeds.

### Authorization

-   The admin route runs authentication middleware first.
-   Admin middleware checks `req.userInfo.role`.
-   A non-admin user receives a forbidden response.
-   An admin user can continue to the route handler.

### The one-line flow to remember

**Register → hash and save password → log in → compare password hash →
issue JWT → send Bearer token → verify JWT → check role when required →
return the protected resource.**
