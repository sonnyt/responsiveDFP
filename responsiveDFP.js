/**
 * ResponsiveDFP: Google Doubleclick for Publishers tag wrapper that adds responsive ad loading ability.
 * Author: Sonny T. <hi@sonnyt.com>, sonnyt.com
 */

// Initilize variables
var responsive_googletag = responsive_googletag || {};
    responsive_googletag.cmd = responsive_googletag.cmd || [];

(function() {
    // check if "cmd" is an array
    if (responsive_googletag.cmd instanceof Array) {
        // store ad units pushed into "cmd"
        var ads = responsive_googletag.cmd;

        /**
         * Responsive Google DFP Tag
         * @return {Object} public functions
         */
        responsive_googletag = (function() {
            var adUnits = ads, // all ad units
                visibleAdUnits = [], // visible ad units
                width = window.outerWidth; // current window width

            /**
             * Initilize required parameters auto initlize
             */
            (function init() {
                /**
                 * stylesheet that hides and displays ad units
                 * the reason to use class names instead of "display: none;" is beacause
                 * google collapses empty ads using "display:none;" so we don't want to toggle that
                 */
                document.write('<style>.responsvie_dfp-visible { display: block; } .responsvie_dfp-hidden { display: none; }</style>');

                /**
                 * Listen to window resize
                 */
                window.onresize = function(event) {
                    // get outter width of window
                    width = event.target.outerWidth;

                    checkAds();

                    return width;
                };

                // check for the first time
                checkAds();

                // IE 8 and below "indexOf()" support
                if(!Array.prototype.indexOf) {
                    Array.prototype.indexOf = function(needle) {
                        for(var i = 0; i < this.length; i++) {
                            if(this[i] === needle) {
                                return i;
                            }
                        }
                        return -1;
                    };
                }
            })();

            /**
             * Check if Ad Unit should be loaded
             */
            function checkAds () {
                var i, len = adUnits.length;

                for (i = 0; i < len; i++) {
                    loadAdUnit(adUnits[i]);

                    toggleVisility(adUnits[i]);
                }
            }

            /**
             * Load Ad Unit
             * @param  {Object} adUnit ad unit that needs to be loaded
             */
            function loadAdUnit (adUnit) {
                if (adUnit.loaded) { return; }

                if (isVisible(adUnit)) {
                    if (typeof(googletag) !== 'undefined') {
                        googletag.cmd.push(function() { googletag.display(adUnit.id); });
                    }

                    adUnit.loaded = true;

                    toggleVisility(adUnit);
                }
            }

            /**
             * Check If Ad Unit is visible
             * @param  {Object}  adUnit ad unit to check
             * @return {Boolean}        true or false
             */
            function isVisible (adUnit) {
                var max = adUnit.query.max || width + 10000000;
                var min = adUnit.query.min || 0;

                return (width >= min && width <= max) ? true : false;
            }

            /**
             * Show and hide Ad Units
             * @param  {Object} adUnit ad unit that needs to be toggled
             */
            function toggleVisility (adUnit) {
                if (isVisible(adUnit)) {
                    document.getElementById(adUnit.id).className = 'responsvie_dfp-visible';

                    if (visibleAdUnits.indexOf(adUnit.call) === -1) { visibleAdUnits.push(adUnit.call); }
                } else {
                    document.getElementById(adUnit.id).className = 'responsvie_dfp-hidden';

                    if (visibleAdUnits.indexOf(adUnit.call) > -1) { visibleAdUnits.splice(visibleAdUnits.indexOf(adUnit.call), 1); }
                }
            }

            /**
             * Reload Ad Units based of visibility
             */
            function refreshAdUnits () {
                if (typeof(googletag) === 'undefined') { return; }
                
                var i, len = visibleAdUnits.length;

                for (i = 0; i < len; i++) {
                    if (window[visibleAdUnits[i]]) { googletag.pubads().refresh([ window[visibleAdUnits[i]] ]); }
                }
            }
 
            return {
                // all ad units
                units: adUnits,
                // visible ad units
                visible: visibleAdUnits,
                // available commands
                cmd: {
                    /**
                     * Custom "push()" that adds items ad units into array and loads them
                     * @return {Intiger} length of array
                     */
                    push: function () {
                        var i, len = arguments.length;

                        for(i = 0; i < len; i++) {
                            var adUnit = arguments[i];

                            // make sure adunit is an object and has "id" and "call" properties
                            if (typeof adUnit === 'object' && 'id' in adUnit && 'call' in adUnit) {
                                adUnits[adUnits.length] = adUnit;

                                // load ad unit
                                loadAdUnit(adUnit);
                            }
                        }

                        return adUnits.length;
                    }
                },
                // refresh ad units
                refresh: refreshAdUnits
            };
        })();
    }
})();