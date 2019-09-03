# Custom element

### Pre-requests
1. [Custom html elements](https://caniuse.com/#feat=custom-elementsv1) is quite new feature
so make sure that it meets your needs before choosing this usage option. Some of the missing 
features can be added with polyfills, but the library itself will not include these.
2. Include the library where you want to use it. You can either install this from npm or copy it
from FinBIF cdn to your server. Address is `https://cdn.laji.fi/label-designer/<version>/editor.js`.
    * Please copy it to your own server instead of referring it directly on cdn.laji.fi
(not all versions are available there and when new version is release older versions are removed there periodically).
3. Use tag on the page you like
```html
<label-designer></label-designer>
```

### Using the custom element

To get access to the element you can use the following snippet
```javascript
var labelDesigner = document.querySelector('label-designer');

// To access inputs you can access properties directly
labelDesigner.availableFields = [...];

// To access outputs you need to addEventListeners to corresponding events
labelDesigner.addEventListener('html', function(event) {
   // event.detail will hold the emitted value.
   // This event is returning object with html and filename properties so you can access them like this:
   var html = event.detail.html;
   var filename = event.detail.filename;
});
```

Source code for the custom element is available [here](https://bitbucket.org/luomus/laji.fi-front/src/development/projects/label-designer-element/)
