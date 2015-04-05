/**
 *
 * Smartscroll
 *
 * 2014 Dreamsolution B.V., Delft, The Netherlands
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
            heightforcer,
            smartlist;

        var rowHeight = 120,
            listlength = 0,
            curfirst = 1,
            drawnum = 0;

        (function() {
            if (conf.hasOwnProperty('height')) {
                rowHeight = conf.height;
            }
            smartlist = conf.list;
            wrapper = conf.container;

            var structure = '<div class="smsc_sp">' +
                '<div class="smsc_faker"></div>' +
                '<div class="smsc_attic"></div>' +
                '<div class="smsc_ac"></div>' +
                '</div>';
            wrapper.insertAdjacentHTML('afterbegin', structure);
            wrapper.classList.add('smsc_wrap');

            heightforcer = wrapper.querySelector('.smsc_faker');
            pane = wrapper.querySelector('.smsc_sp');
            actualcontent = wrapper.querySelector('.smsc_ac');
            attic = wrapper.querySelector('.smsc_attic');

            pane.style.height = getHeight(wrapper);
            pane.addEventListener('scroll', adjustView, false);

            styler.resize(onStylerResize);
            layout();
        })();

        function transform(d) {
            actualcontent.style.transform = 'translate(0px, ' + d + 'px)';
            actualcontent.style.webkitTransform = 'translate(0px, ' + d + 'px)';
        }

        function getHeight(el){
            return window.getComputedStyle(el).height;
        }

        function layout() {
            listlength = smartlist.getSize();

            drawnum = Math.ceil(parseInt(getHeight(pane),10) / rowHeight) + 1;
            heightforcer.style.height = (listlength * rowHeight) + 'px';

            if(pane.scrollTop > listlength * rowHeight){
                pane.scrollTop = listlength * rowHeight - parseInt(getHeight(pane),10);
            }
            adjustView(null, true);
        }

        function adjustView(event, listchanged) {
            var dx = 0;
            var o = pane.scrollTop;
            o = o > 0 ? o - 1 : 0;

            var firstElement = Math.floor((o) / rowHeight) + 1;

            if (drawnum < listlength && firstElement > listlength-drawnum + 1) {
                firstElement = listlength - drawnum + 1;
                dx = rowHeight;
            }

            if (curfirst !== firstElement || listchanged) {
                drawContent(firstElement, listchanged);

            }

            transform(Math.min(o - ((o % rowHeight))) - dx);

            curfirst = firstElement;
        }

        function moveToAttic(tbr){
            attic.appendChild(tbr);
            window.setTimeout(function(){
                attic.removeChild(tbr);
            }, 1000);
        }

        function drawContent(startWith, listchanged) {
            /** if moving by one, just remove first one
             * and append one or vice-verse to keep performance. prevent unneeded redraws.
             */
            var t;

            var tbr;

            if (!listchanged && startWith === curfirst + 1) {
                moveToAttic(actualcontent.firstChild);
                t = smartlist.renderItemAtPosition(curfirst + drawnum);
                if (typeof t === 'string') {
                    actualcontent.insertAdjacentHTML('beforeend', t);
                } else {
                    actualcontent.appendChild(t);
                }
            }
            else if (!listchanged && startWith === curfirst) {
                moveToAttic(actualcontent.lastChild);
                t = smartlist.renderItemAtPosition(curfirst - 1);
                if (typeof t === 'string') {
                    actualcontent.insertAdjacentHTML('afterbegin', t);
                } else {
                    actualcontent.insertBefore(t, actualcontent.firstchild);
                }
            }
            else {
                // too much of a hassle.. just redraw!
                while (actualcontent.firstChild) {
                    moveToAttic(actualcontent.firstChild);
                }

                for (var i = startWith; i < startWith + drawnum
                            && i - startWith < listlength; i++) {
                    t = smartlist.renderItemAtPosition(i);
                    if (t && typeof t === 'string') {
                        actualcontent.insertAdjacentHTML('beforeend', t);
                    } else if (t) {
                        actualcontent.appendChild(t);
                    }
                }
            }
        }

        function onStylerResize() {
            pane.style.height = window.getComputedStyle(wrapper).height;
            layout();
        }

        return {
            handleEvent: function handleEvent(type, msg) {
                if (type === 'listchanged') {
                    layout();
                    var event = new CustomEvent('my-event', { detail: msg});
                    wrapper.dispatchEvent(event);
                }
            },
            setRowHeight: function setRowHeight(h) {
                // must be called if the row-detail-level is changed!
                rowHeight = h;
                layout();
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
                if (settings.hasOwnProperty('filter')
                        && settings.filter !== filter) {
                    filter = settings.filter;
                    mt = true;
                }
                if (settings.hasOwnProperty('order')
                        && settings.order !== order) {
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

            renderItemAtPosition: function renderItemAtPosition(offset) {
                if (offset >= 0 && offset <= shadowlist.length){
                    return renderfn(shadowlist[offset - 1]);
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
