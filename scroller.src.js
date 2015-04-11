/**
 *
 * Smartscroll
 *
 * 2015 Dreamsolution B.V., Delft, The Netherlands
 *
 */

var smartscroll = function () {
    'use strict';

    function createStyler(window) {
        var handle, // timeout handle
            stylers, // style create functions
            listeners; // resize listeners

        (function () {
            listeners = [];
            stylers = [];
            window.addEventListener('resize', onResize, false);
            window.addEventListener('unload', onUnload, false);
        })();

        function create_styler(styleFn) {
            return function (width, height) {
                var s = '\n';
                if (styleFn.hasOwnProperty('name')) {
                    s += '/* ' + styleFn.name + ' */\n';
                }
                s += styleFn(width, height);
                return s;
            };
        }

        // Create a new style element with the given CSS and append, and remove
        // any earlier style element _after_ that.
        function replace_style_elm(text) {
            var cstyler = document.querySelector('head .viewport-styler');

            document.querySelector('head').insertAdjacentHTML( 'beforeend',
                    '<style type="text/css" class="viewport-styler">' +
                    text + '</style>');

            if (cstyler) {
                cstyler.parentNode.removeChild(cstyler);
            }
        }

        function eval_stylers() {
            var i,
                exprs = [],
                width = window.innerWidth,
                height = window.innerHeight;

            handle = undefined;
            for (i = 0; i < stylers.length; i++) {
                exprs.push(stylers[i](width, height));
            }
            replace_style_elm(exprs.join('\n'));

            for (i = listeners.length; i--;) {
                listeners[i]();
            }
        }

        function onResize() {
            if (handle) {
                window.clearTimeout(handle);
            }
            handle = window.setTimeout(eval_stylers, 120);
        }

        function onUnload() {
            window.clearTimeout(handle);
            listeners = handle = stylers = undefined;
        }

        return {
            resize: function resize(callbackFn) {
                listeners.push(callbackFn);
            },
            addStyleCreator: function addStyleCreator(styleFn) {
                var styler = create_styler(styleFn),
                    width = window.innerWidth,
                    height = window.innerHeight;

                stylers[stylers.length] = styler;
                // Immediately append the style:
                var elm = document.querySelector('head .viewport-styler');
                var text = elm ? elm.innerHTML : '';
                replace_style_elm(text + styler(width, height));
            },
            redraw: function redraw() {
                return onResize();
            }
        };
    }


    function smartScroll(conf) {
        var wrapper,
            pane,
            actualcontent,
            attic,
            keycapture,
            heightforcer,
            smartlist;

        var rowHeight = 120,
            listlength = 0,
            curfirst = 1,
            drawnum = 0,
            nth_active = 0; // XXX: 0 means -NO- active row!  smartlist-functions are NOT 0-based!

        (function() {
            if (conf.hasOwnProperty('height')) {
                rowHeight = conf.height;
            }
            smartlist = conf.list;
            wrapper = conf.container;

            var structure =
                '<textarea class="smsc_key_capture"></textarea>' +
                '<div class="smsc_sp">' +
                '<div class="smsc_faker"></div>' +
                '<div class="smsc_attic"></div>' +
                '<div class="smsc_ac"></div>' +
                '</div>';

            // Prepare wrapper
            wrapper.insertAdjacentHTML('afterbegin', structure);
            wrapper.classList.add('smsc_wrap');
            wrapper.addEventListener('previous',onPrevious, false);
            wrapper.addEventListener('next',onNext, false);

            // Prepare actual scrolling pane
            pane = wrapper.querySelector('.smsc_sp');
            pane.style.height = getElementHeight(wrapper);
            pane.addEventListener('scroll', onScroll, false);

            // Prepare 'content' part
            actualcontent = wrapper.querySelector('.smsc_ac');
            actualcontent.addEventListener('click', onClick, false);

            // Prepare key-event capturing
            keycapture = wrapper.querySelector('.smsc_key_capture');
            keycapture.addEventListener('focus', onFocus, false);
            keycapture.addEventListener('keydown', onKeydown, false);

            // Add the trick to get the scrollbar we want
            heightforcer = wrapper.querySelector('.smsc_faker');

            // Attic for delay thrashing of out of view DOMnodes.
            // Webkit needs this..
            attic = wrapper.querySelector('.smsc_attic');

            styler.resize(onStylerResize);

            prepareCheat();
        })();

        // Helpers.

        function easeInOutQuad(t, b, c, d) {
            t /= d/2;
            if (t < 1){
                return c/2*t*t + b;
            }
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        }

        function scrollTo(element, to, duration) {
            var start = element.scrollTop,
                change = to - start,
                currentTime = 0,
                increment = 20;

            var animateScroll = function(){
                currentTime += increment;
                var val = easeInOutQuad(currentTime, start, change, duration);
                element.scrollTop = val;
                if(currentTime < duration) {
                    setTimeout(animateScroll, increment);
                }
            };
            animateScroll();
        }

        function getElementHeight(el){
            return window.getComputedStyle(el).height;
        }

        function getPaneHeight(){
            return parseInt(getElementHeight(pane),10);
        }

        // Events

        function onFocus() {
            keycapture.focus();
        }

        function onPrevious(){
            var n = Math.max(nth_active-1, 1);
            if (n === nth_active){ return; }
            if ((n-1) * rowHeight < pane.scrollTop ){
                scrollTo(pane, (n-1) * rowHeight, 150);
            }
            nth_active = n;
            fireRowActivated();
        }

        function onNext(){
            var n = Math.min(nth_active+1, listlength);
            if (n > listlength){ return; }
            if (n * rowHeight > pane.scrollTop + getPaneHeight() ){
                scrollTo(pane, (n * rowHeight) - getPaneHeight(), 150);
            }
            nth_active = n;
            fireRowActivated();
        }

        function onKeydown(evt){
            if (evt.which === 38){
                onPrevious();
            } else if (evt.which === 40){
                onNext();
            } else if (evt.which !== 9){
                // Allow TAB, Maybe allow some more...
                evt.preventDefault();
            }
        }

        function onClick(evt) {
            onFocus();
            nth_active = parseInt(( evt.clientY -
                wrapper.getBoundingClientRect().top +
                pane.scrollTop ) / rowHeight, 10) + 1;
            fireRowActivated();
        }

        function onStylerResize() {
            pane.style.height = getElementHeight(wrapper);
            prepareCheat();
        }

        function onScroll(){
            doCheat(false);
        }

        // Fires

        function fireRowActivated(){
            wrapper.dispatchEvent(
                new CustomEvent('row-activated',
                    {detail: {
                            item: smartlist.getItemAtPosition(nth_active),
                            active_row: nth_active,
                            first_row: (nth_active === 1),
                            last_row: (nth_active === listlength)
                        },
                     bubbles: true}
                )
            );

            /* The convention is to add the .smsc_active_row class to the row-root-element. */
            var row = actualcontent.firstChild;
            var i = curfirst;
            while (row) {
                if(i === nth_active){
                    row.classList.add('smsc_active_row');
                } else {
                    row.classList.remove('smsc_active_row');
                }
                i++;
                row = row.nextSibling;
            }
        }

        // Viewport handling // All the actual 'cheating'

        function transform(d) {
            actualcontent.style.transform = 'translate(0px, ' + d + 'px)';
            actualcontent.style.webkitTransform = 'translate(0px, ' + d + 'px)';
        }

        function moveToAttic(tbr){
            attic.appendChild(tbr);
            window.setTimeout(function(){
                attic.removeChild(tbr);
            }, 1000);
        }

        function prepareCheat() {
            listlength = smartlist.getSize();
            drawnum = Math.ceil(getPaneHeight() / rowHeight) + 1;
            heightforcer.style.height = (listlength * rowHeight) + 'px';

            if(pane.scrollTop > listlength * rowHeight){
                pane.scrollTop = listlength * rowHeight - getPaneHeight();
            }
            doCheat(true);
        }

        function doCheat(listchanged) {
            var dx = 0;
            var o = pane.scrollTop;
            o = o > 0 ? o - 1 : 0;

            var first = Math.floor((o) / rowHeight) + 1;

            if (drawnum < listlength && first > (listlength - drawnum + 1)) {
                first = listlength - drawnum + 1;
                dx = rowHeight;
            }

            if (curfirst !== first || listchanged) {
                drawContent(first, listchanged);

            }
            transform(o - (o % rowHeight) - dx);

            curfirst = first;
        }

        function drawContent(startWith, listchanged) {
            /** if moving by one, just remove first one
             * and append one or vice-verse to keep performance. prevent unneeded redraws.
             */
            var t;

            if (!listchanged && startWith === curfirst + 1) {
                moveToAttic(actualcontent.firstChild);
                t = smartlist.renderItemAtPosition(curfirst + drawnum, nth_active);
                if (typeof t === 'string') {
                    actualcontent.insertAdjacentHTML('beforeend', t);
                } else {
                    actualcontent.appendChild(t);
                }
            }
            else if (!listchanged && startWith === curfirst) {
                moveToAttic(actualcontent.lastChild);
                t = smartlist.renderItemAtPosition(curfirst - 1, nth_active);
                if (typeof t === 'string') {
                    actualcontent.insertAdjacentHTML('afterbegin', t);
                } else {
                    actualcontent.insertBefore(t, actualcontent.firstChild);
                }
            }
            else {
                // too much of a hassle.. just redraw!
                while (actualcontent.firstChild) {
                    moveToAttic(actualcontent.firstChild);
                }

                for (var i = startWith; i < startWith + drawnum &&
                        i - startWith < listlength; i++) {
                    t = smartlist.renderItemAtPosition(i, nth_active);
                    if (t && typeof t === 'string') {
                        actualcontent.insertAdjacentHTML('beforeend', t);
                    } else if (t) {
                        actualcontent.appendChild(t);
                    }
                }
            }
        }

        // Public part

        return {
            handleEvent: function handleEvent(type, msg) {
                if (type === 'listchanged') {
                    nth_active = 0;
                    prepareCheat();
                }
            },
            setRowHeight: function setRowHeight(h) {
                // must be called if the row-detail-level is changed!
                rowHeight = h;
                prepareCheat();
            }
        };
    }


    function smartList(conf) {
        var list = [],
            shadowlist = [], // contains filtered or ordered list
            listeners = [],
            filterfn = conf.filterfn,
            renderfn = conf.renderfn,
            order = "id",
            filter = "";

        // We're using an object-based event handling, and not callback so that
        // we can easily hook up a smartscroll object to the accompanying
        // smartlist object.
        function fireEvent(type, evt) {
            for (var i = listeners.length; i--; ) {
                listeners[i].handleEvent.apply(listeners[i], [type, evt]);
            }
        }

        // filter callback implementation for browsers that
        // support js 1.6 array.filter:
        function js_filter_callback(item) {
            return filterfn(item, filter);
        }

        function maintainShadowList() {
            if ('filter' in list && typeof list.filter === 'function') {
                shadowlist = list.filter(js_filter_callback);
            } else {
                shadowlist = [];
                for (var i = 0; i < list.length; i++) {
                    if (filterfn(list[i], filter)) {
                        shadowlist[shadowlist.length] = list[i];
                    }
                }
            }
            shadowlist.sort(dynamicSort());
            fireEvent('listchanged', {
                size_total: list.length,
                size_filtered: shadowlist.length
            });
        }

        function dynamicSort() {
            if (typeof order === 'function') {
                return order;
            } else {
                var ordering = order[0] === "-" ? -1 : 1,
                    prop = ordering === -1 ? order.substr(1) : order;

                return function sorter(a, b) {
                    /** XXX Force the null values to be on the end,
                     *  always...(regardless of sort order):
                     */
                    var prop_a = a[prop],
                        prop_b = b[prop],
                        missing_in_a = prop_a === undefined || prop_a === null,
                        missing_in_b = prop_b === undefined || prop_b === null;

                    if (missing_in_a && missing_in_b) {
                        return 0;
                    } else if (missing_in_a) {
                        return 1;
                    } else if (missing_in_b) {
                        return -1;
                    } else {
                        return ordering * ((prop_a < prop_b) ?
                            -1 : (prop_a > prop_b) ? 1 : 0);
                    }
                };
            }
        }

        return {
            loadData: function loadData(data, redraw) {
                list = data;
                if (redraw) {
                    maintainShadowList();
                }
            },

            set: function set(settings) {
                var mt = false;
                if (settings.hasOwnProperty('filter') &&
                            settings.filter !== filter) {
                    filter = settings.filter;
                    mt = true;
                }
                if (settings.hasOwnProperty('order') &&
                            settings.order !== order) {
                    order = settings.order;
                    mt = true;
                }
                if (mt) {
                    maintainShadowList();
                }
            },

            getSize: function getSize() {
                return shadowlist.length;
            },

            getItemAtPosition: function getItemAtPosition(offset) {
                if (offset >= 0 && offset <= shadowlist.length){
                    return shadowlist[offset - 1];
                } else {
                    return;
                }
            },

            renderItemAtPosition: function renderItemAtPosition(offset, nth) {
                if (offset >= 0 && offset <= shadowlist.length){
                    return renderfn(shadowlist[offset - 1], (offset===nth));
                } else {
                    return '';
                }
            },

            addListener: function addListener(listener) {
                listeners.push(listener);
            },

            /**
             * Sort function for use in the "order" config option.
             */
            lowerCompare: function lowerCompare(a, b) {
                a = ("" + a).toLowerCase();
                b = ("" + b).toLowerCase();
                return a.localeCompare(b);
            },

            debug: function debug() {
                var t = [];
                for (var i = 0; i< shadowlist.length; i++) {
                    t.push(shadowlist[i].id);
                }
            }
        };
    }

    // There should be one instance of the styler per window.
    var styler = createStyler(window);

    return {
        viewport_styler: styler,
        Scroll: smartScroll,
        List: smartList
    };
}();
