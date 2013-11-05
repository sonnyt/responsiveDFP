/**
 * ResponsiveDFP: Google Doubleclick for Publishers tag wrapper that adds responsive ad loading ability.
 * Author: Sonny T. <hi@sonnyt.com>, sonnyt.com
 */

var responsive_googletag = function () {
        // all ads
    var adUnits = Array(),
        // width of the window
        width = window.outerWidth;

        /**
         * Main Ad Unit function that provides methods
         */
    var adUnit = function () {
        // this Ad Unit
        var _unit = this;

        // check for object to make sure that it has required properties
        if (!('id' in unit) && !('call' in unit)) return;

        return {
            /**
             * Load Ad Unit
             */
            load: function () {
                // check if ad unit is already loaded
                if (unit.loaded) return;

                // check if ad unit slot is visible
                if (this.isVisibile()) {
                    var script = document.createElement("script");
                        script.type  = "text/javascript";
                        script.text = 'googletag.cmd.push(function() { googletag.display("' + unit.id +'"); });';

                    document.getElementById(unit.id).appendChild(script);

                    // set this ad unit loaded
                    unit.loaded = true;
                }
                
                this.toggle();
            },
            /**
             * Reload Ad Unit
             */
            reload: function () {
                if (this.isVisibile() && window[unit.call]) {
                    googletag.pubads().refresh([ window[unit.call] ]);
                }
            },
            /**
             * Check if Ad Unit should be visible
             * @return {Boolean} true or false
             */
            isVisibile: function () {
                var max = unit.query.max || width + 10000000;
                var min = unit.query.min || 0;

                return (width > min && width < max);
            },
            /**
             * Hdie and Show Ad Unit
             */
            toggle: function () {
                if (this.isVisibile()) {
                    document.getElementById(unit.id).style.display = 'block';
                } else {
                    document.getElementById(unit.id).style.display = 'none';
                }
            }
        }
    };

    /**
     * On window resize load and hide/show Ad Units
     */
    window.onresize = function(event) {
        width = event.target.outerWidth;

        var len = adUnits.length,
            i = 0;

        while(i < len) {
            var ad = adUnit.call(adUnits[i]);
                ad.load();
                ad.toggle();

            i++;
        }

        return width;
    };

    // visible commands
    return {
        cmd: {
            /**
             * Replicates the array().push() method but also runs ads
             * @return {Intiger} adUnits length
             */
            push: function () {
                for(var i = 0, len = arguments.length; i < len; i++) {
                    var adSlot = arguments[i];

                    if (typeof adSlot === 'object' && 'id' in adSlot && 'call' in adSlot) {
                        adUnits[adUnits.length] = adSlot;

                        var ad = adUnit.call(adSlot);
                            ad.load();
                    }
                }

                return adUnits.length;
            }
        },
        /**
         * Relead Ad Units based on visibility
         */
        reload: function () {
            var len = adUnits.length,
                i = 0;

            while(i < len) {
                var ad = adUnit.call(adUnits[i]);
                    ad.reload();

                i++;
            }
        },
        /**
         * List of all Ad Units
         * @type {Object}
         */
        units: adUnits,
    };
}();