(function($) {
    /**
     * Initialize tinymce editor for Bootstrap grid
     * @param {*} options 
     *   lang: Path to language JSON
     *   tinymceoptions: Object containing TinyMCE options. Target parameter is set automatically.
     */
    $.fn.bootstrapeditor = function(options) {

        const MODE_DESKTOP = 1;
        const MODE_DESKTOP_SMALL = 2;
        const MODE_TABLET = 3;
        const MODE_MOBILE = 4;

        const SIZE_DESKTOP = 1200;
        const SIZE_DESKTOP_SMALL = 991;
        const SIZE_TABLET = 767;
        const SIZE_MOBILE = 575;

        const DIR_LEFT = -1;
        const DIR_RIGHT = 1;
        const DIR_UP = -2;
        const DIR_DOWN = 2;

        const DEFAULT_OPTIONS = {
            "lang": "assets/js/bootstrapedit-en.json",
            "tinymceoptions": {
                inline: true
            }
        };

        const OPTIONS_LANG = "lang";

        let currentMode = MODE_DESKTOP;
        let dict = null;

        function getHtml()
        {
            let $clone = $editElements.clone();
            $clone.find(".mce-content-body").children().unwrap();
            $clone.find("[data-role=bootstrap-edit-main-control-panel]").remove();
            $clone.find("[data-role=bootstrap-edit-col-control-panel]").remove();
            $clone.find("[data-role=bootstrap-edit-row-control-panel]").remove();
            let html = $clone.html();

            return html;
        }

        function translateSize(size)
        {
            switch(size)
            {
                case MODE_DESKTOP: return "lg";
                case MODE_DESKTOP_SMALL: return "md";
                case MODE_TABLET: return "sm";
                case MODE_MOBILE: return "xs";
            }

            return null;
        }

        function findSizeClass($column, size)
        {
            let cssclass = $column.attr("class");
            let split = cssclass ? cssclass.split(" ") : [];

            size = translateSize(size);

            for (let c in split)
            {
                let cc = split[c];
                if (cc.startsWith("col-" + size))
                    return cc;
            }

            return null;
        }

        function setupRow($row)
        {
            let $controlPanelRow = $("<div data-role='bootstrap-edit-row-control-panel'></div>");

            let $addcolumn = $('<i class="bootstrap-edit-button" title="' + dict.addcolumn + '"><i class="fas fa-plus-circle"></i></i>');
            let $rowmoveup = $('<i class="bootstrap-edit-button" title="' + dict.moveup + '"><i class="fas fa-caret-square-up"></i></i>');
            let $rowmovedown = $('<i class="bootstrap-edit-button" title="' + dict.movedown + '"><i class="fas fa-caret-square-down"></i></i>');
            let $rowremove = $('<i class="bootstrap-edit-button" title="' + dict.remove + '"><i class="fas fa-trash-alt"></i>');

            $addcolumn.click(function() {
                createColumn($(this).closest(".row"));
            });

            $rowmoveup.click(function() {
                moveRow(DIR_UP, $(this).closest(".row"));
            });

            $rowmovedown.click(function() {
                moveRow(DIR_DOWN, $(this).closest(".row"));
            });

            $rowremove.click(function() {
                removeRow($(this).closest(".row"));
            });

            $controlPanelRow.append($addcolumn);
            $controlPanelRow.append($rowmoveup);
            $controlPanelRow.append($rowmovedown);
            $controlPanelRow.append($rowremove);

            $row.append($controlPanelRow);

            let $columns = $row.find("[class^=col]");
            $columns.each(function(iCol, eCol) {
                let $col = $(eCol);

                setupColumn($col);
            });
        }

        function setupColumn($column)
        {
            if (!findSizeClass($column, MODE_DESKTOP))
                $column.addClass("col-lg-3");
            if (!findSizeClass($column, MODE_DESKTOP_SMALL))
                $column.addClass("col-md-3");
            if (!findSizeClass($column, MODE_TABLET))
                $column.addClass("col-sm-6");
            if (!findSizeClass($column, MODE_MOBILE))
                $column.addClass("col-xs-12");

            let $controlPanelCol = $('<div data-role="bootstrap-edit-col-control-panel"></div>');
            let $downsize = $('<i class="bootstrap-edit-button" title="' + dict.shrink + '"><i class="fas fa-minus-square"></i></i>');
            let $upsize = $('<i class="bootstrap-edit-button" title="' + dict.grow + '"><i class="fas fa-plus-square"></i></i>');
            let $colmoveleft = $('<i class="bootstrap-edit-button" title="' + dict.moveleft + '"><i class="fas fa-caret-square-left"></i></i>');
            let $colmoveright = $('<i class="bootstrap-edit-button" title="' + dict.moveright + '"><i class="fas fa-caret-square-right"></i></i>');
            let $colremove = $('<i class="bootstrap-edit-button" title="' + dict.remove + '"><i class="fas fa-trash-alt"></i></i>');

            $downsize.click(function() {
                resizeCol(-1, $(this).closest("[class^=col]"));
            });

            $upsize.click(function() {
                resizeCol(1, $(this).closest("[class^=col]"));
            });

            $colmoveleft.click(function() {
                moveCol(DIR_LEFT, $(this).closest("[class^=col]"));
            });

            $colmoveright.click(function() {
                moveCol(DIR_RIGHT, $(this).closest("[class^=col]"));
            });

            $colremove.click(function() {
                removeCol($(this).closest("[class^=col]"));
            });

            $controlPanelCol.append($downsize);
            $controlPanelCol.append($upsize);
            $controlPanelCol.append($colmoveleft);
            $controlPanelCol.append($colmoveright);
            $controlPanelCol.append($colremove);

            $column.wrapInner("<div data-role='bootstrap-edit-tinymce-container'></div>").append($column);
            $column.append($controlPanelCol);

            let $tinymceContainer = $column.find("[data-role=bootstrap-edit-tinymce-container]");

            setupTinymce($tinymceContainer);
        }

        function setupTinymce($column)
        {
            let tinymceoptions = options.tinymceoptions;
            tinymceoptions.target = $column.get(0);

            tinymce.init(tinymceoptions);
        }

        function disableEditor()
        {
            //@TODO - finish this
            let $columns = $editElements.find("[class^=col]");
            $columns.each(function(i,e) {
                var $col = $(e);
                //$col.attr("data-remember-editor", 1);
                //$col.get(0).tinymce.remove();
            });
        }

        function getClassForMode($column)
        {
            let cssclass = $column.attr("class");
            let split = cssclass.split(" ");

            for (let c in split)
            {
                let cc = split[c];
                switch(currentMode)
                {
                    case MODE_DESKTOP:
                        if (cc.startsWith("col-lg"))
                            return cc;
                        break;
                    case MODE_DESKTOP_SMALL:
                        if (cc.startsWith("col-md"))
                            return cc;
                        break;
                    case MODE_TABLET:
                        if (cc.startsWith("col-sm"))
                            return cc;
                        break;
                    case MODE_MOBILE:
                        if (cc.startsWith("col-xs"))
                            return cc;
                        break;
                }
            }

            return null;
        }

        function createClassForMode(size)
        {
            let c = "";

            switch(currentMode)
            {
                case MODE_DESKTOP:
                    c = "col-lg-";
                    break;
                case MODE_DESKTOP_SMALL:
                    c = "col-md-";
                    break;
                case MODE_TABLET:
                    c = "col-sm-";
                    break;
                case MODE_MOBILE:
                    c = "col-xs-";
                    break;
            }

            return c + size;
        }

        function getColSize(cssclass)
        {
            let split = cssclass.split("-");
            return parseInt(split[2]);
        }

        function changeMode($container, newMode)
        {
            currentMode = parseInt(newMode);

            $container.removeClass("bootstrap-edit-preview-xs");
            $container.removeClass("bootstrap-edit-preview-sm");
            $container.removeClass("bootstrap-edit-preview-md");
            $container.removeClass("bootstrap-edit-preview-lg");

            switch(currentMode)
            {
                case MODE_DESKTOP:
                    $container.css("width", SIZE_DESKTOP);
                    $container.addClass("bootstrap-edit-preview-lg");
                    break;
                case MODE_DESKTOP_SMALL:
                    $container.css("width", SIZE_DESKTOP_SMALL);
                    $container.addClass("bootstrap-edit-preview-md");
                    break;
                case MODE_TABLET:
                    $container.css("width", SIZE_TABLET);
                    $container.addClass("bootstrap-edit-preview-sm");
                    break;
                case MODE_MOBILE:
                    $container.css("width", SIZE_MOBILE);
                    $container.addClass("bootstrap-edit-preview-xs");
                    break;
            }
        }

        function resizeCol(value, $column)
        {
            let cssclass = getClassForMode($column);
            $column.removeClass(cssclass);
            let size = getColSize(cssclass) + value;

            if (size > 12)
                size = 12;
            else if (size < 0)
                size = 0;

            let newClass = createClassForMode(size);
            $column.addClass(newClass);
        }

        function moveRow(direction, $row)
        {
            if (direction === DIR_UP)
            {
                $row.insertBefore($row.prev());
            }
            else if (direction === DIR_DOWN)
            {
                $row.insertAfter($row.next());
            }
        }

        function moveCol(direction, $col)
        {
            if (direction === DIR_LEFT)
            {
                $col.insertBefore($col.prev());
            }
            else if (direction === DIR_RIGHT)
            {
                $col.insertAfter($col.next());
            }
        }

        function removeRow($row)
        {
            $row.remove();
        }

        function removeCol($col)
        {
            $col.remove();
        }

        function createRow($container)
        {
            let $row = $("<div class='row'></div>");
            setupRow($row);
            $container.append($row);
        }

        function createColumn($row)
        {
            let $col = $("<div>" + dict.newcolumn + "</div>");
            setupColumn($col);
            $row.append($col);
        }

        function enablePreview()
        {
            disableEditor();
            $editElements.addClass("bootstrap-edit-preview");
        }

        function disablePreview()
        {
            $editElements.removeClass("bootstrap-edit-preview");
        }

        function loadLangFile(lang, complete)
        {
            $.ajax({
                method: "GET",
                url: lang,
                dataType: "json",
                success: function(res) {
                    dict = res;
                    if (complete != undefined)
                        complete();
                },
                error: function() {
                    console.error("Could not load language file \"" + lang + "\". Loading aborted.");
                }
            });
        }

        function isset(obj, property)
        {
            return typeof obj[property] !== 'undefined';
        }

        if (options == undefined)
            options = DEFAULT_OPTIONS;
        else
        {
            for (var optidx in DEFAULT_OPTIONS)
            {
                if (!isset(options, optidx))
                    options[optidx] = DEFAULT_OPTIONS[optidx];
            }
        }

        let $editElements = this;

        loadLangFile(options[OPTIONS_LANG], function() {

            let $container = $editElements.find(".container");
    
            let $controlPanelMain = $("<div data-role='bootstrap-edit-main-control-panel'></div>");
            let $controlPanelMode = $("<select>" +
                "<option value='" + MODE_DESKTOP + "'>" + dict.sizedesktop + "</option>" +
                "<option value='" + MODE_DESKTOP_SMALL + "'>" + dict.sizesmallerdisplay + "</option>" +
                "<option value='" + MODE_TABLET + "'>" + dict.sizetablet + "</option>" +
                "<option value='" + MODE_MOBILE + "'>" + dict.sizemobile + "</option>" +
                "</select>");
            let $addnewrow = $('<i class="bootstrap-edit-button" title="' + dict.addrow + '"><i class="fas fa-plus-circle"></i></i>');
            let $togglepreview = $("<label><span>" + dict.preview + ":</span> <input type='checkbox'></label>");
            let $getHtml = $('<i class="bootstrap-edit-button" title="' + dict.gethtml + '"><i class="fas fa-code"></i></i>');
    
            $controlPanelMode.change(function() {
                changeMode($editElements, $(this).val());
            });
            changeMode($editElements, MODE_DESKTOP);
    
            $addnewrow.click(function() {
                createRow($container);
            });
    
            $togglepreview.find("input").change(function() {
                let on = $(this).is(":checked");
                if (on)
                    enablePreview();
                else
                    disablePreview();
            });
    
            $getHtml.click(function() {
                let html = getHtml();
                console.log("Clean HTML output:");
                console.log("======================");
                console.log(html);
                console.log("======================");
            });
    
            $controlPanelMain.append($controlPanelMode);
            $controlPanelMain.append($addnewrow);
            $controlPanelMain.append($togglepreview);
            $controlPanelMain.append($getHtml);
    
            $editElements.prepend($controlPanelMain);
    
            $editElements.each(function(iEdit,eEdit) {
                let $editElement = $(eEdit);
                let $rows = $editElement.find(".row");
    
                $rows.each(function(iRow, eRow) {
                    let $row = $(eRow);
    
                    setupRow($row);
                });
            });

        });

        return {
            "element": this,
            "getHtml": getHtml
        };
    };
})(jQuery);