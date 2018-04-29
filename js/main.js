(function($) {
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

        let currentMode = MODE_DESKTOP;

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
            let $addcolumn = $("<i class='button' title='Add column'>+</i>");
            let $rowmoveup = $("<i class='button' title='Move up'>^</i>");
            let $rowmovedown = $("<i class='button' title='Move down'>v</i>");
            let $rowremove = $("<i class='button' title='Remove'>x</i>");

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

            let $controlPanelCol = $("<div data-role='bootstrap-edit-col-control-panel'></div>");
            let $downsize = $("<i class='button' title='Shrink'>-</i>");
            let $upsize = $("<i class='button' title='Grow'>+</i>");
            let $colmoveleft = $("<i class='button' title='Move left'>\<</i>");
            let $colmoveright = $("<i class='button' title='Move right'>\></i>");
            let $colremove = $("<i class='button' title='Remove'>x</i>");

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
            tinymce.init({
                target: $column.get(0),
                inline: true
            });
        }

        function disableEditor()
        {
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

            $container.removeClass("preview-xs");
            $container.removeClass("preview-sm");
            $container.removeClass("preview-md");
            $container.removeClass("preview-lg");

            switch(currentMode)
            {
                case MODE_DESKTOP:
                    $container.css("width", SIZE_DESKTOP);
                    $containerasd.addClass("preview-lg");
                    break;
                case MODE_DESKTOP_SMALL:
                    $container.css("width", SIZE_DESKTOP_SMALL);
                    $container.addClass("preview-md");
                    break;
                case MODE_TABLET:
                    $container.css("width", SIZE_TABLET);
                    $container.addClass("preview-sm");
                    break;
                case MODE_MOBILE:
                    $container.css("width", SIZE_MOBILE);
                    $container.addClass("preview-xs");
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
            let $col = $("<div>New column</div>");
            setupColumn($col);
            $row.append($col);
        }

        function enablePreview()
        {
            disableEditor();
            $editElements.addClass("preview");
        }

        function disablePreview()
        {
            $editElements.removeClass("preview");
        }

        let $editElements = this;
        let $container = $editElements.find(".container");

        let $controlPanelMain = $("<div data-role='bootstrap-edit-main-control-panel'></div>");
        let $controlPanelMode = $("<select>" +
            "<option value='" + MODE_DESKTOP + "'>Desktop</option>" +
            "<option value='" + MODE_DESKTOP_SMALL + "'>Smaller display</option>" +
            "<option value='" + MODE_TABLET + "'>Tablet</option>" +
            "<option value='" + MODE_MOBILE + "'>Mobile</option>" +
            "</select>");
        let $addnewrow = $("<i class='button'>+</i>");
        let $togglepreview = $("<label>Preview: <input type='checkbox'></label>");

        $controlPanelMode.change(function() {
            changeMode($editElements, $(this).val());
        });

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

        $controlPanelMain.append($controlPanelMode);
        $controlPanelMain.append($addnewrow);
        $controlPanelMain.append($togglepreview);

        $editElements.prepend($controlPanelMain);

        $editElements.each(function(iEdit,eEdit) {
            let $editElement = $(eEdit);
            let $rows = $editElement.find(".row");

            $rows.each(function(iRow, eRow) {
                let $row = $(eRow);

                setupRow($row);
            });
        });
    };
})(jQuery);