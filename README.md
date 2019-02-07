*OBSOLETE*

# Progenitor

Progenitor is a baseline template with tooling for a modern front-end web development 
stack. The project aims to:

*   Define a project structure and deployment process that can be used in 
    most web applications.
*   Bootstrap the development process by providing an opinionated set of 
    Javascript and CSS frameworks and libraries.
*   Make dependency management quick and efficient.
*   Provide tools that help run/automate various build and deployment tasks
    in order to achieve an optimized output.

One of the motivations behind Progenitor was a need to update my front-end
development tooling and process.

HTML, JS, and CSS are the building blocks of the web, but these technologies
often lack structure and (in the case of CSS) flexibility when it comes to 
development work. As web applications become more front-end heavy, the need 
for a more organized development workflow increased. However, a lot of developers, 
including myself, have not really kept up with the advances in tooling that 
have cropped up in recent years. This project serves as an entry point for me to 
start taking advantage of the new web ecosystem.

## Getting Started

*Note: Setup is similar across platforms, but was written specifically for Mac OS.*

### General Requirements

Progenitor takes advantage of a lot of command line tools. You need the following in
your dev environment:

*   Ruby - Mac OS has this installed by default.
*   Node Package Manager (NPM) - NPM is the official package manager of NodeJS and 
    comes bundled with it. There are a lot of ways to install Node, but for Mac OS, 
    the recommended way is through Homebrew.

### Initial Setup

We now need to install those tools that we will use in our project. Most of these tools
are installed through Ruby or NPM.

We now need to install those tools that we will use in our project. Most of these tools
are installed through Ruby or NPM. Run the following commands in Terminal:

```
/* Install our Sass tools */
gem install sass
gem install compass
gem install susy
```

```
/* Install our JS tools */
npm install -g grunt-cli
npm install -g bower
npm install -g requirejs
```

### Project Setup

1.  Fork, clone, or download the contents of the repository to your local environment.
2.  Initialize our tools and processes by running the following:
    *   `npm install` - This uses package.json to install a local version of Grunt for our project.
    *   `compass init` - First, `cd compass` to the correct directory before running this. This creates the Sass cache for
        Compass.
    *   `bower install` - This installs our JS libraries in /components/ as defined in bower.json.
    *   `grunt build` - This runs the Grunt build task defined in Gruntfile.js and deploys all the bower components to
        their public folders.
    *   `grunt watch` - Finally, this runs the watch task that looks for changes in the directory and applies tasks to them.
        Initially it just uses Compass to compile Sass, but you can extend this task with whatever you one.    
3. Start coding and customizing!

## Primary Components

The following components form the basis of the development process we will
use in extending Progenitor for web applications. These are all opinionated
decisions, especially the decision to use Compass; however, these are all
seeing widespread adoption and will likely not fall into abandonware.

### [Sass](http://sass-lang.com/)

Sass is a CSS preprocessor that extends the CSS language with additional features
that will help us code more efficiently. Major language features include variables,
mixins, nested rules, and math. Sass also includes a watch process that 
automatically compiles .scss files into .css files for us, ready for deployment.

### [Compass](http://beta.compass-style.org/)

Compass is a Sass authoring framework that provides two things: reusable mixins,
and tooling that extends Sass's watch process. We will be using Compass to compile
and (optionally) minify our stylesheets. An alternative authoring framework would be
[Bourbon](http://bourbon.io/), which is a lightweight mixin library. However,
Bourbon does not have additional tooling. For this project, I have chosen to go
with Compass.

### [Bower](http://bower.io/)

Bower is a dependency management tool for Javascript packages. We will just use it
to keep track of our dependencies. Simple as that.

### [Grunt](http://gruntjs.com/)

Grunt is a Javascript task runner. Think ant. Grunt will tie the disparate parts of our
project and form the basis of our front-end build system. Using Grunt, we will be able 
to watch for changes in source files and apply relevant tasks, as well as 
move/minify/concatenate our source files for deployment.

### [RequireJS](http://requirejs.org/)

RequireJS is a *soft* primary component that provides structure to our Javascript files.
It is an Asynchronous Module Definition (AMD) library that enables us to modularize parts
of our code, as well as a loader that loads needed JS files on demand, based on the module's
requirements.

Not all projects may require (heh) AMD, so this can be easily taken out, but larger-scale
or single-page apps will benefit from some form of structure, which is why this is baked-in.
There is a noticeable learning curve, though. For the other side of the camp, search for
[CommonJS](http://en.wikipedia.org/wiki/CommonJS) libraries that handle modules
differently.

## Secondary Components

The following Sass components are included in the project but can be easily removed or
replaced:

*   [Susy](http://susy.oddbird.net/) - Responsive grids for Compass

*   [Inuit](https://github.com/csswizardry/inuit.css) - An OOCSS framework that may
    overlap with what Compass provides
    
*   [Normalize](http://necolas.github.io/normalize.css/) - A base stylesheet that 
    normalizes page elements across different browsers. Sane starting point for any
    web developer. I have made Normalize an .scss file so that it can be included
    in Sass compilation.

The following Javascript libraries are included in the project using Bower:

*   [jQuery](http://jquery.com/) and [Zepto](http://zeptojs.com/) - For DOM manipulation
    and an all-around general library, we will use either of these two (Zepto for modern
    browsers). Note that I haven't checked how jQuery plugins will handle using Zepto as
    the base.
    
*   [Modernizr](http://modernizr.com/) - Feature detection library. Going to be useful 
    for progressive enhancement. The included library is the entire one- for specific
    projects, the amount of feature detection may be smaller.
*   [JSON3](http://bestiejs.github.io/json3/) - Simple utility library for parsing and
    stringifying JSON.
    
*   [Handlebars](http://handlebarsjs.com/) - Templating engine. It requires
    extra configuration if we want to use it for RequireJS.
    
*   [Knockout](http://knockoutjs.com/) - Declarative data-binding MVVM library. I am very familiar
    with knockout as a data-binding library. However, this can easily replaced or
    supplemented by your framework or MVx of choice, e.g. Angular, Backbone, Ractive.
    But don't knock it 'til you've tried it (heh). 
    
    As an add-on, I have included the 
    [Knockout Class Binding Provider](https://github.com/rniemeyer/knockout-classBindingProvider)
    library to give you a choice if you want to specify bindings in HTML or in JS code.
    
*   [Underscore](http://underscorejs.org/) - Utility library

*   [Sammy](http://sammyjs.org/) - Routing library we can use for single-page apps or pages that
    have hashbang navigation. Alternative: [Director](https://github.com/flatiron/director)
    
## Resources

TODO - include resources that helped me shape this project

* [HTML5 Email Boilerplate](http://htmlemailboilerplate.com/)
