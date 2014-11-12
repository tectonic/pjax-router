# PJAX Router

The PJAX router allows developers to register routes that are requested against your server within your application, and have the send and complete events that jquery-pjax fires handled specifically for those routes. It provides a greater element of organisation and control of your front-end code and alleviates you from bundling your javascript with your HTML output as part of the response from the server.

In short, it makes PJAX applications cleaner, easier to read - and much more manageable.

## Installation

Simply download the pjax-router.min.js file and load that in your HTML document.

## Usage

PJAX Router comes with the Tectonic.Pjax.Router class, allowing you to register routes that will respond to various calls.

```javascript
var usersHandler = function() {
    // do stuff
};

// If you're using the router a lot, you can alias it to another variable
var router = Tectonic.Pjax.Router;

// Define the handler that will respond to "get" requests against the /users/ endpoint
router.get('users', usersHandler);
```

The code above registers a new usersHandler that will be called when the request is returned from the server for GET /users/. Your function
can then implement front-end logic that is specific to that request/view combination. This will probably make more sense however, where functionality is heavier:

```javascript
var userHandler = function(id) {
    $('form#user').submit(function() {
        new FormValidator(this);    
    });
};

router.get('users/:id', userHandler);
```

There's a few new things here. First and foremost - there's some logic. In this case whenever we're viewing a user, we've also been sent back a bunch of HTML that represents a form. Here we're binding the submit event to a form validation library, which could handle the various fields, and however it wants to deal with the validation itself.

Secondly, our route is now supporting url arguments. In this case its an id, and when the route matches, our route handler will be passed the id that was provided as part of the URL. Cool, huh?

## Examples

We think it's best to learn from examples, so check them out over at our [examples page](https://github.com/tectonic/pjax-router/wiki/Examples).

## License

The MIT License (MIT)

Copyright (c) 2014 Tectonic Digital

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.