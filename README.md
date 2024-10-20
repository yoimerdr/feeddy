# feeddy

An easy-to-use interface for making requests to the Blogger Feeds API.

## Install

Download the [feeddy](https://github.com/yoimerdr/feeddy/releases/latest) script and include it in your project.

```html
<script src="./path-to/feeddy.js"></script>
```

or you can use

```html
<script src="https://yoimerdr.github.io/feeddy/dist/feeddy.min.js"></script>
```
## How to

### Paginate posts

```javascript
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
    console.log(result.posts);
  })
```

### Search posts

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
    console.log(result.posts);
  })
```

### Posts with the given categories only

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
  params: feeddy.search.params()
    .limit(12)
    .build()
}).then(console.log)
```

#### Raw feed

```javascript
feeddy.feed.raw({
  blogUrl: '', // The blog url, or nothing if the current origin is the blogger blog. 
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
