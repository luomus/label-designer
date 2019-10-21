# Standalone app

You can fetch standalone version of this app from link bellow. We're using [js-xlsx](https://github.com/protobi/js-xlsx/tree/beta)
to read the files so any format supported by that library is also supported by this library.
  
To be able to provide the standalone version for different operating systems
we've wrapped this library with [electron](https://electronjs.org).
Source code for this app is publicly available 
[here](https://bitbucket.org/luomus/laji.fi-front/src/development/projects/label-designer-electron/).

### Usage

First prepare spreadsheet with the data you want to label. It can have data something like this:

|  id  | data gathered | species          |
|------|---------------|------------------|
| 1    | 2019-01-02    | Parus major      |
| 2    | 2019-02-03    | Sciurus vulgaris |

1. Import the file using the menu item from File > Import from file...
2. Choose the file from the menu and fill in the form.
3. Now that the data is imported you can design the label or load any of you previously saved
labels. 
4. Available fields are automatically generated based on the first row in the file loaded.

# Download

* [linux](https://cdn.laji.fi/label-designer/label-designer-linux-x64.tar.gz)
* [mac](https://cdn.laji.fi/label-designer/label-designer-darwin-x64.zip)
* [windows](https://cdn.laji.fi/label-designer/label-designer-windows.zip)
