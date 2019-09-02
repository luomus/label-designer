# Using as Angular module

To start using this library do the following steps: 
1. Make sure that you all the [dependencies](../dependencies.html) installed.
2. Import the `LabelDesignerModule` from `label-designer` package in the module 
where you want to use it.
```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LabelDesignerModule } from 'label-designer';
@NgModule({
    imports: [
        BrowserModule,
        LabelDesignerModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```
3. Use the `ll-label-designer` tag where ever needed.
```
<ll-label-designer
      (html)="onHtml($event)"
      [data]="data"
      [(availableFields)]="availableFields"
      [(setup)]="setup"
></ll-label-designer>
```

You're required to give setup object but everything else is optional, all though giving available
fields is highly recommended. Basic setup should something like this:
```json
{
  "page": {
    // Basic presets class is provided by the Label Designer and you can use that to include
    // different page sizes and known border styles 
    "height.mm": 297,
    "width.mm": 210,
    "paddingTop.mm": 10,
    "paddingLeft.mm": 10,
    "paddingBottom.mm": 10,
    "paddingRight.mm": 10
  },
  "label": {
    "height.mm": 20,
    "width.mm": 50,
    "marginTop.mm": 1.5,
    "marginLeft.mm": 1.5,
    "marginBottom.mm": 1.5,
    "marginRight.mm": 1.5,
    "font-family": "Arial",
    "font-size.pt": 9
  },
  "labelItems": [
    {
      "type": "field",
      "style": {
        "width.mm": 13,
        "height.mm": 13,
      },
      "x": 0, // x position im mm
      "y": 0, // y position im mm
      "fields": [
        {
          "field": "uri",                     // value for this is picked from the data with this key.
          "content": "http://example.com/ID", // This is displayed in the preview (with qr-code type QR Code is displayed instead)
          "label": "URI - QRCode",            // This label that is visible on the editor.
          "type": FieldType.qrCode            // This is optional and editor will enable special features based on this.
        }
      ]
    },
    {
      "type": "field",
      "style": {
        "width.mm": 35,
        "height.mm": 5,
      },
      "x": 15,
      "y": 0,
      "fields": [
        {"field": "uri", "content": "http://example.com/ID", "label": "URI", "type":  FieldType.uri},
        {"field": "species", "content": "Parus major", "label": "Species"}
      ]
    }
  ]
}
```
If you're using [json schema spec](http://json-schema.org/) you can use provided
[SchemaService](../../injectables/SchemaService.html) to 
extract available fields data for you. Please note that all the features of json schema are not supported.
Basic availableFields looks something like this:
```json
[
  {
    "field": "uri",                     // Values is picked from this key on the data
    "content": "http://example.com/ID", 
    "label": "URI - QRCode",           
    "type": "qr-code"                   // Tells the Label Designer to convert this field value to QR Code
  },
  {
    "field": "uri",
    "content": "http://example.com/ID", // This value is shown on the preview
    "label": "URI",                     // This value is shown on the editor 
    "type": "uri"
  },
  {
    "field": "",                        // This fields value is not picked from the data
    "content": "Text",
    "label": "Text",
    "type": "text"                      // text type means that the value can be inputted from editor and it's not picked from the data.
  },
  {
    "field": "gatheringEvent.dateBegin",
    "label": "Start date"
  },
  {
    "field": "gatheringEvent.dateEnd",
    "label": "End date"
  },
  {
    "field": "keywords",
    "isArray": true,                    // If the data contains an array this needs to be set to true. In the editor setting join by value on this fields tells how the different values are joined together. 
    "label": "Keywords"
  },
  //...
]
```

When the user imports excel file available fields are automatically generated based on the first
row on the excel.

More information about all the available inputs, outputs and methods of the ll-label-designer
component can found [here](../../components/LabelDesignerComponent.html).


