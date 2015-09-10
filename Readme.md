# StaticSmith-Branch

[![Join the chat at https://gitter.im/codePile/StaticSmith-Branch](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/codePile/StaticSmith-Branch?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/codePile/StaticSmith-Branch.svg)](https://travis-ci.org/codePile/StaticSmith-Branch) 

  A [StaticSmith][staticsmith] module to run separate middleware pipelines on 
  selected files.

  `StaticSmith-Branch` facilitates `declarative` pipelines by file pattern or filter, since it means
  each plugin doesn't have to implement its own filtering. `StaticSmith-Branch` was forked (from [metalsmith-branch v0.0.4](https://github.com/ericgj/metalsmith-branch/tree/0.0.4)) and re-configured for use with the [StaticSmith Engine][staticsmith] utilized by the Single Page Application / Content Management System (SPA/CMS), [OceanPress](https://oceanpress.io) - A [codePile.PBC](http://codepile.org) project.

## Current Release Status: *v[TBA]*
### Stable Production Release:
>`StaticSmith-Branch v[TBA]` is the current **stable/production** series on the `master` branch released on [TBA].
>You can learn about what is new with `StaticSmith v[TBA]` in our [Release Announcements](http://OceanPress.io/release-announcements/) or bullet-ed in the [HISTORY.md](https://github.com/codePile/StaticSmith/blob/master/History.md)

### Beta Quality Build: *v0.1.0*
>`StaticSmith-Branch v0.1.0` is the current **beta** series on the `develop` branch and the release as a production build is scheduled for [TBA]. Information about whats new in this version can be viewed in the  [HISTORY.md](https://github.com/codePile/StaticSmith-branch/blob/develop/History.md)

---

## Installation

    $ npm install @codepile/staticsmith-branch --save

## Usage

  In your build file:
  
  ```js
  var branch = require('@codepile/staticsmith-branch')

  staticsmith
    .use( branch()
            .pattern('*.md')        // for only md source files,
            .use( templates({       // run through jade template engine
                    engine: "jade",
                    inPlace: true
                  })
            )
            .use( markdown() )      // and generate html
        )

  // you can also specify the pattern directly in constructor

  staticsmith
    .use( branch('images/*') 
            .use( imageVariants() )
        )

  // or select files by function of their name, properties, and order:

  var lastweek = function(filename,props,i){
    var dt = new Date()
      , last = new Date( dt.getFullYear(), dt.getMonth(), dt.getDate());
    last.setDate( last.getDate() - 6 )
    return ( props.published >= last );
  }

  staticsmith
    .use( branch( lastweek )
            .use( tagLatest() )
        )
  ```

  **Note** Nested branches are possible too.

  ```js
  // to post-process only markdown-sourced files in a 'special' dir:

  staticsmith
    .use( branch('*.md')
            .use( markdown() )
            .use( branch('special/*.html')
                    .use( postProcess() )
                )
        )
  ```

---
## Todo's's, Bugs, Requests, Security, Oh My!:
**Have a Feature Request?** [Suggest it at our UserVoice page](https://oceanpress.uservoice.com). Peers can vote vote on your awesome idea and if it is a popular request, we'll implement it and you can follow its progress on our [Waffle Board](https://oceanpress.waffle.io)

**Found A Bug?** [Give us a holler](https://github.com/codePile/StaticSmith-Branch/issues/new) on our issues page and if your `in the need to know whats going down`? Check out our [Waffle Board](https://waffle.io/oceanpress/OceanPress) - You'll see the noise you created and track it in reall time. Our policy is Transparency, Transparency, Transparency!

**Security:** Here at codePile.PBC, we are committed to working with security experts across the world to stay up to date with the latest security techniques and participates in `HackerOne`. The codePile cooperative may pay out for various issues reported there. You can find out more information on our [HackerOne page](https://hackerone.com/codePile).

---
**StaticSmith** and **StaticSmith-Branch** are products of **OceanPress** - A registered trademark maintained by [codePile.PBC](http://codepile.org) & its [contributors](https://github.com/codePile/OceanPress/graphs/contributors) | **codePile.PBC** is a public benefit company ([PBC](http://en.wikipedia.org/wiki/Public-benefit_corporation)) operating as a consumer/worker (web-technology) [cooperative](http://en.wikipedia.org/wiki/Consumer_cooperative).

[staticsmith]: https://github.com/codePile/StaticSmith

