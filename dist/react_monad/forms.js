"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Immutable = require("immutable");
var core_1 = require("./core");
var primitives_1 = require("./primitives");
var html_1 = require("./html");
var combinators_1 = require("./combinators");
exports.simple_inner_form = function (mode, model_name, entries) {
    return function (c) { return combinators_1.repeat(function (c) {
        return combinators_1.any(entries.map(function (e) {
            return e.kind == "string" ?
                combinators_1.retract(function (c) { return e.in(c.model); }, function (c) { return function (s) {
                    var new_c = e.out(c.model)(s);
                    var errors = e.get_errors(new_c);
                    return { model: new_c, errors: errors.length > 0 ? c.errors.set(e.field_name, errors) : c.errors.remove(e.field_name) };
                }; }, html_1.label(e.field_name, true)(html_1.div("monadic-field " + (c.errors.has(e.field_name) ? "monadic-field-error" : ""))(
                // c.errors.has(e.field_name) ?
                //   c.errors.get(e.field_name).map(error =>
                //     _ => string("view", `${model_name(c.model)}_${e.field_name}_error`)(`Error: ${error}`).ignore())
                // :
                [])(primitives_1.string(mode, "text", model_name(c.model) + "_" + e.field_name))), model_name(c.model) + "_" + e.field_name + "_retract")
                : e.kind == "number" ?
                    combinators_1.retract(function (c) { return e.in(c.model); }, function (c) { return function (s) {
                        var new_c = e.out(c.model)(s);
                        var errors = e.get_errors(new_c);
                        return { model: new_c, errors: errors.length > 0 ? c.errors.set(e.field_name, errors) : c.errors.remove(e.field_name) };
                    }; }, html_1.label(e.field_name, true)(html_1.div("monadic-field " + (c.errors.has(e.field_name) ? "monadic-field-error" : ""))(
                    // c.errors.has(e.field_name) ?
                    //   c.errors.get(e.field_name).map(error =>
                    //     _ => string("view", `${model_name(c.model)}_${e.field_name}_error`)(`Error: ${error}`).ignore())
                    // :
                    [])(primitives_1.number(mode, model_name(c.model) + "_" + e.field_name))), model_name(c.model) + "_" + e.field_name + "_retract")
                    : e.kind == "image" ?
                        combinators_1.retract(function (c) { return e.in(c.model); }, function (c) { return function (s) {
                            var new_c = e.out(c.model)(s);
                            var errors = e.get_errors(new_c);
                            return { model: new_c, errors: errors.length > 0 ? c.errors.set(e.field_name, errors) : c.errors.remove(e.field_name) };
                        }; }, html_1.label(e.field_name, true)(html_1.div("monadic-field " + (c.errors.has(e.field_name) ? "monadic-field-error" : ""))(
                        // c.errors.has(e.field_name) ?
                        //   c.errors.get(e.field_name).map(error =>
                        //     _ => string("view", `${model_name(c.model)}_${e.field_name}_error`)(`Error: ${error}`).ignore())
                        // :
                        [])(html_1.image(mode, model_name(c.model) + "_" + e.field_name))), model_name(c.model) + "_" + e.field_name + "_retract")
                        : e.kind == "lazy image" ?
                            combinators_1.retract(function (c) { return null; }, function (c) { return function (_) { return c; }; }, function (_) { return e.download(c.model).bind(model_name(c.model) + "_" + e.field_name + "_downloader", function (src) {
                                return combinators_1.repeat(function (src) {
                                    return html_1.label(e.field_name, true)(html_1.image(mode, model_name(c.model) + "_" + e.field_name))(src).bind(model_name(c.model) + "_" + e.field_name + "_uploader", function (new_src) {
                                        return e.upload(c.model)(new_src);
                                    });
                                })(src);
                            }).ignore(); }, model_name(c.model) + "_" + e.field_name + "_retract")
                            : e.kind == "file" ?
                                combinators_1.retract(function (c) { return e.in(c.model); }, function (c) { return function (s) {
                                    var new_c = e.out(c.model)(s);
                                    var errors = e.get_errors(new_c);
                                    return { model: new_c, errors: errors.length > 0 ? c.errors.set(e.field_name, errors) : c.errors.remove(e.field_name) };
                                }; }, html_1.label(e.field_name, true)(html_1.div("monadic-field " + (c.errors.has(e.field_name) ? "monadic-field-error" : ""))(
                                // c.errors.has(e.field_name) ?
                                //   c.errors.get(e.field_name).map(error =>
                                //     _ => string("view", `${model_name(c.model)}_${e.field_name}_error`)(`Error: ${error}`).ignore())
                                // :
                                [])(function (_) { return html_1.file(mode, e.filename(c.model), e.url(c.model)).ignore_with(null); })), model_name(c.model) + "_" + e.field_name + "_retract")
                                : e.kind == "lazy file" ?
                                    combinators_1.retract(function (c) { return null; }, function (c) { return function (f) { return (__assign({}, c, { model: e.out(c.model)(f) })); }; }, function (_) { return html_1.label(e.field_name, true)(function (_) {
                                        return html_1.file(mode, e.filename(c.model), e.url(c.model)).bind(model_name(c.model) + "_" + e.field_name + "_uploader", function (f) {
                                            return e.upload(c.model)(f).ignore_with(f);
                                        });
                                    })(null); })
                                    : e.kind == "datetime" ?
                                        combinators_1.retract(function (c) { return e.in(c.model); }, function (c) { return function (s) {
                                            var new_c = e.out(c.model)(s);
                                            var errors = e.get_errors(new_c);
                                            return { model: new_c, errors: errors.length > 0 ? c.errors.set(e.field_name, errors) : c.errors.remove(e.field_name) };
                                        }; }, primitives_1.date_time(mode, e.field_name, function () { return "Creating date_time formfield"; }))
                                        :
                                            null;
        }), model_name(c.model) + "_inner_form")(c);
    }, model_name(c.model) + "_repeater")(c); };
};
exports.form_errors = function (model_name, entries) {
    return function (fd) { return html_1.div("form-errors")(entries.map(function (e) {
        return e.kind != "lazy image" && e.kind != "image" ?
            function (c) { return (c.errors.has(e.field_name) ?
                primitives_1.string("view", "text", model_name(c.model) + "_" + e.field_name)("" + c.errors.get(e.field_name)).ignore(model_name(c.model) + "_" + e.field_name + "_error_ignore")
                : core_1.unit(null)).filter(function (_) { return false; }); }
            :
                function (c) { return core_1.unit(null).filter(function (_) { return false; }); };
    }))(function (c) { return core_1.unit(c).filter(function (_) { return false; }); })(fd).filter(function (_) { return false; }); };
};
exports.simple_form_with_autosave = function (mode, model_name, entries, download_M, upload_M) {
    return download_M.bind(undefined, function (c) {
        return exports.simple_inner_form(mode, model_name, entries)({ model: c, errors: Immutable.Map() })
            .bind(model_name(c) + "_error_recap", combinators_1.any([
            function (c) { return exports.form_errors(model_name, entries)(c).ignore_with(c).filter(function (_) { return false; }); },
            function (c) { return core_1.unit(c); }
        ]))
            .filter(function (c) { return c.errors.isEmpty(); }, model_name(c) + "_error_filter")
            .map(function (c) { return c.model; }).bind(model_name(c) + "_uploader", combinators_1.delay(200, model_name(c) + "_delay")(upload_M)).ignore();
    });
};
exports.simple_form_with_save_button = function (mode, model_name, entries, download_M, upload_M) {
    return download_M.bind(undefined, function (c) {
        return exports.simple_inner_form(mode, model_name, entries)({ model: c, errors: Immutable.Map() }).bind(model_name(c) + "_form", function (c) {
            return combinators_1.any([
                exports.form_errors(model_name, entries),
                function (c) { return html_1.button("save", !c.errors.isEmpty())(c); }
            ])(c);
        }).map(function (c) { return c.model; }).bind(model_name(c) + "_uploader", combinators_1.delay(200, model_name(c) + "_delayer")(upload_M)).ignore();
    });
};
exports.simple_form_with_prev_and_next_buttons = function (mode, model_name, entries, prev_enabled, next_enabled, prev_visible, next_visible, on_prev, on_next) {
    return function (c) {
        return exports.simple_inner_form(mode, model_name, entries)(c).bind(model_name(c.model) + "_form", function (c) {
            return combinators_1.any([
                exports.form_errors(model_name, entries),
                function (c) { return prev_visible(c) ? html_1.button("prev", prev_enabled(c))(c).map(function (c) { return (__assign({}, c, { model: on_prev(c.model) })); }) : core_1.unit(c).filter(function (_) { return false; }); },
                function (c) { return next_visible(c) ? html_1.button("next", next_enabled(c))(c).map(function (c) { return (__assign({}, c, { model: on_next(c.model) })); }) : core_1.unit(c).filter(function (_) { return false; }); }
            ])(c);
        });
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVhY3RfbW9uYWQvZm9ybXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUdBLHFDQUFzQztBQUN0QywrQkFBMEM7QUFDMUMsMkNBQXdFO0FBQ3hFLCtCQUFnRjtBQUNoRiw2Q0FBNEY7QUFpQmpGLFFBQUEsaUJBQWlCLEdBQUcsVUFBWSxJQUFTLEVBQUUsVUFBd0IsRUFBRSxPQUFzQjtJQUNwRyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxvQkFBTSxDQUFjLFVBQUEsQ0FBQztRQUMvQixPQUFBLGlCQUFHLENBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7WUFDWCxPQUFBLENBQUMsQ0FBQyxJQUFJLElBQUksUUFBUTtnQkFDaEIscUJBQU8sQ0FDTCxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFiLENBQWEsRUFBRSxVQUFBLENBQUMsSUFBSSxPQUFBLFVBQUEsQ0FBQztvQkFDeEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7b0JBQzdCLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUE7b0JBQ2hDLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFDLENBQUE7Z0JBQUMsQ0FBQyxFQUhoRyxDQUdnRyxFQUN6SCxZQUFLLENBQWlCLENB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