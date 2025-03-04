var feeddy = (function (exports) {
    'use strict';

    var isArray = Array.isArray;
    function forEach(array, callback, thisArg) {
        array.forEach(callback, thisArg);
    }

    function typeIs(value, type) {
        var typeOf = typeof value;
        return (isArray(type) ? type : [type])
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
    function isString(value) {
        return typeIs(value, "string");
    }

    function apply(fn, thisArg, args) {
        return fn.apply(thisArg, arguments[2]);
    }

    function string(value, nullableString) {
        if (isDefined(value))
            return value.toString();
        nullableString = isFunction(nullableString) ? nullableString : function () { return ""; };
        return nullableString();
    }

    var keys = Object.keys;

    function protoapply(cls, key, instance, args) {
        return apply(cls.prototype[key], instance, arguments[3]);
    }

    function hasOwn(target, key) {
        return protoapply(Object, "hasOwnProperty", target, [key]);
    }

    function len(iterable) {
        return iterable.length;
    }

    function slice(source, startIndex, endIndex) {
        return protoapply((Array), "slice", source, [startIndex, endIndex]);
    }
    function reduce(source, callbackfn, initialValue) {
        return protoapply(Array, "reduce", source, [callbackfn, initialValue]);
    }

    function self(value) {
        return value;
    }

    function get$1(object, key) {
        var args = arguments, i = 1;
        if (len(args) <= 2)
            return object ? object[key] : undefined;
        for (; i < len(args); i++) {
            key = args[i];
            if (object)
                object = object[key];
            else
                return object;
        }
        return object;
    }
    function set(object, key, key2) {
        var args = arguments, lt = len(args), value = args[lt - 1];
        if (lt > 3) {
            object = apply(get$1, undefined, slice(args, 0, lt - 2));
            key = args[lt - 2];
        }
        if (!object)
            return undefined;
        object[key] = value;
        return object[key];
    }
    function setTo(object, key, target) {
        var props = {};
        if (isString(key)) {
            props[key] = self;
        }
        else if (isArray(key))
            for (var i = 0; i < len(key); i++) {
                var value = key[i];
                props[value] = key[value];
            }
        else if (!isObject(key))
            return target;
        else
            props = key;
        key = keys(props);
        for (var i = 0; i < len(key); i++) {
            var prop = key[i];
            if (hasOwn(object, prop))
                set(target, prop, props[prop](get$1(object, prop)));
        }
        return target;
    }

    function _assign(target, source, mode, noObject) {
        if (!isDefined(source))
            return;
        if (!isObject(source)) {
            if (noObject)
                noObject(target, source, mode);
            return;
        }
        return reduce(keys(source), function (source, key) {
            if (mode === 'deep' && hasOwn(target, key)) {
                var tp = get$1(target, key);
                var ts = get$1(source, key);
                if (isPlainObject(tp) && isObject(ts))
                    _assign(tp, ts, mode);
                else
                    setTo(source, key, target);
            }
            else
                setTo(source, key, target);
            return source;
        }, source);
    }
    function _assignItems(mode, target, source, noObject) {
        if (!isDefined(target) || !isDefined(source))
            return target;
        for (var i = 0; i < len(source); i++)
            _assign(target, source[i], mode, noObject);
        return target;
    }
    function assign(target) {
        return _assignItems("simple", target, arguments);
    }
    function deepAssign(target) {
        return _assignItems("deep", target, arguments);
    }
    function _createNoObjectKey(target, source, mode) {
        target[source.toString()] = source;
    }
    function create() {
        return _assignItems("simple", {}, arguments, _createNoObjectKey);
    }

    function multiple(target, descriptors, definer) {
        forEach(keys(descriptors), function (key) { return definer(target, key, descriptors[key]); });
    }
    function descriptor(value, writable, configurable, enumerable) {
        return {
            value: value,
            writable: writable,
            enumerable: enumerable,
            configurable: configurable,
        };
    }

    var defineProperty = Object.defineProperty;
    var freeze = Object.freeze;

    function prop(target, key, descriptor) {
        if (!hasOwn(target, key))
            defineProperty(target, key, descriptor);
    }
    function props(target, descriptors) {
        multiple(target, descriptors, prop);
    }

    function _value(target, key, value, writable, numerable) {
        prop(target, key, descriptor(value, writable, undefined, numerable));
    }
    function readonly2(target, key, value) {
        _value(target, key, value, false, true);
    }
    function writeable(target, key, value) {
        _value(target, key, value, true, false);
    }

    function call(fn, thisArg) {
        return fn.apply(thisArg, slice(arguments, 2));
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

    var IllegalAccessError = (function (_super) {
        __extends(IllegalAccessError, _super);
        function IllegalAccessError(message) {
            var _this = _super.call(this, message) || this;
            _this.name = 'IllegalAccessError';
            return _this;
        }
        return IllegalAccessError;
    }(Error));
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

    function isEmpty() {
        return len(this) === 0;
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

    var max$1 = Math.max;
    var min = Math.min;
    var round = Math.round;
    var random = Math.random;

    function concat(base) {
        return apply(base.concat, base, slice(arguments, 1));
    }

    function coerceAtLeast(minimum) {
        return max$1(this.valueOf(), minimum);
    }
    function coerceIn(minimum, maximum) {
        if (minimum > maximum)
            throw new IllegalArgumentError(concat("Cannot coerce value to an empty range: maximum '", maximum, "' is less than minimum '", minimum, "'"));
        return min(max$1(this.valueOf(), minimum), maximum);
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
        error = error || "The given value not meets the given condition.";
        if (!condition(value))
            throw new IllegalArgumentError(error);
        return value;
    }
    function requireDefined(value, name) {
        name = name || "value";
        return requireIf(value, isDefined, concat("The given ", name, " argument must be defined."));
    }
    function requiredWithType(value, type, name) {
        name = name || "value";
        if (isArray(type)) {
            if (type.every(function (it) { return !typeIs(value, it); }))
                throw new IllegalArgumentError(concat("The ", name, " argument must be be one of these types: [", type, "[]"));
        }
        else if (!typeIs(value, type))
            throw new IllegalArgumentError(concat("The ", name, " argument must be a ", type));
        return value;
    }
    function requireObject(value, name) {
        return requiredWithType(value, 'object', name);
    }

    function toDescriptor(source) {
        return reduce(keys(source), function (current, key) {
            current[key] = descriptor(source[key], true, true, true);
            return current;
        }, {});
    }
    function es5class(callable, options) {
        requireObject(options, "options");
        requireObject(callable.prototype);
        if (options.statidescriptor)
            props(callable, options.statidescriptor);
        if (options.statics)
            props(callable, toDescriptor(options.statics));
        if (options.protodescriptor)
            props(callable.prototype, options.protodescriptor);
        props(callable.prototype, toDescriptor(options.prototype));
        return callable;
    }

    var dateTypes = ["published", "updated"];

    function includes(searchElement, fromIndex) {
        return len(this) === 0 ? false : protoapply(Array, "indexOf", this, [searchElement, fromIndex]) !== -1;
    }

    function minimumsOne(max) {
        max = call(toInt, string(max));
        return isDefined(max) ? apply(coerceAtLeast, max, [1]) : 1;
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
    function updateProperty(args, source, key, builder, allowUndefined) {
        var value = len(args) > 0 ? args[0] : source[key];
        if (!allowUndefined && !isDefined(value))
            delete source[key];
        else
            source[key] = builder ? builder(value) : value;
        return source[key];
    }
    var SearchParams = function (source) {
        readonly2(this, "source", source || {});
    };
    function propertyFn(key, builder, allowUndefined) {
        return function (value) {
            var source = this.source;
            return updateProperty(arguments, source, key, builder, allowUndefined);
        };
    }
    function dateProperties(type, mode) {
        var suffix = mode === "max" ? "AtMost" : "AtLeast";
        set(prototype$2, type + suffix, function (value) {
            var source = this.source, key = concat(type, "-", mode);
            return updateProperty(arguments, source, key, validDate);
        });
    }
    var prototype$2 = {
        max: propertyFn("max-results", minimumsOne),
        start: propertyFn("start-index", minimumsOne),
        query: propertyFn("q"),
        alt: propertyFn("alt", function (it) { return call(includes, ["json", "rss", "atom"], it) ? it : 'json'; }, true),
        orderby: propertyFn("orderby", function (order) { return call(includes, dateTypes, order) ? order : 'updated'; }, true),
        toDefined: function () {
            return this.source;
        }
    };
    forEach(dateTypes, function (key) {
        dateProperties(key, "min");
        dateProperties(key, "max");
    });
    es5class(SearchParams, {
        prototype: prototype$2,
        statics: {
            from: paramsFrom
        }
    });
    function paramsFrom(source, copy) {
        if (source instanceof SearchParams)
            return copy ? paramsFrom(source.source, copy) : source;
        return new SearchParams(copy ? assign({}, source) : source);
    }

    var id = 0;
    var postfix = random();
    function uid(key) {
        return concat("Symbol('", string(key), "')_", apply(1.0.toString, ++id + postfix, [36]));
    }

    function paramIndex(index, action) {
        var params = get$1(this, searchParamsSymbol);
        var current = params.start();
        index = call(toInt, string(index)) >> 0;
        current = action === 'plus' ? current + index : (action === 'minus' ? current - index : index);
        params.start(current);
        return this;
    }
    function paramDate(min, max, type, keepAtLeast, keepAtMost) {
        if (isDefined(min) || !keepAtLeast)
            call(get$1(this, type + "AtLeast"), this, min);
        if (isDefined(max) || !keepAtMost)
            call(get$1(this, type + "AtMost"), this, max);
    }
    var searchParamsSymbol = uid("p");
    var maxResults = 500;
    var SearchParamsBuilder = function (source) {
        if (source instanceof SearchParams)
            writeable(this, searchParamsSymbol, source);
        else
            return builderFrom(source);
    };
    function simpleProperty(key) {
        return function (value) {
            var params = get$1(this, searchParamsSymbol);
            apply(get$1(params, key), params, [value]);
            return this;
        };
    }
    function datePropertiesBuilder(type) {
        set(prototype$1, type, function (min, max) {
            var params = get$1(this, searchParamsSymbol);
            call(paramDate, params, min, max, type);
            return this;
        });
        set(prototype$1, type + "AtLeast", function (min) {
            var params = get$1(this, searchParamsSymbol);
            call(paramDate, params, min, undefined, type, false, true);
            return this;
        });
        set(prototype$1, type + "AtMost", function (max) {
            var params = get$1(this, searchParamsSymbol);
            call(paramDate, params, undefined, max, type, true);
            return this;
        });
    }
    var source = ['place', 'plus', 'minus']
        .map(function (mode) {
        return function (index) {
            return call(paramIndex, this, index, mode);
        };
    });
    var max = simpleProperty("max");
    var prototype$1 = {
        max: max,
        limit: max,
        start: source[0],
        plusStart: source[1],
        minusStart: source[2],
        index: source[0],
        plusIndex: source[1],
        minusIndex: source[2],
        paginated: function (page) {
            if (isDefined(page)) {
                var max_1 = get$1(this, searchParamsSymbol).max();
                this.start(apply(coerceAtLeast, call(toInt, string(page)) - 1, [0]) * max_1 + 1);
            }
            return this;
        },
        order: simpleProperty("orderby"),
        query: simpleProperty("query"),
        alt: simpleProperty("alt"),
        build: function (copy) {
            var params = get$1(this, searchParamsSymbol);
            return copy ? builderFrom(params.source, true)
                .build() : params.source;
        }
    };
    forEach(dateTypes, datePropertiesBuilder);
    es5class(SearchParamsBuilder, {
        prototype: prototype$1,
        statics: {
            from: builderFrom,
            empty: paramsBuilder
        }
    });
    readonly2(SearchParamsBuilder, "maxResults", maxResults);
    function builderFrom(params, copy) {
        return new SearchParamsBuilder(paramsFrom(params, copy));
    }
    function paramsBuilder() {
        return new SearchParamsBuilder({});
    }

    function createRoute(type, route, id) {
        var suffix = "summary", mid = "posts", prefix = "/";
        if (route === "full")
            suffix = "default";
        if (type === "pages")
            mid = "pages";
        else if (type === "comments") {
            mid = "comments";
            if (id)
                prefix = concat(prefix, id, prefix);
        }
        if (id && type !== "comments")
            suffix += concat("/", id);
        return concat("feeds", prefix, mid, "/", suffix);
    }
    var routes = {};
    forEach(["posts", "pages", "comments"], function (key) {
        readonly2(routes, key, createRoute(key, "full"));
        readonly2(routes, key + "Summary", createRoute(key, "summary"));
    });

    function buildUrl(options, id) {
        requireObject(options, "options");
        var href;
        if (isDefined(options.blogUrl))
            href = options.blogUrl;
        else if (location)
            href = location.origin;
        else
            throw new IllegalArgumentError("You must pass the blog url or call this on the browser.");
        options.blogUrl = href;
        var fetchUrl = new URL(href);
        fetchUrl.pathname += createRoute(options.type, options.route, id);
        var params = paramsFrom(options.params);
        params.max(apply(coerceIn, params.max(), [1, maxResults]));
        params.alt(params.alt());
        var search = params.toDefined();
        forEach(keys(search), function (key) {
            fetchUrl.searchParams.set(key, search[key]);
        });
        return fetchUrl;
    }
    function getId(source, type) {
        if (isObject(source)) {
            if (hasOwn(source, "id"))
                return getId(get$1(source, "id"), type);
            if (hasOwn(source, "$t"))
                source = get$1(source, "$t");
        }
        if (!apply(includes, ["blog", "post", "page"], [type]))
            throw new IllegalArgumentError(concat("'", type, "' is an unknown type id."));
        var expr = new RegExp(concat(type, "-", "([0-9]+)"), "g");
        var res = requireDefined(expr.exec(source));
        return res[1];
    }
    function isComments(options) {
        return get$1(options, "type") === "comments";
    }

    function extend(source) {
        requireIf(source, isObject, "The source must be an indexable object.");
        apply(this.push, this, source);
        return this;
    }

    function _rawGet(options, all, id) {
        options = feedOptions(options);
        var params = paramsFrom(options.params);
        if (all) {
            params.start(1);
            params.max(maxResults);
        }
        var entries = [];
        var url = buildUrl(options, id);
        var startIndex = params.start();
        function request(url, max) {
            return fetch(string(url))
                .then(function (res) {
                if (res.status !== 200)
                    throw new IllegalAccessError("Request failed. Status: " + res.status);
                return res.text();
            })
                .then(function (body) {
                try {
                    var blog = JSON.parse(body);
                    if (id && !isComments(options)) {
                        return blog;
                    }
                    var feed = blog.feed;
                    var entry = feed.entry || [];
                    apply((extend), entries, [entry]);
                    var length_1 = len(entry);
                    if (apply(isNotEmpty, entry) && length_1 >= maxResults && ((all && length_1 >= maxResults) || (!all && length_1 < max))) {
                        if (!all)
                            max -= length_1;
                        params.start(params.start() + length_1);
                        params.max(max);
                        return request(buildUrl(options), max);
                    }
                    feed.entry = entries;
                    if (params.max() !== len(entries))
                        feed.openSearch$itemsPerPage.$t = feed.openSearch$totalResults.$t = string(len(entries));
                    feed.openSearch$startIndex.$t = string(startIndex);
                    return blog;
                }
                catch (e) {
                    throw {
                        message: "Parse failed. The response is not a JSON.",
                        body: body,
                    };
                }
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
    function rawById(options) {
        return _rawGet(get$1(options, "feed") || {}, false, get$1(options, "id"));
    }

    function rawTextToText(text) {
        return isObject(text) ? string(text.$t) : '';
    }
    function rawTextToNumber(text) {
        return apply(toInt, rawTextToText(text));
    }
    function rawTextToBoolean(text) {
        return Boolean(rawTextToText(text));
    }
    function rawCategoryToCategory(category) {
        return isArray(category) ? category.map(function (it) { return it.term; }) : [];
    }
    function rawAuthorToAuthor(author) {
        return isArray(author) ? author
            .map(function (value) { return setTo(value, {
            email: rawTextToText,
            name: rawTextToText,
            uri: rawTextToText,
            gd$image: self
        }, {}); }) : [];
    }
    function rawEntryToEntry(post) {
        if (!isObject(post))
            return {};
        return setTo(post, {
            id: rawTextToText,
            author: rawAuthorToAuthor,
            title: rawTextToText,
            link: self,
            updated: rawTextToText,
            published: rawTextToText,
            category: rawCategoryToCategory,
            media$thumbnail: function (value) { return ({
                width: apply(toInt, value.width),
                height: apply(toInt, value.height),
                url: value.url
            }); },
            content: rawTextToText,
            summary: rawTextToText,
            thr$total: rawTextToNumber,
            "thr$in-reply-to": self,
            gd$extendedProperty: self
        }, {});
    }
    function rawBlogEntryToBlogEntry(blog) {
        return setTo(blog, {
            version: self,
            encoding: self,
            entry: rawEntryToEntry
        }, {});
    }
    function rawBlogToBlog(blog) {
        return setTo(blog, {
            version: self,
            encoding: self,
            feed: function (feed) {
                var res = rawEntryToEntry(feed);
                setTo(feed, {
                    blogger$adultContent: rawTextToBoolean,
                    subtitle: rawTextToText,
                    openSearch$itemsPerPage: rawTextToNumber,
                    openSearch$startIndex: rawTextToNumber,
                    openSearch$totalResults: rawTextToNumber,
                    entry: function (value) { return isArray(value) ? value.map(rawEntryToEntry) : []; },
                }, res);
                return res;
            }
        }, {});
    }

    function all(options) {
        return rawAll(options)
            .then(rawBlogToBlog);
    }
    function get(options) {
        return rawGet(options)
            .then(rawBlogToBlog);
    }
    function byId(options) {
        var mapper = get$1(options, "feed", "type") === "comments" ? rawBlogToBlog : rawBlogEntryToBlogEntry;
        return rawById(options)
            .then(mapper);
    }

    function entries2(options, fn, id) {
        requireObject(options, "options");
        var feed;
        options.feed = feed = getIf(options.feed, isObject, create);
        var params = paramsFrom(feed.params), max = params.max();
        var builder = builderFrom(params);
        var request = isComments(feed) && id ? function (feed) {
            return _rawGet(feed, params.query(), id)
                .then(rawBlogToBlog);
        } : get;
        function changePage(page) {
            feed.params = builder
                .paginated(page)
                .build();
            return request(feed)
                .then(function (blog) { return freeze({
                entries: get$1(blog, "feed", "entry") || [],
                blog: blog
            }); });
        }
        function createHandler(blog) {
            builder.max(max);
            var source = fn ? fn(blog) : {};
            var handler = freeze(assign(source, {
                total: blog.feed.openSearch$totalResults,
                page: changePage
            }));
            delete blog.feed;
            return handler;
        }
        if (!params.query())
            params.max(1);
        return (id && isComments(feed) ? request : (params.query() ? all : get))(feed)
            .then(createHandler);
    }
    function entries(options, extra) {
        return entries2(options, extra);
    }

    function posts(options) {
        set(options, "feed", "type", "posts");
        return entries2(options, function (blog) { return ({
            categories: freeze(blog.feed.category || []),
        }); });
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

    var querySymbol = uid('q');
    var excludeSymbol = uid('e');
    var operatorSymbol = uid('o');
    var exactSymbol = uid('e');
    function buildQuery(terms, sep, startQuote, endQuote) {
        if (!isArray(terms))
            terms = [terms];
        endQuote = endQuote || startQuote;
        terms = terms.map(string)
            .filter(function (it) { return apply(isNotEmpty, it); });
        return apply(isEmpty, terms) ? '' : concat(startQuote, terms.join(sep), endQuote);
    }
    function appendQuery(args, name) {
        if (len(args) === 0)
            return this;
        var qt = quote(get$1(this, exactSymbol)), op = operator(get$1(this, operatorSymbol)), xc = get$1(this, excludeSymbol) ? exclude() : '';
        name = string(name);
        name = apply(isNotEmpty, name) ? concat(name, ':') : '';
        var current = get$1(this, querySymbol);
        var query = buildQuery(slice(args), concat(qt, op, xc, name, qt), concat(xc, name, qt), qt);
        if (apply(isNotEmpty, current))
            current += op;
        set(this, querySymbol, current + query);
        return this;
    }
    var QueryStringBuilder = function () {
        writeable(this, exactSymbol, false);
        writeable(this, operatorSymbol, 'OR');
        writeable(this, excludeSymbol, false);
        writeable(this, querySymbol, '');
    };
    function setFn(symbol, value) {
        return function () {
            set(this, symbol, value);
            return this;
        };
    }
    var prototype = {
        and: setFn(operatorSymbol, "AND"),
        or: setFn(operatorSymbol, 'OR'),
        exact: setFn(exactSymbol, true),
        noExact: setFn(exactSymbol, false),
        exclude: setFn(excludeSymbol, true),
        noExclude: setFn(excludeSymbol, false),
        terms: function () {
            return apply(appendQuery, this, [arguments]);
        },
        named: function (name) {
            return apply(appendQuery, this, [slice(arguments, 1), name]);
        },
        build: function () {
            var query = get$1(this, querySymbol);
            return apply(isEmpty, query) ? undefined : query;
        }
    };
    var named = ["label", "title", "author"]
        .map(function (key) {
        var handler = function () {
            return apply(this.named, this, [key].concat(slice(arguments)));
        };
        set(prototype, key, handler);
        return handler;
    });
    prototype["labels"] = prototype["categories"] = named[0];
    es5class(QueryStringBuilder, {
        prototype: prototype
    });
    function queryBuilder() {
        return new QueryStringBuilder();
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
            throw new IllegalArgumentError(concat("The ", defaultRatio ? 'ratio' : 'format', " ", format, " is not valid."));
        return new constructor(width, height);
    }
    uid("Size#width");
    uid("Size#height");

    var thumbnailSizeExpression = 's72-c';
    function toFormatSize(size) {
        return isObject(size) ? concat("", size.width, ":", size.height) : string(size);
    }
    function postThumbnail(source, size, ratio) {
        var parse = parseSize(function (width, height) {
            this.width = round(width);
            this.height = round(height);
            this.adjust = function () {
                return this;
            };
            this.ratio = function () {
                return this.height === 0 ? 0 : this.width / this.height;
            };
        }, isObject, toFormatSize(size), ratio || 16 / 9);
        var expression = concat("w", parse.width, "-h", parse.height, "-p-k-no-nu");
        return source.media$thumbnail
            .url.replace(concat("/", thumbnailSizeExpression, "/"), concat("/", expression, "/"))
            .replace(concat("=", thumbnailSizeExpression), concat("=", expression));
    }

    function withCategories(options) {
        var categories = options.categories;
        if (apply(isEmpty, categories))
            return new Promise(function (_, reject) { return reject("The categories are empty."); });
        var feed = feedOptions(options.feed);
        set(feed, "type", "posts");
        var params = paramsFrom(feed.params);
        var builder = queryBuilder()
            .exact();
        apply(options.every ? builder.and : builder.or, builder);
        builderFrom(params)
            .query(apply(builder.categories, builder, categories)
            .build());
        return all(feed)
            .then(function (blog) { return freeze({
            posts: blog.feed.entry
                .map(function (post) { return ({ count: len(post.category.filter(function (it) { return categories.indexOf(it) >= 0; })), post: post }); })
                .sort(function (a, b) { return b.count - a.count; })
                .slice(0, params.max()),
            blog: blog
        }); });
    }

    function commentsById(options) {
        set(options, "feed", "type", "comments");
        return entries2(options, null, get$1(options, "id"));
    }

    readonly2(rawGet, "all", rawAll);
    readonly2(rawGet, "byId", rawById);
    var feed = get;
    readonly2(feed, "all", all);
    readonly2(feed, "raw", rawGet);
    readonly2(feed, "byId", byId);
    var search = {
        query: queryBuilder,
        QueryStringBuilder: QueryStringBuilder,
        params: paramsBuilder,
        SearchParamsBuilder: SearchParamsBuilder,
        SearchParams: SearchParams
    };
    readonly2(entries, "byId", byId);
    readonly2(posts, "createsThumbnail", postThumbnail);
    readonly2(posts, "withCategories", withCategories);
    var module = {
        posts: posts,
        entries: entries,
        search: search,
        feed: feed,
        routes: routes,
        buildUrl: buildUrl,
        getId: getId,
    };
    var others = ["comments", "pages"];
    forEach(others, function (key) {
        set(module, key, function (options) {
            set(options, "feed", "type", key);
            return entries(options);
        });
    });
    others.push("posts");
    forEach(others, function (key) {
        set(module, key, "byId", function (options) {
            set(options, "feed", "type", key);
            return byId(options);
        });
    });
    set(module, "comments", "byId", commentsById);
    assign(exports, module);

    exports.buildUrl = buildUrl;
    exports.feed = feed;
    exports.getId = getId;

    return exports;

})({});
//# sourceMappingURL=feeddy.js.map
