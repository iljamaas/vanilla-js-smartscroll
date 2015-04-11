// Some callbacks first

function filterer(item, search){

    // Check if item should be shown (return true) or not (return false)
    // 'search' can be anything.. depending on what you feed the list. See below.
    var c = item.engine + ' ' + item.browser + ' ' + item.platform + ' ' + item.version + ' ' + item.grade;
    return (c.toLowerCase().indexOf(search.toLowerCase()) != -1)
}

function renderer(item, active){

    // The convention: add class 'smsc_active_row' on 'ROOT-row-element if active
    var cl = active?'smsc_active_row':'';

    // Render a row. Please note; item is referenced back to it's source! So any modification
    // here will be ... a modification :-)

    // Most likely you will need some SANE formatter here. Mustache.js?

    var c = item.engine + ' <b>' + item.browser + '</b> ' + item.platform + ' ' + item.version + ' ' + item.grade;

    return '<div class="contentblock ' + cl + '">' + item.id + ' :: ' + c + '</div>';
}

function styler(width, height) {
    // A bit nicer function to set heights to the list. prevent having style="height: XXpx;" attributes throughout
    // the code.
    return '.list-container { height: $Hpx }'.replace('$H', '' + (height-100));
}

// Some variables you will probably implement in a meaningfull way..

// A nice list with some data
var data = [
    {
        id: 1,
        engine: "Gecko",
        browser: "Firefox 1.5",
        platform: "Win 98+ / OSX.2+",
        version: "1.8",
        grade: "A"
    },
    {
        id: 2,
        engine: "Gecko",
        browser: "Firefox 2.0",
        platform: "Win 98+ / OSX.2+",
        version: "1.8",
        grade: "A"
    },
    {
        id: 3,
        engine: "Gecko",
        browser: "Firefox 3.0",
        platform: "Win 2k+ / OSX.3+",
        version: "1.9",
        grade: "A"
    },
    {
        id: 4,
        engine: "Gecko",
        browser: "Camino 1.0",
        platform: "OSX.2+",
        version: "1.8",
        grade: "A"
    },
    {
        id: 5,
        engine: "Gecko",
        browser: "Camino 1.5",
        platform: "OSX.3+",
        version: "1.8",
        grade: "A"
    },
    {
        id: 6,
        engine: "Gecko",
        browser: "Netscape 7.2",
        platform: "Win 95+ / Mac OS 8.6-9.2",
        version: "1.7",
        grade: "A"
    },
    {
        id: 7,
        engine: "Gecko",
        browser: "Netscape Browser 8",
        platform: "Win 98SE+",
        version: "1.7",
        grade: "A"
    },
    {
        id: 8,
        engine: "Gecko",
        browser: "Netscape Navigator 9",
        platform: "Win 98+ / OSX.2+",
        version: "1.8",
        grade: "A"
    },
    {
        id: 9,
        engine: "Gecko",
        browser: "Mozilla 1.0",
        platform: "Win 95+ / OSX.1+",
        version: "1",
        grade: "A"
    },
    {
        id: 10,
        engine: "Gecko",
        browser: "Mozilla 1.1",
        platform: "Win 95+ / OSX.1+",
        version: "1.1",
        grade: "A"
    },
    {
        id: 11,
        engine: "Gecko",
        browser: "Mozilla 1.2",
        platform: "Win 95+ / OSX.1+",
        version: "1.2",
        grade: "A"
    },
    {
        id: 12,
        engine: "Gecko",
        browser: "Mozilla 1.3",
        platform: "Win 95+ / OSX.1+",
        version: "1.3",
        grade: "A"
    },
    {
        id: 13,
        engine: "Gecko",
        browser: "Mozilla 1.4",
        platform: "Win 95+ / OSX.1+",
        version: "1.4",
        grade: "A"
    },
    {
        id: 14,
        engine: "Gecko",
        browser: "Mozilla 1.5",
        platform: "Win 95+ / OSX.1+",
        version: "1.5",
        grade: "A"
    },
    {
        id: 15,
        engine: "Gecko",
        browser: "Mozilla 1.6",
        platform: "Win 95+ / OSX.1+",
        version: "1.6",
        grade: "A"
    },
    {
        id: 16,
        engine: "Gecko",
        browser: "Mozilla 1.7",
        platform: "Win 98+ / OSX.1+",
        version: "1.7",
        grade: "A"
    },
    {
        id: 17,
        engine: "Gecko",
        browser: "Mozilla 1.8",
        platform: "Win 98+ / OSX.1+",
        version: "1.8",
        grade: "A"
    },
    {
        id: 18,
        engine: "Gecko",
        browser: "Seamonkey 1.1",
        platform: "Win 98+ / OSX.2+",
        version: "1.8",
        grade: "A"
    },
    {
        id: 19,
        engine: "Gecko",
        browser: "Epiphany 2.20",
        platform: "Gnome",
        version: "1.8",
        grade: "A"
    },
    {
        id: 20,
        engine: "Gecko (UTF-8: $¢€ היצוא)",
        browser: "Firefox 1.0",
        platform: "Win 98+ / OSX.2+",
        version: "1.7",
        grade: "A"
    },
    {
        id: 21,
        engine: "KHTML",
        browser: "Konqureror 3.1",
        platform: "KDE 3.1",
        version: "3.1",
        grade: "C"
    },
    {
        id: 22,
        engine: "KHTML",
        browser: "Konqureror 3.3",
        platform: "KDE 3.3",
        version: "3.3",
        grade: "A"
    },
    {
        id: 23,
        engine: "KHTML",
        browser: "Konqureror 3.5",
        platform: "KDE 3.5",
        version: "3.5",
        grade: "A"
    },
    {
        id: 24,
        engine: "Misc",
        browser: "NetFront 3.1",
        platform: "Embedded devices",
        version: "-",
        grade: "C"
    },
    {
        id: 25,
        engine: "Misc",
        browser: "NetFront 3.4",
        platform: "Embedded devices",
        version: "-",
        grade: "A"
    },
    {
        id: 26,
        engine: "Misc",
        browser: "Dillo 0.8",
        platform: "Embedded devices",
        version: "-",
        grade: "X"
    },
    {
        id: 27,
        engine: "Misc",
        browser: "Links",
        platform: "Text only",
        version: "-",
        grade: "X"
    },
    {
        id: 28,
        engine: "Misc",
        browser: "Lynx",
        platform: "Text only",
        version: "-",
        grade: "X"
    },
    {
        id: 29,
        engine: "Misc",
        browser: "IE Mobile",
        platform: "Windows Mobile 6",
        version: "-",
        grade: "C"
    },
    {
        id: 30,
        engine: "Misc",
        browser: "PSP browser",
        platform: "PSP",
        version: "-",
        grade: "C"
    },
    {
        id: 31,
        engine: "Other browsers",
        browser: "All others",
        platform: "-",
        version: "-",
        grade: "U"
    },
    {
        id: 32,
        engine: "Presto",
        browser: "Opera 7.0",
        platform: "Win 95+ / OSX.1+",
        version: "-",
        grade: "A"
    },
    {
        id: 33,
        engine: "Presto",
        browser: "Opera 7.5",
        platform: "Win 95+ / OSX.2+",
        version: "-",
        grade: "A"
    },
    {
        id: 34,
        engine: "Presto",
        browser: "Opera 8.0",
        platform: "Win 95+ / OSX.2+",
        version: "-",
        grade: "A"
    },
    {
        id: 35,
        engine: "Presto",
        browser: "Opera 8.5",
        platform: "Win 95+ / OSX.2+",
        version: "-",
        grade: "A"
    },
    {
        id: 36,
        engine: "Presto",
        browser: "Opera 9.0",
        platform: "Win 95+ / OSX.3+",
        version: "-",
        grade: "A"
    },
    {
        id: 37,
        engine: "Presto",
        browser: "Opera 9.2",
        platform: "Win 88+ / OSX.3+",
        version: "-",
        grade: "A"
    },
    {
        id: 38,
        engine: "Presto",
        browser: "Opera 9.5",
        platform: "Win 88+ / OSX.3+",
        version: "-",
        grade: "A"
    },
    {
        id: 39,
        engine: "Presto",
        browser: "Opera for Wii",
        platform: "Wii",
        version: "-",
        grade: "A"
    },
    {
        id: 40,
        engine: "Presto",
        browser: "Nokia N800",
        platform: "N800",
        version: "-",
        grade: "A"
    },
    {
        id: 41,
        engine: "Presto",
        browser: "Nintendo DS browser",
        platform: "Nintendo DS",
        version: "8.5",
        grade: "C/A1"
    },
    {
        id: 42,
        engine: "Tasman",
        browser: "Internet Explorer 4.5",
        platform: "Mac OS 8-9",
        version: "-",
        grade: "X"
    },
    {
        id: 43,
        engine: "Tasman",
        browser: "Internet Explorer 5.1",
        platform: "Mac OS 7.6-9",
        version: "1",
        grade: "C"
    },
    {
        id: 44,
        engine: "Tasman",
        browser: "Internet Explorer 5.2",
        platform: "Mac OS 8-X",
        version: "1",
        grade: "C"
    },
    {
        id: 45,
        engine: "Trident",
        browser: "Internet Explorer 4.0",
        platform: "Win 95+ (Entity: &)",
        version: "4",
        grade: "X"
    },
    {
        id: 46,
        engine: "Trident",
        browser: "Internet Explorer 5.0",
        platform: "Win 95+",
        version: "5",
        grade: "C"
    },
    {
        id: 47,
        engine: "Trident",
        browser: "Internet Explorer 5.5",
        platform: "Win 95+",
        version: "5.5",
        grade: "A"
    },
    {
        id: 48,
        engine: "Trident",
        browser: "Internet Explorer 6",
        platform: "Win 98+",
        version: "6",
        grade: "A"
    },
    {
        id: 49,
        engine: "Trident",
        browser: "Internet Explorer 7",
        platform: "Win XP SP2+",
        version: "7",
        grade: "A"
    },
    {
        id: 50,
        engine: "Trident",
        browser: "AOL browser (AOL desktop)",
        platform: "Win XP",
        version: "6",
        grade: "A"
    },
    {
        id: 51,
        engine: "Webkit",
        browser: "Safari 1.2",
        platform: "OSX.3",
        version: "125.5",
        grade: "A"
    },
    {
        id: 52,
        engine: "Webkit",
        browser: "Safari 1.3",
        platform: "OSX.3",
        version: "312.8",
        grade: "A"
    },
    {
        id: 53,
        engine: "Webkit",
        browser: "Safari 2.0",
        platform: "OSX.4+",
        version: "419.3",
        grade: "A"
    },
    {
        id: 54,
        engine: "Webkit",
        browser: "Safari 3.0",
        platform: "OSX.4+",
        version: "522.1",
        grade: "A"
    },
    {
        id: 55,
        engine: "Webkit",
        browser: "OmniWeb 5.5",
        platform: "OSX.4+",
        version: "420",
        grade: "A"
    },
    {
        id: 56,
        engine: "Webkit",
        browser: "iPod Touch / iPhone",
        platform: "iPod",
        version: "420.1",
        grade: "A"
    },
    {
        id: 57,
        engine: "Webkit",
        browser: "S60",
        platform: "S60",
        version: "413",
        grade: "A"
    }
]

// Searchterm could be some text, but also a more complex structure, it is passed to the filterfn callback
// function, in this example the filterer function above.
var search = '';

// Order can be simply one of the data 'keys'  e.g. 'id' with possible '-' as prefix for descending sort.
// You can assign a custum sorter-function to 'order' to use more complex sorting algorithms.
var order = '-id';


// Actual use of the smartscoll

// Sane styling
smartscroll.viewport_styler.addStyleCreator(styler);

// Instantiate a list
var myList = smartscroll.List({renderfn: renderer, filterfn: filterer});

// Feed the list with some data
myList.loadData(data);

// Initialise the list
myList.set({filter: search, order: order}); // the set function MUST at least be called once!

// Instantiate the smartscroll by assign a container and the list
var myPane = smartscroll.Scroll( {container: document.querySelector('.list-container'), list: myList } );


document.querySelector('.list-container').addEventListener('row-activated',function(evt){
    console.log(evt.detail);
}, false);


myList.addListener(myPane);  // Usefull if you tend to CHANGE the data

myPane.setRowHeight(100); // 100 is also the default, but just as an example


// Polyfill for creating CustomEvents on IE9/10/11
// https://github.com/krambuhl/custom-event-polyfill/blob/master/custom-event-polyfill.js

if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
    var CustomEvent = function(event, params) {
        var evt;
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };

        evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent; // expose definition to window
}