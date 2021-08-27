
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element$1(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty$2() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children$1(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element$1('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children$1(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function dataset_dev(node, property, value) {
        node.dataset[property] = value;
        dispatch_dev('SvelteDOMSetDataset', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /* --------------------------------------------
     *
     * Return a truthy value if is zero
     *
     * --------------------------------------------
     */
    function canBeZero (val) {
    	if (val === 0) {
    		return true;
    	}
    	return val;
    }

    function makeAccessor (acc) {
    	if (!canBeZero(acc)) return null;
    	if (Array.isArray(acc)) {
    		return d => acc.map(k => {
    			return typeof k !== 'function' ? d[k] : k(d);
    		});
    	} else if (typeof acc !== 'function') { // eslint-disable-line no-else-return
    		return d => d[acc];
    	}
    	return acc;
    }

    /* --------------------------------------------
     *
     * Remove undefined fields from an object
     *
     * --------------------------------------------
     */

    // From Object.fromEntries polyfill https://github.com/tc39/proposal-object-from-entries/blob/master/polyfill.js#L1
    function fromEntries(iter) {
    	const obj = {};

    	for (const pair of iter) {
    		if (Object(pair) !== pair) {
    			throw new TypeError("iterable for fromEntries should yield objects");
    		}

    		// Consistency with Map: contract is that entry has "0" and "1" keys, not
    		// that it is an array or iterable.

    		const { "0": key, "1": val } = pair;

    		Object.defineProperty(obj, key, {
    			configurable: true,
    			enumerable: true,
    			writable: true,
    			value: val,
    		});
    	}

    	return obj;
    }

    function filterObject (obj, comparisonObj = {}) {
    	return fromEntries(Object.entries(obj).filter(([key, value]) => {
    		return value !== undefined
    			&& comparisonObj[key] === undefined;
    	}));
    }

    /* --------------------------------------------
     *
     * Calculate the extents of desired fields
     * For example, a fields object like this:
     * `{'x': d => d.x, 'y': d => d.y}`
     * For data like this:
     * [{ x: 0, y: -10 }, { x: 10, y: 0 }, { x: 5, y: 10 }]
     * Returns an object like:
     * `{ x: [0, 10], y: [-10, 10] }`
     *
     * --------------------------------------------
     */
    function calcExtents (data, fields) {
    	if (!Array.isArray(data)) {
    		throw new TypeError('The first argument of calcExtents() must be an array.');
    	}

    	if (
    		Array.isArray(fields)
    		|| fields === undefined
    		|| fields === null
    	) {
    		throw new TypeError('The second argument of calcExtents() must be an '
    		+ 'object with field names as keys as accessor functions as values.');
    	}

    	const extents = {};

    	const keys = Object.keys(fields);
    	const kl = keys.length;
    	let i;
    	let j;
    	let k;
    	let s;
    	let min;
    	let max;
    	let acc;
    	let val;

    	const dl = data.length;
    	for (i = 0; i < kl; i += 1) {
    		s = keys[i];
    		acc = fields[s];
    		min = null;
    		max = null;
    		for (j = 0; j < dl; j += 1) {
    			val = acc(data[j]);
    			if (Array.isArray(val)) {
    				const vl = val.length;
    				for (k = 0; k < vl; k += 1) {
    					if (val[k] !== undefined && val[k] !== null && Number.isNaN(val[k]) === false) {
    						if (min === null || val[k] < min) {
    							min = val[k];
    						}
    						if (max === null || val[k] > max) {
    							max = val[k];
    						}
    					}
    				}
    			} else if (val !== undefined && val !== null && Number.isNaN(val) === false) {
    				if (min === null || val < min) {
    					min = val;
    				}
    				if (max === null || val > max) {
    					max = val;
    				}
    			}
    		}
    		extents[s] = [min, max];
    	}

    	return extents;
    }

    /* --------------------------------------------
     * If we have a domain from settings, fill in
     * any null values with ones from our measured extents
     * otherwise, return the measured extent
     */
    function partialDomain (domain = [], directive) {
    	if (Array.isArray(directive) === true) {
    		return directive.map((d, i) => {
    			if (d === null) {
    				return domain[i];
    			}
    			return d;
    		});
    	}
    	return domain;
    }

    function calcDomain (s) {
    	return function domainCalc ([$extents, $domain]) {
    		return $extents ? partialDomain($extents[s], $domain) : $domain;
    	};
    }

    function ascending$2(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector(f) {
      let delta = f;
      let compare = f;

      if (f.length === 1) {
        delta = (d, x) => f(d) - x;
        compare = ascendingComparator(f);
      }

      function left(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          const mid = (lo + hi) >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      }

      function right(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          const mid = (lo + hi) >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }

      function center(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        const i = left(a, x, lo, hi - 1);
        return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
      }

      return {left, center, right};
    }

    function ascendingComparator(f) {
      return (d, x) => ascending$2(f(d), x);
    }

    function number$1(x) {
      return x === null ? NaN : +x;
    }

    const ascendingBisect = bisector(ascending$2);
    const bisectRight = ascendingBisect.right;
    bisector(number$1).center;
    var bisect = bisectRight;

    var e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function ticks(start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
        let r0 = Math.round(start / step), r1 = Math.round(stop / step);
        if (r0 * step < start) ++r0;
        if (r1 * step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) * step;
      } else {
        step = -step;
        let r0 = Math.round(start * step), r1 = Math.round(stop * step);
        if (r0 / step < start) ++r0;
        if (r1 / step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) / step;
      }

      if (reverse) ticks.reverse();

      return ticks;
    }

    function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0
          ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
          : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;
      else if (error >= e5) step1 *= 5;
      else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
        reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
        reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
        reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
        reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
        reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy: function(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable: function() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb$1(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb$1, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function() {
        return this;
      },
      displayable: function() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    }

    function rgb_formatRgb() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }

    function hex(value) {
      value = Math.max(0, Math.min(255, Math.round(value) || 0));
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl: function() {
        var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(")
            + (this.h || 0) + ", "
            + (this.s || 0) * 100 + "%, "
            + (this.l || 0) * 100 + "%"
            + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var constant$4 = x => () => x;

    function linear$1(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant$4(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear$1(a, d) : constant$4(isNaN(a) ? b : a);
    }

    var rgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb(start, end) {
        var r = color((start = rgb$1(start)).r, (end = rgb$1(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb.gamma = rgbGamma;

      return rgb;
    })(1);

    function numberArray(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function interpolateNumber(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolate(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function string(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolate(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant$4(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color(b)) ? (b = c, rgb) : string)
          : b instanceof color ? rgb
          : b instanceof Date ? date
          : isNumberArray(b) ? numberArray
          : Array.isArray(b) ? genericArray
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    function constants(x) {
      return function() {
        return x;
      };
    }

    function number(x) {
      return +x;
    }

    var unit = [0, 1];

    function identity$3(x) {
      return x;
    }

    function normalize(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constants(isNaN(b) ? NaN : 0.5);
    }

    function clamper(a, b) {
      var t;
      if (a > b) t = a, a = b, b = t;
      return function(x) { return Math.max(a, Math.min(b, x)); };
    }

    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap(domain, range, interpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
      else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, interpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = normalize(domain[i], domain[i + 1]);
        r[i] = interpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisect(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp())
          .unknown(source.unknown());
    }

    function transformer() {
      var domain = unit,
          range = unit,
          interpolate$1 = interpolate,
          transform,
          untransform,
          unknown,
          clamp = identity$3,
          piecewise,
          output,
          input;

      function rescale() {
        var n = Math.min(domain.length, range.length);
        if (clamp !== identity$3) clamp = clamper(domain[0], domain[n - 1]);
        piecewise = n > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? true : identity$3, rescale()) : clamp !== identity$3;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      return function(t, u) {
        transform = t, untransform = u;
        return rescale();
      };
    }

    function continuous() {
      return transformer()(identity$3, identity$3);
    }

    function formatDecimal$1(x) {
      return Math.abs(x = Math.round(x)) >= 1e21
          ? x.toLocaleString("en").replace(/,/g, "")
          : x.toString(10);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimalParts(1.23) returns ["123", 0].
    function formatDecimalParts$1(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent$1(x) {
      return x = formatDecimalParts$1(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup$1(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals$1(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re$1 = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier$1(specifier) {
      if (!(match = re$1.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      return new FormatSpecifier$1({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
      });
    }

    formatSpecifier$1.prototype = FormatSpecifier$1.prototype; // instanceof

    function FormatSpecifier$1(specifier) {
      this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
      this.align = specifier.align === undefined ? ">" : specifier.align + "";
      this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
      this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
      this.zero = !!specifier.zero;
      this.width = specifier.width === undefined ? undefined : +specifier.width;
      this.comma = !!specifier.comma;
      this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
      this.trim = !!specifier.trim;
      this.type = specifier.type === undefined ? "" : specifier.type + "";
    }

    FormatSpecifier$1.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width === undefined ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim$1(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent$1;

    function formatPrefixAuto$1(x, p) {
      var d = formatDecimalParts$1(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent$1 = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimalParts$1(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded$1(x, p) {
      var d = formatDecimalParts$1(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes$1 = {
      "%": (x, p) => (x * 100).toFixed(p),
      "b": (x) => Math.round(x).toString(2),
      "c": (x) => x + "",
      "d": formatDecimal$1,
      "e": (x, p) => x.toExponential(p),
      "f": (x, p) => x.toFixed(p),
      "g": (x, p) => x.toPrecision(p),
      "o": (x) => Math.round(x).toString(8),
      "p": (x, p) => formatRounded$1(x * 100, p),
      "r": formatRounded$1,
      "s": formatPrefixAuto$1,
      "X": (x) => Math.round(x).toString(16).toUpperCase(),
      "x": (x) => Math.round(x).toString(16)
    };

    function identity$2(x) {
      return x;
    }

    var map$1 = Array.prototype.map,
        prefixes$1 = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale$1(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity$2 : formatGroup$1(map$1.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity$2 : formatNumerals$1(map$1.call(locale.numerals, String)),
          percent = locale.percent === undefined ? "%" : locale.percent + "",
          minus = locale.minus === undefined ? "−" : locale.minus + "",
          nan = locale.nan === undefined ? "NaN" : locale.nan + "";

      function newFormat(specifier) {
        specifier = formatSpecifier$1(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes$1[type]) precision === undefined && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes$1[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Determine the sign. -0 is not less than 0, but 1 / -0 is!
            var valueNegative = value < 0 || 1 / value < 0;

            // Perform the initial formatting.
            value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim$1(value);

            // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
            if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes$1[8 + prefixExponent$1 / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier$1(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes$1[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale$1;
    var format$1;
    var formatPrefix;

    defaultLocale$1({
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale$1(definition) {
      locale$1 = formatLocale$1(definition);
      format$1 = locale$1.format;
      formatPrefix = locale$1.formatPrefix;
      return locale$1;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent$1(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3 - exponent$1(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent$1(max) - exponent$1(step)) + 1;
    }

    function tickFormat(start, stop, count, specifier) {
      var step = tickStep(start, stop, count),
          precision;
      specifier = formatSpecifier$1(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format$1(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        var d = domain();
        return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain();
        var i0 = 0;
        var i1 = d.length - 1;
        var start = d[i0];
        var stop = d[i1];
        var prestep;
        var step;
        var maxIter = 10;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }
        
        while (maxIter-- > 0) {
          step = tickIncrement(start, stop, count);
          if (step === prestep) {
            d[i0] = start;
            d[i1] = stop;
            return domain(d);
          } else if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
          } else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
          } else {
            break;
          }
          prestep = step;
        }

        return scale;
      };

      return scale;
    }

    function linear() {
      var scale = continuous();

      scale.copy = function() {
        return copy(scale, linear());
      };

      initRange.apply(scale, arguments);

      return linearish(scale);
    }

    function transformPow(exponent) {
      return function(x) {
        return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
      };
    }

    function transformSqrt(x) {
      return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
    }

    function transformSquare(x) {
      return x < 0 ? -x * x : x * x;
    }

    function powish(transform) {
      var scale = transform(identity$3, identity$3),
          exponent = 1;

      function rescale() {
        return exponent === 1 ? transform(identity$3, identity$3)
            : exponent === 0.5 ? transform(transformSqrt, transformSquare)
            : transform(transformPow(exponent), transformPow(1 / exponent));
      }

      scale.exponent = function(_) {
        return arguments.length ? (exponent = +_, rescale()) : exponent;
      };

      return linearish(scale);
    }

    function pow$1() {
      var scale = powish(transformer());

      scale.copy = function() {
        return copy(scale, pow$1()).exponent(scale.exponent());
      };

      initRange.apply(scale, arguments);

      return scale;
    }

    function sqrt() {
      return pow$1.apply(null, arguments).exponent(0.5);
    }

    var defaultScales = {
    	x: linear,
    	y: linear,
    	z: linear,
    	r: sqrt
    };

    /* --------------------------------------------
     *
     * Determine whether a scale is a log, symlog, power or other
     * This is not meant to be exhaustive of all the different types of
     * scales in d3-scale and focuses on continuous scales
     *
     * --------------------------------------------
     */
    function findScaleType(scale) {
    	if (scale.constant) {
    		return 'symlog';
    	}
    	if (scale.base) {
    		return 'log';
    	}
    	if (scale.exponent) {
    		if (scale.exponent() === 0.5) {
    			return 'sqrt';
    		}
    		return 'pow';
    	}
    	return 'other';
    }

    function identity$1 (d) {
    	return d;
    }

    function log(sign) {
    	return x => Math.log(sign * x);
    }

    function exp(sign) {
    	return x => sign * Math.exp(x);
    }

    function symlog(c) {
    	return x => Math.sign(x) * Math.log1p(Math.abs(x / c));
    }

    function symexp(c) {
    	return x => Math.sign(x) * Math.expm1(Math.abs(x)) * c;
    }

    function pow(exponent) {
    	return function powFn(x) {
    		return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
    	};
    }

    function getPadFunctions(scale) {
    	const scaleType = findScaleType(scale);

    	if (scaleType === 'log') {
    		const sign = Math.sign(scale.domain()[0]);
    		return { lift: log(sign), ground: exp(sign), scaleType };
    	}
    	if (scaleType === 'pow') {
    		const exponent = 1;
    		return { lift: pow(exponent), ground: pow(1 / exponent), scaleType };
    	}
    	if (scaleType === 'sqrt') {
    		const exponent = 0.5;
    		return { lift: pow(exponent), ground: pow(1 / exponent), scaleType };
    	}
    	if (scaleType === 'symlog') {
    		const constant = 1;
    		return { lift: symlog(constant), ground: symexp(constant), scaleType };
    	}

    	return { lift: identity$1, ground: identity$1, scaleType };
    }

    /* --------------------------------------------
     *
     * Returns a modified scale domain by in/decreasing
     * the min/max by taking the desired difference
     * in pixels and converting it to units of data.
     * Returns an array that you can set as the new domain.
     * Padding contributed by @veltman.
     * See here for discussion of transforms: https://github.com/d3/d3-scale/issues/150
     *
     * --------------------------------------------
     */

    function padScale (scale, padding) {
    	if (typeof scale.range !== 'function') {
    		throw new Error('Scale method `range` must be a function');
    	}
    	if (typeof scale.domain !== 'function') {
    		throw new Error('Scale method `domain` must be a function');
    	}
    	if (!Array.isArray(padding)) {
    		return scale.domain();
    	}

    	if (scale.domain().length !== 2) {
    		console.warn('[LayerCake] The scale is expected to have a domain of length 2 to use padding. Are you sure you want to use padding? Your scale\'s domain is:', scale.domain());
    	}
    	if (scale.range().length !== 2) {
    		console.warn('[LayerCake] The scale is expected to have a range of length 2 to use padding. Are you sure you want to use padding? Your scale\'s range is:', scale.range());
    	}

    	const { lift, ground } = getPadFunctions(scale);

    	const d0 = scale.domain()[0];

    	const isTime = Object.prototype.toString.call(d0) === '[object Date]';

    	const [d1, d2] = scale.domain().map(d => {
    		return isTime ? lift(d.getTime()) : lift(d);
    	});
    	const [r1, r2] = scale.range();
    	const paddingLeft = padding[0] || 0;
    	const paddingRight = padding[1] || 0;

    	const step = (d2 - d1) / (Math.abs(r2 - r1) - paddingLeft - paddingRight); // Math.abs() to properly handle reversed scales

    	return [d1 - paddingLeft * step, paddingRight * step + d2].map(d => {
    		return isTime ? ground(new Date(d)) : ground(d);
    	});
    }

    /* eslint-disable no-nested-ternary */
    function calcBaseRange(s, width, height, reverse, percentRange) {
    	let min;
    	let max;
    	if (percentRange === true) {
    		min = 0;
    		max = 100;
    	} else {
    		min = s === 'r' ? 1 : 0;
    		max = s === 'y' ? height : s === 'r' ? 25 : width;
    	}
    	return reverse === true ? [max, min] : [min, max];
    }

    function getDefaultRange(s, width, height, reverse, range, percentRange) {
    	return !range
    		? calcBaseRange(s, width, height, reverse, percentRange)
    		: typeof range === 'function'
    			? range({ width, height })
    			: range;
    }

    function createScale (s) {
    	return function scaleCreator ([$scale, $extents, $domain, $padding, $nice, $reverse, $width, $height, $range, $percentScale]) {
    		if ($extents === null) {
    			return null;
    		}

    		const defaultRange = getDefaultRange(s, $width, $height, $reverse, $range, $percentScale);

    		const scale = $scale === defaultScales[s] ? $scale() : $scale.copy();

    		/* --------------------------------------------
    		 * On creation, `$domain` will already have any nulls filled in
    		 * But if we set it via the context it might not, so rerun it through partialDomain
    		 */
    		scale
    			.domain(partialDomain($extents[s], $domain))
    			.range(defaultRange);

    		if ($padding) {
    			scale.domain(padScale(scale, $padding));
    		}

    		if ($nice === true) {
    			if (typeof scale.nice === 'function') {
    				scale.nice();
    			} else {
    				console.error(`[Layer Cake] You set \`${s}Nice: true\` but the ${s}Scale does not have a \`.nice\` method. Ignoring...`);
    			}
    		}

    		return scale;
    	};
    }

    function createGetter ([$acc, $scale]) {
    	return d => {
    		const val = $acc(d);
    		if (Array.isArray(val)) {
    			return val.map(v => $scale(v));
    		}
    		return $scale(val);
    	};
    }

    function getRange([$scale]) {
    	if (typeof $scale === 'function') {
    		if (typeof $scale.range === 'function') {
    			return $scale.range();
    		}
    		console.error('[LayerCake] Your scale doesn\'t have a `.range` method?');
    	}
    	return null;
    }

    var defaultReverses = {
    	x: false,
    	y: true,
    	z: false,
    	r: false
    };

    /* node_modules/layercake/src/LayerCake.svelte generated by Svelte v3.42.1 */

    const { Object: Object_1, console: console_1 } = globals;
    const file$4 = "node_modules/layercake/src/LayerCake.svelte";

    const get_default_slot_changes$1 = dirty => ({
    	element: dirty[0] & /*element*/ 4,
    	width: dirty[0] & /*$width_d*/ 64,
    	height: dirty[0] & /*$height_d*/ 128,
    	aspectRatio: dirty[0] & /*$aspectRatio_d*/ 256,
    	containerWidth: dirty[0] & /*$_containerWidth*/ 512,
    	containerHeight: dirty[0] & /*$_containerHeight*/ 1024
    });

    const get_default_slot_context$1 = ctx => ({
    	element: /*element*/ ctx[2],
    	width: /*$width_d*/ ctx[6],
    	height: /*$height_d*/ ctx[7],
    	aspectRatio: /*$aspectRatio_d*/ ctx[8],
    	containerWidth: /*$_containerWidth*/ ctx[9],
    	containerHeight: /*$_containerHeight*/ ctx[10]
    });

    // (303:0) {#if (ssr === true || typeof window !== 'undefined')}
    function create_if_block$2(ctx) {
    	let div;
    	let div_style_value;
    	let div_resize_listener;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[54].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[53], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			div = element$1("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "layercake-container svelte-vhzpsp");

    			attr_dev(div, "style", div_style_value = "\n\t\t\tposition:" + /*position*/ ctx[5] + ";\n\t\t\t" + (/*position*/ ctx[5] === 'absolute'
    			? 'top:0;right:0;bottom:0;left:0;'
    			: '') + "\n\t\t\t" + (/*pointerEvents*/ ctx[4] === false
    			? 'pointer-events:none;'
    			: '') + "\n\t\t");

    			add_render_callback(() => /*div_elementresize_handler*/ ctx[56].call(div));
    			add_location(div, file$4, 303, 1, 9414);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[55](div);
    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[56].bind(div));
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*element, $width_d, $height_d, $aspectRatio_d, $_containerWidth, $_containerHeight*/ 1988 | dirty[1] & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[53],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[53])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[53], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}

    			if (!current || dirty[0] & /*position, pointerEvents*/ 48 && div_style_value !== (div_style_value = "\n\t\t\tposition:" + /*position*/ ctx[5] + ";\n\t\t\t" + (/*position*/ ctx[5] === 'absolute'
    			? 'top:0;right:0;bottom:0;left:0;'
    			: '') + "\n\t\t\t" + (/*pointerEvents*/ ctx[4] === false
    			? 'pointer-events:none;'
    			: '') + "\n\t\t")) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[55](null);
    			div_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(303:0) {#if (ssr === true || typeof window !== 'undefined')}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = (/*ssr*/ ctx[3] === true || typeof window !== 'undefined') && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$2();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*ssr*/ ctx[3] === true || typeof window !== 'undefined') {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*ssr*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let context;
    	let $width_d;
    	let $height_d;
    	let $aspectRatio_d;
    	let $_containerWidth;
    	let $_containerHeight;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LayerCake', slots, ['default']);
    	let { ssr = false } = $$props;
    	let { pointerEvents = true } = $$props;
    	let { position = 'relative' } = $$props;
    	let { percentRange = false } = $$props;
    	let { width = undefined } = $$props;
    	let { height = undefined } = $$props;
    	let { containerWidth = width || 100 } = $$props;
    	let { containerHeight = height || 100 } = $$props;
    	let { element = undefined } = $$props;
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { z = undefined } = $$props;
    	let { r = undefined } = $$props;
    	let { custom = {} } = $$props;
    	let { data = [] } = $$props;
    	let { xDomain = undefined } = $$props;
    	let { yDomain = undefined } = $$props;
    	let { zDomain = undefined } = $$props;
    	let { rDomain = undefined } = $$props;
    	let { xNice = false } = $$props;
    	let { yNice = false } = $$props;
    	let { zNice = false } = $$props;
    	let { rNice = false } = $$props;
    	let { xReverse = defaultReverses.x } = $$props;
    	let { yReverse = defaultReverses.y } = $$props;
    	let { zReverse = defaultReverses.z } = $$props;
    	let { rReverse = defaultReverses.r } = $$props;
    	let { xPadding = undefined } = $$props;
    	let { yPadding = undefined } = $$props;
    	let { zPadding = undefined } = $$props;
    	let { rPadding = undefined } = $$props;
    	let { xScale = defaultScales.x } = $$props;
    	let { yScale = defaultScales.y } = $$props;
    	let { zScale = defaultScales.y } = $$props;
    	let { rScale = defaultScales.r } = $$props;
    	let { xRange = undefined } = $$props;
    	let { yRange = undefined } = $$props;
    	let { zRange = undefined } = $$props;
    	let { rRange = undefined } = $$props;
    	let { padding = {} } = $$props;
    	let { extents = {} } = $$props;
    	let { flatData = undefined } = $$props;

    	/* --------------------------------------------
     * Preserve a copy of our passed in settings before we modify them
     * Return this to the user's context so they can reference things if need be
     * Add the active keys since those aren't on our settings object.
     * This is mostly an escape-hatch
     */
    	const config = {};

    	/* --------------------------------------------
     * Make store versions of each parameter
     * Prefix these with `_` to keep things organized
     */
    	const _percentRange = writable();

    	const _containerWidth = writable();
    	validate_store(_containerWidth, '_containerWidth');
    	component_subscribe($$self, _containerWidth, value => $$invalidate(9, $_containerWidth = value));
    	const _containerHeight = writable();
    	validate_store(_containerHeight, '_containerHeight');
    	component_subscribe($$self, _containerHeight, value => $$invalidate(10, $_containerHeight = value));
    	const _x = writable();
    	const _y = writable();
    	const _z = writable();
    	const _r = writable();
    	const _custom = writable();
    	const _data = writable();
    	const _xDomain = writable();
    	const _yDomain = writable();
    	const _zDomain = writable();
    	const _rDomain = writable();
    	const _xNice = writable();
    	const _yNice = writable();
    	const _zNice = writable();
    	const _rNice = writable();
    	const _xReverse = writable();
    	const _yReverse = writable();
    	const _zReverse = writable();
    	const _rReverse = writable();
    	const _xPadding = writable();
    	const _yPadding = writable();
    	const _zPadding = writable();
    	const _rPadding = writable();
    	const _xScale = writable();
    	const _yScale = writable();
    	const _zScale = writable();
    	const _rScale = writable();
    	const _xRange = writable();
    	const _yRange = writable();
    	const _zRange = writable();
    	const _rRange = writable();
    	const _padding = writable();
    	const _flatData = writable();
    	const _extents = writable();
    	const _config = writable(config);

    	/* --------------------------------------------
     * Create derived values
     * Suffix these with `_d`
     */
    	const activeGetters_d = derived([_x, _y, _z, _r], ([$x, $y, $z, $r]) => {
    		const obj = {};

    		if ($x) {
    			obj.x = $x;
    		}

    		if ($y) {
    			obj.y = $y;
    		}

    		if ($z) {
    			obj.z = $z;
    		}

    		if ($r) {
    			obj.r = $r;
    		}

    		return obj;
    	});

    	const padding_d = derived([_padding, _containerWidth, _containerHeight], ([$padding]) => {
    		const defaultPadding = { top: 0, right: 0, bottom: 0, left: 0 };
    		return Object.assign(defaultPadding, $padding);
    	});

    	const box_d = derived([_containerWidth, _containerHeight, padding_d], ([$containerWidth, $containerHeight, $padding]) => {
    		const b = {};
    		b.top = $padding.top;
    		b.right = $containerWidth - $padding.right;
    		b.bottom = $containerHeight - $padding.bottom;
    		b.left = $padding.left;
    		b.width = b.right - b.left;
    		b.height = b.bottom - b.top;

    		if (b.width <= 0) {
    			console.error('[LayerCake] Target div has zero or negative width. Did you forget to set an explicit width in CSS on the container?');
    		}

    		if (b.height <= 0) {
    			console.error('[LayerCake] Target div has zero or negative height. Did you forget to set an explicit height in CSS on the container?');
    		}

    		return b;
    	});

    	const width_d = derived([box_d], ([$box]) => {
    		return $box.width;
    	});

    	validate_store(width_d, 'width_d');
    	component_subscribe($$self, width_d, value => $$invalidate(6, $width_d = value));

    	const height_d = derived([box_d], ([$box]) => {
    		return $box.height;
    	});

    	validate_store(height_d, 'height_d');
    	component_subscribe($$self, height_d, value => $$invalidate(7, $height_d = value));

    	/* --------------------------------------------
     * Calculate extents by taking the extent of the data
     * and filling that in with anything set by the user
     */
    	const extents_d = derived([_flatData, activeGetters_d, _extents], ([$flatData, $activeGetters, $extents]) => {
    		return {
    			...calcExtents($flatData, filterObject($activeGetters, $extents)),
    			...$extents
    		};
    	});

    	const xDomain_d = derived([extents_d, _xDomain], calcDomain('x'));
    	const yDomain_d = derived([extents_d, _yDomain], calcDomain('y'));
    	const zDomain_d = derived([extents_d, _zDomain], calcDomain('z'));
    	const rDomain_d = derived([extents_d, _rDomain], calcDomain('r'));

    	const xScale_d = derived(
    		[
    			_xScale,
    			extents_d,
    			xDomain_d,
    			_xPadding,
    			_xNice,
    			_xReverse,
    			width_d,
    			height_d,
    			_xRange,
    			_percentRange
    		],
    		createScale('x')
    	);

    	const xGet_d = derived([_x, xScale_d], createGetter);

    	const yScale_d = derived(
    		[
    			_yScale,
    			extents_d,
    			yDomain_d,
    			_yPadding,
    			_yNice,
    			_yReverse,
    			width_d,
    			height_d,
    			_yRange,
    			_percentRange
    		],
    		createScale('y')
    	);

    	const yGet_d = derived([_y, yScale_d], createGetter);

    	const zScale_d = derived(
    		[
    			_zScale,
    			extents_d,
    			zDomain_d,
    			_zPadding,
    			_zNice,
    			_zReverse,
    			width_d,
    			height_d,
    			_zRange,
    			_percentRange
    		],
    		createScale('z')
    	);

    	const zGet_d = derived([_z, zScale_d], createGetter);

    	const rScale_d = derived(
    		[
    			_rScale,
    			extents_d,
    			rDomain_d,
    			_rPadding,
    			_rNice,
    			_rReverse,
    			width_d,
    			height_d,
    			_rRange,
    			_percentRange
    		],
    		createScale('r')
    	);

    	const rGet_d = derived([_r, rScale_d], createGetter);
    	const xRange_d = derived([xScale_d], getRange);
    	const yRange_d = derived([yScale_d], getRange);
    	const zRange_d = derived([zScale_d], getRange);
    	const rRange_d = derived([rScale_d], getRange);

    	const aspectRatio_d = derived([width_d, height_d], ([$aspectRatio, $width, $height]) => {
    		return $width / $height;
    	});

    	validate_store(aspectRatio_d, 'aspectRatio_d');
    	component_subscribe($$self, aspectRatio_d, value => $$invalidate(8, $aspectRatio_d = value));

    	const writable_props = [
    		'ssr',
    		'pointerEvents',
    		'position',
    		'percentRange',
    		'width',
    		'height',
    		'containerWidth',
    		'containerHeight',
    		'element',
    		'x',
    		'y',
    		'z',
    		'r',
    		'custom',
    		'data',
    		'xDomain',
    		'yDomain',
    		'zDomain',
    		'rDomain',
    		'xNice',
    		'yNice',
    		'zNice',
    		'rNice',
    		'xReverse',
    		'yReverse',
    		'zReverse',
    		'rReverse',
    		'xPadding',
    		'yPadding',
    		'zPadding',
    		'rPadding',
    		'xScale',
    		'yScale',
    		'zScale',
    		'rScale',
    		'xRange',
    		'yRange',
    		'zRange',
    		'rRange',
    		'padding',
    		'extents',
    		'flatData'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<LayerCake> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	function div_elementresize_handler() {
    		containerWidth = this.clientWidth;
    		containerHeight = this.clientHeight;
    		$$invalidate(0, containerWidth);
    		$$invalidate(1, containerHeight);
    	}

    	$$self.$$set = $$props => {
    		if ('ssr' in $$props) $$invalidate(3, ssr = $$props.ssr);
    		if ('pointerEvents' in $$props) $$invalidate(4, pointerEvents = $$props.pointerEvents);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('percentRange' in $$props) $$invalidate(16, percentRange = $$props.percentRange);
    		if ('width' in $$props) $$invalidate(17, width = $$props.width);
    		if ('height' in $$props) $$invalidate(18, height = $$props.height);
    		if ('containerWidth' in $$props) $$invalidate(0, containerWidth = $$props.containerWidth);
    		if ('containerHeight' in $$props) $$invalidate(1, containerHeight = $$props.containerHeight);
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    		if ('x' in $$props) $$invalidate(19, x = $$props.x);
    		if ('y' in $$props) $$invalidate(20, y = $$props.y);
    		if ('z' in $$props) $$invalidate(21, z = $$props.z);
    		if ('r' in $$props) $$invalidate(22, r = $$props.r);
    		if ('custom' in $$props) $$invalidate(23, custom = $$props.custom);
    		if ('data' in $$props) $$invalidate(24, data = $$props.data);
    		if ('xDomain' in $$props) $$invalidate(25, xDomain = $$props.xDomain);
    		if ('yDomain' in $$props) $$invalidate(26, yDomain = $$props.yDomain);
    		if ('zDomain' in $$props) $$invalidate(27, zDomain = $$props.zDomain);
    		if ('rDomain' in $$props) $$invalidate(28, rDomain = $$props.rDomain);
    		if ('xNice' in $$props) $$invalidate(29, xNice = $$props.xNice);
    		if ('yNice' in $$props) $$invalidate(30, yNice = $$props.yNice);
    		if ('zNice' in $$props) $$invalidate(31, zNice = $$props.zNice);
    		if ('rNice' in $$props) $$invalidate(32, rNice = $$props.rNice);
    		if ('xReverse' in $$props) $$invalidate(33, xReverse = $$props.xReverse);
    		if ('yReverse' in $$props) $$invalidate(34, yReverse = $$props.yReverse);
    		if ('zReverse' in $$props) $$invalidate(35, zReverse = $$props.zReverse);
    		if ('rReverse' in $$props) $$invalidate(36, rReverse = $$props.rReverse);
    		if ('xPadding' in $$props) $$invalidate(37, xPadding = $$props.xPadding);
    		if ('yPadding' in $$props) $$invalidate(38, yPadding = $$props.yPadding);
    		if ('zPadding' in $$props) $$invalidate(39, zPadding = $$props.zPadding);
    		if ('rPadding' in $$props) $$invalidate(40, rPadding = $$props.rPadding);
    		if ('xScale' in $$props) $$invalidate(41, xScale = $$props.xScale);
    		if ('yScale' in $$props) $$invalidate(42, yScale = $$props.yScale);
    		if ('zScale' in $$props) $$invalidate(43, zScale = $$props.zScale);
    		if ('rScale' in $$props) $$invalidate(44, rScale = $$props.rScale);
    		if ('xRange' in $$props) $$invalidate(45, xRange = $$props.xRange);
    		if ('yRange' in $$props) $$invalidate(46, yRange = $$props.yRange);
    		if ('zRange' in $$props) $$invalidate(47, zRange = $$props.zRange);
    		if ('rRange' in $$props) $$invalidate(48, rRange = $$props.rRange);
    		if ('padding' in $$props) $$invalidate(49, padding = $$props.padding);
    		if ('extents' in $$props) $$invalidate(50, extents = $$props.extents);
    		if ('flatData' in $$props) $$invalidate(51, flatData = $$props.flatData);
    		if ('$$scope' in $$props) $$invalidate(53, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		writable,
    		derived,
    		makeAccessor,
    		filterObject,
    		calcExtents,
    		calcDomain,
    		createScale,
    		createGetter,
    		getRange,
    		defaultScales,
    		defaultReverses,
    		ssr,
    		pointerEvents,
    		position,
    		percentRange,
    		width,
    		height,
    		containerWidth,
    		containerHeight,
    		element,
    		x,
    		y,
    		z,
    		r,
    		custom,
    		data,
    		xDomain,
    		yDomain,
    		zDomain,
    		rDomain,
    		xNice,
    		yNice,
    		zNice,
    		rNice,
    		xReverse,
    		yReverse,
    		zReverse,
    		rReverse,
    		xPadding,
    		yPadding,
    		zPadding,
    		rPadding,
    		xScale,
    		yScale,
    		zScale,
    		rScale,
    		xRange,
    		yRange,
    		zRange,
    		rRange,
    		padding,
    		extents,
    		flatData,
    		config,
    		_percentRange,
    		_containerWidth,
    		_containerHeight,
    		_x,
    		_y,
    		_z,
    		_r,
    		_custom,
    		_data,
    		_xDomain,
    		_yDomain,
    		_zDomain,
    		_rDomain,
    		_xNice,
    		_yNice,
    		_zNice,
    		_rNice,
    		_xReverse,
    		_yReverse,
    		_zReverse,
    		_rReverse,
    		_xPadding,
    		_yPadding,
    		_zPadding,
    		_rPadding,
    		_xScale,
    		_yScale,
    		_zScale,
    		_rScale,
    		_xRange,
    		_yRange,
    		_zRange,
    		_rRange,
    		_padding,
    		_flatData,
    		_extents,
    		_config,
    		activeGetters_d,
    		padding_d,
    		box_d,
    		width_d,
    		height_d,
    		extents_d,
    		xDomain_d,
    		yDomain_d,
    		zDomain_d,
    		rDomain_d,
    		xScale_d,
    		xGet_d,
    		yScale_d,
    		yGet_d,
    		zScale_d,
    		zGet_d,
    		rScale_d,
    		rGet_d,
    		xRange_d,
    		yRange_d,
    		zRange_d,
    		rRange_d,
    		aspectRatio_d,
    		context,
    		$width_d,
    		$height_d,
    		$aspectRatio_d,
    		$_containerWidth,
    		$_containerHeight
    	});

    	$$self.$inject_state = $$props => {
    		if ('ssr' in $$props) $$invalidate(3, ssr = $$props.ssr);
    		if ('pointerEvents' in $$props) $$invalidate(4, pointerEvents = $$props.pointerEvents);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('percentRange' in $$props) $$invalidate(16, percentRange = $$props.percentRange);
    		if ('width' in $$props) $$invalidate(17, width = $$props.width);
    		if ('height' in $$props) $$invalidate(18, height = $$props.height);
    		if ('containerWidth' in $$props) $$invalidate(0, containerWidth = $$props.containerWidth);
    		if ('containerHeight' in $$props) $$invalidate(1, containerHeight = $$props.containerHeight);
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    		if ('x' in $$props) $$invalidate(19, x = $$props.x);
    		if ('y' in $$props) $$invalidate(20, y = $$props.y);
    		if ('z' in $$props) $$invalidate(21, z = $$props.z);
    		if ('r' in $$props) $$invalidate(22, r = $$props.r);
    		if ('custom' in $$props) $$invalidate(23, custom = $$props.custom);
    		if ('data' in $$props) $$invalidate(24, data = $$props.data);
    		if ('xDomain' in $$props) $$invalidate(25, xDomain = $$props.xDomain);
    		if ('yDomain' in $$props) $$invalidate(26, yDomain = $$props.yDomain);
    		if ('zDomain' in $$props) $$invalidate(27, zDomain = $$props.zDomain);
    		if ('rDomain' in $$props) $$invalidate(28, rDomain = $$props.rDomain);
    		if ('xNice' in $$props) $$invalidate(29, xNice = $$props.xNice);
    		if ('yNice' in $$props) $$invalidate(30, yNice = $$props.yNice);
    		if ('zNice' in $$props) $$invalidate(31, zNice = $$props.zNice);
    		if ('rNice' in $$props) $$invalidate(32, rNice = $$props.rNice);
    		if ('xReverse' in $$props) $$invalidate(33, xReverse = $$props.xReverse);
    		if ('yReverse' in $$props) $$invalidate(34, yReverse = $$props.yReverse);
    		if ('zReverse' in $$props) $$invalidate(35, zReverse = $$props.zReverse);
    		if ('rReverse' in $$props) $$invalidate(36, rReverse = $$props.rReverse);
    		if ('xPadding' in $$props) $$invalidate(37, xPadding = $$props.xPadding);
    		if ('yPadding' in $$props) $$invalidate(38, yPadding = $$props.yPadding);
    		if ('zPadding' in $$props) $$invalidate(39, zPadding = $$props.zPadding);
    		if ('rPadding' in $$props) $$invalidate(40, rPadding = $$props.rPadding);
    		if ('xScale' in $$props) $$invalidate(41, xScale = $$props.xScale);
    		if ('yScale' in $$props) $$invalidate(42, yScale = $$props.yScale);
    		if ('zScale' in $$props) $$invalidate(43, zScale = $$props.zScale);
    		if ('rScale' in $$props) $$invalidate(44, rScale = $$props.rScale);
    		if ('xRange' in $$props) $$invalidate(45, xRange = $$props.xRange);
    		if ('yRange' in $$props) $$invalidate(46, yRange = $$props.yRange);
    		if ('zRange' in $$props) $$invalidate(47, zRange = $$props.zRange);
    		if ('rRange' in $$props) $$invalidate(48, rRange = $$props.rRange);
    		if ('padding' in $$props) $$invalidate(49, padding = $$props.padding);
    		if ('extents' in $$props) $$invalidate(50, extents = $$props.extents);
    		if ('flatData' in $$props) $$invalidate(51, flatData = $$props.flatData);
    		if ('context' in $$props) $$invalidate(52, context = $$props.context);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*x*/ 524288) {
    			if (x) config.x = x;
    		}

    		if ($$self.$$.dirty[0] & /*y*/ 1048576) {
    			if (y) config.y = y;
    		}

    		if ($$self.$$.dirty[0] & /*z*/ 2097152) {
    			if (z) config.z = z;
    		}

    		if ($$self.$$.dirty[0] & /*r*/ 4194304) {
    			if (r) config.r = r;
    		}

    		if ($$self.$$.dirty[0] & /*xDomain*/ 33554432) {
    			if (xDomain) config.xDomain = xDomain;
    		}

    		if ($$self.$$.dirty[0] & /*yDomain*/ 67108864) {
    			if (yDomain) config.yDomain = yDomain;
    		}

    		if ($$self.$$.dirty[0] & /*zDomain*/ 134217728) {
    			if (zDomain) config.zDomain = zDomain;
    		}

    		if ($$self.$$.dirty[0] & /*rDomain*/ 268435456) {
    			if (rDomain) config.rDomain = rDomain;
    		}

    		if ($$self.$$.dirty[1] & /*xRange*/ 16384) {
    			if (xRange) config.xRange = xRange;
    		}

    		if ($$self.$$.dirty[1] & /*yRange*/ 32768) {
    			if (yRange) config.yRange = yRange;
    		}

    		if ($$self.$$.dirty[1] & /*zRange*/ 65536) {
    			if (zRange) config.zRange = zRange;
    		}

    		if ($$self.$$.dirty[1] & /*rRange*/ 131072) {
    			if (rRange) config.rRange = rRange;
    		}

    		if ($$self.$$.dirty[0] & /*percentRange*/ 65536) {
    			_percentRange.set(percentRange);
    		}

    		if ($$self.$$.dirty[0] & /*containerWidth*/ 1) {
    			_containerWidth.set(containerWidth);
    		}

    		if ($$self.$$.dirty[0] & /*containerHeight*/ 2) {
    			_containerHeight.set(containerHeight);
    		}

    		if ($$self.$$.dirty[0] & /*x*/ 524288) {
    			_x.set(makeAccessor(x));
    		}

    		if ($$self.$$.dirty[0] & /*y*/ 1048576) {
    			_y.set(makeAccessor(y));
    		}

    		if ($$self.$$.dirty[0] & /*z*/ 2097152) {
    			_z.set(makeAccessor(z));
    		}

    		if ($$self.$$.dirty[0] & /*r*/ 4194304) {
    			_r.set(makeAccessor(r));
    		}

    		if ($$self.$$.dirty[0] & /*xDomain*/ 33554432) {
    			_xDomain.set(xDomain);
    		}

    		if ($$self.$$.dirty[0] & /*yDomain*/ 67108864) {
    			_yDomain.set(yDomain);
    		}

    		if ($$self.$$.dirty[0] & /*zDomain*/ 134217728) {
    			_zDomain.set(zDomain);
    		}

    		if ($$self.$$.dirty[0] & /*rDomain*/ 268435456) {
    			_rDomain.set(rDomain);
    		}

    		if ($$self.$$.dirty[0] & /*custom*/ 8388608) {
    			_custom.set(custom);
    		}

    		if ($$self.$$.dirty[0] & /*data*/ 16777216) {
    			_data.set(data);
    		}

    		if ($$self.$$.dirty[0] & /*xNice*/ 536870912) {
    			_xNice.set(xNice);
    		}

    		if ($$self.$$.dirty[0] & /*yNice*/ 1073741824) {
    			_yNice.set(yNice);
    		}

    		if ($$self.$$.dirty[1] & /*zNice*/ 1) {
    			_zNice.set(zNice);
    		}

    		if ($$self.$$.dirty[1] & /*rNice*/ 2) {
    			_rNice.set(rNice);
    		}

    		if ($$self.$$.dirty[1] & /*xReverse*/ 4) {
    			_xReverse.set(xReverse);
    		}

    		if ($$self.$$.dirty[1] & /*yReverse*/ 8) {
    			_yReverse.set(yReverse);
    		}

    		if ($$self.$$.dirty[1] & /*zReverse*/ 16) {
    			_zReverse.set(zReverse);
    		}

    		if ($$self.$$.dirty[1] & /*rReverse*/ 32) {
    			_rReverse.set(rReverse);
    		}

    		if ($$self.$$.dirty[1] & /*xPadding*/ 64) {
    			_xPadding.set(xPadding);
    		}

    		if ($$self.$$.dirty[1] & /*yPadding*/ 128) {
    			_yPadding.set(yPadding);
    		}

    		if ($$self.$$.dirty[1] & /*zPadding*/ 256) {
    			_zPadding.set(zPadding);
    		}

    		if ($$self.$$.dirty[1] & /*rPadding*/ 512) {
    			_rPadding.set(rPadding);
    		}

    		if ($$self.$$.dirty[1] & /*xScale*/ 1024) {
    			_xScale.set(xScale);
    		}

    		if ($$self.$$.dirty[1] & /*yScale*/ 2048) {
    			_yScale.set(yScale);
    		}

    		if ($$self.$$.dirty[1] & /*zScale*/ 4096) {
    			_zScale.set(zScale);
    		}

    		if ($$self.$$.dirty[1] & /*rScale*/ 8192) {
    			_rScale.set(rScale);
    		}

    		if ($$self.$$.dirty[1] & /*xRange*/ 16384) {
    			_xRange.set(xRange);
    		}

    		if ($$self.$$.dirty[1] & /*yRange*/ 32768) {
    			_yRange.set(yRange);
    		}

    		if ($$self.$$.dirty[1] & /*zRange*/ 65536) {
    			_zRange.set(zRange);
    		}

    		if ($$self.$$.dirty[1] & /*rRange*/ 131072) {
    			_rRange.set(rRange);
    		}

    		if ($$self.$$.dirty[1] & /*padding*/ 262144) {
    			_padding.set(padding);
    		}

    		if ($$self.$$.dirty[1] & /*extents*/ 524288) {
    			_extents.set(filterObject(extents));
    		}

    		if ($$self.$$.dirty[0] & /*data*/ 16777216 | $$self.$$.dirty[1] & /*flatData*/ 1048576) {
    			_flatData.set(flatData || data);
    		}

    		if ($$self.$$.dirty[1] & /*context*/ 2097152) {
    			setContext('LayerCake', context);
    		}
    	};

    	$$invalidate(52, context = {
    		activeGetters: activeGetters_d,
    		width: width_d,
    		height: height_d,
    		percentRange: _percentRange,
    		aspectRatio: aspectRatio_d,
    		containerWidth: _containerWidth,
    		containerHeight: _containerHeight,
    		x: _x,
    		y: _y,
    		z: _z,
    		r: _r,
    		custom: _custom,
    		data: _data,
    		xNice: _xNice,
    		yNice: _yNice,
    		zNice: _zNice,
    		rNice: _rNice,
    		xReverse: _xReverse,
    		yReverse: _yReverse,
    		zReverse: _zReverse,
    		rReverse: _rReverse,
    		xPadding: _xPadding,
    		yPadding: _yPadding,
    		zPadding: _zPadding,
    		rPadding: _rPadding,
    		padding: padding_d,
    		flatData: _flatData,
    		extents: extents_d,
    		xDomain: xDomain_d,
    		yDomain: yDomain_d,
    		zDomain: zDomain_d,
    		rDomain: rDomain_d,
    		xRange: xRange_d,
    		yRange: yRange_d,
    		zRange: zRange_d,
    		rRange: rRange_d,
    		config: _config,
    		xScale: xScale_d,
    		xGet: xGet_d,
    		yScale: yScale_d,
    		yGet: yGet_d,
    		zScale: zScale_d,
    		zGet: zGet_d,
    		rScale: rScale_d,
    		rGet: rGet_d
    	});

    	return [
    		containerWidth,
    		containerHeight,
    		element,
    		ssr,
    		pointerEvents,
    		position,
    		$width_d,
    		$height_d,
    		$aspectRatio_d,
    		$_containerWidth,
    		$_containerHeight,
    		_containerWidth,
    		_containerHeight,
    		width_d,
    		height_d,
    		aspectRatio_d,
    		percentRange,
    		width,
    		height,
    		x,
    		y,
    		z,
    		r,
    		custom,
    		data,
    		xDomain,
    		yDomain,
    		zDomain,
    		rDomain,
    		xNice,
    		yNice,
    		zNice,
    		rNice,
    		xReverse,
    		yReverse,
    		zReverse,
    		rReverse,
    		xPadding,
    		yPadding,
    		zPadding,
    		rPadding,
    		xScale,
    		yScale,
    		zScale,
    		rScale,
    		xRange,
    		yRange,
    		zRange,
    		rRange,
    		padding,
    		extents,
    		flatData,
    		context,
    		$$scope,
    		slots,
    		div_binding,
    		div_elementresize_handler
    	];
    }

    class LayerCake extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				ssr: 3,
    				pointerEvents: 4,
    				position: 5,
    				percentRange: 16,
    				width: 17,
    				height: 18,
    				containerWidth: 0,
    				containerHeight: 1,
    				element: 2,
    				x: 19,
    				y: 20,
    				z: 21,
    				r: 22,
    				custom: 23,
    				data: 24,
    				xDomain: 25,
    				yDomain: 26,
    				zDomain: 27,
    				rDomain: 28,
    				xNice: 29,
    				yNice: 30,
    				zNice: 31,
    				rNice: 32,
    				xReverse: 33,
    				yReverse: 34,
    				zReverse: 35,
    				rReverse: 36,
    				xPadding: 37,
    				yPadding: 38,
    				zPadding: 39,
    				rPadding: 40,
    				xScale: 41,
    				yScale: 42,
    				zScale: 43,
    				rScale: 44,
    				xRange: 45,
    				yRange: 46,
    				zRange: 47,
    				rRange: 48,
    				padding: 49,
    				extents: 50,
    				flatData: 51
    			},
    			null,
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayerCake",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get ssr() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ssr(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get percentRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set percentRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerWidth() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerWidth(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerHeight() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerHeight(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get z() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set z(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get r() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set r(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get custom() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set custom(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get extents() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set extents(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flatData() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flatData(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/layercake/src/layouts/Svg.svelte generated by Svelte v3.42.1 */
    const file$3 = "node_modules/layercake/src/layouts/Svg.svelte";
    const get_default_slot_changes = dirty => ({ element: dirty & /*element*/ 1 });
    const get_default_slot_context = ctx => ({ element: /*element*/ ctx[0] });
    const get_defs_slot_changes = dirty => ({ element: dirty & /*element*/ 1 });
    const get_defs_slot_context = ctx => ({ element: /*element*/ ctx[0] });

    function create_fragment$3(ctx) {
    	let svg;
    	let defs;
    	let g;
    	let g_transform_value;
    	let svg_style_value;
    	let current;
    	const defs_slot_template = /*#slots*/ ctx[13].defs;
    	const defs_slot = create_slot(defs_slot_template, ctx, /*$$scope*/ ctx[12], get_defs_slot_context);
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			if (defs_slot) defs_slot.c();
    			g = svg_element("g");
    			if (default_slot) default_slot.c();
    			add_location(defs, file$3, 24, 1, 652);
    			attr_dev(g, "class", "layercake-layout-svg_g");
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*$padding*/ ctx[6].left + ", " + /*$padding*/ ctx[6].top + ")");
    			add_location(g, file$3, 27, 1, 697);
    			attr_dev(svg, "class", "layercake-layout-svg svelte-u84d8d");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			attr_dev(svg, "width", /*$containerWidth*/ ctx[4]);
    			attr_dev(svg, "height", /*$containerHeight*/ ctx[5]);
    			attr_dev(svg, "style", svg_style_value = "" + (/*zIndexStyle*/ ctx[2] + /*pointerEventsStyle*/ ctx[3]));
    			add_location(svg, file$3, 16, 0, 487);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, defs);

    			if (defs_slot) {
    				defs_slot.m(defs, null);
    			}

    			append_dev(svg, g);

    			if (default_slot) {
    				default_slot.m(g, null);
    			}

    			/*svg_binding*/ ctx[14](svg);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (defs_slot) {
    				if (defs_slot.p && (!current || dirty & /*$$scope, element*/ 4097)) {
    					update_slot_base(
    						defs_slot,
    						defs_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(defs_slot_template, /*$$scope*/ ctx[12], dirty, get_defs_slot_changes),
    						get_defs_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, element*/ 4097)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*$padding*/ 64 && g_transform_value !== (g_transform_value = "translate(" + /*$padding*/ ctx[6].left + ", " + /*$padding*/ ctx[6].top + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}

    			if (!current || dirty & /*viewBox*/ 2) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			}

    			if (!current || dirty & /*$containerWidth*/ 16) {
    				attr_dev(svg, "width", /*$containerWidth*/ ctx[4]);
    			}

    			if (!current || dirty & /*$containerHeight*/ 32) {
    				attr_dev(svg, "height", /*$containerHeight*/ ctx[5]);
    			}

    			if (!current || dirty & /*zIndexStyle, pointerEventsStyle*/ 12 && svg_style_value !== (svg_style_value = "" + (/*zIndexStyle*/ ctx[2] + /*pointerEventsStyle*/ ctx[3]))) {
    				attr_dev(svg, "style", svg_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(defs_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(defs_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (defs_slot) defs_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			/*svg_binding*/ ctx[14](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $containerWidth;
    	let $containerHeight;
    	let $padding;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Svg', slots, ['defs','default']);
    	let { element = undefined } = $$props;
    	let { viewBox = undefined } = $$props;
    	let { zIndex = undefined } = $$props;
    	let { pointerEvents = undefined } = $$props;
    	let zIndexStyle = '';
    	let pointerEventsStyle = '';
    	const { containerWidth, containerHeight, padding } = getContext('LayerCake');
    	validate_store(containerWidth, 'containerWidth');
    	component_subscribe($$self, containerWidth, value => $$invalidate(4, $containerWidth = value));
    	validate_store(containerHeight, 'containerHeight');
    	component_subscribe($$self, containerHeight, value => $$invalidate(5, $containerHeight = value));
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(6, $padding = value));
    	const writable_props = ['element', 'viewBox', 'zIndex', 'pointerEvents'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Svg> was created with unknown prop '${key}'`);
    	});

    	function svg_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    		if ('zIndex' in $$props) $$invalidate(10, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(11, pointerEvents = $$props.pointerEvents);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		element,
    		viewBox,
    		zIndex,
    		pointerEvents,
    		zIndexStyle,
    		pointerEventsStyle,
    		containerWidth,
    		containerHeight,
    		padding,
    		$containerWidth,
    		$containerHeight,
    		$padding
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    		if ('zIndex' in $$props) $$invalidate(10, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(11, pointerEvents = $$props.pointerEvents);
    		if ('zIndexStyle' in $$props) $$invalidate(2, zIndexStyle = $$props.zIndexStyle);
    		if ('pointerEventsStyle' in $$props) $$invalidate(3, pointerEventsStyle = $$props.pointerEventsStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*zIndex*/ 1024) {
    			$$invalidate(2, zIndexStyle = typeof zIndex !== 'undefined'
    			? `z-index:${zIndex};`
    			: '');
    		}

    		if ($$self.$$.dirty & /*pointerEvents*/ 2048) {
    			$$invalidate(3, pointerEventsStyle = pointerEvents === false ? 'pointer-events:none;' : '');
    		}
    	};

    	return [
    		element,
    		viewBox,
    		zIndexStyle,
    		pointerEventsStyle,
    		$containerWidth,
    		$containerHeight,
    		$padding,
    		containerWidth,
    		containerHeight,
    		padding,
    		zIndex,
    		pointerEvents,
    		$$scope,
    		slots,
    		svg_binding
    	];
    }

    class Svg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			element: 0,
    			viewBox: 1,
    			zIndex: 10,
    			pointerEvents: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Svg",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get element() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zIndex() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zIndex(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var nodes = [
    	{
    		id: "Business Taxes",
    		definition: "Taxes collected from businesses, including gross receipts taxes, commercial rent taxes, administrative office taxes and others. ",
    		category: "revenues"
    	},
    	{
    		id: "Charges for Services",
    		definition: "Fees paid by residents and organizations for city services, ranging from hospital fees and building inspections to street cleaning. ",
    		category: "revenues"
    	},
    	{
    		id: "Contributions Ret/HSS/HlthCare",
    		definition: "Employee contributions to retirement and healthcare funds.",
    		category: "revenues"
    	},
    	{
    		id: "Expenditure Recovery",
    		definition: "Revenue from services performed by city departments for other city departments.",
    		category: "revenues"
    	},
    	{
    		id: "Fines, Forfeiture, & Penalties",
    		definition: "Fines and penalties charged to residents, businesses and organizations. ",
    		category: "revenues"
    	},
    	{
    		id: "Interest & Investment Income",
    		definition: "Interest earned and other value appreciation of funds loaned or invested. ",
    		category: "revenues"
    	},
    	{
    		id: "Intergovernmental: Federal",
    		definition: "Funding from the U.S. federal government. ",
    		category: "revenues"
    	},
    	{
    		id: "Intergovernmental: Other",
    		definition: "Funding from other government entities. ",
    		category: "revenues"
    	},
    	{
    		id: "Intergovernmental: State",
    		definition: "Funding from the state of California. ",
    		category: "revenues"
    	},
    	{
    		id: "Intrafund Transfers In",
    		definition: "Revenue transfers between city funds.",
    		category: "revenues"
    	},
    	{
    		id: "Licenses, Permits,& Franchises",
    		definition: "Revenue from licenses and permits issued by the city. ",
    		category: "revenues"
    	},
    	{
    		id: "Other Financing Sources",
    		definition: "Miscellaneous financing",
    		category: "revenues"
    	},
    	{
    		id: "Other Local Taxes",
    		definition: "Sales taxes, hotel taxes, real estate transfer taxes and other assorted local taxes. ",
    		category: "revenues"
    	},
    	{
    		id: "Other Revenues",
    		definition: "Miscellaneous revenue",
    		category: "revenues"
    	},
    	{
    		id: "Property Taxes",
    		definition: "Taxes paid on property that is proportional to the property's assessed value.",
    		category: "revenues"
    	},
    	{
    		id: "Rents & Concessions",
    		definition: "Rental income and seller concessions for properties owned by the city. ",
    		category: "revenues"
    	},
    	{
    		id: "Transfers In",
    		definition: "Payments between city departments for services rendered. ",
    		category: "revenues"
    	},
    	{
    		id: "Unappropriated Fund Balance",
    		definition: "Reserves from a prior year that are now being used as a source of funds.",
    		category: "revenues"
    	},
    	{
    		id: "Capital Projects Funds",
    		definition: "Funds used for the acquisition or construction of major capital facilities",
    		category: "funds"
    	},
    	{
    		id: "Component Units",
    		definition: "Entities that are legally separate but financially accountable to the city, such as the San Francisco Redevelopment Agency.",
    		category: "funds"
    	},
    	{
    		id: "Debt Service Funds",
    		definition: "Funds used for long-term principal obligation, interest and related debt costs.",
    		category: "funds"
    	},
    	{
    		id: "Enterprise Funds",
    		definition: "Funds from city and county agencies, such as the airport and ports, that earn revenue much like a business enterprise. ",
    		category: "funds"
    	},
    	{
    		id: "General Fund",
    		definition: "The general operating fund for the city. ",
    		category: "funds"
    	},
    	{
    		id: "Internal Service Funds",
    		definition: "Funds for goods and services provided by one department or agency to another on a cost-reimbursement basis, such as the Health Service System.",
    		category: "funds"
    	},
    	{
    		id: "Investment Trust Fund",
    		definition: "A fiduciary fund used to report external investments.",
    		category: "funds"
    	},
    	{
    		id: "Pension, Other Employee and Ot",
    		definition: "Pension and employee benefit trust funds. ",
    		category: "funds"
    	},
    	{
    		id: "Permanent Fund",
    		definition: "Legally restricted funds to the extent that only\nearnings, and not principal, may be used for an ongoing purpose.",
    		category: "funds"
    	},
    	{
    		id: "Private Purpose Trust Fund",
    		definition: "Funds used for the benefit of individuals, private organizations, or other governments.",
    		category: "funds"
    	},
    	{
    		id: "Special Revenue Funds",
    		definition: "Proceeds of specific revenue sources (other than expendable trusts or major capital projects) that are legally restricted for specified purposes.",
    		category: "funds"
    	},
    	{
    		id: "Community Health",
    		definition: "Public health operations, services and infrastructure",
    		category: "spending"
    	},
    	{
    		id: "Culture & Recreation",
    		definition: "Parks, museums, libraries and other culture and recreation. ",
    		category: "spending"
    	},
    	{
    		id: "General Administration & Finance",
    		definition: "General administration of the city, such as human resources, finance, Mayor's Office and Board of Supervisors.",
    		category: "spending"
    	},
    	{
    		id: "Human Welfare & Neighborhood Development",
    		definition: "Social services and benefits for individuals, families and communities. ",
    		category: "spending"
    	},
    	{
    		id: "Public Protection",
    		definition: "Public safety spending, such as police and fire. ",
    		category: "spending"
    	},
    	{
    		id: "Public Works, Transportation & Commerce",
    		definition: "Transit, utilities, city maintenance and economic development.",
    		category: "spending"
    	},
    	{
    		id: "General City Responsibilities",
    		definition: "Spending not directly attributable to one city department, or that is citywide in nature.",
    		category: "spending"
    	},
    	{
    		id: "Transfer Adjustment-Source",
    		definition: "",
    		category: "spending"
    	}
    ];
    var links = [
    	{
    		source: "Business Taxes",
    		target: "General Fund",
    		value: 957140000
    	},
    	{
    		source: "Business Taxes",
    		target: "Special Revenue Funds",
    		value: 556670000
    	},
    	{
    		source: "Charges for Services",
    		target: "Component Units",
    		value: 311000
    	},
    	{
    		source: "Charges for Services",
    		target: "Enterprise Funds",
    		value: 3446860624
    	},
    	{
    		source: "Charges for Services",
    		target: "General Fund",
    		value: 255110935
    	},
    	{
    		source: "Charges for Services",
    		target: "Internal Service Funds",
    		value: 632609
    	},
    	{
    		source: "Charges for Services",
    		target: "Private Purpose Trust Fund",
    		value: 2953402
    	},
    	{
    		source: "Charges for Services",
    		target: "Special Revenue Funds",
    		value: 116401214
    	},
    	{
    		source: "Contributions Ret/HSS/HlthCare",
    		target: "Pension, Other Employee and Ot",
    		value: 39523718
    	},
    	{
    		source: "Expenditure Recovery",
    		target: "Component Units",
    		value: 100000
    	},
    	{
    		source: "Expenditure Recovery",
    		target: "Enterprise Funds",
    		value: 160373729
    	},
    	{
    		source: "Expenditure Recovery",
    		target: "General Fund",
    		value: 594421165
    	},
    	{
    		source: "Expenditure Recovery",
    		target: "Internal Service Funds",
    		value: 169009801
    	},
    	{
    		source: "Expenditure Recovery",
    		target: "Pension, Other Employee and Ot",
    		value: 110000
    	},
    	{
    		source: "Expenditure Recovery",
    		target: "Special Revenue Funds",
    		value: 266192373
    	},
    	{
    		source: "Fines, Forfeiture, & Penalties",
    		target: "Debt Service Funds",
    		value: 18406400
    	},
    	{
    		source: "Fines, Forfeiture, & Penalties",
    		target: "Enterprise Funds",
    		value: 113250159
    	},
    	{
    		source: "Fines, Forfeiture, & Penalties",
    		target: "General Fund",
    		value: 4034532
    	},
    	{
    		source: "Fines, Forfeiture, & Penalties",
    		target: "Special Revenue Funds",
    		value: 11335028
    	},
    	{
    		source: "Interest & Investment Income",
    		target: "Capital Projects Funds",
    		value: 2292978
    	},
    	{
    		source: "Interest & Investment Income",
    		target: "Enterprise Funds",
    		value: 32394612
    	},
    	{
    		source: "Interest & Investment Income",
    		target: "General Fund",
    		value: 36247329
    	},
    	{
    		source: "Interest & Investment Income",
    		target: "Investment Trust Fund",
    		value: 81000
    	},
    	{
    		source: "Interest & Investment Income",
    		target: "Pension, Other Employee and Ot",
    		value: 400000
    	},
    	{
    		source: "Interest & Investment Income",
    		target: "Permanent Fund",
    		value: 15000
    	},
    	{
    		source: "Interest & Investment Income",
    		target: "Private Purpose Trust Fund",
    		value: 419471
    	},
    	{
    		source: "Interest & Investment Income",
    		target: "Special Revenue Funds",
    		value: 4086812
    	},
    	{
    		source: "Intergovernmental: Federal",
    		target: "Enterprise Funds",
    		value: 309355357
    	},
    	{
    		source: "Intergovernmental: Federal",
    		target: "General Fund",
    		value: 359612475
    	},
    	{
    		source: "Intergovernmental: Federal",
    		target: "Private Purpose Trust Fund",
    		value: 2920972
    	},
    	{
    		source: "Intergovernmental: Federal",
    		target: "Special Revenue Funds",
    		value: 247127333
    	},
    	{
    		source: "Intergovernmental: Other",
    		target: "Capital Projects Funds",
    		value: 630000
    	},
    	{
    		source: "Intergovernmental: Other",
    		target: "Enterprise Funds",
    		value: 126727381
    	},
    	{
    		source: "Intergovernmental: Other",
    		target: "General Fund",
    		value: 2781041
    	},
    	{
    		source: "Intergovernmental: Other",
    		target: "Internal Service Funds",
    		value: 41126
    	},
    	{
    		source: "Intergovernmental: Other",
    		target: "Special Revenue Funds",
    		value: 4021966
    	},
    	{
    		source: "Intergovernmental: State",
    		target: "Capital Projects Funds",
    		value: 207000
    	},
    	{
    		source: "Intergovernmental: State",
    		target: "Debt Service Funds",
    		value: 800000
    	},
    	{
    		source: "Intergovernmental: State",
    		target: "Enterprise Funds",
    		value: 126028045
    	},
    	{
    		source: "Intergovernmental: State",
    		target: "General Fund",
    		value: 854372018
    	},
    	{
    		source: "Intergovernmental: State",
    		target: "Investment Trust Fund",
    		value: 99157603
    	},
    	{
    		source: "Intergovernmental: State",
    		target: "Special Revenue Funds",
    		value: 177712608
    	},
    	{
    		source: "Intrafund Transfers In",
    		target: "Enterprise Funds",
    		value: 678950200
    	},
    	{
    		source: "Intrafund Transfers In",
    		target: "General Fund",
    		value: 743227512
    	},
    	{
    		source: "Intrafund Transfers In",
    		target: "Internal Service Funds",
    		value: 1200000
    	},
    	{
    		source: "Intrafund Transfers In",
    		target: "Special Revenue Funds",
    		value: 57522118
    	},
    	{
    		source: "Licenses, Permits,& Franchises",
    		target: "Enterprise Funds",
    		value: 19412844
    	},
    	{
    		source: "Licenses, Permits,& Franchises",
    		target: "General Fund",
    		value: 27944010
    	},
    	{
    		source: "Licenses, Permits,& Franchises",
    		target: "Special Revenue Funds",
    		value: 9233752
    	},
    	{
    		source: "Other Financing Sources",
    		target: "Capital Projects Funds",
    		value: 67500000
    	},
    	{
    		source: "Other Financing Sources",
    		target: "Private Purpose Trust Fund",
    		value: 9956582
    	},
    	{
    		source: "Other Financing Sources",
    		target: "Special Revenue Funds",
    		value: 2400683
    	},
    	{
    		source: "Other Local Taxes",
    		target: "General Fund",
    		value: 777750000
    	},
    	{
    		source: "Other Local Taxes",
    		target: "Private Purpose Trust Fund",
    		value: 4506500
    	},
    	{
    		source: "Other Local Taxes",
    		target: "Special Revenue Funds",
    		value: 18581031
    	},
    	{
    		source: "Other Revenues",
    		target: "Component Units",
    		value: 15254338
    	},
    	{
    		source: "Other Revenues",
    		target: "Debt Service Funds",
    		value: 7660481
    	},
    	{
    		source: "Other Revenues",
    		target: "Enterprise Funds",
    		value: 181738663
    	},
    	{
    		source: "Other Revenues",
    		target: "General Fund",
    		value: 24237535
    	},
    	{
    		source: "Other Revenues",
    		target: "Permanent Fund",
    		value: 15000
    	},
    	{
    		source: "Other Revenues",
    		target: "Private Purpose Trust Fund",
    		value: 23816299
    	},
    	{
    		source: "Other Revenues",
    		target: "Special Revenue Funds",
    		value: 34814290
    	},
    	{
    		source: "Property Taxes",
    		target: "Debt Service Funds",
    		value: 350355572
    	},
    	{
    		source: "Property Taxes",
    		target: "General Fund",
    		value: 2115600000
    	},
    	{
    		source: "Property Taxes",
    		target: "Private Purpose Trust Fund",
    		value: 144882894
    	},
    	{
    		source: "Property Taxes",
    		target: "Special Revenue Funds",
    		value: 248134000
    	},
    	{
    		source: "Rents & Concessions",
    		target: "Component Units",
    		value: 11250000
    	},
    	{
    		source: "Rents & Concessions",
    		target: "Enterprise Funds",
    		value: 391890227
    	},
    	{
    		source: "Rents & Concessions",
    		target: "General Fund",
    		value: 11728090
    	},
    	{
    		source: "Rents & Concessions",
    		target: "Internal Service Funds",
    		value: 528265
    	},
    	{
    		source: "Rents & Concessions",
    		target: "Permanent Fund",
    		value: 22500
    	},
    	{
    		source: "Rents & Concessions",
    		target: "Private Purpose Trust Fund",
    		value: 479689
    	},
    	{
    		source: "Rents & Concessions",
    		target: "Special Revenue Funds",
    		value: 39984064
    	},
    	{
    		source: "Component Units",
    		target: "Transfer Adjustment-Source",
    		value: 100000
    	},
    	{
    		source: "Debt Service Funds",
    		target: "Transfer Adjustment-Source",
    		value: 2250000
    	},
    	{
    		source: "Enterprise Funds",
    		target: "Transfer Adjustment-Source",
    		value: 1201170404
    	},
    	{
    		source: "General Fund",
    		target: "Transfer Adjustment-Source",
    		value: 1495977696
    	},
    	{
    		source: "Internal Service Funds",
    		target: "Transfer Adjustment-Source",
    		value: 170709801
    	},
    	{
    		source: "Pension, Other Employee and Ot",
    		target: "Transfer Adjustment-Source",
    		value: 110000
    	},
    	{
    		source: "Special Revenue Funds",
    		target: "Transfer Adjustment-Source",
    		value: 518051639
    	},
    	{
    		source: "Transfers In",
    		target: "Debt Service Funds",
    		value: 2250000
    	},
    	{
    		source: "Transfers In",
    		target: "Enterprise Funds",
    		value: 361846475
    	},
    	{
    		source: "Transfers In",
    		target: "General Fund",
    		value: 158329019
    	},
    	{
    		source: "Transfers In",
    		target: "Internal Service Funds",
    		value: 500000
    	},
    	{
    		source: "Transfers In",
    		target: "Special Revenue Funds",
    		value: 194337148
    	},
    	{
    		source: "Unappropriated Fund Balance",
    		target: "Capital Projects Funds",
    		value: 3000000
    	},
    	{
    		source: "Unappropriated Fund Balance",
    		target: "Enterprise Funds",
    		value: 100150384
    	},
    	{
    		source: "Unappropriated Fund Balance",
    		target: "General Fund",
    		value: 778545814
    	},
    	{
    		source: "Unappropriated Fund Balance",
    		target: "Internal Service Funds",
    		value: 3380521
    	},
    	{
    		source: "Unappropriated Fund Balance",
    		target: "Permanent Fund",
    		value: 62500
    	},
    	{
    		source: "Unappropriated Fund Balance",
    		target: "Private Purpose Trust Fund",
    		value: 30810073
    	},
    	{
    		source: "Unappropriated Fund Balance",
    		target: "Special Revenue Funds",
    		value: 203005647
    	},
    	{
    		source: "Capital Projects Funds",
    		target: "Community Health",
    		value: 10100000
    	},
    	{
    		source: "Capital Projects Funds",
    		target: "Culture & Recreation",
    		value: 6229978
    	},
    	{
    		source: "Capital Projects Funds",
    		target: "General Administration & Finance",
    		value: 36443000
    	},
    	{
    		source: "Capital Projects Funds",
    		target: "Human Welfare & Neighborhood Development",
    		value: 2000000
    	},
    	{
    		source: "Capital Projects Funds",
    		target: "Public Protection",
    		value: 9857000
    	},
    	{
    		source: "Capital Projects Funds",
    		target: "Public Works, Transportation & Commerce",
    		value: 9000000
    	},
    	{
    		source: "Component Units",
    		target: "General Administration & Finance",
    		value: 26815338
    	},
    	{
    		source: "Debt Service Funds",
    		target: "General City Responsibilities",
    		value: 379472453
    	},
    	{
    		source: "Enterprise Funds",
    		target: "Community Health",
    		value: 1383578784
    	},
    	{
    		source: "Enterprise Funds",
    		target: "Public Protection",
    		value: 102746326
    	},
    	{
    		source: "Enterprise Funds",
    		target: "Public Works, Transportation & Commerce",
    		value: 3978424335
    	},
    	{
    		source: "General Fund",
    		target: "Community Health",
    		value: 1056458931
    	},
    	{
    		source: "General Fund",
    		target: "Culture & Recreation",
    		value: 220866400
    	},
    	{
    		source: "General Fund",
    		target: "General Administration & Finance",
    		value: 497915463
    	},
    	{
    		source: "General Fund",
    		target: "General City Responsibilities",
    		value: 251835451
    	},
    	{
    		source: "General Fund",
    		target: "Human Welfare & Neighborhood Development",
    		value: 1418405892
    	},
    	{
    		source: "General Fund",
    		target: "Public Protection",
    		value: 1505148517
    	},
    	{
    		source: "General Fund",
    		target: "Public Works, Transportation & Commerce",
    		value: 236525404
    	},
    	{
    		source: "Internal Service Funds",
    		target: "General Administration & Finance",
    		value: 5082521
    	},
    	{
    		source: "Investment Trust Fund",
    		target: "Public Protection",
    		value: 99238603
    	},
    	{
    		source: "Pension, Other Employee and Ot",
    		target: "General Administration & Finance",
    		value: 39923718
    	},
    	{
    		source: "Permanent Fund",
    		target: "Culture & Recreation",
    		value: 115000
    	},
    	{
    		source: "Private Purpose Trust Fund",
    		target: "Human Welfare & Neighborhood Development",
    		value: 220745882
    	},
    	{
    		source: "Special Revenue Funds",
    		target: "Community Health",
    		value: 314610473
    	},
    	{
    		source: "Special Revenue Funds",
    		target: "Culture & Recreation",
    		value: 300116553
    	},
    	{
    		source: "Special Revenue Funds",
    		target: "General Administration & Finance",
    		value: 231257121
    	},
    	{
    		source: "Special Revenue Funds",
    		target: "General City Responsibilities",
    		value: 6939017
    	},
    	{
    		source: "Special Revenue Funds",
    		target: "Human Welfare & Neighborhood Development",
    		value: 947244265
    	},
    	{
    		source: "Special Revenue Funds",
    		target: "Public Protection",
    		value: 76633878
    	},
    	{
    		source: "Special Revenue Funds",
    		target: "Public Works, Transportation & Commerce",
    		value: 194963693
    	}
    ];
    var data = {
    	nodes: nodes,
    	links: links
    };

    var xhtml$1 = "http://www.w3.org/1999/xhtml";

    var namespaces$1 = {
      svg: "http://www.w3.org/2000/svg",
      xhtml: xhtml$1,
      xlink: "http://www.w3.org/1999/xlink",
      xml: "http://www.w3.org/XML/1998/namespace",
      xmlns: "http://www.w3.org/2000/xmlns/"
    };

    function namespace$1(name) {
      var prefix = name += "", i = prefix.indexOf(":");
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return namespaces$1.hasOwnProperty(prefix) ? {space: namespaces$1[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
    }

    function creatorInherit$1(name) {
      return function() {
        var document = this.ownerDocument,
            uri = this.namespaceURI;
        return uri === xhtml$1 && document.documentElement.namespaceURI === xhtml$1
            ? document.createElement(name)
            : document.createElementNS(uri, name);
      };
    }

    function creatorFixed$1(fullname) {
      return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
      };
    }

    function creator$1(name) {
      var fullname = namespace$1(name);
      return (fullname.local
          ? creatorFixed$1
          : creatorInherit$1)(fullname);
    }

    function none$1() {}

    function selector$1(selector) {
      return selector == null ? none$1 : function() {
        return this.querySelector(selector);
      };
    }

    function selection_select$1(select) {
      if (typeof select !== "function") select = selector$1(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
          }
        }
      }

      return new Selection$1(subgroups, this._parents);
    }

    // Given something array like (or null), returns something that is strictly an
    // array. This is used to ensure that array-like objects passed to d3.selectAll
    // or selection.selectAll are converted into proper arrays when creating a
    // selection; we don’t ever want to create a selection backed by a live
    // HTMLCollection or NodeList. However, note that selection.selectAll will use a
    // static NodeList as a group, since it safely derived from querySelectorAll.
    function array(x) {
      return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
    }

    function empty$1() {
      return [];
    }

    function selectorAll$1(selector) {
      return selector == null ? empty$1 : function() {
        return this.querySelectorAll(selector);
      };
    }

    function arrayAll(select) {
      return function() {
        return array(select.apply(this, arguments));
      };
    }

    function selection_selectAll$1(select) {
      if (typeof select === "function") select = arrayAll(select);
      else select = selectorAll$1(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            subgroups.push(select.call(node, node.__data__, i, group));
            parents.push(node);
          }
        }
      }

      return new Selection$1(subgroups, parents);
    }

    function matcher$1(selector) {
      return function() {
        return this.matches(selector);
      };
    }

    function childMatcher(selector) {
      return function(node) {
        return node.matches(selector);
      };
    }

    var find$1 = Array.prototype.find;

    function childFind(match) {
      return function() {
        return find$1.call(this.children, match);
      };
    }

    function childFirst() {
      return this.firstElementChild;
    }

    function selection_selectChild(match) {
      return this.select(match == null ? childFirst
          : childFind(typeof match === "function" ? match : childMatcher(match)));
    }

    var filter = Array.prototype.filter;

    function children() {
      return Array.from(this.children);
    }

    function childrenFilter(match) {
      return function() {
        return filter.call(this.children, match);
      };
    }

    function selection_selectChildren(match) {
      return this.selectAll(match == null ? children
          : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
    }

    function selection_filter$1(match) {
      if (typeof match !== "function") match = matcher$1(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Selection$1(subgroups, this._parents);
    }

    function sparse$1(update) {
      return new Array(update.length);
    }

    function selection_enter$1() {
      return new Selection$1(this._enter || this._groups.map(sparse$1), this._parents);
    }

    function EnterNode$1(parent, datum) {
      this.ownerDocument = parent.ownerDocument;
      this.namespaceURI = parent.namespaceURI;
      this._next = null;
      this._parent = parent;
      this.__data__ = datum;
    }

    EnterNode$1.prototype = {
      constructor: EnterNode$1,
      appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
      insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
      querySelector: function(selector) { return this._parent.querySelector(selector); },
      querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
    };

    function constant$3(x) {
      return function() {
        return x;
      };
    }

    function bindIndex$1(parent, group, enter, update, exit, data) {
      var i = 0,
          node,
          groupLength = group.length,
          dataLength = data.length;

      // Put any non-null nodes that fit into update.
      // Put any null nodes into enter.
      // Put any remaining data into enter.
      for (; i < dataLength; ++i) {
        if (node = group[i]) {
          node.__data__ = data[i];
          update[i] = node;
        } else {
          enter[i] = new EnterNode$1(parent, data[i]);
        }
      }

      // Put any non-null nodes that don’t fit into exit.
      for (; i < groupLength; ++i) {
        if (node = group[i]) {
          exit[i] = node;
        }
      }
    }

    function bindKey$1(parent, group, enter, update, exit, data, key) {
      var i,
          node,
          nodeByKeyValue = new Map,
          groupLength = group.length,
          dataLength = data.length,
          keyValues = new Array(groupLength),
          keyValue;

      // Compute the key for each node.
      // If multiple nodes have the same key, the duplicates are added to exit.
      for (i = 0; i < groupLength; ++i) {
        if (node = group[i]) {
          keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
          if (nodeByKeyValue.has(keyValue)) {
            exit[i] = node;
          } else {
            nodeByKeyValue.set(keyValue, node);
          }
        }
      }

      // Compute the key for each datum.
      // If there a node associated with this key, join and add it to update.
      // If there is not (or the key is a duplicate), add it to enter.
      for (i = 0; i < dataLength; ++i) {
        keyValue = key.call(parent, data[i], i, data) + "";
        if (node = nodeByKeyValue.get(keyValue)) {
          update[i] = node;
          node.__data__ = data[i];
          nodeByKeyValue.delete(keyValue);
        } else {
          enter[i] = new EnterNode$1(parent, data[i]);
        }
      }

      // Add any remaining nodes that were not bound to data to exit.
      for (i = 0; i < groupLength; ++i) {
        if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
          exit[i] = node;
        }
      }
    }

    function datum(node) {
      return node.__data__;
    }

    function selection_data$1(value, key) {
      if (!arguments.length) return Array.from(this, datum);

      var bind = key ? bindKey$1 : bindIndex$1,
          parents = this._parents,
          groups = this._groups;

      if (typeof value !== "function") value = constant$3(value);

      for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
        var parent = parents[j],
            group = groups[j],
            groupLength = group.length,
            data = arraylike(value.call(parent, parent && parent.__data__, j, parents)),
            dataLength = data.length,
            enterGroup = enter[j] = new Array(dataLength),
            updateGroup = update[j] = new Array(dataLength),
            exitGroup = exit[j] = new Array(groupLength);

        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
          if (previous = enterGroup[i0]) {
            if (i0 >= i1) i1 = i0 + 1;
            while (!(next = updateGroup[i1]) && ++i1 < dataLength);
            previous._next = next || null;
          }
        }
      }

      update = new Selection$1(update, parents);
      update._enter = enter;
      update._exit = exit;
      return update;
    }

    // Given some data, this returns an array-like view of it: an object that
    // exposes a length property and allows numeric indexing. Note that unlike
    // selectAll, this isn’t worried about “live” collections because the resulting
    // array will only be used briefly while data is being bound. (It is possible to
    // cause the data to change while iterating by using a key function, but please
    // don’t; we’d rather avoid a gratuitous copy.)
    function arraylike(data) {
      return typeof data === "object" && "length" in data
        ? data // Array, TypedArray, NodeList, array-like
        : Array.from(data); // Map, Set, iterable, string, or anything else
    }

    function selection_exit$1() {
      return new Selection$1(this._exit || this._groups.map(sparse$1), this._parents);
    }

    function selection_join$1(onenter, onupdate, onexit) {
      var enter = this.enter(), update = this, exit = this.exit();
      if (typeof onenter === "function") {
        enter = onenter(enter);
        if (enter) enter = enter.selection();
      } else {
        enter = enter.append(onenter + "");
      }
      if (onupdate != null) {
        update = onupdate(update);
        if (update) update = update.selection();
      }
      if (onexit == null) exit.remove(); else onexit(exit);
      return enter && update ? enter.merge(update).order() : update;
    }

    function selection_merge$1(context) {
      var selection = context.selection ? context.selection() : context;

      for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Selection$1(merges, this._parents);
    }

    function selection_order$1() {

      for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
        for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
          if (node = group[i]) {
            if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
            next = node;
          }
        }
      }

      return this;
    }

    function selection_sort$1(compare) {
      if (!compare) compare = ascending$1;

      function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
      }

      for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            sortgroup[i] = node;
          }
        }
        sortgroup.sort(compareNode);
      }

      return new Selection$1(sortgroups, this._parents).order();
    }

    function ascending$1(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function selection_call$1() {
      var callback = arguments[0];
      arguments[0] = this;
      callback.apply(null, arguments);
      return this;
    }

    function selection_nodes$1() {
      return Array.from(this);
    }

    function selection_node$1() {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
          var node = group[i];
          if (node) return node;
        }
      }

      return null;
    }

    function selection_size$1() {
      let size = 0;
      for (const node of this) ++size; // eslint-disable-line no-unused-vars
      return size;
    }

    function selection_empty$1() {
      return !this.node();
    }

    function selection_each$1(callback) {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
      }

      return this;
    }

    function attrRemove$1(name) {
      return function() {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS$1(fullname) {
      return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant$1(name, value) {
      return function() {
        this.setAttribute(name, value);
      };
    }

    function attrConstantNS$1(fullname, value) {
      return function() {
        this.setAttributeNS(fullname.space, fullname.local, value);
      };
    }

    function attrFunction$1(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
      };
    }

    function attrFunctionNS$1(fullname, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
      };
    }

    function selection_attr$1(name, value) {
      var fullname = namespace$1(name);

      if (arguments.length < 2) {
        var node = this.node();
        return fullname.local
            ? node.getAttributeNS(fullname.space, fullname.local)
            : node.getAttribute(fullname);
      }

      return this.each((value == null
          ? (fullname.local ? attrRemoveNS$1 : attrRemove$1) : (typeof value === "function"
          ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)
          : (fullname.local ? attrConstantNS$1 : attrConstant$1)))(fullname, value));
    }

    function defaultView$1(node) {
      return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
          || (node.document && node) // node is a Window
          || node.defaultView; // node is a Document
    }

    function styleRemove$1(name) {
      return function() {
        this.style.removeProperty(name);
      };
    }

    function styleConstant$1(name, value, priority) {
      return function() {
        this.style.setProperty(name, value, priority);
      };
    }

    function styleFunction$1(name, value, priority) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
      };
    }

    function selection_style$1(name, value, priority) {
      return arguments.length > 1
          ? this.each((value == null
                ? styleRemove$1 : typeof value === "function"
                ? styleFunction$1
                : styleConstant$1)(name, value, priority == null ? "" : priority))
          : styleValue$1(this.node(), name);
    }

    function styleValue$1(node, name) {
      return node.style.getPropertyValue(name)
          || defaultView$1(node).getComputedStyle(node, null).getPropertyValue(name);
    }

    function propertyRemove$1(name) {
      return function() {
        delete this[name];
      };
    }

    function propertyConstant$1(name, value) {
      return function() {
        this[name] = value;
      };
    }

    function propertyFunction$1(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
      };
    }

    function selection_property$1(name, value) {
      return arguments.length > 1
          ? this.each((value == null
              ? propertyRemove$1 : typeof value === "function"
              ? propertyFunction$1
              : propertyConstant$1)(name, value))
          : this.node()[name];
    }

    function classArray$1(string) {
      return string.trim().split(/^|\s+/);
    }

    function classList$1(node) {
      return node.classList || new ClassList$1(node);
    }

    function ClassList$1(node) {
      this._node = node;
      this._names = classArray$1(node.getAttribute("class") || "");
    }

    ClassList$1.prototype = {
      add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
          this._names.push(name);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
          this._names.splice(i, 1);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      contains: function(name) {
        return this._names.indexOf(name) >= 0;
      }
    };

    function classedAdd$1(node, names) {
      var list = classList$1(node), i = -1, n = names.length;
      while (++i < n) list.add(names[i]);
    }

    function classedRemove$1(node, names) {
      var list = classList$1(node), i = -1, n = names.length;
      while (++i < n) list.remove(names[i]);
    }

    function classedTrue$1(names) {
      return function() {
        classedAdd$1(this, names);
      };
    }

    function classedFalse$1(names) {
      return function() {
        classedRemove$1(this, names);
      };
    }

    function classedFunction$1(names, value) {
      return function() {
        (value.apply(this, arguments) ? classedAdd$1 : classedRemove$1)(this, names);
      };
    }

    function selection_classed$1(name, value) {
      var names = classArray$1(name + "");

      if (arguments.length < 2) {
        var list = classList$1(this.node()), i = -1, n = names.length;
        while (++i < n) if (!list.contains(names[i])) return false;
        return true;
      }

      return this.each((typeof value === "function"
          ? classedFunction$1 : value
          ? classedTrue$1
          : classedFalse$1)(names, value));
    }

    function textRemove$1() {
      this.textContent = "";
    }

    function textConstant$1(value) {
      return function() {
        this.textContent = value;
      };
    }

    function textFunction$1(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
      };
    }

    function selection_text$1(value) {
      return arguments.length
          ? this.each(value == null
              ? textRemove$1 : (typeof value === "function"
              ? textFunction$1
              : textConstant$1)(value))
          : this.node().textContent;
    }

    function htmlRemove$1() {
      this.innerHTML = "";
    }

    function htmlConstant$1(value) {
      return function() {
        this.innerHTML = value;
      };
    }

    function htmlFunction$1(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
      };
    }

    function selection_html$1(value) {
      return arguments.length
          ? this.each(value == null
              ? htmlRemove$1 : (typeof value === "function"
              ? htmlFunction$1
              : htmlConstant$1)(value))
          : this.node().innerHTML;
    }

    function raise$1() {
      if (this.nextSibling) this.parentNode.appendChild(this);
    }

    function selection_raise$1() {
      return this.each(raise$1);
    }

    function lower$1() {
      if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
    }

    function selection_lower$1() {
      return this.each(lower$1);
    }

    function selection_append$1(name) {
      var create = typeof name === "function" ? name : creator$1(name);
      return this.select(function() {
        return this.appendChild(create.apply(this, arguments));
      });
    }

    function constantNull$1() {
      return null;
    }

    function selection_insert$1(name, before) {
      var create = typeof name === "function" ? name : creator$1(name),
          select = before == null ? constantNull$1 : typeof before === "function" ? before : selector$1(before);
      return this.select(function() {
        return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
      });
    }

    function remove$1() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    }

    function selection_remove$1() {
      return this.each(remove$1);
    }

    function selection_cloneShallow$1() {
      var clone = this.cloneNode(false), parent = this.parentNode;
      return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }

    function selection_cloneDeep$1() {
      var clone = this.cloneNode(true), parent = this.parentNode;
      return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }

    function selection_clone$1(deep) {
      return this.select(deep ? selection_cloneDeep$1 : selection_cloneShallow$1);
    }

    function selection_datum$1(value) {
      return arguments.length
          ? this.property("__data__", value)
          : this.node().__data__;
    }

    function contextListener$1(listener) {
      return function(event) {
        listener.call(this, event, this.__data__);
      };
    }

    function parseTypenames$1(typenames) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {type: t, name: name};
      });
    }

    function onRemove$1(typename) {
      return function() {
        var on = this.__on;
        if (!on) return;
        for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
          if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.options);
          } else {
            on[++i] = o;
          }
        }
        if (++i) on.length = i;
        else delete this.__on;
      };
    }

    function onAdd$1(typename, value, options) {
      return function() {
        var on = this.__on, o, listener = contextListener$1(value);
        if (on) for (var j = 0, m = on.length; j < m; ++j) {
          if ((o = on[j]).type === typename.type && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.options);
            this.addEventListener(o.type, o.listener = listener, o.options = options);
            o.value = value;
            return;
          }
        }
        this.addEventListener(typename.type, listener, options);
        o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
        if (!on) this.__on = [o];
        else on.push(o);
      };
    }

    function selection_on$1(typename, value, options) {
      var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

      if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
          for (i = 0, o = on[j]; i < n; ++i) {
            if ((t = typenames[i]).type === o.type && t.name === o.name) {
              return o.value;
            }
          }
        }
        return;
      }

      on = value ? onAdd$1 : onRemove$1;
      for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
      return this;
    }

    function dispatchEvent$1(node, type, params) {
      var window = defaultView$1(node),
          event = window.CustomEvent;

      if (typeof event === "function") {
        event = new event(type, params);
      } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
      }

      node.dispatchEvent(event);
    }

    function dispatchConstant$1(type, params) {
      return function() {
        return dispatchEvent$1(this, type, params);
      };
    }

    function dispatchFunction$1(type, params) {
      return function() {
        return dispatchEvent$1(this, type, params.apply(this, arguments));
      };
    }

    function selection_dispatch$1(type, params) {
      return this.each((typeof params === "function"
          ? dispatchFunction$1
          : dispatchConstant$1)(type, params));
    }

    function* selection_iterator() {
      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) yield node;
        }
      }
    }

    var root$1 = [null];

    function Selection$1(groups, parents) {
      this._groups = groups;
      this._parents = parents;
    }

    function selection_selection() {
      return this;
    }

    Selection$1.prototype = {
      constructor: Selection$1,
      select: selection_select$1,
      selectAll: selection_selectAll$1,
      selectChild: selection_selectChild,
      selectChildren: selection_selectChildren,
      filter: selection_filter$1,
      data: selection_data$1,
      enter: selection_enter$1,
      exit: selection_exit$1,
      join: selection_join$1,
      merge: selection_merge$1,
      selection: selection_selection,
      order: selection_order$1,
      sort: selection_sort$1,
      call: selection_call$1,
      nodes: selection_nodes$1,
      node: selection_node$1,
      size: selection_size$1,
      empty: selection_empty$1,
      each: selection_each$1,
      attr: selection_attr$1,
      style: selection_style$1,
      property: selection_property$1,
      classed: selection_classed$1,
      text: selection_text$1,
      html: selection_html$1,
      raise: selection_raise$1,
      lower: selection_lower$1,
      append: selection_append$1,
      insert: selection_insert$1,
      remove: selection_remove$1,
      clone: selection_clone$1,
      datum: selection_datum$1,
      on: selection_on$1,
      dispatch: selection_dispatch$1,
      [Symbol.iterator]: selection_iterator
    };

    function select$1(selector) {
      return typeof selector === "string"
          ? new Selection$1([[document.querySelector(selector)]], [document.documentElement])
          : new Selection$1([[selector]], root$1);
    }

    function selectAll$1(selector) {
      return typeof selector === "string"
          ? new Selection$1([document.querySelectorAll(selector)], [document.documentElement])
          : new Selection$1([array(selector)], root$1);
    }

    function max(values, valueof) {
      let max;
      if (valueof === undefined) {
        for (const value of values) {
          if (value != null
              && (max < value || (max === undefined && value >= value))) {
            max = value;
          }
        }
      } else {
        let index = -1;
        for (let value of values) {
          if ((value = valueof(value, ++index, values)) != null
              && (max < value || (max === undefined && value >= value))) {
            max = value;
          }
        }
      }
      return max;
    }

    function min(values, valueof) {
      let min;
      if (valueof === undefined) {
        for (const value of values) {
          if (value != null
              && (min > value || (min === undefined && value >= value))) {
            min = value;
          }
        }
      } else {
        let index = -1;
        for (let value of values) {
          if ((value = valueof(value, ++index, values)) != null
              && (min > value || (min === undefined && value >= value))) {
            min = value;
          }
        }
      }
      return min;
    }

    function sum(values, valueof) {
      let sum = 0;
      if (valueof === undefined) {
        for (let value of values) {
          if (value = +value) {
            sum += value;
          }
        }
      } else {
        let index = -1;
        for (let value of values) {
          if (value = +valueof(value, ++index, values)) {
            sum += value;
          }
        }
      }
      return sum;
    }

    function targetDepth(d) {
      return d.target.depth;
    }

    function left(node) {
      return node.depth;
    }

    function right(node, n) {
      return n - 1 - node.height;
    }

    function justify(node, n) {
      return node.sourceLinks.length ? node.depth : n - 1;
    }

    function center(node) {
      return node.targetLinks.length ? node.depth
          : node.sourceLinks.length ? min(node.sourceLinks, targetDepth) - 1
          : 0;
    }

    function constant$2(x) {
      return function() {
        return x;
      };
    }

    function ascendingSourceBreadth(a, b) {
      return ascendingBreadth(a.source, b.source) || a.index - b.index;
    }

    function ascendingTargetBreadth(a, b) {
      return ascendingBreadth(a.target, b.target) || a.index - b.index;
    }

    function ascendingBreadth(a, b) {
      return a.y0 - b.y0;
    }

    function value(d) {
      return d.value;
    }

    function defaultId(d) {
      return d.index;
    }

    function defaultNodes(graph) {
      return graph.nodes;
    }

    function defaultLinks(graph) {
      return graph.links;
    }

    function find(nodeById, id) {
      const node = nodeById.get(id);
      if (!node) throw new Error("missing: " + id);
      return node;
    }

    function computeLinkBreadths({nodes}) {
      for (const node of nodes) {
        let y0 = node.y0;
        let y1 = y0;
        for (const link of node.sourceLinks) {
          link.y0 = y0 + link.width / 2;
          y0 += link.width;
        }
        for (const link of node.targetLinks) {
          link.y1 = y1 + link.width / 2;
          y1 += link.width;
        }
      }
    }

    function Sankey$1() {
      let x0 = 0, y0 = 0, x1 = 1, y1 = 1; // extent
      let dx = 24; // nodeWidth
      let dy = 8, py; // nodePadding
      let id = defaultId;
      let align = justify;
      let sort;
      let linkSort;
      let nodes = defaultNodes;
      let links = defaultLinks;
      let iterations = 6;

      function sankey() {
        const graph = {nodes: nodes.apply(null, arguments), links: links.apply(null, arguments)};
        computeNodeLinks(graph);
        computeNodeValues(graph);
        computeNodeDepths(graph);
        computeNodeHeights(graph);
        computeNodeBreadths(graph);
        computeLinkBreadths(graph);
        return graph;
      }

      sankey.update = function(graph) {
        computeLinkBreadths(graph);
        return graph;
      };

      sankey.nodeId = function(_) {
        return arguments.length ? (id = typeof _ === "function" ? _ : constant$2(_), sankey) : id;
      };

      sankey.nodeAlign = function(_) {
        return arguments.length ? (align = typeof _ === "function" ? _ : constant$2(_), sankey) : align;
      };

      sankey.nodeSort = function(_) {
        return arguments.length ? (sort = _, sankey) : sort;
      };

      sankey.nodeWidth = function(_) {
        return arguments.length ? (dx = +_, sankey) : dx;
      };

      sankey.nodePadding = function(_) {
        return arguments.length ? (dy = py = +_, sankey) : dy;
      };

      sankey.nodes = function(_) {
        return arguments.length ? (nodes = typeof _ === "function" ? _ : constant$2(_), sankey) : nodes;
      };

      sankey.links = function(_) {
        return arguments.length ? (links = typeof _ === "function" ? _ : constant$2(_), sankey) : links;
      };

      sankey.linkSort = function(_) {
        return arguments.length ? (linkSort = _, sankey) : linkSort;
      };

      sankey.size = function(_) {
        return arguments.length ? (x0 = y0 = 0, x1 = +_[0], y1 = +_[1], sankey) : [x1 - x0, y1 - y0];
      };

      sankey.extent = function(_) {
        return arguments.length ? (x0 = +_[0][0], x1 = +_[1][0], y0 = +_[0][1], y1 = +_[1][1], sankey) : [[x0, y0], [x1, y1]];
      };

      sankey.iterations = function(_) {
        return arguments.length ? (iterations = +_, sankey) : iterations;
      };

      function computeNodeLinks({nodes, links}) {
        for (const [i, node] of nodes.entries()) {
          node.index = i;
          node.sourceLinks = [];
          node.targetLinks = [];
        }
        const nodeById = new Map(nodes.map((d, i) => [id(d, i, nodes), d]));
        for (const [i, link] of links.entries()) {
          link.index = i;
          let {source, target} = link;
          if (typeof source !== "object") source = link.source = find(nodeById, source);
          if (typeof target !== "object") target = link.target = find(nodeById, target);
          source.sourceLinks.push(link);
          target.targetLinks.push(link);
        }
        if (linkSort != null) {
          for (const {sourceLinks, targetLinks} of nodes) {
            sourceLinks.sort(linkSort);
            targetLinks.sort(linkSort);
          }
        }
      }

      function computeNodeValues({nodes}) {
        for (const node of nodes) {
          node.value = node.fixedValue === undefined
              ? Math.max(sum(node.sourceLinks, value), sum(node.targetLinks, value))
              : node.fixedValue;
        }
      }

      function computeNodeDepths({nodes}) {
        const n = nodes.length;
        let current = new Set(nodes);
        let next = new Set;
        let x = 0;
        while (current.size) {
          for (const node of current) {
            node.depth = x;
            for (const {target} of node.sourceLinks) {
              next.add(target);
            }
          }
          if (++x > n) throw new Error("circular link");
          current = next;
          next = new Set;
        }
      }

      function computeNodeHeights({nodes}) {
        const n = nodes.length;
        let current = new Set(nodes);
        let next = new Set;
        let x = 0;
        while (current.size) {
          for (const node of current) {
            node.height = x;
            for (const {source} of node.targetLinks) {
              next.add(source);
            }
          }
          if (++x > n) throw new Error("circular link");
          current = next;
          next = new Set;
        }
      }

      function computeNodeLayers({nodes}) {
        const x = max(nodes, d => d.depth) + 1;
        const kx = (x1 - x0 - dx) / (x - 1);
        const columns = new Array(x);
        for (const node of nodes) {
          const i = Math.max(0, Math.min(x - 1, Math.floor(align.call(null, node, x))));
          node.layer = i;
          node.x0 = x0 + i * kx;
          node.x1 = node.x0 + dx;
          if (columns[i]) columns[i].push(node);
          else columns[i] = [node];
        }
        if (sort) for (const column of columns) {
          column.sort(sort);
        }
        return columns;
      }

      function initializeNodeBreadths(columns) {
        const ky = min(columns, c => (y1 - y0 - (c.length - 1) * py) / sum(c, value));
        for (const nodes of columns) {
          let y = y0;
          for (const node of nodes) {
            node.y0 = y;
            node.y1 = y + node.value * ky;
            y = node.y1 + py;
            for (const link of node.sourceLinks) {
              link.width = link.value * ky;
            }
          }
          y = (y1 - y + py) / (nodes.length + 1);
          for (let i = 0; i < nodes.length; ++i) {
            const node = nodes[i];
            node.y0 += y * (i + 1);
            node.y1 += y * (i + 1);
          }
          reorderLinks(nodes);
        }
      }

      function computeNodeBreadths(graph) {
        const columns = computeNodeLayers(graph);
        py = Math.min(dy, (y1 - y0) / (max(columns, c => c.length) - 1));
        initializeNodeBreadths(columns);
        for (let i = 0; i < iterations; ++i) {
          const alpha = Math.pow(0.99, i);
          const beta = Math.max(1 - alpha, (i + 1) / iterations);
          relaxRightToLeft(columns, alpha, beta);
          relaxLeftToRight(columns, alpha, beta);
        }
      }

      // Reposition each node based on its incoming (target) links.
      function relaxLeftToRight(columns, alpha, beta) {
        for (let i = 1, n = columns.length; i < n; ++i) {
          const column = columns[i];
          for (const target of column) {
            let y = 0;
            let w = 0;
            for (const {source, value} of target.targetLinks) {
              let v = value * (target.layer - source.layer);
              y += targetTop(source, target) * v;
              w += v;
            }
            if (!(w > 0)) continue;
            let dy = (y / w - target.y0) * alpha;
            target.y0 += dy;
            target.y1 += dy;
            reorderNodeLinks(target);
          }
          if (sort === undefined) column.sort(ascendingBreadth);
          resolveCollisions(column, beta);
        }
      }

      // Reposition each node based on its outgoing (source) links.
      function relaxRightToLeft(columns, alpha, beta) {
        for (let n = columns.length, i = n - 2; i >= 0; --i) {
          const column = columns[i];
          for (const source of column) {
            let y = 0;
            let w = 0;
            for (const {target, value} of source.sourceLinks) {
              let v = value * (target.layer - source.layer);
              y += sourceTop(source, target) * v;
              w += v;
            }
            if (!(w > 0)) continue;
            let dy = (y / w - source.y0) * alpha;
            source.y0 += dy;
            source.y1 += dy;
            reorderNodeLinks(source);
          }
          if (sort === undefined) column.sort(ascendingBreadth);
          resolveCollisions(column, beta);
        }
      }

      function resolveCollisions(nodes, alpha) {
        const i = nodes.length >> 1;
        const subject = nodes[i];
        resolveCollisionsBottomToTop(nodes, subject.y0 - py, i - 1, alpha);
        resolveCollisionsTopToBottom(nodes, subject.y1 + py, i + 1, alpha);
        resolveCollisionsBottomToTop(nodes, y1, nodes.length - 1, alpha);
        resolveCollisionsTopToBottom(nodes, y0, 0, alpha);
      }

      // Push any overlapping nodes down.
      function resolveCollisionsTopToBottom(nodes, y, i, alpha) {
        for (; i < nodes.length; ++i) {
          const node = nodes[i];
          const dy = (y - node.y0) * alpha;
          if (dy > 1e-6) node.y0 += dy, node.y1 += dy;
          y = node.y1 + py;
        }
      }

      // Push any overlapping nodes up.
      function resolveCollisionsBottomToTop(nodes, y, i, alpha) {
        for (; i >= 0; --i) {
          const node = nodes[i];
          const dy = (node.y1 - y) * alpha;
          if (dy > 1e-6) node.y0 -= dy, node.y1 -= dy;
          y = node.y0 - py;
        }
      }

      function reorderNodeLinks({sourceLinks, targetLinks}) {
        if (linkSort === undefined) {
          for (const {source: {sourceLinks}} of targetLinks) {
            sourceLinks.sort(ascendingTargetBreadth);
          }
          for (const {target: {targetLinks}} of sourceLinks) {
            targetLinks.sort(ascendingSourceBreadth);
          }
        }
      }

      function reorderLinks(nodes) {
        if (linkSort === undefined) {
          for (const {sourceLinks, targetLinks} of nodes) {
            sourceLinks.sort(ascendingTargetBreadth);
            targetLinks.sort(ascendingSourceBreadth);
          }
        }
      }

      // Returns the target.y0 that would produce an ideal link from source to target.
      function targetTop(source, target) {
        let y = source.y0 - (source.sourceLinks.length - 1) * py / 2;
        for (const {target: node, width} of source.sourceLinks) {
          if (node === target) break;
          y += width + py;
        }
        for (const {source: node, width} of target.targetLinks) {
          if (node === source) break;
          y -= width;
        }
        return y;
      }

      // Returns the source.y0 that would produce an ideal link from source to target.
      function sourceTop(source, target) {
        let y = target.y0 - (target.targetLinks.length - 1) * py / 2;
        for (const {source: node, width} of target.targetLinks) {
          if (node === source) break;
          y += width + py;
        }
        for (const {target: node, width} of source.sourceLinks) {
          if (node === target) break;
          y -= width;
        }
        return y;
      }

      return sankey;
    }

    var pi = Math.PI,
        tau = 2 * pi,
        epsilon = 1e-6,
        tauEpsilon = tau - epsilon;

    function Path() {
      this._x0 = this._y0 = // start of current subpath
      this._x1 = this._y1 = null; // end of current subpath
      this._ = "";
    }

    function path() {
      return new Path;
    }

    Path.prototype = path.prototype = {
      constructor: Path,
      moveTo: function(x, y) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
      },
      closePath: function() {
        if (this._x1 !== null) {
          this._x1 = this._x0, this._y1 = this._y0;
          this._ += "Z";
        }
      },
      lineTo: function(x, y) {
        this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      quadraticCurveTo: function(x1, y1, x, y) {
        this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      bezierCurveTo: function(x1, y1, x2, y2, x, y) {
        this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      arcTo: function(x1, y1, x2, y2, r) {
        x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
        var x0 = this._x1,
            y0 = this._y1,
            x21 = x2 - x1,
            y21 = y2 - y1,
            x01 = x0 - x1,
            y01 = y0 - y1,
            l01_2 = x01 * x01 + y01 * y01;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x1,y1).
        if (this._x1 === null) {
          this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
        else if (!(l01_2 > epsilon));

        // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
        // Equivalently, is (x1,y1) coincident with (x2,y2)?
        // Or, is the radius zero? Line to (x1,y1).
        else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
          this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Otherwise, draw an arc!
        else {
          var x20 = x2 - x0,
              y20 = y2 - y0,
              l21_2 = x21 * x21 + y21 * y21,
              l20_2 = x20 * x20 + y20 * y20,
              l21 = Math.sqrt(l21_2),
              l01 = Math.sqrt(l01_2),
              l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
              t01 = l / l01,
              t21 = l / l21;

          // If the start tangent is not coincident with (x0,y0), line to.
          if (Math.abs(t01 - 1) > epsilon) {
            this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
          }

          this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
        }
      },
      arc: function(x, y, r, a0, a1, ccw) {
        x = +x, y = +y, r = +r, ccw = !!ccw;
        var dx = r * Math.cos(a0),
            dy = r * Math.sin(a0),
            x0 = x + dx,
            y0 = y + dy,
            cw = 1 ^ ccw,
            da = ccw ? a0 - a1 : a1 - a0;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x0,y0).
        if (this._x1 === null) {
          this._ += "M" + x0 + "," + y0;
        }

        // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
        else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
          this._ += "L" + x0 + "," + y0;
        }

        // Is this arc empty? We’re done.
        if (!r) return;

        // Does the angle go the wrong way? Flip the direction.
        if (da < 0) da = da % tau + tau;

        // Is this a complete circle? Draw two arcs to complete the circle.
        if (da > tauEpsilon) {
          this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
        }

        // Is this arc non-empty? Draw an arc!
        else if (da > epsilon) {
          this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
        }
      },
      rect: function(x, y, w, h) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
      },
      toString: function() {
        return this._;
      }
    };

    function constant$1(x) {
      return function constant() {
        return x;
      };
    }

    function x(p) {
      return p[0];
    }

    function y(p) {
      return p[1];
    }

    var slice = Array.prototype.slice;

    function linkSource(d) {
      return d.source;
    }

    function linkTarget(d) {
      return d.target;
    }

    function link(curve) {
      var source = linkSource,
          target = linkTarget,
          x$1 = x,
          y$1 = y,
          context = null;

      function link() {
        var buffer, argv = slice.call(arguments), s = source.apply(this, argv), t = target.apply(this, argv);
        if (!context) context = buffer = path();
        curve(context, +x$1.apply(this, (argv[0] = s, argv)), +y$1.apply(this, argv), +x$1.apply(this, (argv[0] = t, argv)), +y$1.apply(this, argv));
        if (buffer) return context = null, buffer + "" || null;
      }

      link.source = function(_) {
        return arguments.length ? (source = _, link) : source;
      };

      link.target = function(_) {
        return arguments.length ? (target = _, link) : target;
      };

      link.x = function(_) {
        return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant$1(+_), link) : x$1;
      };

      link.y = function(_) {
        return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant$1(+_), link) : y$1;
      };

      link.context = function(_) {
        return arguments.length ? ((context = _ == null ? null : _), link) : context;
      };

      return link;
    }

    function curveHorizontal(context, x0, y0, x1, y1) {
      context.moveTo(x0, y0);
      context.bezierCurveTo(x0 = (x0 + x1) / 2, y0, x0, y1, x1, y1);
    }

    function linkHorizontal() {
      return link(curveHorizontal);
    }

    function horizontalSource(d) {
      return [d.source.x1, d.y0];
    }

    function horizontalTarget(d) {
      return [d.target.x0, d.y1];
    }

    function sankeyLinkHorizontal() {
      return linkHorizontal()
          .source(horizontalSource)
          .target(horizontalTarget);
    }

    var Sankey = /*#__PURE__*/Object.freeze({
        __proto__: null,
        sankey: Sankey$1,
        sankeyCenter: center,
        sankeyLeft: left,
        sankeyRight: right,
        sankeyJustify: justify,
        sankeyLinkHorizontal: sankeyLinkHorizontal
    });

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getAugmentedNamespace(n) {
    	if (n.__esModule) return n;
    	var a = Object.defineProperty({}, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var xhtml = "http://www.w3.org/1999/xhtml";

    var namespaces = {
      svg: "http://www.w3.org/2000/svg",
      xhtml: xhtml,
      xlink: "http://www.w3.org/1999/xlink",
      xml: "http://www.w3.org/XML/1998/namespace",
      xmlns: "http://www.w3.org/2000/xmlns/"
    };

    function namespace(name) {
      var prefix = name += "", i = prefix.indexOf(":");
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
    }

    function creatorInherit(name) {
      return function() {
        var document = this.ownerDocument,
            uri = this.namespaceURI;
        return uri === xhtml && document.documentElement.namespaceURI === xhtml
            ? document.createElement(name)
            : document.createElementNS(uri, name);
      };
    }

    function creatorFixed(fullname) {
      return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
      };
    }

    function creator(name) {
      var fullname = namespace(name);
      return (fullname.local
          ? creatorFixed
          : creatorInherit)(fullname);
    }

    function none() {}

    function selector(selector) {
      return selector == null ? none : function() {
        return this.querySelector(selector);
      };
    }

    function selection_select(select) {
      if (typeof select !== "function") select = selector(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    function empty() {
      return [];
    }

    function selectorAll(selector) {
      return selector == null ? empty : function() {
        return this.querySelectorAll(selector);
      };
    }

    function selection_selectAll(select) {
      if (typeof select !== "function") select = selectorAll(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            subgroups.push(select.call(node, node.__data__, i, group));
            parents.push(node);
          }
        }
      }

      return new Selection(subgroups, parents);
    }

    function matcher(selector) {
      return function() {
        return this.matches(selector);
      };
    }

    function selection_filter(match) {
      if (typeof match !== "function") match = matcher(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    function sparse(update) {
      return new Array(update.length);
    }

    function selection_enter() {
      return new Selection(this._enter || this._groups.map(sparse), this._parents);
    }

    function EnterNode(parent, datum) {
      this.ownerDocument = parent.ownerDocument;
      this.namespaceURI = parent.namespaceURI;
      this._next = null;
      this._parent = parent;
      this.__data__ = datum;
    }

    EnterNode.prototype = {
      constructor: EnterNode,
      appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
      insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
      querySelector: function(selector) { return this._parent.querySelector(selector); },
      querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
    };

    function constant(x) {
      return function() {
        return x;
      };
    }

    var keyPrefix = "$"; // Protect against keys like “__proto__”.

    function bindIndex(parent, group, enter, update, exit, data) {
      var i = 0,
          node,
          groupLength = group.length,
          dataLength = data.length;

      // Put any non-null nodes that fit into update.
      // Put any null nodes into enter.
      // Put any remaining data into enter.
      for (; i < dataLength; ++i) {
        if (node = group[i]) {
          node.__data__ = data[i];
          update[i] = node;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Put any non-null nodes that don’t fit into exit.
      for (; i < groupLength; ++i) {
        if (node = group[i]) {
          exit[i] = node;
        }
      }
    }

    function bindKey(parent, group, enter, update, exit, data, key) {
      var i,
          node,
          nodeByKeyValue = {},
          groupLength = group.length,
          dataLength = data.length,
          keyValues = new Array(groupLength),
          keyValue;

      // Compute the key for each node.
      // If multiple nodes have the same key, the duplicates are added to exit.
      for (i = 0; i < groupLength; ++i) {
        if (node = group[i]) {
          keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
          if (keyValue in nodeByKeyValue) {
            exit[i] = node;
          } else {
            nodeByKeyValue[keyValue] = node;
          }
        }
      }

      // Compute the key for each datum.
      // If there a node associated with this key, join and add it to update.
      // If there is not (or the key is a duplicate), add it to enter.
      for (i = 0; i < dataLength; ++i) {
        keyValue = keyPrefix + key.call(parent, data[i], i, data);
        if (node = nodeByKeyValue[keyValue]) {
          update[i] = node;
          node.__data__ = data[i];
          nodeByKeyValue[keyValue] = null;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Add any remaining nodes that were not bound to data to exit.
      for (i = 0; i < groupLength; ++i) {
        if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
          exit[i] = node;
        }
      }
    }

    function selection_data(value, key) {
      if (!value) {
        data = new Array(this.size()), j = -1;
        this.each(function(d) { data[++j] = d; });
        return data;
      }

      var bind = key ? bindKey : bindIndex,
          parents = this._parents,
          groups = this._groups;

      if (typeof value !== "function") value = constant(value);

      for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
        var parent = parents[j],
            group = groups[j],
            groupLength = group.length,
            data = value.call(parent, parent && parent.__data__, j, parents),
            dataLength = data.length,
            enterGroup = enter[j] = new Array(dataLength),
            updateGroup = update[j] = new Array(dataLength),
            exitGroup = exit[j] = new Array(groupLength);

        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
          if (previous = enterGroup[i0]) {
            if (i0 >= i1) i1 = i0 + 1;
            while (!(next = updateGroup[i1]) && ++i1 < dataLength);
            previous._next = next || null;
          }
        }
      }

      update = new Selection(update, parents);
      update._enter = enter;
      update._exit = exit;
      return update;
    }

    function selection_exit() {
      return new Selection(this._exit || this._groups.map(sparse), this._parents);
    }

    function selection_join(onenter, onupdate, onexit) {
      var enter = this.enter(), update = this, exit = this.exit();
      enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
      if (onupdate != null) update = onupdate(update);
      if (onexit == null) exit.remove(); else onexit(exit);
      return enter && update ? enter.merge(update).order() : update;
    }

    function selection_merge(selection) {

      for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Selection(merges, this._parents);
    }

    function selection_order() {

      for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
        for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
          if (node = group[i]) {
            if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
            next = node;
          }
        }
      }

      return this;
    }

    function selection_sort(compare) {
      if (!compare) compare = ascending;

      function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
      }

      for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            sortgroup[i] = node;
          }
        }
        sortgroup.sort(compareNode);
      }

      return new Selection(sortgroups, this._parents).order();
    }

    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function selection_call() {
      var callback = arguments[0];
      arguments[0] = this;
      callback.apply(null, arguments);
      return this;
    }

    function selection_nodes() {
      var nodes = new Array(this.size()), i = -1;
      this.each(function() { nodes[++i] = this; });
      return nodes;
    }

    function selection_node() {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
          var node = group[i];
          if (node) return node;
        }
      }

      return null;
    }

    function selection_size() {
      var size = 0;
      this.each(function() { ++size; });
      return size;
    }

    function selection_empty() {
      return !this.node();
    }

    function selection_each(callback) {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
      }

      return this;
    }

    function attrRemove(name) {
      return function() {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS(fullname) {
      return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant(name, value) {
      return function() {
        this.setAttribute(name, value);
      };
    }

    function attrConstantNS(fullname, value) {
      return function() {
        this.setAttributeNS(fullname.space, fullname.local, value);
      };
    }

    function attrFunction(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
      };
    }

    function attrFunctionNS(fullname, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
      };
    }

    function selection_attr(name, value) {
      var fullname = namespace(name);

      if (arguments.length < 2) {
        var node = this.node();
        return fullname.local
            ? node.getAttributeNS(fullname.space, fullname.local)
            : node.getAttribute(fullname);
      }

      return this.each((value == null
          ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
          ? (fullname.local ? attrFunctionNS : attrFunction)
          : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
    }

    function defaultView(node) {
      return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
          || (node.document && node) // node is a Window
          || node.defaultView; // node is a Document
    }

    function styleRemove(name) {
      return function() {
        this.style.removeProperty(name);
      };
    }

    function styleConstant(name, value, priority) {
      return function() {
        this.style.setProperty(name, value, priority);
      };
    }

    function styleFunction(name, value, priority) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
      };
    }

    function selection_style(name, value, priority) {
      return arguments.length > 1
          ? this.each((value == null
                ? styleRemove : typeof value === "function"
                ? styleFunction
                : styleConstant)(name, value, priority == null ? "" : priority))
          : styleValue(this.node(), name);
    }

    function styleValue(node, name) {
      return node.style.getPropertyValue(name)
          || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
    }

    function propertyRemove(name) {
      return function() {
        delete this[name];
      };
    }

    function propertyConstant(name, value) {
      return function() {
        this[name] = value;
      };
    }

    function propertyFunction(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
      };
    }

    function selection_property(name, value) {
      return arguments.length > 1
          ? this.each((value == null
              ? propertyRemove : typeof value === "function"
              ? propertyFunction
              : propertyConstant)(name, value))
          : this.node()[name];
    }

    function classArray(string) {
      return string.trim().split(/^|\s+/);
    }

    function classList(node) {
      return node.classList || new ClassList(node);
    }

    function ClassList(node) {
      this._node = node;
      this._names = classArray(node.getAttribute("class") || "");
    }

    ClassList.prototype = {
      add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
          this._names.push(name);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
          this._names.splice(i, 1);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      contains: function(name) {
        return this._names.indexOf(name) >= 0;
      }
    };

    function classedAdd(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.add(names[i]);
    }

    function classedRemove(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.remove(names[i]);
    }

    function classedTrue(names) {
      return function() {
        classedAdd(this, names);
      };
    }

    function classedFalse(names) {
      return function() {
        classedRemove(this, names);
      };
    }

    function classedFunction(names, value) {
      return function() {
        (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
      };
    }

    function selection_classed(name, value) {
      var names = classArray(name + "");

      if (arguments.length < 2) {
        var list = classList(this.node()), i = -1, n = names.length;
        while (++i < n) if (!list.contains(names[i])) return false;
        return true;
      }

      return this.each((typeof value === "function"
          ? classedFunction : value
          ? classedTrue
          : classedFalse)(names, value));
    }

    function textRemove() {
      this.textContent = "";
    }

    function textConstant(value) {
      return function() {
        this.textContent = value;
      };
    }

    function textFunction(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
      };
    }

    function selection_text(value) {
      return arguments.length
          ? this.each(value == null
              ? textRemove : (typeof value === "function"
              ? textFunction
              : textConstant)(value))
          : this.node().textContent;
    }

    function htmlRemove() {
      this.innerHTML = "";
    }

    function htmlConstant(value) {
      return function() {
        this.innerHTML = value;
      };
    }

    function htmlFunction(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
      };
    }

    function selection_html(value) {
      return arguments.length
          ? this.each(value == null
              ? htmlRemove : (typeof value === "function"
              ? htmlFunction
              : htmlConstant)(value))
          : this.node().innerHTML;
    }

    function raise() {
      if (this.nextSibling) this.parentNode.appendChild(this);
    }

    function selection_raise() {
      return this.each(raise);
    }

    function lower() {
      if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
    }

    function selection_lower() {
      return this.each(lower);
    }

    function selection_append(name) {
      var create = typeof name === "function" ? name : creator(name);
      return this.select(function() {
        return this.appendChild(create.apply(this, arguments));
      });
    }

    function constantNull() {
      return null;
    }

    function selection_insert(name, before) {
      var create = typeof name === "function" ? name : creator(name),
          select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
      return this.select(function() {
        return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
      });
    }

    function remove() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    }

    function selection_remove() {
      return this.each(remove);
    }

    function selection_cloneShallow() {
      var clone = this.cloneNode(false), parent = this.parentNode;
      return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }

    function selection_cloneDeep() {
      var clone = this.cloneNode(true), parent = this.parentNode;
      return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }

    function selection_clone(deep) {
      return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
    }

    function selection_datum(value) {
      return arguments.length
          ? this.property("__data__", value)
          : this.node().__data__;
    }

    var filterEvents = {};

    var event = null;

    if (typeof document !== "undefined") {
      var element = document.documentElement;
      if (!("onmouseenter" in element)) {
        filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
      }
    }

    function filterContextListener(listener, index, group) {
      listener = contextListener(listener, index, group);
      return function(event) {
        var related = event.relatedTarget;
        if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
          listener.call(this, event);
        }
      };
    }

    function contextListener(listener, index, group) {
      return function(event1) {
        var event0 = event; // Events can be reentrant (e.g., focus).
        event = event1;
        try {
          listener.call(this, this.__data__, index, group);
        } finally {
          event = event0;
        }
      };
    }

    function parseTypenames(typenames) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {type: t, name: name};
      });
    }

    function onRemove(typename) {
      return function() {
        var on = this.__on;
        if (!on) return;
        for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
          if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.capture);
          } else {
            on[++i] = o;
          }
        }
        if (++i) on.length = i;
        else delete this.__on;
      };
    }

    function onAdd(typename, value, capture) {
      var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
      return function(d, i, group) {
        var on = this.__on, o, listener = wrap(value, i, group);
        if (on) for (var j = 0, m = on.length; j < m; ++j) {
          if ((o = on[j]).type === typename.type && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.capture);
            this.addEventListener(o.type, o.listener = listener, o.capture = capture);
            o.value = value;
            return;
          }
        }
        this.addEventListener(typename.type, listener, capture);
        o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
        if (!on) this.__on = [o];
        else on.push(o);
      };
    }

    function selection_on(typename, value, capture) {
      var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

      if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
          for (i = 0, o = on[j]; i < n; ++i) {
            if ((t = typenames[i]).type === o.type && t.name === o.name) {
              return o.value;
            }
          }
        }
        return;
      }

      on = value ? onAdd : onRemove;
      if (capture == null) capture = false;
      for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
      return this;
    }

    function customEvent(event1, listener, that, args) {
      var event0 = event;
      event1.sourceEvent = event;
      event = event1;
      try {
        return listener.apply(that, args);
      } finally {
        event = event0;
      }
    }

    function dispatchEvent(node, type, params) {
      var window = defaultView(node),
          event = window.CustomEvent;

      if (typeof event === "function") {
        event = new event(type, params);
      } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
      }

      node.dispatchEvent(event);
    }

    function dispatchConstant(type, params) {
      return function() {
        return dispatchEvent(this, type, params);
      };
    }

    function dispatchFunction(type, params) {
      return function() {
        return dispatchEvent(this, type, params.apply(this, arguments));
      };
    }

    function selection_dispatch(type, params) {
      return this.each((typeof params === "function"
          ? dispatchFunction
          : dispatchConstant)(type, params));
    }

    var root = [null];

    function Selection(groups, parents) {
      this._groups = groups;
      this._parents = parents;
    }

    function selection() {
      return new Selection([[document.documentElement]], root);
    }

    Selection.prototype = selection.prototype = {
      constructor: Selection,
      select: selection_select,
      selectAll: selection_selectAll,
      filter: selection_filter,
      data: selection_data,
      enter: selection_enter,
      exit: selection_exit,
      join: selection_join,
      merge: selection_merge,
      order: selection_order,
      sort: selection_sort,
      call: selection_call,
      nodes: selection_nodes,
      node: selection_node,
      size: selection_size,
      empty: selection_empty,
      each: selection_each,
      attr: selection_attr,
      style: selection_style,
      property: selection_property,
      classed: selection_classed,
      text: selection_text,
      html: selection_html,
      raise: selection_raise,
      lower: selection_lower,
      append: selection_append,
      insert: selection_insert,
      remove: selection_remove,
      clone: selection_clone,
      datum: selection_datum,
      on: selection_on,
      dispatch: selection_dispatch
    };

    function select(selector) {
      return typeof selector === "string"
          ? new Selection([[document.querySelector(selector)]], [document.documentElement])
          : new Selection([[selector]], root);
    }

    function create(name) {
      return select(creator(name).call(document.documentElement));
    }

    var nextId = 0;

    function local() {
      return new Local;
    }

    function Local() {
      this._ = "@" + (++nextId).toString(36);
    }

    Local.prototype = local.prototype = {
      constructor: Local,
      get: function(node) {
        var id = this._;
        while (!(id in node)) if (!(node = node.parentNode)) return;
        return node[id];
      },
      set: function(node, value) {
        return node[this._] = value;
      },
      remove: function(node) {
        return this._ in node && delete node[this._];
      },
      toString: function() {
        return this._;
      }
    };

    function sourceEvent() {
      var current = event, source;
      while (source = current.sourceEvent) current = source;
      return current;
    }

    function point(node, event) {
      var svg = node.ownerSVGElement || node;

      if (svg.createSVGPoint) {
        var point = svg.createSVGPoint();
        point.x = event.clientX, point.y = event.clientY;
        point = point.matrixTransform(node.getScreenCTM().inverse());
        return [point.x, point.y];
      }

      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }

    function mouse(node) {
      var event = sourceEvent();
      if (event.changedTouches) event = event.changedTouches[0];
      return point(node, event);
    }

    function selectAll(selector) {
      return typeof selector === "string"
          ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
          : new Selection([selector == null ? [] : selector], root);
    }

    function touch(node, touches, identifier) {
      if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

      for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
        if ((touch = touches[i]).identifier === identifier) {
          return point(node, touch);
        }
      }

      return null;
    }

    function touches(node, touches) {
      if (touches == null) touches = sourceEvent().touches;

      for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
        points[i] = point(node, touches[i]);
      }

      return points;
    }

    var src = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create,
        creator: creator,
        local: local,
        matcher: matcher,
        mouse: mouse,
        namespace: namespace,
        namespaces: namespaces,
        clientPoint: point,
        select: select,
        selectAll: selectAll,
        selection: selection,
        selector: selector,
        selectorAll: selectorAll,
        style: styleValue,
        touch: touch,
        touches: touches,
        window: defaultView,
        get event () { return event; },
        customEvent: customEvent
    });

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(src);

    var d3Textwrap = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
        factory(exports, require$$0) ;
    }(commonjsGlobal, function (exports,d3Selection) {
        var method;
        var verify_bounds;
        var resolve_bounds;
        var resolve_padding;
        var pad;
        var dimensions;
        var wrap;
        var textwrap;
        // test for foreignObject support and determine wrapping strategy
        method = typeof SVGForeignObjectElement === 'undefined' ? 'tspans' : 'foreignobject';

        // accept multiple input types as boundaries
        verify_bounds = function(bounds) {
            var bounds_object,
                bounds_function;
            bounds_function = typeof bounds === 'function';
            if (typeof bounds === 'object' && ! bounds.nodeType) {
                if (! bounds.height || ! bounds.width) {
                    console.error('text wrapping bounds must specify height and width');
                    return false;
                } else {
                    return true;
                }
            }
            // convert a selection to bounds
            if (
                bounds instanceof d3Selection.selection ||
                bounds.nodeType ||
                bounds_function ||
                bounds_object
            ) {
                return true;
            // use input as bounds directly
            } else {
                console.error('invalid bounds specified for text wrapping');
                return false;
            }
        };

        resolve_bounds = function(bounds) {
            var properties,
                dimensions,
                result,
                i;
            properties = ['height', 'width'];
            if (typeof bounds === 'function') {
                dimensions = bounds();
            } else if (bounds.nodeType) {
                dimensions = bounds.getBoundingClientRect();
            } else if (typeof bounds === 'object') {
                dimensions = bounds;
            }
            result = Object.create(null);
            for (i = 0; i < properties.length; i++) {
                result[properties[i]] = dimensions[properties[i]];
            }
            return result;
        };

        resolve_padding = function(padding) {
            var result;
            if (typeof padding === 'function') {
                result = padding();
            } else if (typeof padding === 'number') {
                result = padding;
            } else if (typeof padding === 'undefined') {
                result = 0;
            }
            if (typeof result !== 'number') {
                console.error('padding could not be converted into a number');
            } else {
                return result;
            }
        };

        pad = function(dimensions, padding) {
            var padded;
            padded = {
                height: dimensions.height - padding * 2,
                width: dimensions.width - padding * 2
            };
            return padded;
        };

        dimensions = function(bounds, padding) {
            var padded;
            padded = pad(resolve_bounds(bounds), resolve_padding(padding));
            return padded;
        };


        wrap = {};

        // wrap text using foreignobject html
        wrap.foreignobject = function(text, dimensions, padding) {
            var content,
                parent,
                foreignobject,
                div;
            // extract our desired content from the single text element
            content = text.text();
            // remove the text node and replace with a foreign object
            parent = d3Selection.select(text.node().parentNode);
            text.remove();
            foreignobject = parent.append('foreignObject');
            // add foreign object and set dimensions, position, etc
            foreignobject
                .attr('requiredFeatures', 'http://www.w3.org/TR/SVG11/feature#Extensibility')
                .attr('width', dimensions.width)
                .attr('height', dimensions.height);
            if (typeof padding === 'number') {
                foreignobject
                    .attr('x', +text.attr('x') + padding)
                    .attr('y', +text.attr('y') + padding);
            }
            // insert an HTML div
            div = foreignobject
                .append('xhtml:div');
            // set div to same dimensions as foreign object
            div
                .style('height', dimensions.height)
                .style('width', dimensions.width)
                // insert text content
                .html(content);
            return div;
        };

        // wrap text using tspans
        wrap.tspans = function(text, dimensions, padding) {
            var pieces,
                piece,
                line_width,
                x_offset,
                tspan,
                previous_content;
            pieces = text.text().split(' ').reverse();
            text.text('');
            tspan = text.append('tspan');
            tspan
                .attr('dx', 0)
                .attr('dy', 0);
            x_offset = 0;
            while (pieces.length > 0) {
                piece = pieces.pop();
                tspan.text(tspan.text() + ' ' + piece);
                line_width = tspan.node().getComputedTextLength() || 0;
                if (line_width > dimensions.width) {
                    previous_content = tspan.text()
                        .split(' ')
                        .slice(0, -1)
                        .join(' ');
                    tspan.text(previous_content);
                    x_offset = tspan.node().getComputedTextLength() * -1;
                    tspan = text.append('tspan');
                    tspan
                        .attr('dx', x_offset)
                        .attr('dy', '1em')
                        .text(piece);
                }
            }
            if (typeof padding === 'number') {
                text
                    .attr('y', +text.attr('y') + padding)
                    .attr('x', +text.attr('x') + padding);
            }
        };

        // factory to generate text wrap functions
        textwrap = function() {
            // text wrap function instance
            var wrapper,
                bounds,
                padding;
            wrapper = function(targets) {
                targets.each(function() {
                    d3Selection.select(this).call(wrap[method], dimensions(bounds, padding), resolve_padding(padding));
                });
            };
            // get or set wrapping boundaries
            wrapper.bounds = function(new_bounds) {
                if (new_bounds) {
                    if (verify_bounds(new_bounds)) {
                        bounds = new_bounds;
                        return wrapper;
                    } else {
                        console.error('invalid text wrapping bounds');
                        return false;
                    }
                } else {
                    return bounds;
                }
            };
            // get or set padding applied on top of boundaries
            wrapper.padding = function(new_padding) {
                if (new_padding) {
                    if (typeof new_padding === 'number' || typeof new_padding === 'function') {
                        padding = new_padding;
                        return wrapper;
                    } else {
                        console.error('text wrap padding value must be either a number or a function');
                        return false;
                    }
                } else {
                    return padding;
                }
            };
            // get or set wrapping method
            wrapper.method = function(new_method) {
                if (new_method) {
                    method = new_method;
                    return wrapper;
                } else {
                    return method;
                }
            };
            return wrapper;
        };

        var textwrap$1 = textwrap;

        exports.selection = d3Selection.selection;
        exports.select = d3Selection.select;
        exports.textwrap = textwrap$1;

        Object.defineProperty(exports, '__esModule', { value: true });

    }));
    });

    /* src/Sankey.svelte generated by Svelte v3.42.1 */
    const file$2 = "src/Sankey.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    // (51:4) {#each sankeyData.links as d}
    function create_each_block_1(ctx) {
    	let path;
    	let path_d_value;
    	let path_stroke_value;
    	let path_stroke_width_value;
    	let mounted;
    	let dispose;

    	function mousemove_handler(...args) {
    		return /*mousemove_handler*/ ctx[17](/*d*/ ctx[25], ...args);
    	}

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "class", "link svelte-ivkcqv");
    			attr_dev(path, "d", path_d_value = /*link*/ ctx[4](/*d*/ ctx[25]));
    			attr_dev(path, "fill", "none");
    			attr_dev(path, "stroke", path_stroke_value = `url(#${/*d*/ ctx[25].source.x0 == 0 ? "rToF" : "fToS"})`);
    			attr_dev(path, "stroke-width", path_stroke_width_value = /*d*/ ctx[25].width);
    			add_location(path, file$2, 51, 6, 1500);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(path, "mousemove", mousemove_handler, false, false, false),
    					listen_dev(path, "mouseout", /*mouseout_handler*/ ctx[18], false, false, false),
    					listen_dev(path, "blur", /*blur_handler*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*link, sankeyData*/ 48 && path_d_value !== (path_d_value = /*link*/ ctx[4](/*d*/ ctx[25]))) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (dirty & /*sankeyData*/ 32 && path_stroke_value !== (path_stroke_value = `url(#${/*d*/ ctx[25].source.x0 == 0 ? "rToF" : "fToS"})`)) {
    				attr_dev(path, "stroke", path_stroke_value);
    			}

    			if (dirty & /*sankeyData*/ 32 && path_stroke_width_value !== (path_stroke_width_value = /*d*/ ctx[25].width)) {
    				attr_dev(path, "stroke-width", path_stroke_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(51:4) {#each sankeyData.links as d}",
    		ctx
    	});

    	return block;
    }

    // (83:8) {#if d.value > 1000000000}
    function create_if_block$1(ctx) {
    	let text_1;
    	let t_value = /*d*/ ctx[25].id + "";
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(text_1, "class", "node-label svelte-ivkcqv");

    			attr_dev(text_1, "x", text_1_x_value = /*d*/ ctx[25].x0 < /*$width*/ ctx[2] * 3 / 4
    			? /*d*/ ctx[25].x1 + 6
    			: /*d*/ ctx[25].x0 - 6);

    			attr_dev(text_1, "y", text_1_y_value = (/*d*/ ctx[25].y1 + /*d*/ ctx[25].y0) / 2);

    			set_style(text_1, "text-anchor", /*d*/ ctx[25].x0 < /*$width*/ ctx[2] * 3 / 4
    			? 'start'
    			: 'end');

    			add_location(text_1, file$2, 83, 10, 2414);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    			/*text_1_binding*/ ctx[23](text_1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sankeyData*/ 32 && t_value !== (t_value = /*d*/ ctx[25].id + "")) set_data_dev(t, t_value);

    			if (dirty & /*sankeyData, $width*/ 36 && text_1_x_value !== (text_1_x_value = /*d*/ ctx[25].x0 < /*$width*/ ctx[2] * 3 / 4
    			? /*d*/ ctx[25].x1 + 6
    			: /*d*/ ctx[25].x0 - 6)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty & /*sankeyData*/ 32 && text_1_y_value !== (text_1_y_value = (/*d*/ ctx[25].y1 + /*d*/ ctx[25].y0) / 2)) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}

    			if (dirty & /*sankeyData, $width*/ 36) {
    				set_style(text_1, "text-anchor", /*d*/ ctx[25].x0 < /*$width*/ ctx[2] * 3 / 4
    				? 'start'
    				: 'end');
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    			/*text_1_binding*/ ctx[23](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(83:8) {#if d.value > 1000000000}",
    		ctx
    	});

    	return block;
    }

    // (67:4) {#each sankeyData.nodes as d, i}
    function create_each_block(ctx) {
    	let g;
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let rect_height_value;
    	let rect_width_value;
    	let rect_fill_value;
    	let mounted;
    	let dispose;

    	function mousemove_handler_1(...args) {
    		return /*mousemove_handler_1*/ ctx[20](/*d*/ ctx[25], ...args);
    	}

    	let if_block = /*d*/ ctx[25].value > 1000000000 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			rect = svg_element("rect");
    			if (if_block) if_block.c();
    			attr_dev(rect, "class", "node svelte-ivkcqv");
    			attr_dev(rect, "x", rect_x_value = /*d*/ ctx[25].x0);
    			attr_dev(rect, "y", rect_y_value = /*d*/ ctx[25].y0);
    			attr_dev(rect, "height", rect_height_value = /*d*/ ctx[25].y1 - /*d*/ ctx[25].y0);
    			attr_dev(rect, "width", rect_width_value = /*d*/ ctx[25].x1 - /*d*/ ctx[25].x0);
    			attr_dev(rect, "fill", rect_fill_value = /*color*/ ctx[9][/*d*/ ctx[25].category]);
    			add_location(rect, file$2, 69, 8, 2006);
    			add_location(g, file$2, 68, 6, 1994);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, rect);
    			if (if_block) if_block.m(g, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(rect, "mousemove", mousemove_handler_1, false, false, false),
    					listen_dev(rect, "mouseout", /*mouseout_handler_1*/ ctx[21], false, false, false),
    					listen_dev(rect, "blur", /*blur_handler_1*/ ctx[22], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*sankeyData*/ 32 && rect_x_value !== (rect_x_value = /*d*/ ctx[25].x0)) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*sankeyData*/ 32 && rect_y_value !== (rect_y_value = /*d*/ ctx[25].y0)) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty & /*sankeyData*/ 32 && rect_height_value !== (rect_height_value = /*d*/ ctx[25].y1 - /*d*/ ctx[25].y0)) {
    				attr_dev(rect, "height", rect_height_value);
    			}

    			if (dirty & /*sankeyData*/ 32 && rect_width_value !== (rect_width_value = /*d*/ ctx[25].x1 - /*d*/ ctx[25].x0)) {
    				attr_dev(rect, "width", rect_width_value);
    			}

    			if (dirty & /*sankeyData*/ 32 && rect_fill_value !== (rect_fill_value = /*color*/ ctx[9][/*d*/ ctx[25].category])) {
    				attr_dev(rect, "fill", rect_fill_value);
    			}

    			if (/*d*/ ctx[25].value > 1000000000) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(g, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(67:4) {#each sankeyData.nodes as d, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let g3;
    	let g0;
    	let text0;
    	let t0;
    	let text1;
    	let t1;
    	let text1_x_value;
    	let text2;
    	let t2;
    	let g1;
    	let g2;
    	let each_value_1 = /*sankeyData*/ ctx[5].links;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*sankeyData*/ ctx[5].nodes;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g3 = svg_element("g");
    			g0 = svg_element("g");
    			text0 = svg_element("text");
    			t0 = text("Revenues");
    			text1 = svg_element("text");
    			t1 = text("Funds");
    			text2 = svg_element("text");
    			t2 = text("Spending");
    			g1 = svg_element("g");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			g2 = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(text0, "class", "header start svelte-ivkcqv");
    			attr_dev(text0, "x", 0);
    			attr_dev(text0, "y", 0);
    			add_location(text0, file$2, 45, 4, 1245);
    			attr_dev(text1, "class", "header middle svelte-ivkcqv");
    			attr_dev(text1, "x", text1_x_value = /*$width*/ ctx[2] / 2);
    			attr_dev(text1, "y", 0);
    			add_location(text1, file$2, 46, 4, 1304);
    			attr_dev(text2, "class", "header end svelte-ivkcqv");
    			attr_dev(text2, "x", /*$width*/ ctx[2]);
    			attr_dev(text2, "y", 0);
    			add_location(text2, file$2, 47, 4, 1370);
    			attr_dev(g0, "class", "headers");
    			attr_dev(g0, "transform", `translate(0, -15)`);
    			add_location(g0, file$2, 44, 2, 1189);
    			attr_dev(g1, "class", "link-group");
    			add_location(g1, file$2, 49, 2, 1437);
    			attr_dev(g2, "class", "rect-group");
    			add_location(g2, file$2, 65, 2, 1870);
    			attr_dev(g3, "class", "sankey-layer");
    			add_location(g3, file$2, 43, 0, 1162);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g3, anchor);
    			append_dev(g3, g0);
    			append_dev(g0, text0);
    			append_dev(text0, t0);
    			append_dev(g0, text1);
    			append_dev(text1, t1);
    			append_dev(g0, text2);
    			append_dev(text2, t2);
    			append_dev(g3, g1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(g1, null);
    			}

    			append_dev(g3, g2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g2, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$width*/ 4 && text1_x_value !== (text1_x_value = /*$width*/ ctx[2] / 2)) {
    				attr_dev(text1, "x", text1_x_value);
    			}

    			if (dirty & /*$width*/ 4) {
    				attr_dev(text2, "x", /*$width*/ ctx[2]);
    			}

    			if (dirty & /*link, sankeyData, hoveredLink*/ 50) {
    				each_value_1 = /*sankeyData*/ ctx[5].links;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(g1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*sankeyData, $width, label, color, hoveredNode, hoveredLink*/ 559) {
    				each_value = /*sankeyData*/ ctx[5].nodes;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g3);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let sankey;
    	let sankeyData;
    	let link;
    	let $data;
    	let $height;
    	let $width;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sankey', slots, []);
    	const { data, width, height } = getContext("LayerCake");
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(15, $data = value));
    	validate_store(width, 'width');
    	component_subscribe($$self, width, value => $$invalidate(2, $width = value));
    	validate_store(height, 'height');
    	component_subscribe($$self, height, value => $$invalidate(16, $height = value));
    	let { hoveredNode, hoveredLink } = $$props;
    	let { nodeWidth = 10 } = $$props;
    	let { nodePadding = 10 } = $$props;
    	let { linkSort = null } = $$props;
    	let { nodeId = d => d.id } = $$props;
    	const wrap = d3Textwrap.textwrap().bounds({ width: 150, height: 100 }).method("tspans");
    	let label;

    	const color = {
    		revenues: "#25C2E4",
    		funds: "#FFCA42",
    		spending: "#F15F27"
    	};

    	const writable_props = ['hoveredNode', 'hoveredLink', 'nodeWidth', 'nodePadding', 'linkSort', 'nodeId'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sankey> was created with unknown prop '${key}'`);
    	});

    	const mousemove_handler = (d, e) => {
    		$$invalidate(1, hoveredLink = { e, data: d });
    	};

    	const mouseout_handler = () => $$invalidate(1, hoveredLink = null);
    	const blur_handler = () => $$invalidate(1, hoveredLink = null);

    	const mousemove_handler_1 = (d, e) => {
    		$$invalidate(0, hoveredNode = { e, data: d });
    	};

    	const mouseout_handler_1 = () => $$invalidate(0, hoveredNode = null);
    	const blur_handler_1 = () => $$invalidate(1, hoveredLink = null);

    	function text_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			label = $$value;
    			$$invalidate(3, label);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('hoveredNode' in $$props) $$invalidate(0, hoveredNode = $$props.hoveredNode);
    		if ('hoveredLink' in $$props) $$invalidate(1, hoveredLink = $$props.hoveredLink);
    		if ('nodeWidth' in $$props) $$invalidate(10, nodeWidth = $$props.nodeWidth);
    		if ('nodePadding' in $$props) $$invalidate(11, nodePadding = $$props.nodePadding);
    		if ('linkSort' in $$props) $$invalidate(12, linkSort = $$props.linkSort);
    		if ('nodeId' in $$props) $$invalidate(13, nodeId = $$props.nodeId);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		afterUpdate,
    		select: select$1,
    		selectAll: selectAll$1,
    		Sankey,
    		textwrap: d3Textwrap.textwrap,
    		data,
    		width,
    		height,
    		hoveredNode,
    		hoveredLink,
    		nodeWidth,
    		nodePadding,
    		linkSort,
    		nodeId,
    		wrap,
    		label,
    		color,
    		link,
    		sankey,
    		sankeyData,
    		$data,
    		$height,
    		$width
    	});

    	$$self.$inject_state = $$props => {
    		if ('hoveredNode' in $$props) $$invalidate(0, hoveredNode = $$props.hoveredNode);
    		if ('hoveredLink' in $$props) $$invalidate(1, hoveredLink = $$props.hoveredLink);
    		if ('nodeWidth' in $$props) $$invalidate(10, nodeWidth = $$props.nodeWidth);
    		if ('nodePadding' in $$props) $$invalidate(11, nodePadding = $$props.nodePadding);
    		if ('linkSort' in $$props) $$invalidate(12, linkSort = $$props.linkSort);
    		if ('nodeId' in $$props) $$invalidate(13, nodeId = $$props.nodeId);
    		if ('label' in $$props) $$invalidate(3, label = $$props.label);
    		if ('link' in $$props) $$invalidate(4, link = $$props.link);
    		if ('sankey' in $$props) $$invalidate(14, sankey = $$props.sankey);
    		if ('sankeyData' in $$props) $$invalidate(5, sankeyData = $$props.sankeyData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*nodeWidth, nodePadding, nodeId, $width, $height, linkSort*/ 80900) {
    			$$invalidate(14, sankey = Sankey$1().// .nodeAlign(nodeAlign)
    			nodeWidth(nodeWidth).nodePadding(nodePadding).nodeId(nodeId).size([$width, $height]).linkSort(linkSort).iterations(200));
    		}

    		if ($$self.$$.dirty & /*sankey, $data*/ 49152) {
    			$$invalidate(5, sankeyData = sankey($data));
    		}
    	};

    	$$invalidate(4, link = sankeyLinkHorizontal());

    	return [
    		hoveredNode,
    		hoveredLink,
    		$width,
    		label,
    		link,
    		sankeyData,
    		data,
    		width,
    		height,
    		color,
    		nodeWidth,
    		nodePadding,
    		linkSort,
    		nodeId,
    		sankey,
    		$data,
    		$height,
    		mousemove_handler,
    		mouseout_handler,
    		blur_handler,
    		mousemove_handler_1,
    		mouseout_handler_1,
    		blur_handler_1,
    		text_1_binding
    	];
    }

    class Sankey_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			hoveredNode: 0,
    			hoveredLink: 1,
    			nodeWidth: 10,
    			nodePadding: 11,
    			linkSort: 12,
    			nodeId: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sankey_1",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*hoveredNode*/ ctx[0] === undefined && !('hoveredNode' in props)) {
    			console.warn("<Sankey> was created without expected prop 'hoveredNode'");
    		}

    		if (/*hoveredLink*/ ctx[1] === undefined && !('hoveredLink' in props)) {
    			console.warn("<Sankey> was created without expected prop 'hoveredLink'");
    		}
    	}

    	get hoveredNode() {
    		throw new Error("<Sankey>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hoveredNode(value) {
    		throw new Error("<Sankey>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hoveredLink() {
    		throw new Error("<Sankey>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hoveredLink(value) {
    		throw new Error("<Sankey>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nodeWidth() {
    		throw new Error("<Sankey>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nodeWidth(value) {
    		throw new Error("<Sankey>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nodePadding() {
    		throw new Error("<Sankey>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nodePadding(value) {
    		throw new Error("<Sankey>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get linkSort() {
    		throw new Error("<Sankey>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set linkSort(value) {
    		throw new Error("<Sankey>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nodeId() {
    		throw new Error("<Sankey>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nodeId(value) {
    		throw new Error("<Sankey>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function formatDecimal(x) {
      return Math.abs(x = Math.round(x)) >= 1e21
          ? x.toLocaleString("en").replace(/,/g, "")
          : x.toString(10);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimalParts(1.23) returns ["123", 0].
    function formatDecimalParts(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
      });
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
      this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
      this.align = specifier.align === undefined ? ">" : specifier.align + "";
      this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
      this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
      this.zero = !!specifier.zero;
      this.width = specifier.width === undefined ? undefined : +specifier.width;
      this.comma = !!specifier.comma;
      this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
      this.trim = !!specifier.trim;
      this.type = specifier.type === undefined ? "" : specifier.type + "";
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width === undefined ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "%": (x, p) => (x * 100).toFixed(p),
      "b": (x) => Math.round(x).toString(2),
      "c": (x) => x + "",
      "d": formatDecimal,
      "e": (x, p) => x.toExponential(p),
      "f": (x, p) => x.toFixed(p),
      "g": (x, p) => x.toPrecision(p),
      "o": (x) => Math.round(x).toString(8),
      "p": (x, p) => formatRounded(x * 100, p),
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": (x) => Math.round(x).toString(16).toUpperCase(),
      "x": (x) => Math.round(x).toString(16)
    };

    function identity(x) {
      return x;
    }

    var map = Array.prototype.map,
        prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity : formatNumerals(map.call(locale.numerals, String)),
          percent = locale.percent === undefined ? "%" : locale.percent + "",
          minus = locale.minus === undefined ? "−" : locale.minus + "",
          nan = locale.nan === undefined ? "NaN" : locale.nan + "";

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Determine the sign. -0 is not less than 0, but 1 / -0 is!
            var valueNegative = value < 0 || 1 / value < 0;

            // Perform the initial formatting.
            value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim(value);

            // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
            if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale;
    var format;

    defaultLocale({
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      format = locale.format;
      return locale;
    }

    /* src/Tooltip.svelte generated by Svelte v3.42.1 */
    const file$1 = "src/Tooltip.svelte";

    // (46:2) {#if hovered}
    function create_if_block(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*hoveredNode*/ ctx[0]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$2();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(46:2) {#if hovered}",
    		ctx
    	});

    	return block;
    }

    // (62:4) {:else}
    function create_else_block(ctx) {
    	let div0;
    	let t0_value = /*hovered*/ ctx[3].data.source.id + "";
    	let t0;
    	let t1;
    	let t2_value = /*hovered*/ ctx[3].data.target.id + "";
    	let t2;
    	let t3;
    	let div1;
    	let t4_value = /*formatDollars*/ ctx[8](/*hovered*/ ctx[3].data.value) + "";
    	let t4;

    	const block = {
    		c: function create() {
    			div0 = element$1("div");
    			t0 = text(t0_value);
    			t1 = text(" → ");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element$1("div");
    			t4 = text(t4_value);
    			attr_dev(div0, "class", "description");
    			add_location(div0, file$1, 62, 6, 1711);
    			attr_dev(div1, "class", "value svelte-1bplenv");
    			add_location(div1, file$1, 65, 6, 1816);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hovered*/ 8 && t0_value !== (t0_value = /*hovered*/ ctx[3].data.source.id + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*hovered*/ 8 && t2_value !== (t2_value = /*hovered*/ ctx[3].data.target.id + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*hovered*/ 8 && t4_value !== (t4_value = /*formatDollars*/ ctx[8](/*hovered*/ ctx[3].data.value) + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(62:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (47:4) {#if hoveredNode}
    function create_if_block_1(ctx) {
    	let div0;
    	let t0_value = /*hovered*/ ctx[3].data.id + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*hovered*/ ctx[3].data.definition + "";
    	let t2;
    	let t3;
    	let if_block_anchor;
    	let if_block = /*hovered*/ ctx[3].data.category != "funds" && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			div0 = element$1("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element$1("div");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty$2();
    			attr_dev(div0, "class", "title svelte-1bplenv");
    			add_location(div0, file$1, 47, 6, 1317);
    			attr_dev(div1, "class", "definition");
    			add_location(div1, file$1, 53, 6, 1475);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t2);
    			insert_dev(target, t3, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hovered*/ 8 && t0_value !== (t0_value = /*hovered*/ ctx[3].data.id + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*hovered*/ 8 && t2_value !== (t2_value = /*hovered*/ ctx[3].data.definition + "")) set_data_dev(t2, t2_value);

    			if (/*hovered*/ ctx[3].data.category != "funds") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t3);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(47:4) {#if hoveredNode}",
    		ctx
    	});

    	return block;
    }

    // (57:6) {#if hovered.data.category != "funds"}
    function create_if_block_2(ctx) {
    	let div;
    	let t_value = /*formatDollars*/ ctx[8](/*hovered*/ ctx[3].data.value) + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element$1("div");
    			t = text(t_value);
    			attr_dev(div, "class", "value svelte-1bplenv");
    			add_location(div, file$1, 57, 8, 1600);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hovered*/ 8 && t_value !== (t_value = /*formatDollars*/ ctx[8](/*hovered*/ ctx[3].data.value) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(57:6) {#if hovered.data.category != \\\"funds\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let div_style_value;
    	let div_resize_listener;
    	let if_block = /*hovered*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element$1("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "" + (null_to_empty(`tooltip`) + " svelte-1bplenv"));

    			attr_dev(div, "style", div_style_value = /*hovered*/ ctx[3] && /*hovered*/ ctx[3].e && `top: ${/*hovered*/ ctx[3].e.offsetY - /*tooltipHeight*/ ctx[2] / 2 > /*$height*/ ctx[4]
			? /*hovered*/ ctx[3].e.offsetY - /*tooltipHeight*/ ctx[2]
			: /*hovered*/ ctx[3].e.offsetY - /*tooltipHeight*/ ctx[2] / 2}px; left: ${/*hovered*/ ctx[3].e.offsetX + /*tooltipWidth*/ ctx[1] > /*$width*/ ctx[5]
			? /*hovered*/ ctx[3].e.offsetX - /*tooltipWidth*/ ctx[1] < 0
				? /*hovered*/ ctx[3].e.offsetX - /*tooltipWidth*/ ctx[1] / 2
				: /*hovered*/ ctx[3].e.offsetX - /*tooltipWidth*/ ctx[1] - offset
			: /*hovered*/ ctx[3].e.offsetX + offset}px;`);

    			add_render_callback(() => /*div_elementresize_handler*/ ctx[10].call(div));
    			toggle_class(div, "active", /*hovered*/ ctx[3]);
    			add_location(div, file$1, 26, 0, 691);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[10].bind(div));
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*hovered*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*hovered, tooltipHeight, $height, tooltipWidth, $width*/ 62 && div_style_value !== (div_style_value = /*hovered*/ ctx[3] && /*hovered*/ ctx[3].e && `top: ${/*hovered*/ ctx[3].e.offsetY - /*tooltipHeight*/ ctx[2] / 2 > /*$height*/ ctx[4]
			? /*hovered*/ ctx[3].e.offsetY - /*tooltipHeight*/ ctx[2]
			: /*hovered*/ ctx[3].e.offsetY - /*tooltipHeight*/ ctx[2] / 2}px; left: ${/*hovered*/ ctx[3].e.offsetX + /*tooltipWidth*/ ctx[1] > /*$width*/ ctx[5]
			? /*hovered*/ ctx[3].e.offsetX - /*tooltipWidth*/ ctx[1] < 0
				? /*hovered*/ ctx[3].e.offsetX - /*tooltipWidth*/ ctx[1] / 2
				: /*hovered*/ ctx[3].e.offsetX - /*tooltipWidth*/ ctx[1] - offset
			: /*hovered*/ ctx[3].e.offsetX + offset}px;`)) {
    				attr_dev(div, "style", div_style_value);
    			}

    			if (dirty & /*hovered*/ 8) {
    				toggle_class(div, "active", /*hovered*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			div_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const offset = 15;

    function instance$1($$self, $$props, $$invalidate) {
    	let hovered;
    	let $height;
    	let $width;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tooltip', slots, []);
    	const { width, height } = getContext("LayerCake");
    	validate_store(width, 'width');
    	component_subscribe($$self, width, value => $$invalidate(5, $width = value));
    	validate_store(height, 'height');
    	component_subscribe($$self, height, value => $$invalidate(4, $height = value));
    	let tooltipWidth, tooltipHeight;
    	let { hoveredNode, hoveredLink } = $$props;

    	//   $height
    	// );
    	// console.log(hoveredNode);
    	const formatDollars = d => {
    		return format("$0.3s")(d).replace(/G/, "B").toLowerCase();
    	};

    	const writable_props = ['hoveredNode', 'hoveredLink'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tooltip> was created with unknown prop '${key}'`);
    	});

    	function div_elementresize_handler() {
    		tooltipWidth = this.clientWidth;
    		tooltipHeight = this.clientHeight;
    		$$invalidate(1, tooltipWidth);
    		$$invalidate(2, tooltipHeight);
    	}

    	$$self.$$set = $$props => {
    		if ('hoveredNode' in $$props) $$invalidate(0, hoveredNode = $$props.hoveredNode);
    		if ('hoveredLink' in $$props) $$invalidate(9, hoveredLink = $$props.hoveredLink);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		format,
    		dataset_dev,
    		width,
    		height,
    		offset,
    		tooltipWidth,
    		tooltipHeight,
    		hoveredNode,
    		hoveredLink,
    		formatDollars,
    		hovered,
    		$height,
    		$width
    	});

    	$$self.$inject_state = $$props => {
    		if ('tooltipWidth' in $$props) $$invalidate(1, tooltipWidth = $$props.tooltipWidth);
    		if ('tooltipHeight' in $$props) $$invalidate(2, tooltipHeight = $$props.tooltipHeight);
    		if ('hoveredNode' in $$props) $$invalidate(0, hoveredNode = $$props.hoveredNode);
    		if ('hoveredLink' in $$props) $$invalidate(9, hoveredLink = $$props.hoveredLink);
    		if ('hovered' in $$props) $$invalidate(3, hovered = $$props.hovered);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*hoveredNode, hoveredLink*/ 513) {
    			$$invalidate(3, hovered = hoveredNode ? hoveredNode : hoveredLink);
    		}

    		if ($$self.$$.dirty & /*hoveredNode*/ 1) ;
    	};

    	return [
    		hoveredNode,
    		tooltipWidth,
    		tooltipHeight,
    		hovered,
    		$height,
    		$width,
    		width,
    		height,
    		formatDollars,
    		hoveredLink,
    		div_elementresize_handler
    	];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { hoveredNode: 0, hoveredLink: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*hoveredNode*/ ctx[0] === undefined && !('hoveredNode' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'hoveredNode'");
    		}

    		if (/*hoveredLink*/ ctx[9] === undefined && !('hoveredLink' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'hoveredLink'");
    		}
    	}

    	get hoveredNode() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hoveredNode(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hoveredLink() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hoveredLink(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.1 */
    const file = "src/App.svelte";

    // (15:6) <Svg>
    function create_default_slot_1(ctx) {
    	let defs;
    	let linearGradient0;
    	let stop0;
    	let stop1;
    	let linearGradient1;
    	let stop2;
    	let stop3;
    	let t;
    	let sankey;
    	let updating_hoveredNode;
    	let updating_hoveredLink;
    	let current;

    	function sankey_hoveredNode_binding(value) {
    		/*sankey_hoveredNode_binding*/ ctx[2](value);
    	}

    	function sankey_hoveredLink_binding(value) {
    		/*sankey_hoveredLink_binding*/ ctx[3](value);
    	}

    	let sankey_props = {};

    	if (/*hoveredNode*/ ctx[0] !== void 0) {
    		sankey_props.hoveredNode = /*hoveredNode*/ ctx[0];
    	}

    	if (/*hoveredLink*/ ctx[1] !== void 0) {
    		sankey_props.hoveredLink = /*hoveredLink*/ ctx[1];
    	}

    	sankey = new Sankey_1({ props: sankey_props, $$inline: true });
    	binding_callbacks.push(() => bind(sankey, 'hoveredNode', sankey_hoveredNode_binding));
    	binding_callbacks.push(() => bind(sankey, 'hoveredLink', sankey_hoveredLink_binding));

    	const block = {
    		c: function create() {
    			defs = svg_element("defs");
    			linearGradient0 = svg_element("linearGradient");
    			stop0 = svg_element("stop");
    			stop1 = svg_element("stop");
    			linearGradient1 = svg_element("linearGradient");
    			stop2 = svg_element("stop");
    			stop3 = svg_element("stop");
    			t = space();
    			create_component(sankey.$$.fragment);
    			attr_dev(stop0, "offset", "0%");
    			attr_dev(stop0, "stop-color", "#25C2E4");
    			add_location(stop0, file, 17, 13, 461);
    			attr_dev(stop1, "offset", "100%");
    			attr_dev(stop1, "stop-color", "#FFCA42");
    			add_location(stop1, file, 17, 54, 502);
    			attr_dev(linearGradient0, "id", "rToF");
    			attr_dev(linearGradient0, "x1", "0");
    			attr_dev(linearGradient0, "y1", "0");
    			attr_dev(linearGradient0, "x2", "100%");
    			attr_dev(linearGradient0, "y2", "0");
    			add_location(linearGradient0, file, 16, 10, 391);
    			attr_dev(stop2, "offset", "0%");
    			attr_dev(stop2, "stop-color", "#FFCA42");
    			add_location(stop2, file, 23, 13, 694);
    			attr_dev(stop3, "offset", "100%");
    			attr_dev(stop3, "stop-color", "#F15F27");
    			add_location(stop3, file, 23, 54, 735);
    			attr_dev(linearGradient1, "id", "fToS");
    			attr_dev(linearGradient1, "x1", "0");
    			attr_dev(linearGradient1, "y1", "0");
    			attr_dev(linearGradient1, "x2", "100%");
    			attr_dev(linearGradient1, "y2", "0");
    			add_location(linearGradient1, file, 22, 10, 624);
    			add_location(defs, file, 15, 8, 374);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, defs, anchor);
    			append_dev(defs, linearGradient0);
    			append_dev(linearGradient0, stop0);
    			append_dev(linearGradient0, stop1);
    			append_dev(defs, linearGradient1);
    			append_dev(linearGradient1, stop2);
    			append_dev(linearGradient1, stop3);
    			insert_dev(target, t, anchor);
    			mount_component(sankey, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sankey_changes = {};

    			if (!updating_hoveredNode && dirty & /*hoveredNode*/ 1) {
    				updating_hoveredNode = true;
    				sankey_changes.hoveredNode = /*hoveredNode*/ ctx[0];
    				add_flush_callback(() => updating_hoveredNode = false);
    			}

    			if (!updating_hoveredLink && dirty & /*hoveredLink*/ 2) {
    				updating_hoveredLink = true;
    				sankey_changes.hoveredLink = /*hoveredLink*/ ctx[1];
    				add_flush_callback(() => updating_hoveredLink = false);
    			}

    			sankey.$set(sankey_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sankey.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sankey.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(defs);
    			if (detaching) detach_dev(t);
    			destroy_component(sankey, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(15:6) <Svg>",
    		ctx
    	});

    	return block;
    }

    // (14:4) <LayerCake {data} padding={{ top: 30, right: 0, bottom: 0, left: 0 }}>
    function create_default_slot(ctx) {
    	let svg;
    	let t;
    	let tooltip;
    	let current;

    	svg = new Svg({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tooltip = new Tooltip({
    			props: {
    				hoveredNode: /*hoveredNode*/ ctx[0],
    				hoveredLink: /*hoveredLink*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    			t = space();
    			create_component(tooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(tooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};

    			if (dirty & /*$$scope, hoveredNode, hoveredLink*/ 19) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);
    			const tooltip_changes = {};
    			if (dirty & /*hoveredNode*/ 1) tooltip_changes.hoveredNode = /*hoveredNode*/ ctx[0];
    			if (dirty & /*hoveredLink*/ 2) tooltip_changes.hoveredLink = /*hoveredLink*/ ctx[1];
    			tooltip.$set(tooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			transition_in(tooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			transition_out(tooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(tooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(14:4) <LayerCake {data} padding={{ top: 30, right: 0, bottom: 0, left: 0 }}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div;
    	let layercake;
    	let current;

    	layercake = new LayerCake({
    			props: {
    				data,
    				padding: { top: 30, right: 0, bottom: 0, left: 0 },
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element$1("main");
    			div = element$1("div");
    			create_component(layercake.$$.fragment);
    			attr_dev(div, "class", "chart-container svelte-1669twz");
    			add_location(div, file, 12, 2, 249);
    			attr_dev(main, "class", "svelte-1669twz");
    			add_location(main, file, 11, 0, 240);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(layercake, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layercake_changes = {};

    			if (dirty & /*$$scope, hoveredNode, hoveredLink*/ 19) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layercake.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layercake.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(layercake);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let hoveredNode, hoveredLink;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function sankey_hoveredNode_binding(value) {
    		hoveredNode = value;
    		$$invalidate(0, hoveredNode);
    	}

    	function sankey_hoveredLink_binding(value) {
    		hoveredLink = value;
    		$$invalidate(1, hoveredLink);
    	}

    	$$self.$capture_state = () => ({
    		LayerCake,
    		Svg,
    		data,
    		Sankey: Sankey_1,
    		Tooltip,
    		hoveredNode,
    		hoveredLink
    	});

    	$$self.$inject_state = $$props => {
    		if ('hoveredNode' in $$props) $$invalidate(0, hoveredNode = $$props.hoveredNode);
    		if ('hoveredLink' in $$props) $$invalidate(1, hoveredLink = $$props.hoveredLink);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		hoveredNode,
    		hoveredLink,
    		sankey_hoveredNode_binding,
    		sankey_hoveredLink_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
