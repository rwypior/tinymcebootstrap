About the project
=====

This project is meant to provide user interface for Bootstrap-powered content using TinyMCE editor.

Working example
=====

Working example is available at [this repository](/index.html).

Instalation
=====

Copy css, js and webfonts directory to your server.
Include `bootstrapedit.min.js`, `bootstrapedit.min.css` and `bootstrapedit.grid.min.css`.

    <script type="text/javascript" src='js/bootstrapedit.js'></script>

    <link rel="stylesheet" href="css/bootstrapedit.css">
    <link rel="stylesheet" href="css/bootstrapedit.grid.css">

In order for bootstrapedit to work, jquery and tinymce are required to be included before bootstrapedit files.
Optionally you can include attached fontawesome styles to provide glyph icons to editor user interface.

Usage
=====

Editor is initialized by running `bootstrapeditor` method on jQuery object.
`bootstrapeditor` method accepts one optional argument: `options`.

The most basic code to set up the editor is as following:

    <script type="text/javascript">
        $(document).ready(function() {
            var editor = $("[data-role=bootstrap-edit]").bootstrapeditor({
                lang: "js/bootstrapedit-en.json"
            });
        });
    </script>

This will run the editor on all the tags that have `data-role=bootstrap-edit` HTML tag and return
the editor object.

`options` argument is optional, it might contain following properties:

- `lang`: path to language file. English language file is attached in the project - `bootstrapedit-en.json`
- `tinymceoptions`: options array for TinyMCE editor. Take a look at TinyMCE for additional reference.
  `target` setting will be overriden to match acceptable elements. Setting it manually will be discarded.

Editor object
-----

Editor object returned from `bootstrapeditor` contains objects and methods available to use on that certain editor.

*Available methods*:
- `getHtml`: return resulting HTML (without editor-related classes and tags)

*Available properties*:
- `element`: jQuery element list used on the editor