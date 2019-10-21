<a name="3.1.8"></a>
# 3.1.8 (2019-10-18)

### Features
* **core:** added default font to presets.
* **editor:** keep label value when using text type field.

### Bug fixes
* **editor:** fixed some of the fonts not being rendered correctly on the pdf
* **tools:** schema service now recognises lists with enum
* **tools:** fix schema service only picking first object from an array of objects

<a name="3.1.7"></a>
# 3.1.7 (2019-10-09)

* **tools:** fix schema service only picking first object from an array of objects

<a name="3.1.6"></a>
# 3.1.6 (2019-10-08)

### Features
* **editor:** when opening a setup will now try to update the label to match current language.

### Bug fixes
* **editor:** when loading setup merge the defaultAvailableFields mappings to the loaded data 
* **editor:** fixed few typos 

<a name="3.1.5"></a>
# 3.1.5 (2019-09-05)

### Features
* **doc:** added link to demo to README.nd

<a name="3.1.4"></a>
# 3.1.4 (2019-09-05)

### Features
* **editor:** added menu item to clear data only on the editor
* **generator:** pre-fill free text fields with the field value

<a name="3.1.3"></a>
# 3.1.3 (2019-09-03)

### Features
* **core:** added method to convert data according to schema to match available fields.
* **core:** new interface to better describe what kind of data can be used as data for the labels.
* **core:** base parameter in schemaToAvailableFields is now optional.

<a name="3.1.1"></a>
# 3.1.1 (2019-08-30)

### Features

* **core:** release instructions pages on [github.io](https://luomus.github.io/label-designer/)
* **core:** update documentation

<a name="3.1.0"></a>
# 3.1.0 (2019-08-28)

### Features

* **editor:** Added better documentation to the components
* **generator:** warn user if range contains non numeric characters

<a name="3.0.0"></a>
# 3.0.0 (2019-08-28)

### BREAKING CHANGES

* **core:** Renamed FormService to SchemaService
* **editor:** Renamed LabelMakerComponent to LabelDesignerComponent
* **editor:** html event from the editor will now return desired filename and html instead of just html  

### Features

* **editor:** Show file/template name on the top right of the edit window
* **editor:** warning when you try to move from one file to another and have unsaved changes 
* **editor:** ask for file name when making label pdf
* **generator:** generating data to text fields will now empty the text field value if there is no value in the generator dialog
* **editor:** added text transform option with capitalize, uppercase and lowercase values.
