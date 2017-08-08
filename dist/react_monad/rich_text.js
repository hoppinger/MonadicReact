"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var draft_js_1 = require("draft-js");
var Draft = require("draft-js");
var core_1 = require("./core");
var DraftEditor = (function (_super) {
    __extends(DraftEditor, _super);
    function DraftEditor(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.editor = null;
        _this.state = { editor_state: _this.props.initial_state };
        return _this;
    }
    DraftEditor.serialize_state = function (editor_state) {
        return JSON.stringify(Draft.convertToRaw(editor_state.getCurrentContent()));
    };
    DraftEditor.deserialize_state = function (raw_content) {
        try {
            return draft_js_1.EditorState.createWithContent(Draft.convertFromRaw(JSON.parse(raw_content)));
        }
        catch (e) {
            return DraftEditor.empty_state();
        }
    };
    DraftEditor.empty_state = function () {
        return draft_js_1.EditorState.createEmpty();
    };
    DraftEditor.prototype.onChange = function (new_editor_state, on_success) {
        var _this = this;
        this.setState(__assign({}, this.state, { editor_state: new_editor_state }), function () {
            if (on_success)
                on_success();
            _this.props.set_state(new_editor_state);
        });
    };
    DraftEditor.prototype.toggle_block_type = function (block_type) {
        var _this = this;
        this.onChange(draft_js_1.RichUtils.toggleBlockType(this.state.editor_state, block_type), function () { return _this.editor.focus(); });
    };
    DraftEditor.prototype.toggle_style = function (command) {
        this.handleKeyCommand(command);
    };
    DraftEditor.prototype.handleKeyCommand = function (command) {
        var _this = this;
        var new_state = draft_js_1.RichUtils.handleKeyCommand(this.state.editor_state, command);
        if (new_state) {
            this.onChange(new_state, function () {
                _this.editor.focus();
            });
            return "handled";
        }
        return "not-handled";
    };
    DraftEditor.prototype.insert_media = function (url, url_type) {
        var _this = this;
        var entity_key = draft_js_1.Entity.create(url_type, 'IMMUTABLE', { src: url });
        var new_editor_state = draft_js_1.AtomicBlockUtils.insertAtomicBlock(this.state.editor_state, entity_key, ' ');
        this.setState(__assign({}, this.state, { editor_state: new_editor_state }), function () {
            _this.props.set_state(new_editor_state);
        });
    };
    DraftEditor.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: "editor__inner" },
            this.props.editable ?
                React.createElement(SlideEditorButtonsBar, { toggle_style: function (s) { return _this.toggle_style(s); }, toggle_block_type: function (s) { return _this.toggle_block_type(s); }, insert_media: function (url, url_type) { return _this.insert_media(url, url_type); } })
                :
                    null,
            React.createElement("div", { className: "slide__text__editor" },
                React.createElement(draft_js_1.Editor, { editorState: this.state.editor_state, onBlur: function () { }, onChange: function (es) { return _this.onChange(es); }, handleKeyCommand: function (c) { return _this.handleKeyCommand(c); }, readOnly: !this.props.editable, blockRendererFn: mediaBlockRenderer(this.props.editable), ref: function (editor) { return _this.editor = editor; }, spellCheck: true }))));
    };
    return DraftEditor;
}(React.Component));
function mediaBlockRenderer(editable) {
    return function (block) {
        if (block.getType() === 'atomic') {
            return {
                component: Media(editable),
                editable: false,
            };
        }
        return null;
    };
}
var Math = (function (_super) {
    __extends(Math, _super);
    function Math(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {};
        return _this;
    }
    Math.prototype.render = function () {
        return null;
        // <ReactKaTeX.BlockMath
        //     math={this.props.src}
        //     errorColor={'#cc0000'}
        //   />
    };
    return Math;
}(React.Component));
var Image = function (props) {
    return React.createElement("img", { src: props.src });
};
var Video = function (props) {
    return React.createElement("video", { controls: true, src: props.src });
};
var YouTube = function (props) {
    return (React.createElement("iframe", { width: "420", height: "315", src: props.src }));
};
var Media = function (editable) { return function (props) {
    var entity = draft_js_1.Entity.get(props.block.getEntityAt(0));
    var src = entity.getData().src;
    var type = entity.getType();
    if (type === 'image') {
        return React.createElement(Image, { src: src });
    }
    else if (type === 'video') {
        return React.createElement(Video, { src: src });
    }
    else if (type === 'youtube') {
        return React.createElement(YouTube, { src: src });
    }
    else if (type === 'mathblock') {
        return React.createElement(Math, { src: src, editable: editable });
    }
    return null;
}; };
var SlideEditorButtonsBar = (function (_super) {
    __extends(SlideEditorButtonsBar, _super);
    function SlideEditorButtonsBar(props, context) {
        return _super.call(this, props, context) || this;
    }
    SlideEditorButtonsBar.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { style: { display: "inline-block" }, className: "text-editor__menu-bar" },
            React.createElement("div", { className: "text-editor__menu-group" },
                React.createElement("button", { className: "text-editor__menu-button text-editor__menu-button--bold", onClick: function () { return _this.props.toggle_style('bold'); } }),
                React.createElement("button", { className: "text-editor__menu-button text-editor__menu-button--italic", onClick: function () { return _this.props.toggle_style('italic'); } }),
                React.createElement("button", { className: "text-editor__menu-button text-editor__menu-button--underline", onClick: function () { return _this.props.toggle_style('underline'); } })),
            React.createElement("div", { className: "text-editor__menu-group" },
                React.createElement("button", { className: "text-editor__menu-button text-editor__menu-button--h1", onClick: function () { return _this.props.toggle_block_type('header-one'); } }),
                React.createElement("button", { className: "text-editor__menu-button text-editor__menu-button--h2", onClick: function () { return _this.props.toggle_block_type('header-two'); } }),
                React.createElement("button", { className: "text-editor__menu-button text-editor__menu-button--h3", onClick: function () { return _this.props.toggle_block_type('header-three'); } })),
            React.createElement("div", { className: "text-editor__menu-group" },
                React.createElement("button", { className: "text-editor__menu-button text-editor__menu-button--ul", onClick: function () { return _this.props.toggle_block_type('unordered-list-item'); } }),
                React.createElement("button", { className: "text-editor__menu-button text-editor__menu-button--ol", onClick: function () { return _this.props.toggle_block_type('ordered-list-item'); } })),
            React.createElement("div", { className: "text-editor__menu-group" },
                React.createElement("button", { className: "text-editor__menu-button text-editor__menu-button--code", onClick: function () { return _this.props.toggle_block_type('code-block'); } }),
                React.createElement("button", { className: "text-editor__menu-button text-editor__menu-button--blockquote", onClick: function () { return _this.props.toggle_block_type('blockquote'); } }),
                React.createElement("button", { className: "text-editor__menu-button text-editor__menu-button--image", onClick: function () { return _this.file_input.click(); } })),
            React.createElement("input", { type: "file", onChange: function (e) {
                    var file = e.target.files[0];
                    if (!file)
                        return;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var contents = e.target.result;
                        _this.props.insert_media(contents, "image");
                    };
                    reader.readAsDataURL(file);
                }, ref: function (file_input) { return _this.file_input = file_input; }, style: { display: "none" } })));
    };
    return SlideEditorButtonsBar;
}(React.Component));
var RichText = (function (_super) {
    __extends(RichText, _super);
    function RichText(props, context) {
        var _this = _super.call(this) || this;
        _this.state = { current_state: props.json_state };
        return _this;
    }
    RichText.prototype.componentWillReceiveProps = function (new_props) {
        var _this = this;
        var new_state = new_props.json_state;
        if (this.state.current_state != new_state) {
            this.setState(__assign({}, this.state, { current_state: new_state }), function () {
                return _this.props.cont(function () { })(_this.state.current_state);
            });
        }
    };
    RichText.prototype.componentWillMount = function () {
        this.props.cont(function () { })(this.state.current_state);
    };
    RichText.prototype.render = function () {
        var _this = this;
        return React.createElement(DraftEditor, { initial_state: this.state.current_state ?
                DraftEditor.deserialize_state(this.state.current_state) :
                DraftEditor.empty_state(), set_state: function (s, on_success) {
                var new_state = DraftEditor.serialize_state(s);
                if (_this.state.current_state != new_state) {
                    _this.setState(__assign({}, _this.state, { current_state: new_state }), function () {
                        return _this.props.cont(function () { })(_this.state.current_state);
                    });
                }
            }, editable: this.props.mode == "edit" });
    };
    return RichText;
}(React.Component));
function rich_text(mode, key, dbg) {
    return function (json_state) { return core_1.make_C(function (ctxt) { return function (cont) {
        return (React.createElement(RichText, { kind: "rich text", debug_info: dbg, json_state: json_state, mode: mode, context: ctxt, cont: cont, key: key }));
    }; }); };
}
exports.rich_text = rich_text;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmljaF90ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlYWN0X21vbmFkL3JpY2hfdGV4dC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBK0I7QUFHL0IscUNBQTZHO0FBQzdHLGdDQUFrQztBQUNsQywrQkFBbUU7QUErQ25FO0lBQTBCLCtCQUF1QztJQUMvRCxxQkFBWSxLQUFnQixFQUFFLE9BQU87UUFBckMsWUFDRSxrQkFBTSxLQUFLLEVBQUUsT0FBTyxDQUFDLFNBR3RCO1FBMkRELFlBQU0sR0FBVyxJQUFJLENBQUE7UUE1RG5CLEtBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxZQUFZLEVBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQTs7SUFDekQsQ0FBQztJQUVNLDJCQUFlLEdBQXRCLFVBQXVCLFlBQXdCO1FBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQzdFLENBQUM7SUFFTSw2QkFBaUIsR0FBeEIsVUFBeUIsV0FBZTtRQUN0QyxJQUFJLENBQUM7WUFDSCxNQUFNLENBQUMsc0JBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3JGLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1gsTUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUNsQyxDQUFDO0lBQ0gsQ0FBQztJQUVNLHVCQUFXLEdBQWxCO1FBQ0UsTUFBTSxDQUFDLHNCQUFXLENBQUMsV0FBVyxFQUFFLENBQUE7SUFDbEMsQ0FBQztJQUVELDhCQUFRLEdBQVIsVUFBUyxnQkFBNEIsRUFBRSxVQUF1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