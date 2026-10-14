# EJS (Embedded JavaScript) — Notes

## 1. What is EJS?

- EJS stands for Embedded JavaScript.
- It is a templating engine used with Node.js and Express.js.
- It allows us to generate dynamic HTML pages using JavaScript.
- We can pass data from the server to an EJS template and display it in HTML.
- EJS templates use the `.ejs` file extension.

## 2. Installation

```bash
npm install ejs
```

## 3. Setting Up EJS in Express

```js
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
```

- `app.set('view engine', 'ejs')` configures EJS as the view engine.
- `res.render('home')` renders the `home.ejs` template.
- By default, Express looks for EJS files inside the `views` directory.

## 4. Folder Structure

```text
project/
├── app.js
├── package.json
└── views/
    └── home.ejs
```

## 5. Basic EJS Template

File: `views/home.ejs`

```html
<!DOCTYPE html>
<html>
<head>
    <title>Home Page</title>
</head>
<body>
    <h1>Welcome to my website!</h1>
</body>
</html>
```

When the user visits `/`, Express renders this template and sends the generated HTML to the browser.

## 6. EJS Syntax

| Syntax | Purpose |
|---|---|
| `<% JavaScript %>` | Executes JavaScript without directly outputting its value |
| `<%= value %>` | Outputs a value after HTML escaping |
| `<%- value %>` | Outputs raw, unescaped content |
| `<%# comment %>` | Adds an EJS comment |
| `<%%` | Outputs a literal `<%` sequence |

### Example

```ejs
<% const name = 'Aditya'; %>

<h1>Hello, <%= name %>!</h1>
```

Output:

```html
<h1>Hello, Aditya!</h1>
```

## 7. Passing Dynamic Data

In Express:

```js
app.get('/profile', (req, res) => {
    res.render('profile', {
        name: 'Aditya',
        age: 21,
        course: 'B.Tech CSE'
    });
});
```

In `views/profile.ejs`:

```ejs
<h1>Name: <%= name %></h1>
<p>Age: <%= age %></p>
<p>Course: <%= course %></p>
```

The object passed to `res.render()` makes its properties available as variables inside the EJS template.

## 8. Conditional Statements

EJS allows JavaScript conditions inside templates.

```ejs
<% if (age >= 18) { %>
    <p>You are an adult.</p>
<% } else { %>
    <p>You are a minor.</p>
<% } %>
```

The condition determines which HTML content is rendered.

## 9. Loops in EJS

### Using `forEach()`

```ejs
<ul>
    <% users.forEach(user => { %>
        <li><%= user %></li>
    <% }); %>
</ul>
```

Express route:

```js
app.get('/users', (req, res) => {
    res.render('users', {
        users: ['Aditya', 'Rahul', 'Aman']
    });
});
```

### Using a `for` Loop

```ejs
<% for (let i = 1; i <= 5; i++) { %>
    <p>Number: <%= i %></p>
<% } %>
```

## 10. Including Reusable Templates

EJS supports reusable template files using `include()`.

Folder structure:

```text
views/
├── home.ejs
└── partials/
    ├── header.ejs
    └── footer.ejs
```

In `home.ejs`:

```ejs
<%- include('partials/header') %>

<h1>Home Page</h1>

<%- include('partials/footer') %>
```

This helps reuse components such as headers, footers, and navigation bars.

## 11. Rendering HTML Content

```js
app.get('/message', (req, res) => {
    res.render('message', {
        content: '<strong>Hello World!</strong>'
    });
});
```

Using escaped output:

```ejs
<p><%= content %></p>
```

The HTML tags are escaped and displayed as text.

Using raw output:

```ejs
<div><%- content %></div>
```

The HTML markup is rendered by the browser.

**Security:** Never render untrusted user input using `<%- %>` without proper sanitization. It can cause cross-site scripting (XSS) vulnerabilities.

## 12. Difference Between `res.send()` and `res.render()`

| `res.send()` | `res.render()` |
|---|---|
| Sends a response directly | Renders a view template |
| Can send text, HTML, and other supported response types | Usually generates HTML from an EJS template |
| Example: `res.send('Hello World')` | Example: `res.render('home', { name: 'Aditya' })` |

## 13. Important Points

- EJS is a server-side templating engine.
- EJS combines HTML with JavaScript-based template logic.
- The standard file extension is `.ejs`.
- Configure EJS using `app.set('view engine', 'ejs')`.
- Use `res.render()` to render a template.
- Use `<% %>` for logic.
- Use `<%= %>` for HTML-escaped output.
- Use `<%- %>` for raw output.
- Use `include()` to reuse template files.
- The browser receives the generated HTML, not the EJS source code.

## 14. Quick Revision

```js
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home', { name: 'Aditya' });
});
```

```ejs
<h1>Hello, <%= name %>!</h1>
```

**Remember:** Express handles the request, EJS generates dynamic HTML on the server, and the browser displays the resulting HTML.
