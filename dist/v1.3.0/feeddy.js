var feeddy = (function (exports) {
  'use strict';

  var isArray = Array.isArray;
  function forEach(array, callback, thisArg) {
    array.forEach(callback, thisArg);
  }

  var nullable = null;
  var indefinite = undefined;

  function typeIs(value, type) {
    var typeOf = typeof value;
    return (isArray(type) ? type : [type]).every(function (type) {
      return typeOf === type;
    });
  }
  function isDefined(value) {
    return value !== indefinite && value !== nullable;
  }
  function isObject(value) {
    return isDefined(value) && typeIs(value, 'object');
  }
  function isFunction(value) {
    return typeIs(value, 'function');
  }
  function isNumber(value) {
    return typeIs(value, 'number') && !isNaN(value);
  }
  function isString(value) {
    return typeIs(value, 'string');
  }

  function apply(fn, thisArg, args) {
    return fn.apply(thisArg, arguments[2]);
  }

  function protoapply(cls, key, instance, args) {
    return apply(cls.prototype[key], instance, arguments[3]);
  }

  function slice(source, startIndex, endIndex) {
    return protoapply(Array, 'slice', source, [startIndex, endIndex]);
  }
  function reduce(source, callbackfn, initialValue) {
    return protoapply(Array, 'reduce', source, [callbackfn, initialValue]);
  }

  function len(iterable) {
    return isDefined(iterable) ? iterable.length : nullable;
  }
  function concat(source) {
    return apply(source.concat, source, slice(arguments, 1));
  }

  function self$1(value) {
    return value;
  }
  function returns(value) {
    return function () {
      return value;
    };
  }
  function reduceText(text, length, separator, joiner) {
    var result = '';
    joiner = joiner || ' ';
    separator = separator || ' ';
    var source = text.split(separator);
    for (var i = 0; i < len(source); i++) {
      var value = source[i];
      if (!value) continue;
      value = concat(result, joiner, value);
      if (length && len(value) > length) break;
      result = value;
    }
    return result.slice(1);
  }

  function string(value, nullableString) {
    if (isDefined(value)) return value.toString();
    nullableString = isFunction(nullableString) ? nullableString : returns('');
    return nullableString();
  }

  var keys = Object.keys;
  var propertyNames = Object.getOwnPropertyNames;
  var defineProperty = Object.defineProperty;
  var freeze = Object.freeze;
  function valueOf(object) {
    return object.valueOf();
  }

  function hasOwn(target, key) {
    return protoapply(Object, 'hasOwnProperty', target, [key]);
  }

  function call(fn, thisArg) {
    return fn.apply(thisArg, slice(arguments, 2));
  }

  function includes(searchElement, fromIndex) {
    var $this = this;
    return len($this) === 0
      ? false
      : protoapply(Array, 'indexOf', $this, [searchElement, fromIndex]) !== -1;
  }

  function get$1(object, key) {
    var args = arguments,
      i = 1;
    if (len(args) <= 2) return object ? object[key] : indefinite;
    for (; i < len(args); i++) {
      key = args[i];
      if (object) object = object[key];
      else return object;
    }
    return object;
  }

  function set(object, key, key2) {
    var args = arguments,
      lt = len(args),
      value = args[lt - 1];
    if (lt > 3) {
      object = apply(get$1, indefinite, slice(args, 0, lt - 2));
      key = args[lt - 2];
    }
    if (!object) return indefinite;
    object[key] = value;
    return object[key];
  }
  function setTo(object, key, target) {
    var props = {};
    if (isString(key)) {
      props[key] = self$1;
    } else if (isArray(key)) {
      props = reduce(
        key,
        function (props, name) {
          props[name] = self$1;
          return props;
        },
        props,
      );
    } else if (!isObject(key)) return target;
    else props = key;
    return reduce(
      keys(props),
      function (target, name) {
        hasOwn(object, name) && (target[name] = props[name](object[name]));
        return target;
      },
      target,
    );
  }

  function assign2(target, source) {
    return isObject(source) ? setTo(source, keys(source), target) : target;
  }

  function multiple(target, descriptors, definer) {
    forEach(keys(descriptors), function (key) {
      return definer(target, key, descriptors[key]);
    });
  }
  function descriptor(value, writable, configurable, enumerable) {
    return {
      value: value,
      writable: writable,
      enumerable: enumerable,
      configurable: configurable,
    };
  }

  function prop(target, key, descriptor) {
    try {
      defineProperty(target, key, descriptor);
    } catch (e) {}
  }
  function props(target, descriptors) {
    multiple(target, descriptors, prop);
  }

  function _value(target, key, value, writable, numerable) {
    prop(target, key, descriptor(value, writable, indefinite, numerable));
  }
  function readonly2(target, key, value) {
    _value(target, key, value, indefinite, true);
  }
  function readonlys2(target, values) {
    multiple(target, values, readonly2);
  }
  function writeable(target, key, value) {
    _value(target, key, value, true);
  }

  function isEmpty($this) {
    return len(this || $this) === 0;
  }
  function isNotEmpty($this) {
    return !isEmpty(this || $this);
  }
  function firstOrNull($this) {
    $this = this || $this;
    return isEmpty($this) ? nullable : $this[0];
  }

  function statics(target, base) {
    (
      get$1(Object, 'setPrototypeOf') ||
      ({ __proto__: [] } instanceof Array &&
        function (target, base) {
          set(target, '__proto__', base);
        }) ||
      function (target, base) {
        return setTo(base, propertyNames(base), target);
      }
    )(target, base);
    return target;
  }
  function prototype$3(target, base) {
    if (!isFunction(base) && base !== nullable)
      throw new TypeError(
        concat('Class extends value ', base, ' is not a constructor or null'),
      );
    statics(target, base);
    function __() {
      this.constructor = base;
    }
    try {
      target.prototype =
        base === nullable
          ? Object.create(base)
          : ((__.prototype = base.prototype), new __());
    } catch (e) {
      var proto = base && base.prototype;
      base && setTo(proto, propertyNames(proto), target.prototype);
    }
    return target;
  }

  function parentFirst(constructor, parent) {
    return parent
      ? function Instanceable() {
          var args = slice(arguments),
            $this = (parent && apply(parent, this, args)) || this;
          constructor && apply(constructor, $this, args);
          return $this;
        }
      : indefinite;
  }

  function self() {
    return function () {
      return this;
    };
  }

  var acceptedTypes = ['object', 'function'],
    Exception = TypeError;
  function sourceToDescriptor(source) {
    return reduce(
      keys(source),
      function (current, key) {
        current[key] = descriptor(source[key], true, true, false);
        return current;
      },
      {},
    );
  }
  function funclass2(options, parent) {
    var statics = options.statics,
      statidescriptor = options.statidescriptor,
      protodescriptor = options.protodescriptor,
      proto = options.prototype;
    var init = options.construct,
      clsBuilder = options.cls,
      constructor = init;
    clsBuilder = clsBuilder || parentFirst;
    if (!isFunction(clsBuilder))
      throw Exception('The modified constructor builder must be a function.');
    var cls = clsBuilder(constructor, parent);
    if (isDefined(init) && !isFunction(init))
      throw Exception('The constructor must be a function.');
    if (isDefined(cls) && !isFunction(cls))
      throw Exception('The modified constructor must be a function.');
    init = cls || init || self();
    parent && prototype$3(init, parent);
    statidescriptor && props(init, statidescriptor);
    statics && props(init, sourceToDescriptor(statics));
    var funPrototype = init.prototype;
    if (!call(includes, acceptedTypes, typeof funPrototype))
      throw Exception('The function prototype must be an object.');
    protodescriptor && props(funPrototype, protodescriptor);
    proto && props(funPrototype, sourceToDescriptor(proto));
    return init;
  }

  function defineException(name, parent) {
    return funclass2(
      {
        construct: function () {
          this.name = name;
        },
      },
      Error,
    );
  }

  var IllegalArgumentError = defineException('IllegalArgumentError');

  var IllegalAccessError = defineException('IllegalAccessError');

  defineException('RequiredArgumentError');

  function getDefined(value, builder, thisArg) {
    return isDefined(value) ? value : getIf(value, isDefined, builder, thisArg);
  }
  function getIf(value, condition, builder, thisArg) {
    if (condition(value)) return value;
    value = apply(builder, thisArg);
    return value;
  }

  function toInt(radix, $this) {
    var value = parseInt(getDefined(this, returns($this)), radix);
    return isNaN(value) ? nullable : value;
  }
  function toFloat($this) {
    var value = parseFloat(getDefined(this, returns($this)));
    return isNaN(value) ? nullable : value;
  }

  var max$1 = Math.max;
  var min = Math.min;
  var round = Math.round;
  var random = Math.random;

  function coerceAtLeast(minimum, $this) {
    return max$1(valueOf(getDefined(this, returns($this))), minimum);
  }

  function coerceIn(minimum, maximum, $this) {
    return min(
      max$1(valueOf(getDefined(this, returns($this))), minimum),
      maximum,
    );
  }

  var dateTypes = ['published', 'updated'],
    parametersMap = {
      'max-results': 'max',
      'start-index': 'start',
      'published-min': 'publishedAtLeast',
      'published-max': 'publishedAtMost',
      'updated-min': 'updatedAtLeast',
      'updated-max': 'updatedAtMost',
      orderby: 'order',
      q: 'query',
      alt: 'alt',
    };

  function deletes(object, key) {
    var args = arguments,
      lt = len(args);
    if (lt > 2) {
      object = apply(get$1, indefinite, slice(args, 0, lt - 1));
      key = args[lt - 1];
    }
    if (!object) return indefinite;
    var value = object[key];
    delete object[key];
    return value;
  }
  function deletes2(object, keys) {
    forEach(keys, function (key) {
      return delete object[key];
    });
  }
  function deletesAll(object) {
    deletes2(object, propertyNames(object));
  }

  function minimumsOne(max) {
    max = toInt(nullable, string(max));
    return isDefined(max) ? coerceAtLeast(1, max) : 1;
  }
  function validDate(date) {
    try {
      return new Date(date).toISOString();
    } catch (e) {
      isDefined(date) && console.error('No valid date given: ', date);
      return indefinite;
    }
  }
  function updateProperty(args, source, key, builder, allowUndefined) {
    var value = len(args) > 0 ? args[0] : source[key];
    if (!allowUndefined && !isDefined(value)) deletes(source, key);
    else source[key] = builder ? builder(value) : value;
    return source[key];
  }
  function propertyFn(key, builder, allowUndefined) {
    return function (value) {
      var source = this.source;
      return updateProperty(arguments, source, key, builder, allowUndefined);
    };
  }
  function dateProperties(type, mode) {
    var suffix = mode === 'max' ? 'AtMost' : 'AtLeast';
    set(prototype$2, type + suffix, function (value) {
      var source = this.source,
        key = concat(type, '-', mode);
      return updateProperty(arguments, source, key, validDate);
    });
  }
  var prototype$2 = {
    max: propertyFn('max-results', minimumsOne),
    start: propertyFn('start-index', minimumsOne),
    query: propertyFn('q'),
    alt: propertyFn(
      'alt',
      function (it) {
        return call(includes, ['json', 'rss', 'atom'], it) ? it : 'json';
      },
      true,
    ),
    orderby: propertyFn(
      'orderby',
      function (order) {
        return call(includes, dateTypes, order) ? order : 'updated';
      },
      true,
    ),
    toDefined: function () {
      return this.source;
    },
  };
  forEach(dateTypes, function (key) {
    dateProperties(key, 'min');
    dateProperties(key, 'max');
  });
  var SearchParams = funclass2({
    construct: function (source) {
      source = source || {};
      for (var key in source) {
        (!parametersMap[key] || !isDefined(source[key])) &&
          deletes2(source, [key]);
      }
      readonly2(this, 'source', source);
    },
    statics: {
      from: paramsFrom,
    },
    prototype: prototype$2,
  });
  function paramsFrom(source, copy) {
    if (source instanceof SearchParams)
      return copy ? paramsFrom(source.source, copy) : source;
    return new SearchParams(copy ? assign2({}, source) : source);
  }

  var id = 0;
  var postfix = random();
  function uid(key) {
    return concat(
      "Symbol('",
      string(key),
      "')_",
      apply((1.0).toString, ++id + postfix, [36]),
    );
  }

  function paramIndex($this, index, action) {
    var params = get$1($this, searchParamsSymbol);
    var current = params.start();
    index = toInt(indefinite, string(index)) >> 0;
    current =
      action === 'plus'
        ? current + index
        : action === 'minus'
          ? current - index
          : index;
    params.start(current);
    return $this;
  }
  function paramDate($this, min, max, type, keepAtLeast, keepAtMost) {
    var params = get$1($this, searchParamsSymbol);
    (isDefined(min) || !keepAtLeast) &&
      apply(get$1(params, type + 'AtLeast'), params, [min]);
    (isDefined(max) || !keepAtMost) &&
      apply(get$1(params, type + 'AtMost'), params, [max]);
    return $this;
  }
  var searchParamsSymbol = uid('p');
  var maxResults = 500;
  function simpleProperty(key) {
    return function (value) {
      var $this = this,
        params = get$1($this, searchParamsSymbol);
      apply(get$1(params, key), params, [value]);
      return $this;
    };
  }
  var source = ['place', 'plus', 'minus'].map(function (mode) {
    return function (index) {
      return paramIndex(this, index, mode);
    };
  });
  var max = simpleProperty('max'),
    prototype$1 = {
      max: max,
      limit: max,
      start: source[0],
      plusStart: source[1],
      minusStart: source[2],
      index: source[0],
      plusIndex: source[1],
      minusIndex: source[2],
      paginated: function (page) {
        var $this = this;
        if (isDefined(page)) {
          var max_1 = get$1($this, searchParamsSymbol).max();
          $this.start(
            coerceAtLeast(0, toInt(nullable, string(page)) - 1) * max_1 + 1,
          );
        }
        return $this;
      },
      order: simpleProperty('orderby'),
      query: simpleProperty('query'),
      alt: simpleProperty('alt'),
      clear: function () {
        var $this = this;
        deletesAll(get$1($this, searchParamsSymbol).source);
        return $this;
      },
      build: function (copy) {
        var params = get$1(this, searchParamsSymbol),
          source = params.source;
        return copy ? builderFrom(source, true).build() : source;
      },
    };
  forEach(dateTypes, function (type) {
    set(prototype$1, type, function (min, max) {
      return paramDate(this, min, max, type);
    });
    set(prototype$1, type + 'AtLeast', function (min) {
      return paramDate(this, min, indefinite, type, false, true);
    });
    set(prototype$1, type + 'AtMost', function (max) {
      return paramDate(this, indefinite, max, type, true);
    });
  });
  var SearchParamsBuilder = funclass2({
    construct: function (source) {
      if (source instanceof SearchParams) {
        writeable(this, searchParamsSymbol, source);
        source = source.source;
        for (var key in source) {
          var map = parametersMap[key];
          map && this[map](source[key]);
        }
      } else return builderFrom(source);
    },
    statics: {
      from: builderFrom,
      empty: paramsBuilder,
    },
    prototype: prototype$1,
  });
  readonly2(SearchParamsBuilder, 'maxResults', maxResults);
  function builderFrom(params, copy) {
    return new SearchParamsBuilder(paramsFrom(params, copy));
  }
  function paramsBuilder() {
    return new SearchParamsBuilder({});
  }

  function createRoute(type, route, id) {
    var suffix = route === 'full' ? 'default' : 'summary',
      mid = 'posts',
      prefix = '/';
    if (type === 'pages') mid = 'pages';
    else if (type === 'comments') {
      mid = 'comments';
      id && (prefix = concat(prefix, id, prefix));
    }
    id && type !== 'comments' && (suffix += concat('/', id));
    return concat('feeds', prefix, mid, '/', suffix);
  }
  var routes = {};
  forEach(['posts', 'pages', 'comments'], function (key) {
    readonly2(routes, key, createRoute(key, 'full'));
    readonly2(routes, key + 'Summary', createRoute(key, indefinite));
  });

  function buildUrl(options, id) {
    options = getIf(options, isObject, self, {});
    var href;
    if (isDefined(options.blogUrl)) href = options.blogUrl;
    else if (typeof location !== 'undefined') href = location.origin;
    else
      throw new IllegalArgumentError(
        'You must pass the blog url or call this on the browser.',
      );
    options.blogUrl = href;
    var fetchUrl = new URL(href);
    fetchUrl.pathname += createRoute(options.type, options.route, id);
    var params = paramsFrom(options.params);
    params.max(coerceIn(1, maxResults, params.max()));
    params.alt(params.alt());
    var search = params.source;
    forEach(keys(search), function (key) {
      fetchUrl.searchParams.set(key, search[key]);
    });
    return fetchUrl;
  }
  function getId(source, type) {
    if (isObject(source)) {
      if (hasOwn(source, 'id')) return getId(get$1(source, 'id'), type);
      hasOwn(source, '$t') && (source = get$1(source, '$t'));
    }
    if (!apply(includes, ['blog', 'post', 'page'], [type]))
      throw new IllegalArgumentError(
        concat("'", type, "' is an unknown type id."),
      );
    var expr = new RegExp(concat(type, '-([0-9]+)'), 'g'),
      res = expr.exec(source);
    return res ? res[1] : '';
  }
  function isComments(options) {
    return get$1(options, 'type') === 'comments';
  }

  function extend(source, $this) {
    $this = this || $this;
    source && apply($this.push, $this, source);
    return $this;
  }

  function _rawGet(options, all, id) {
    options = feedOptions(options);
    var params = paramsFrom(options.params);
    if (all) {
      params.start(1);
      params.max(maxResults);
    }
    var entries = [],
      url = buildUrl(options, id),
      startIndex = params.start() || 1;
    function request(url, max) {
      return fetch(string(url))
        .then(function (res) {
          if (res.status !== 200)
            throw new IllegalAccessError(
              'Request failed. Status: ' + res.status,
            );
          return res.text();
        })
        .then(function (body) {
          try {
            var blog = JSON.parse(body);
            if (id && !isComments(options)) {
              return blog;
            }
            var feed = blog.feed,
              entry = feed.entry || [];
            extend(entry, entries);
            var length_1 = len(entry);
            if (isNotEmpty(entry) && (all || (!all && length_1 < max))) {
              !all && (max -= length_1);
              params.start(params.start() + length_1);
              params.max(max);
              if (max > 0) return request(buildUrl(options), max);
            }
            feed.entry = entries;
            if (params.max() !== len(entries))
              feed.openSearch$itemsPerPage.$t =
                feed.openSearch$totalResults.$t = string(len(entries));
            feed.openSearch$startIndex.$t = string(startIndex);
            return blog;
          } catch (e) {
            throw {
              message: 'Parse failed. The response is not a JSON.',
              body: body,
            };
          }
        });
    }
    return request(url, params.max());
  }
  function feedOptions(options) {
    var result = assign2(
        {
          route: 'summary',
          type: 'posts',
        },
        options,
      ),
      key = 'params',
      max = 'max-results',
      params = {};
    params[max] = 1;
    set(result, key, assign2(params, get$1(options, key)));
    return result;
  }
  function rawGet(options) {
    return _rawGet(options);
  }
  function rawAll(options) {
    return _rawGet(options, true);
  }
  function rawById(options) {
    return _rawGet(get$1(options, 'feed') || {}, false, get$1(options, 'id'));
  }

  function rawTextToText(text) {
    return string(get$1(text, '$t'));
  }
  function rawTextToNumber(text) {
    return toInt(nullable, rawTextToText(text));
  }
  function rawTextToBoolean(text) {
    return Boolean(rawTextToText(text));
  }
  function rawCategoryToCategory(category) {
    return isArray(category)
      ? category.map(function (it) {
          return it.term;
        })
      : [];
  }
  function rawAuthorToAuthor(author) {
    return isArray(author)
      ? author.map(function (value) {
          return setTo(
            value,
            {
              email: rawTextToText,
              name: rawTextToText,
              uri: rawTextToText,
              gd$image: self$1,
            },
            {},
          );
        })
      : [];
  }
  function rawEntryToEntry(post) {
    if (!isObject(post)) return {};
    return setTo(
      post,
      {
        id: rawTextToText,
        author: rawAuthorToAuthor,
        title: rawTextToText,
        link: self$1,
        updated: rawTextToText,
        published: rawTextToText,
        category: rawCategoryToCategory,
        media$thumbnail: function (value) {
          return {
            width: apply(toInt, value.width),
            height: apply(toInt, value.height),
            url: value.url,
          };
        },
        content: rawTextToText,
        summary: rawTextToText,
        thr$total: rawTextToNumber,
        'thr$in-reply-to': self$1,
        gd$extendedProperty: self$1,
      },
      {},
    );
  }
  function rawBlogEntryToBlogEntry(blog) {
    return setTo(
      blog,
      {
        version: self$1,
        encoding: self$1,
        entry: rawEntryToEntry,
      },
      {},
    );
  }
  function rawBlogToBlog(blog) {
    return setTo(
      blog,
      {
        version: self$1,
        encoding: self$1,
        feed: function (feed) {
          var res = rawEntryToEntry(feed);
          setTo(
            feed,
            {
              blogger$adultContent: rawTextToBoolean,
              subtitle: rawTextToText,
              openSearch$itemsPerPage: rawTextToNumber,
              openSearch$startIndex: rawTextToNumber,
              openSearch$totalResults: rawTextToNumber,
              entry: function (value) {
                return isArray(value) ? value.map(rawEntryToEntry) : [];
              },
            },
            res,
          );
          return res;
        },
      },
      {},
    );
  }

  function all(options) {
    return rawAll(options).then(rawBlogToBlog);
  }
  function get(options) {
    return rawGet(options).then(rawBlogToBlog);
  }
  function byId(options) {
    var mapper =
      get$1(options, 'feed', 'type') === 'comments'
        ? rawBlogToBlog
        : rawBlogEntryToBlogEntry;
    return rawById(options).then(mapper);
  }

  function entriesBase(options, builder, id) {
    options = getIf(options, isObject, self, {});
    var feed;
    options.feed = feed = getIf(options.feed, isObject, self, {});
    var params = paramsFrom(feed.params),
      paramsBuilder = builderFrom(params);
    var request =
        isComments(feed) && id
          ? function (feed) {
              return _rawGet(feed, params.query(), id).then(rawBlogToBlog);
            }
          : get,
      createHandler = builder(feed, params, paramsBuilder, request);
    params.query() || params.max(1);
    return (id && isComments(feed) ? request : params.query() ? all : get)(
      feed,
    ).then(createHandler);
  }

  function basicHandler(changePage, fn) {
    return function (options, params, builder, request) {
      var max = params.max();
      return function (blog) {
        builder.max(max);
        var source = fn ? fn(blog) : {},
          handler = freeze(
            assign2(source, {
              total: blog.feed.openSearch$totalResults,
              page: changePage(options, params, builder, request),
            }),
          );
        deletes(blog, 'feed');
        return handler;
      };
    };
  }
  function basicHandlerPage(feed, params, builder, request) {
    return function (page) {
      feed.params = builder.paginated(page).build();
      return request(feed).then(function (blog) {
        return freeze({
          entries: get$1(blog, 'feed', 'entry') || [],
          blog: blog,
        });
      });
    };
  }

  function posts(options) {
    set(options, 'feed', 'type', 'posts');
    return entriesBase(
      options,
      basicHandler(basicHandlerPage, function (blog) {
        return {
          categories: freeze(blog.feed.category || []),
        };
      }),
    );
  }

  function operator(operator) {
    return operator === 'OR' ? '|' : ' ';
  }
  function quote(exact) {
    return exact ? '"' : '';
  }
  function exclude() {
    return '-';
  }

  var querySymbol = uid('q'),
    excludeSymbol = uid('e'),
    operatorSymbol = uid('o'),
    exactSymbol = uid('e');
  function buildQuery(terms, sep, startQuote, endQuote) {
    terms = isArray(terms) ? terms : [terms];
    endQuote = getDefined(endQuote, returns(startQuote));
    terms = terms.map(string).filter(isNotEmpty);
    return isEmpty(terms) ? '' : concat(startQuote, terms.join(sep), endQuote);
  }
  function appendQuery($this, args, name) {
    if (isEmpty(args)) return $this;
    var qt = quote(get$1($this, exactSymbol)),
      op = operator(get$1($this, operatorSymbol)),
      xc = get$1($this, excludeSymbol) ? exclude() : '';
    name = string(name);
    name = isNotEmpty(name) ? concat(name, ':') : '';
    var current = get$1($this, querySymbol);
    var query = buildQuery(
      slice(args),
      concat(qt, op, xc, name, qt),
      concat(xc, name, qt),
      qt,
    );
    isNotEmpty(current) && (current += op);
    set($this, querySymbol, current + query);
    return $this;
  }
  function setFn(symbol, value) {
    return function () {
      var $this = this;
      set($this, symbol, value);
      return $this;
    };
  }
  var prototype = {
    and: setFn(operatorSymbol, 'AND'),
    or: setFn(operatorSymbol, 'OR'),
    exact: setFn(exactSymbol, true),
    noExact: setFn(exactSymbol, false),
    exclude: setFn(excludeSymbol, true),
    noExclude: setFn(excludeSymbol, false),
    terms: function () {
      return appendQuery(this, arguments);
    },
    named: function (name) {
      return appendQuery(this, slice(arguments, 1), name);
    },
    build: function () {
      var query = get$1(this, querySymbol);
      return isEmpty(query) ? indefinite : query;
    },
    clear: function (reset) {
      var $this = this;
      if (reset) {
        set($this, querySymbol, '');
        set($this, operatorSymbol, 'OR');
        set($this, excludeSymbol, false);
        set($this, exactSymbol, false);
      }
      return $this;
    },
  };
  var named = ['label', 'title', 'author', 'link'].map(function (key) {
    var handler = function () {
      var $this = this;
      return apply($this.named, $this, concat([key], slice(arguments)));
    };
    set(prototype, key, handler);
    return handler;
  });
  prototype['labels'] = prototype['categories'] = named[0];
  prototype['url'] = named[3];
  var QueryStringBuilder = funclass2({
    construct: function () {
      var $this = this;
      writeable($this, exactSymbol, false);
      writeable($this, operatorSymbol, 'OR');
      writeable($this, excludeSymbol, false);
      writeable($this, querySymbol, '');
    },
    prototype: prototype,
  });
  function queryBuilder() {
    return new QueryStringBuilder();
  }

  function splitQuery(query) {
    var result = {
      named: {},
      exact: [],
      terms: [],
    };
    var tokenRegex = /(\w+):"([^"]+)"|(\w+):(\w*)|"([^"]+)"|(\w+)/g;
    var match;
    while ((match = tokenRegex.exec(query)) !== null) {
      if (match[1] && match[2]) {
        var key = match[1],
          value = match[2];
        var named = result.named[key];
        named || (named = result.named[key] = { exact: [], terms: [] });
        named.exact.push(value);
      } else if (match[3] && match[4]) {
        var key = match[3],
          value = match[4];
        var named = result.named[key];
        named || (named = result.named[key] = { exact: [], terms: [] });
        named.terms.push(value);
      } else if (match[5]) {
        result.exact.push(match[5]);
      } else if (match[6]) {
        result.terms.push(match[6]);
      }
    }
    return result;
  }

  function parseSize(constructor, isSize, format, ratio) {
    var aspectRatio = 1;
    if (!isDefined(ratio))
      aspectRatio = parseSize(constructor, isSize, format, 1).ratio();
    else if (isNumber(ratio)) aspectRatio = ratio;
    else if (!isSize(ratio))
      aspectRatio = parseSize(constructor, isSize, ratio, 1).ratio();
    else if (isFunction(get$1(ratio, 'ratio'))) aspectRatio = ratio.ratio();
    var match = string(format).split(':');
    var width = toFloat(match[0]),
      height = toFloat(match[1]);
    if (isDefined(width) && isDefined(height))
      return new constructor(width, height).adjust(aspectRatio);
    else if (isDefined(width)) height = width / aspectRatio;
    else if (isDefined(height)) width = height * aspectRatio;
    else
      throw new IllegalArgumentError(
        concat('The format ', format, ' is not valid.'),
      );
    return new constructor(width, height);
  }

  var thumbnailSizeExpression = 's72-c';
  function toFormatSize(size) {
    return isObject(size)
      ? concat('', size.width, ':', size.height)
      : string(size);
  }
  function postThumbnail(source, size, ratio) {
    var parse = parseSize(
      function (width, height) {
        var $this = this;
        $this.height = round(height);
        $this.width = round(width);
        $this.adjust = self();
        $this.ratio = function () {
          return $this.height === 0 ? 0 : $this.width / $this.height;
        };
      },
      isObject,
      toFormatSize(size),
      ratio || 16 / 9,
    );
    var expression = concat('w', parse.width, '-h', parse.height, '-p-k-no-nu'),
      sizeMatch = new RegExp(
        concat('\/(', thumbnailSizeExpression, '|s[0-9]+)', '\/'),
      ),
      legacyMatch = new RegExp(
        concat('=(', thumbnailSizeExpression, '|s[0-9]+)'),
      );
    source = get$1(source, 'media$thumbnail', 'url') || string(source);
    return source
      .replace(sizeMatch, concat('/', expression, '/'))
      .replace(legacyMatch, concat('=', expression));
  }

  function withCategories(options) {
    var categories = options.categories;
    if (apply(isEmpty, categories))
      return new Promise(function (_, reject) {
        return reject('The categories are empty.');
      });
    var feed = feedOptions(options.feed),
      params = paramsFrom(feed.params),
      builder = queryBuilder().exact();
    set(feed, 'type', 'posts');
    apply(options.every ? builder.and : builder.or, builder);
    builderFrom(params).query(
      apply(builder.categories, builder, categories).build(),
    );
    return all(feed).then(function (blog) {
      return freeze({
        posts: blog.feed.entry
          .map(function (post) {
            return {
              count: len(
                post.category.filter(function (it) {
                  return categories.indexOf(it) >= 0;
                }),
              ),
              post: post,
            };
          })
          .sort(function (a, b) {
            return b.count - a.count;
          })
          .slice(0, params.max()),
        blog: blog,
      });
    });
  }

  function entries(options, extra) {
    return entriesBase(options, basicHandler(basicHandlerPage, extra));
  }

  function commentsById(options) {
    set(options, 'feed', 'type', 'comments');
    return entriesBase(
      options,
      basicHandler(basicHandlerPage),
      get$1(options, 'id'),
    );
  }

  function bind(fn, thisArg) {
    return fn.bind(thisArg);
  }

  function findLastIndex(predicate, thisArg) {
    predicate = bind(predicate, thisArg);
    var $this = this;
    var index = len($this);
    while (index > 0) {
      --index;
      if (index in $this && predicate($this[index], index, $this)) return index;
    }
    return -1;
  }
  function findLast(predicate, thisArg) {
    predicate = bind(predicate, thisArg);
    var $this = this,
      index = apply(findLastIndex, $this, [predicate, thisArg]);
    return index !== -1 ? $this[index] : indefinite;
  }

  function entryPathname(source, length) {
    var links = get$1(source, 'link');
    var link = indefinite;
    if (links && isNotEmpty(links)) {
      link = apply(findLast, links, [
        function (value) {
          return value.rel === 'alternate';
        },
      ]);
      if (link) return link.href.split('/').pop().replace('.html', '');
    }
    link = get$1(source, 'title') || string(source);
    return reduceText(link, length, /\W/, '-').toLowerCase();
  }

  function resolve(result) {
    return new Promise(function (res) {
      return res(result);
    });
  }

  function createResult(base, parameters) {
    var values = keys(parameters);
    base = isEmpty(values)
      ? base
      : concat(
          base,
          '?',
          values
            .sort(function (a, b) {
              return a.localeCompare(b);
            })
            .map(function (key) {
              return concat(key, '=', parameters[key]);
            })
            .join('&'),
        );
    return {
      parameters: parameters,
      url: base,
    };
  }
  function ssrPosts(options) {
    set(options, 'feed', 'type', 'posts');
    var ssr = get$1(options, 'ssr'),
      label = get$1(options, 'category'),
      sourceParams = get$1(options, 'feed', 'params');
    var query = get$1(sourceParams, 'q'),
      url = '/search';
    if (ssr === 'label' && label && isNotEmpty(label)) {
      url = concat(url, '/label/', label);
      query = queryBuilder().labels(label).build();
    } else if (ssr !== 'query') query = indefinite;
    set(sourceParams, 'q', query);
    return entriesBase(
      options,
      basicHandler(function (feed, params, builder, request) {
        var max = params.max(),
          query = params.query();
        return function (page) {
          var baseUrl = url,
            parameters = {
              'max-results': max,
            },
            early = indefinite;
          builder.max(max).paginated(page).minusIndex(1);
          if (ssr === 'query' && query) {
            parameters['q'] = query;
            parameters['by-date'] = true;
          }
          if (page === 1) {
            if ((ssr !== 'query' || !query) && (ssr !== 'label' || !label)) {
              baseUrl = '/';
              parameters = {};
            }
            early = true;
          } else if (apply(includes, ['query', 'default2'], [ssr])) {
            parameters['start'] = params.start();
            parameters['by-date'] = early = true;
            if (ssr === 'default2') parameters['q'] = '*';
          }
          if (early) return resolve(createResult(baseUrl, parameters));
          feed.params = builder.max(1).build();
          return request(feed).then(function (result) {
            var entry = firstOrNull(get$1(result, 'feed', 'entry') || []);
            if (!entry) return createResult('/', {});
            var date = entry.published;
            date = date.substring(0, 19) + date.substring(23, 29);
            parameters['updated-max'] = date;
            return createResult(baseUrl, parameters);
          });
        };
      }),
    );
  }

  readonlys2(rawGet, {
    all: rawAll,
    byId: rawById,
  });
  var feed = get;
  readonlys2(feed, {
    all: all,
    raw: rawGet,
    byId: byId,
  });
  var search = {};
  readonlys2(search, {
    query: queryBuilder,
    QueryStringBuilder: QueryStringBuilder,
    params: paramsBuilder,
    SearchParamsBuilder: SearchParamsBuilder,
    SearchParams: SearchParams,
  });
  readonlys2(queryBuilder, {
    split: splitQuery,
    Builder: QueryStringBuilder,
  });
  readonlys2(paramsBuilder, {
    Params: SearchParams,
    Builder: SearchParamsBuilder,
  });
  readonlys2(entries, {
    byId: byId,
    createsPathname: entryPathname,
  });
  readonlys2(posts, {
    createsThumbnail: postThumbnail,
    withCategories: withCategories,
    ssr: ssrPosts,
  });
  var module = {
    posts: posts,
    entries: entries,
    search: search,
    feed: feed,
    routes: routes,
    buildUrl: buildUrl,
    getId: getId,
  };
  var others = ['comments', 'pages'];
  forEach(others, function (key) {
    set(module, key, function (options) {
      set(options, 'feed', 'type', key);
      return entries(options);
    });
  });
  others.push('posts');
  forEach(others, function (key) {
    set(module, key, 'byId', function (options) {
      set(options, 'feed', 'type', key);
      return byId(options);
    });
  });
  set(module, 'comments', 'byId', commentsById);
  assign2(exports, module);

  exports.buildUrl = buildUrl;
  exports.feed = feed;
  exports.getId = getId;

  return exports;
})({});
