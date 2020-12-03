/*jslint regexp: true, nomen: true, undef: true, sloppy: true, eqeq: true, vars: true, white: true, plusplus: true, maxerr: 50, indent: 4 */
/*global gdpol_polls_data*/
var gdpol_plugin_edit, gdpol_plugin_form;

;(function($, window, document, undefined) {
    gdpol_plugin_form = {
        base: "#gdpol-form-",
        run: function(poll) {
            var el = gdpol_plugin_form.base + poll,
                data = JSON.parse($(".gdpol-poll-settings", $(el)).html());

            $("form", $(el)).data("gdpol", data);

            if (data.choice !== "single" && data.limit > 0) {
                $("input[type=checkbox]", $(el)).change(function(){
                    var cnt = $("input[type=checkbox]:checked", $(el)).length;

                    if (cnt >= data.limit) {
                        $("input[type=checkbox]:not(:checked)").prop("disabled", true);
                    } else {
                        $("input[type=checkbox]").prop("disabled", false);
                    }
                });
            }

            $("form", $(el)).submit(function(){
                var submit = false;

                if ($("button", $(el)).length === 1) {
                    if (data.choice === "single") {
                        if ($("input[type=radio]:checked", $(el)).length === 1) {
                            submit = true;
                        }                        
                    } else {
                        if ($("input[type=checkbox]:checked", $(el)).length > 0) {
                            submit = true;
                        }
                    }
                }

                return submit;
            });
        }
    };

    gdpol_plugin_edit = {
        id: 1,
        seq: 1,
        tpl: "",
        run: function(seq, id) {
            gdpol_plugin_edit.seq = seq;
            gdpol_plugin_edit.id = id;

            gdpol_plugin_edit.controls();
            gdpol_plugin_edit.responses();
            gdpol_plugin_edit.validate();
        },
        controls: function() {
            $(document).on("change", ".gdpol-field-extra-select", function(){
                var key = $(this).data("field"), val = $(this).val();

                $("." + key + "-field:not(." + key + '-' + val).slideUp("fast");
                $("." + key + '-' + val).slideDown("slow");
            });

            $(document).on("change", ".gdpol-poll-status", function(){
                var is = $(this).is(":checked");

                if (is) {
                    $(".gdpol-fields-wrapper").slideDown("slow");
                } else {
                    $(".gdpol-fields-wrapper").slideUp("fast");
                }
            });
        },
        responses: function() {
            gdpol_plugin_edit.tpl = $("#gdpol-response-item-template").html();

            $(document).on("click", ".gdpol-responses-list ._minus button", function(e){
                e.preventDefault();

                $(this).closest("li").fadeOut("slow", function(){
                    $(this).remove();

                    if ($(".gdpol-responses-list li").length < 2) {
                        gdpol_plugin_edit.add_response();
                    }
                });
            });

            $(document).on("click", ".gdpol-responses-list ._down button", function(e){
                e.preventDefault();

                var item = $(this).closest("li");
                item.insertAfter(item.next());
            });

            $(document).on("click", ".gdpol-responses-list ._up button", function(e){
                e.preventDefault();

                var item = $(this).closest("li");
                item.insertBefore(item.prev());
            });

            $(document).on("click", ".gdpol-new-response", function(e){
                e.preventDefault();

                gdpol_plugin_edit.add_response();
            });
        },
        add_response: function() {
            gdpol_plugin_edit.id++;
            gdpol_plugin_edit.seq++;

            var tpl = "<li>" + gdpol_plugin_edit.tpl + "</li>";
            tpl = tpl.replace(/{{SEQID}}/gi, gdpol_plugin_edit.seq);
            tpl = tpl.replace(/{{RESID}}/gi, gdpol_plugin_edit.id);
            tpl = tpl.replace(/{{RESPONSE}}/gi, "");

            $(".gdpol-field-responses ul").append(tpl);
        },
        validate: function() {
            $("#new-post").submit(gdpol_plugin_edit.check);
        },
        check: function() {
            var submit = true;

            if ($(".gdpol-poll-status").is(":checked")) {
                if ($(".gdpol-poll-question").val() === "") {
                    submit = false;

                    alert(gdpol_polls_data.error_question);
                } else {
                    var cnt = 0;

                    $(".gdpol-responses-list ._label input").each(function(){
                        if ($(this).val() !== "") {
                            cnt++;
                        }
                    });

                    if (cnt < 2) {
                        submit = false;

                        alert(gdpol_polls_data.error_responses);
                    }
                }
            }

            return submit;
        }
    };
})(jQuery, window, document);
