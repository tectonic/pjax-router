# PJAX Router

The PJAX router allows developers to register routes that are requested against your server within your application, and have the send and complete events that jquery-pjax fires handled specifically for those routes. It provides a greater element of organisation and control of your front-end code and alleviates you from bundling your javascript with your HTML output as part of the response from the server.

In short, it makes PJAX applications cleaner, easier to read - and much more manageable.

## Installation

Simply download the pjax-router.min.js file and load that in your HTML document.

## Usage

PJAX Router comes with the Tectonic.Pjax.Router class, allowing you to register routes that will respond to various calls.

'''javascript
var usersHandler = function() {
    // do stuff
};

// If you're using the router a lot, you can alias it to another variable
var router = Tectonic.Pjax.Router;

// Define the handler that will respond to "get" requests against the /users/ endpoint
router.get('users', usersHandler);
'''

The code above registers a new usersHandler that will be called when the request is returned from the server for GET /users/. Your function
can then implement front-end logic that is specific to that request/view combination.

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