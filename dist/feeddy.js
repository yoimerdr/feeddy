var feeddy = (function (exports) {
    'use strict';

    function typeIs(value, type) {
        var typeOf = typeof value;
        return (Array.isArray(type) ? type : [type])
            .every(function (type) { return typeOf === type; });
    }
    function isDefined(value) {
        return value !== undefined && value !== null;
    }
    function isObject(value) {
        return isDefined(value) && typeIs(value, "object");
    }
    function isPlainObject(value) {
        return isDefined(value) && value.constructor === {}.constructor;
    }
    function isFunction(value) {
        return typeIs(value, "function");
    }
    function isNumber(value) {
        return typeIs(value, "number") && !isNaN(value);
    }

    function apply(fn, thisArg, args) {
        return fn.apply(thisArg, arguments[2]);
    }

    function letValue(value, fn, thisArg) {
        return apply(fn, thisArg, [value]);
    }
    function string(value, nullableString) {
        if (isDefined(value))
            return value.toString();
        nullableString = isFunction(nullableString) ? nullableString : function () { return ""; };
        return nullableString();
    }
    function keys(object) {
        return Object.keys(object);
    }
    function get$1(target, key) {
        return target[key];
    }

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    ((function (_super) {
        __extends(IllegalAccessError, _super);
        function IllegalAccessError(message) {
            var _this = _super.call(this, message) || this;
            _this.name = 'IllegalAccessError';
            return _this;
        }
        return IllegalAccessError;
    })(Error));
    var IllegalArgumentError = (function (_super) {
        __extends(IllegalArgumentError, _super);
        function IllegalArgumentError(message) {
            var _this = _super.call(this, message) || this;
            _this.name = 'IllegalArgumentError';
            return _this;
        }
        return IllegalArgumentError;
    }(Error));
    ((function (_super) {
        __extends(RequiredArgumentError, _super);
        function RequiredArgumentError(message) {
            var _this = _super.call(this, message) || this;
            _this.name = 'RequiredArgumentError';
            return _this;
        }
        return RequiredArgumentError;
    })(IllegalArgumentError));

    function getDefined(value, builder, thisArg) {
        return isDefined(value) ? value : getIf(value, isDefined, builder, thisArg);
    }
    function getIf(value, condition, builder, thisArg) {
        if (condition(value))
            return value;
        requiredWithType(builder, "function", "builder");
        value = apply(builder, thisArg);
        return value;
    }
    function requireIf(value, condition, error) {
        condition = requiredWithType(condition, "function", "condition");
        error = getDefined(error, function () { return "The given value not meets the given condition."; });
        if (!condition(value))
            throw new IllegalArgumentError(error);
        return value;
    }
    function requireDefined(value, name) {
        name = getDefined(name, function () { return "value"; });
        return requireIf(value, isDefined, "The given ".concat(name, " argument must be defined."));
    }
    function requiredWithType(value, type, name) {
        name = getDefined(name, function () { return "value"; });
        if (Array.isArray(type)) {
            if (type.every(function (it) { return !typeIs(value, it); }))
                throw new IllegalArgumentError("The ".concat(name, " argument must be be one of these types: [").concat(type, "]"));
        }
        else if (!typeIs(value, type))
            throw new IllegalArgumentError("The ".concat(name, " argument must be a ").concat(type));
        return value;
    }
    function requireObject(value, name) {
        return requiredWithType(value, 'object', name);
    }

    function bind(fn, thisArg) {
        return fn.bind(thisArg);
    }

    function slice(source, startIndex, endIndex) {
        return apply(Array.prototype.slice, source, [startIndex, endIndex]);
    }
    function each(source, callbackfn, thisArg) {
        if (isFunction(get$1(source, 'forEach'))) {
            callbackfn = bind(callbackfn, thisArg);
            var index_1 = 0;
            source.forEach(function (value) {
                callbackfn(value, index_1, source);
                index_1++;
            });
        }
        else
            apply(Array.prototype.forEach, source, [callbackfn, thisArg]);
    }

    function hasOwn(target, key) {
        return apply(Object.prototype.hasOwnProperty, target, [key]);
    }

    function _assign(target, source, mode, noObject) {
        if (!isDefined(source))
            return;
        if (!isObject(source)) {
            return;
        }
        each(keys(source), function (key) {
            if (mode === 'deep' && hasOwn(target, key)) {
                var tp = target[key];
                var ts = source[key];
                if (isPlainObject(tp) && isObject(ts))
                    _assign(tp, ts, mode);
                else
                    target[key] = source[key];
            }
            else
                target[key] = source[key];
        });
    }
    function _assignItems(mode, target, source, noObject) {
        if (!isDefined(target) || !isDefined(source))
            return target;
        for (var i = 0; i < source.length; i++)
            _assign(target, source[i], mode);
        return target;
    }
    function assign(target) {
        return _assignItems("simple", target, arguments);
    }
    function deepAssign(target) {
        return _assignItems("deep", target, arguments);
    }
    function entries(value) {
        var entry = [];
        if (!isDefined(value))
            return entry;
        if (isObject(value)) {
            each(keys(value), function (key) {
                entry.push({
                    key: key,
                    value: isObject(value[key]) ? entries(value[key]) : value[key],
                });
            });
        }
        else
            entry.push({
                key: value.toString(),
                value: value
            });
        return entry;
    }

    function multiple(target, descriptors, definer) {
        each(keys(descriptors), function (key) { return definer(target, key, descriptors[key]); });
    }

    function prop(target, key, descriptor) {
        if (!hasOwn(target, key))
            Object.defineProperty(target, key, descriptor);
    }

    function _value(target, key, value, writable) {
        prop(target, key, {
            enumerable: false,
            value: value,
            writable: writable
        });
    }
    function readonly(target, key, value) {
        _value(target, key, value, false);
    }
    function readonlys(target, values) {
        multiple(target, values, readonly);
    }
    function writeable(target, key, value) {
        _value(target, key, value, true);
    }
    function writeables(target, values) {
        multiple(target, values, writeable);
    }

    function minimumsOne(max) {
        max = string(max).toInt();
        return isDefined(max) ? max.coerceAtLeast(1) : 1;
    }
    function validDate(date) {
        try {
            return new Date(date)
                .toISOString();
        }
        catch (e) {
            if (isDefined(date))
                console.error('No valid date given: ', date);
            return undefined;
        }
    }
    function updateProperty(args, source, key, builder, noArgs) {
        if (args.length > 0 || noArgs) {
            var value = args.length > 0 ? args[0] : source[key];
            source[key] = builder ? builder(value) : value;
        }
    }
    var SearchParams = (function () {
        function SearchParams(source) {
            readonlys(this, {
                source: getDefined(source, function () { return ({}); })
            });
        }
        SearchParams.from = function (source, copy) {
            if (source instanceof SearchParams)
                return copy ? SearchParams.from(source.source, copy) : source;
            return new SearchParams(copy ? assign({}, source) : source);
        };
        SearchParams.prototype.max = function (max) {
            updateProperty(arguments, this.source, 'max-results', minimumsOne, true);
            return this.source["max-results"];
        };
        SearchParams.prototype.start = function (index) {
            updateProperty(arguments, this.source, 'start-index', minimumsOne, true);
            return this.source["start-index"];
        };
        SearchParams.prototype.publishedAtLeast = function (min) {
            updateProperty(arguments, this.source, 'published-min', validDate);
            return this.source["published-min"];
        };
        SearchParams.prototype.publishedAtMost = function (max) {
            updateProperty(arguments, this.source, 'published-max', validDate);
            return this.source["published-max"];
        };
        SearchParams.prototype.updatedAtLeast = function (min) {
            updateProperty(arguments, this.source, 'updated-min', validDate);
            return this.source["updated-min"];
        };
        SearchParams.prototype.updatedAtMost = function (max) {
            updateProperty(arguments, this.source, 'updated-max', validDate);
            return this.source["updated-max"];
        };
        SearchParams.prototype.orderby = function (order) {
            order = (order === 'updated' || order === 'starttime' || order === 'lastmodified') ? order : 'lastmodified';
            this.source["orderby"] = order;
            return order;
        };
        SearchParams.prototype.query = function (query) {
            updateProperty(arguments, this.source, 'q');
            return this.source["q"];
        };
        SearchParams.prototype.alt = function (type) {
            updateProperty(arguments, this.source, 'alt', function (it) { return (it == 'alt' || it === 'rss') ? it : 'json'; });
        };
        SearchParams.prototype.toDefined = function () {
            var source = {};
            each(keys(this.source), function (key) {
                if (isDefined(this[key]))
                    source[key] = this[key];
            }, this.source);
            return source;
        };
        return SearchParams;
    }());

    function call(fn, thisArg) {
        return fn.apply(thisArg, slice(arguments, 2));
    }

    function paramIndex(index, action) {
        var current = this.__params__.start();
        index = string(index).toInt() >> 0;
        current = action === 'add' ? current + index : (action === 'subtract' ? current - index : index);
        this.__params__.start(current);
    }
    function paramDate(min, max, atLeast, atMost, keepAtLeast, keepAtMost) {
        if (isDefined(min) || !keepAtLeast)
            call(atLeast, this, min);
        if (isDefined(max) || !keepAtMost)
            call(atMost, this, max);
    }
    var SearchParamsBuilder = (function () {
        function SearchParamsBuilder(source) {
            if (source instanceof SearchParams)
                this.__params__ = source;
            else
                return SearchParamsBuilder.from(source);
        }
        SearchParamsBuilder.from = function (params, copy) {
            return new SearchParamsBuilder(SearchParams.from(params, copy));
        };
        SearchParamsBuilder.empty = function () {
            return new SearchParamsBuilder({});
        };
        Object.defineProperty(SearchParamsBuilder, "maxResults", {
            get: function () {
                return 500;
            },
            enumerable: false,
            configurable: true
        });
        SearchParamsBuilder.prototype.max = function (max) {
            this.__params__.max(max);
            return this;
        };
        SearchParamsBuilder.prototype.limit = function (limit) {
            return this.max(limit);
        };
        SearchParamsBuilder.prototype.start = function (index) {
            call(paramIndex, this, index, 'replace');
            return this;
        };
        SearchParamsBuilder.prototype.plusStart = function (index) {
            call(paramIndex, this, index, 'add');
            return this;
        };
        SearchParamsBuilder.prototype.minusStart = function (index) {
            call(paramIndex, this, index, 'subtract');
            return this;
        };
        SearchParamsBuilder.prototype.index = function (index) {
            return this.start(index);
        };
        SearchParamsBuilder.prototype.plusIndex = function (index) {
            return this.plusStart(index);
        };
        SearchParamsBuilder.prototype.minusIndex = function (index) {
            return this.minusStart(index);
        };
        SearchParamsBuilder.prototype.paginated = function (page) {
            if (isDefined(page)) {
                var max = this.__params__.max();
                this.start((string(page).toInt() - 1).coerceAtLeast(0) * max + 1);
            }
            return this;
        };
        SearchParamsBuilder.prototype.published = function (min, max) {
            call(paramDate, this.__params__, min, max, this.__params__.publishedAtLeast, this.__params__.publishedAtMost);
            return this;
        };
        SearchParamsBuilder.prototype.publishedAtLeast = function (min) {
            call(paramDate, this.__params__, min, undefined, this.__params__.publishedAtLeast, this.__params__.publishedAtMost, false, true);
            return this;
        };
        SearchParamsBuilder.prototype.publishedAtMost = function (max) {
            call(paramDate, this.__params__, undefined, max, this.__params__.publishedAtLeast, this.__params__.publishedAtMost, true);
            return this;
        };
        SearchParamsBuilder.prototype.updated = function (min, max) {
            call(paramDate, this.__params__, min, max, this.__params__.updatedAtLeast, this.__params__.updatedAtMost);
            return this;
        };
        SearchParamsBuilder.prototype.updatedAtLeast = function (min) {
            call(paramDate, this.__params__, min, undefined, this.__params__.updatedAtLeast, this.__params__.updatedAtMost, false, true);
            return this;
        };
        SearchParamsBuilder.prototype.updatedAtMost = function (max) {
            call(paramDate, this.__params__, undefined, max, this.__params__.updatedAtLeast, this.__params__.updatedAtMost, true);
            return this;
        };
        SearchParamsBuilder.prototype.order = function (order) {
            this.__params__.orderby(order);
            return this;
        };
        SearchParamsBuilder.prototype.query = function (query) {
            this.__params__.query(query);
            return this;
        };
        SearchParamsBuilder.prototype.build = function (copy) {
            if (copy)
                return SearchParamsBuilder.from(this.__params__.source, true)
                    .build();
            return this.__params__.source;
        };
        return SearchParamsBuilder;
    }());
    function paramsBuilder() {
        return SearchParamsBuilder.empty();
    }

    var routes = {
        posts: function () {
            return "feeds/posts/default";
        },
        postsSummary: function () {
            return "feeds/posts/summary";
        }
    };
    function buildUrl(options) {
        requireDefined(options, "options");
        var href;
        if (isDefined(options.blogUrl))
            href = options.blogUrl;
        else if (location)
            href = location.origin;
        else
            throw new IllegalArgumentError("You must pass the blog url or call this on the browser.");
        options.blogUrl = href;
        var fetchUrl = new URL(href);
        fetchUrl.pathname += options.route === 'full' ? routes.posts() : routes.postsSummary();
        var params = SearchParams.from(options.params);
        params.alt("json");
        params.max(params.max().coerceIn(1, SearchParamsBuilder.maxResults));
        each(entries(params.toDefined()), function (param) {
            fetchUrl.searchParams.set(param.key, param.value);
        });
        return fetchUrl;
    }

    function _rawGet(options, all) {
        options = feedOptions(options);
        var params = SearchParams.from(options.params);
        if (all) {
            params.start(1);
            params.max(SearchParamsBuilder.maxResults);
        }
        var entries = [];
        var url = buildUrl(options);
        var startIndex = params.start();
        function request(url, max) {
            return fetch(url)
                .then(function (res) { return res.json(); })
                .then(function (blog) {
                var entry = getDefined(blog.feed.entry, function () { return []; });
                var feed = blog.feed;
                entries.extends(entry);
                if (entry.isNotEmpty() && entry.length >= SearchParamsBuilder.maxResults && ((all && entry.length >= SearchParamsBuilder.maxResults) || (!all && entry.length < max))) {
                    if (!all)
                        max -= entry.length;
                    params.start(params.start() + entry.length);
                    params.max(max);
                    return request(buildUrl(options), max);
                }
                feed.entry = entries;
                if (params.max() !== entries.length)
                    feed.openSearch$itemsPerPage.$t = feed.openSearch$totalResults.$t = entries.length.toString();
                feed.openSearch$startIndex.$t = startIndex.toString();
                return blog;
            });
        }
        return request(url, params.max());
    }
    function feedOptions(options) {
        return deepAssign({
            route: 'summary',
            params: {
                "max-results": 1
            }
        }, options);
    }
    function rawGet(options) {
        return _rawGet(options);
    }
    function rawAll(options) {
        return _rawGet(options, true);
    }

    function rawTextToText(text) {
        return isObject(text) ? string(text.$t) : '';
    }
    function rawTextToNumber(text) {
        return rawTextToText(text).toInt();
    }
    function rawTextToBoolean(text) {
        return Boolean(rawTextToText(text));
    }
    function rawCategoryToCategory(category) {
        return Array.isArray(category) ? category.map(function (it) { return it.term; }) : [];
    }
    function rawAuthorToAuthor(author) {
        return {
            email: rawTextToText(author.email),
            name: rawTextToText(author.name),
            uri: rawTextToText(author.uri),
            gd$image: author.gd$image
        };
    }
    function rawPostToPost(post) {
        if (!isObject(post))
            return {};
        var base = {
            id: rawTextToText(post.id),
            author: post.author.map(rawAuthorToAuthor),
            title: rawTextToText(post.title),
            link: post.link,
            category: rawCategoryToCategory(post.category),
            media$thumbnail: {
                width: post.media$thumbnail.width.toInt(),
                height: post.media$thumbnail.height.toInt(),
                url: post.media$thumbnail.url
            },
            updated: rawTextToText(post.updated),
            published: rawTextToText(post.published)
        };
        if (post.content)
            base.content = rawTextToText(post.content);
        else if (post.summary)
            base.summary = rawTextToText(post.summary);
        else
            throw new IllegalArgumentError("No valid post given");
        return base;
    }
    function rawBlogToBlog(blog) {
        var feed = blog.feed;
        return {
            version: blog.version,
            encoding: blog.encoding,
            feed: {
                id: rawTextToText(feed.id),
                author: feed.author.map(rawAuthorToAuthor),
                category: rawCategoryToCategory(feed.category),
                blogger$adultContent: rawTextToBoolean(feed.blogger$adultContent),
                title: rawTextToText(feed.title),
                subtitle: rawTextToText(feed.subtitle),
                updated: rawTextToText(feed.updated),
                openSearch$startIndex: rawTextToNumber(feed.openSearch$startIndex),
                openSearch$totalResults: rawTextToNumber(feed.openSearch$totalResults),
                openSearch$itemsPerPage: rawTextToNumber(feed.openSearch$itemsPerPage),
                entry: Array.isArray(feed.entry) ? feed.entry.map(function (post) { return rawPostToPost(post); }) : [],
                link: feed.link
            }
        };
    }

    function all(options) {
        return rawAll(options)
            .then(rawBlogToBlog);
    }
    function get(options) {
        return rawGet(options)
            .then(rawBlogToBlog);
    }

    function coerceAtLeast(minimum) {
        var value = this.valueOf();
        return value < minimum ? minimum : value;
    }
    function coerceAtMost(maximum) {
        var value = this.valueOf();
        return value > maximum ? maximum : value;
    }
    function coerceIn(minimum, maximum) {
        if (minimum > maximum)
            throw new IllegalArgumentError("Cannot coerce value to an empty range: maximum ".concat(maximum, " is less than minimum ").concat(minimum, "."));
        var value = this.valueOf();
        return (value < minimum) ? minimum : (value > maximum) ? maximum : value;
    }
    function numberExtensions(extensions) {
        readonlys(Number.prototype, extensions);
    }

    function isEmpty() {
        return this.length === 0;
    }
    function isNotEmpty() {
        return !apply(isEmpty, this);
    }

    function toInt(radix) {
        var value = parseInt(this, radix);
        return isNaN(value) ? null : value;
    }
    function toFloat() {
        var value = parseFloat(this);
        return isNaN(value) ? null : value;
    }
    function stringExtensions(extensions) {
        readonlys(String.prototype, extensions);
    }

    function parseSize(constructor, isSize, format, ratio, defaultRatio) {
        var aspectRatio = 1;
        if (!isDefined(ratio))
            aspectRatio = parseSize(constructor, isSize, format, 1, true).ratio();
        else if (isNumber(ratio))
            aspectRatio = ratio;
        else if (!isSize(ratio))
            aspectRatio = parseSize(constructor, isSize, ratio, 1, true).ratio();
        var match = string(format)
            .split(":");
        var width = apply(toFloat, match[0]);
        var height = apply(toFloat, match[1]);
        if (isDefined(width) && isDefined(height))
            return new constructor(width, height)
                .adjust(defaultRatio ? 0 : aspectRatio);
        else if (isDefined(width))
            height = width / aspectRatio;
        else if (isDefined(height))
            width = height * aspectRatio;
        else
            throw new IllegalArgumentError("The ".concat(defaultRatio ? 'ratio' : 'format', " '").concat(format, "' is not valid."));
        return new constructor(width, height);
    }

    var id = 0;
    var postfix = Math.random();
    function uid(key) {
        return "Symbol('".concat(string(key), "')_").concat(apply(1.0.toString, ++id + postfix, [36]));
    }

    var rep = {
        operator: function (operator) {
            return operator === 'OR' ? '|' : ' ';
        },
        quote: function (exact) {
            return exact ? '"' : '';
        },
        exclude: function () {
            return '-';
        }
    };

    var querySymbol = uid('QueryStringBuilder#Query');
    var excludeSymbol = uid('QueryStringBuilder#Exclude');
    var operatorSymbol = uid('QueryStringBuilder#Operator');
    var exactSymbol = uid('QueryStringBuilder#Exact');
    function buildQuery(terms, sep, startQuote, endQuote) {
        if (!Array.isArray(terms))
            return buildQuery([terms], sep, startQuote, endQuote);
        endQuote = getDefined(endQuote, function () { return startQuote; });
        terms = terms.map(function (it) { return string(it); })
            .filter(function (it) { return it.isNotEmpty(); });
        return terms.isEmpty() ? '' : "".concat(startQuote).concat(terms.join(sep)).concat(endQuote);
    }
    function appendQuery(args, name) {
        if (args.length === 0)
            return;
        var quote = rep.quote(get$1(this, exactSymbol));
        var op = rep.operator(get$1(this, operatorSymbol));
        var xc = get$1(this, excludeSymbol) ? rep.exclude() : '';
        name = string(name);
        name = name.isNotEmpty() ? name + ':' : '';
        var current = get$1(this, querySymbol);
        var query = buildQuery(slice(args), quote + op + xc + name + quote, xc + name + quote, quote);
        if (current.isNotEmpty())
            current += op;
        current += query;
        this[querySymbol] = current;
        return this;
    }
    var QueryStringBuilder = (function () {
        function QueryStringBuilder() {
            var symbols = {};
            symbols[exactSymbol] = false;
            symbols[operatorSymbol] = 'OR';
            symbols[excludeSymbol] = false;
            symbols[querySymbol] = '';
            writeables(this, symbols);
        }
        QueryStringBuilder.prototype.and = function () {
            this[operatorSymbol] = 'AND';
            return this;
        };
        QueryStringBuilder.prototype.or = function () {
            this[operatorSymbol] = 'OR';
            return this;
        };
        QueryStringBuilder.prototype.exact = function () {
            this[exactSymbol] = true;
            return this;
        };
        QueryStringBuilder.prototype.noExact = function () {
            this[exactSymbol] = false;
            return this;
        };
        QueryStringBuilder.prototype.exclude = function () {
            this[excludeSymbol] = true;
            return this;
        };
        QueryStringBuilder.prototype.noExclude = function () {
            this[excludeSymbol] = false;
            return this;
        };
        QueryStringBuilder.prototype.terms = function () {
            apply(appendQuery, this, [arguments]);
            return this;
        };
        QueryStringBuilder.prototype.named = function (name) {
            apply(appendQuery, this, [slice(arguments, 1), name]);
            return this;
        };
        QueryStringBuilder.prototype.categories = function () {
            return apply(this.named, this, ['label'].concat(slice(arguments)));
        };
        QueryStringBuilder.prototype.labels = function () {
            return apply(this.categories, this, arguments);
        };
        QueryStringBuilder.prototype.build = function () {
            var query = get$1(this, querySymbol);
            return query.isEmpty() ? undefined : query;
        };
        return QueryStringBuilder;
    }());
    function queryBuilder() {
        return new QueryStringBuilder();
    }

    var thumbnailSizeExpression = 's72-c';
    function posts(options) {
        requireObject(options, 'options');
        options.feed = getIf(options.feed, isObject, function () { return ({}); });
        var params = SearchParams.from(options.feed.params);
        function changePage(page) {
            options.feed.params = SearchParamsBuilder.from(params)
                .paginated(page)
                .build();
            get(options.feed)
                .then(function (blog) {
                if (!isDefined(blog))
                    return;
                options.onPosts(blog.feed.entry, blog);
            });
        }
        (params.query() ? all : get)(options.feed)
            .then(function (blog) {
            if (blog.feed.openSearch$totalResults > 0) {
                options.onTotal(Object.freeze({
                    total: blog.feed.openSearch$totalResults,
                    page: changePage
                }));
            }
        })
            .catch(console.error);
    }
    function toFormatSize(size) {
        return isObject(size) ? "".concat(string(size.width), ":").concat(string(size.height)) : string(size);
    }
    function postThumbnail(source, size, ratio) {
        var parse = parseSize(function (width, height) {
            this.width = Math.round(width);
            this.height = Math.round(height);
            this.adjust = function () {
                return this;
            };
            this.ratio = function () {
                return this.height === 0 ? 0 : this.width / this.height;
            };
        }, isObject, toFormatSize(size), getDefined(ratio, function () { return 16 / 9; }));
        var expression = "w".concat(parse.width, "-h").concat(parse.height, "-p-k-no-nu");
        return source.media$thumbnail
            .url.replace("/".concat(thumbnailSizeExpression, "/"), "/".concat(expression, "/"))
            .replace("=".concat(thumbnailSizeExpression), "=".concat(expression));
    }
    function withCategories(options) {
        var categories = options.categories;
        if (categories.isEmpty())
            return;
        var feed = feedOptions(options.feed);
        var params = SearchParams.from(feed.params);
        var builder = letValue(queryBuilder(), function (it) { return apply((options.every ? it.and : it.or), it); });
        SearchParamsBuilder.from(params)
            .query(apply(builder.categories, builder, categories)
            .build());
        all(feed)
            .then(function (blog) {
            options.onPosts(blog.feed.entry
                .map(function (post) { return ({ count: post.category.filter(function (it) { return categories.indexOf(it) >= 0; }).length, post: post }); })
                .sort(function (a, b) { return b.count - a.count; })
                .slice(0, params.max()), blog);
        });
    }

    function extend(source) {
        requireIf(source, isObject, "The source must be an indexable object.");
        apply(this.push, this, source);
        return this;
    }
    function arrayExtensions(extensions) {
        readonlys(Array.prototype, extensions);
    }

    arrayExtensions({
        isEmpty: isEmpty,
        isNotEmpty: isNotEmpty,
        extends: extend,
    });
    numberExtensions({
        coerceIn: coerceIn,
        coerceAtLeast: coerceAtLeast,
        coerceAtMost: coerceAtMost
    });
    stringExtensions({
        isEmpty: isEmpty,
        isNotEmpty: isNotEmpty,
        toInt: toInt
    });
    readonlys(rawGet, {
        all: rawAll
    });
    var feed = get;
    readonlys(feed, {
        all: all,
        raw: rawGet,
    });
    var search = {
        query: queryBuilder,
        QueryStringBuilder: QueryStringBuilder,
        params: paramsBuilder,
        SearchParamsBuilder: SearchParamsBuilder
    };
    readonlys(posts, {
        createsThumbnail: postThumbnail,
        withCategories: withCategories
    });

    exports.buildUrl = buildUrl;
    exports.feed = feed;
    exports.posts = posts;
    exports.routes = routes;
    exports.search = search;

    return exports;

})({});
//# sourceMappingURL=feeddy.js.map
