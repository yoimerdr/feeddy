# feeddy

An easy-to-use interface for making requests to the Blogger Feeds API.

## Install

Download the [feeddy](https://github.com/yoimerdr/feeddy/releases/latest) script and include it in your project.

```html
<script src="./path-to/feeddy.js"></script>
```

or you can use

```html
<script src="https://yoimerdr.github.io/feeddy/dist/v1.2.1/feeddy.min.js"></script>
```
## How to

### Paginate entries

If you want to get the paginated entries and do something with them dynamically, you could do something like this

```javascript
// you can also use .comments or .pages instead .posts.
feeddy.posts({
  feed: {
    // For tests only you can use the 'https://cors-anywhere.herokuapp.com/' + your blog url.
    // Allow temporary access on https://cors-anywhere.herokuapp.com/corsdemo 
    blogUrl: '', // The blog url, or nothing if the current origin is the blogger blog. 
    params: feeddy.search.params()
      .limit(12)
      .build()
  }
}).then(handler => handler.page(1))
  .then(result => {
    console.log(result.entries); // .posts was deprecated an removed since 1.2
  })
```

#### Search posts

You could also paginate the entries by combining with some search parameters.

```javascript
feeddy.posts({
  feed: {
    blogUrl: '', // The blog url, or nothing if the current origin is the blogger blog. 
    params: feeddy.search.params()
      .limit(12)
      .query(
        feeddy.search.query()
          .terms('term') // The term for search, for terms with spaces use .exact() before .terms()
          .build()
      )
      .build()
  }
}).then(handler => handler.page(1))
  .then(result => {
    console.log(result.entries);
  })
```

### Paginate entries (SSR)

If you don't want to load the entries dynamically, but have the blogger generator itself return the entries (like cards at home),
you could do the following to get the valid URLs for it.

```javascript
feeddy.posts.ssr({
  feed: {
    blogUrl: '', // The blog url, or nothing if the current origin is the blogger blog. 
    params: feeddy.search.params()
      .limit(12)
      .build()
  },
  ssr: 'default2' // the ssr mode, the default value is 'default'.
}).then(handler => handler.page(2))
  .then(result => {
    console.log(result.url);
  })
```

### Posts with the given categories only

If you want to search for entries related to some categories, you may use:

```javascript
feeddy.posts.withCategories({
  feed: {
    blogUrl: '', // The blog url, or nothing if the current origin is the blogger blog. 
    params: feeddy.search.params()
      .limit(12)
      .build()
  },
  categories: ['category', 'name'],
  
})
  .then(result => {
    console.log(result.posts);
  })
```

### Interact with the feeds only

#### Mapped feed

```javascript
feeddy.feed({
  blogUrl: '', // The blog url, or nothing if the current origin is the blogger blog. 
  type: "posts", // since 1.2 the type (posts, pages, comments) is mandatory. This condition was removed in 1.2.1, default is posts.
  params: feeddy.search.params()
    .limit(12)
    .build()
}).then(console.log)
```

#### Raw feed

```javascript
feeddy.feed.raw({
  blogUrl: '', // The blog url, or nothing if the current origin is the blogger blog. 
  type: "posts", // since 1.2 the type (posts, pages, comments) is mandatory. This condition was removed in 1.2.1, default is posts.
  params: feeddy.search.params()
    .limit(12)
    .build()
}).then(console.log)
```

## Docs

You can read about the methods available and how responses are structured [here](https://yoimerdr.github.io/feeddy/docs/index.html).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Build your own

### Clone the repository

```bash
git clone https://github.com/yoimerdr/feeddy.git
```

### Install dependencies

Creates the `lib` folder
```bash 
mkdir lib
```

Moves into

```bash
cd lib
```

Clones the `jstls` dependency
```bash
git clone https://github.com/yoimerdr/jstls.git
```

And edit the project as you wish.
