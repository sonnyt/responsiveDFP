responsiveDFP
=============

Google Doubleclick for Publishers tag wrapper that adds responsive ad loading ability.

Quick Start
=
Step 1
--
Load responsiveDFP.js or responsiveDFP.min.js file in your header.

Step 2
--
Initlize your Google DFP pixel and define your Ad slots in the header. It should look something like this:

```JS
googletag.cmd.push(function() {
    slot1 = googletag.defineSlot('/####/mysite', [[970, 90]], 'header_desktop').addService(googletag.pubads());
    slot2 = googletag.defineSlot('/####/mysite', [[728,90]], 'header_ipad').addService(googletag.pubads());
    slot3 = googletag.defineSlot('/####/mysite', [[300, 250], [300, 600]], 'sidekick').addService(googletag.pubads());
    
    googletag.pubads().collapseEmptyDivs();
    googletag.enableServices();
});
```
Step 3
--
Place `<div />` tags wherever in your HTML body that you would like ads to appear. It should looks something like this:

```HTML
<div id="header_desktop"></div>
```

Step 4
--
Inside of the `<div />` tags you created above, place the `responsive_googletag` functions, as such:

```HTML
<div id="header_desktop">
	<script>
		responsive_googletag.cmd.push({
			id: 'header_desktop',
			call: 'slot1',
			query: {
			  min: 1024,
			  max: null
			}
		});
	</script>
</div>
```

Read more about tag configuration below.

Configuration
==
The `responsive_googletag` expect few parameters to correctly load and display ad units.

Variable | Value 
--- | ---
id | ID of ad unit, the same ID that you define on the div tag
call | Variable name that is assigned to this ad slot
query | Object that contains min and max width of the window, think media queries

Suggested Min and Max Width
==
Device | Min | Max
--- | --- | ---
**Desktop** | 1024 | null
**Tablet** (portrait & landscape) | 768 | 1024
**Tablet** (portrait) | 768 | 959
**Tablet** (landscape) | 960 | 1024
**Mobile** (portrait & landscape) | null | 767
**Mobile** (portrait) | 320 | 479
**Mobile** (landscape) | 480 | 767

