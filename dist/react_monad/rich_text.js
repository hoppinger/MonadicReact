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
var katex = require("katex");
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
        if (this.props.editable) {
            this.setState(__assign({}, this.state, { editor_state: new_editor_state }), function () {
                if (on_success)
                    on_success();
                _this.props.set_state(new_editor_state);
            });
        }
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
    DraftEditor.prototype.insert_media = function (contentState, url, url_type) {
        var _this = this;
        var selectionState = this.state.editor_state.getSelection();
        var new_content_state = contentState.createEntity(url_type, 'IMMUTABLE', { src: url });
        var entity_key = new_content_state.getLastCreatedEntityKey();
        var new_editor_state = draft_js_1.AtomicBlockUtils.insertAtomicBlock(this.state.editor_state, entity_key, ' ');
        new_content_state = new_editor_state.getCurrentContent();
        var anchorKey = selectionState.getAnchorKey();
        var currentContentBlock = new_content_state.getBlockForKey(anchorKey);
        var blockMap = new_content_state.getBlockMap();
        var newBlockMap = currentContentBlock.getText() == "" ? blockMap.remove(currentContentBlock.getKey()) : blockMap;
        var newContentState = contentState.set('blockMap', newBlockMap);
        var newEditorState = draft_js_1.EditorState.createWithContent(newContentState);
        this.setState(__assign({}, this.state, { editor_state: newEditorState }), function () {
            _this.props.set_state(new_editor_state);
        });
    };
    DraftEditor.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: "editor__inner" },
            this.props.editable ?
                React.createElement(SlideEditorButtonsBar, { toggle_style: function (s) { return _this.toggle_style(s); }, toggle_block_type: function (s) { return _this.toggle_block_type(s); }, insert_media: function (url, url_type) {
                        return _this.insert_media(_this.state.editor_state.getCurrentContent(), url, url_type);
                    } })
                :
                    null,
            React.createElement("div", { className: "slide__text__editor" },
                React.createElement(draft_js_1.Editor, { editorState: this.state.editor_state, onBlur: function () { }, onChange: function (es) { return _this.onChange(es); }, handleKeyCommand: function (c) { return _this.handleKeyCommand(c); }, readOnly: !this.props.editable, blockRendererFn: mediaBlockRenderer(this.state.editor_state.getCurrentContent(), this.props.editable), ref: function (editor) { return _this.editor = editor; }, spellCheck: true }))));
    };
    return DraftEditor;
}(React.Component));
function mediaBlockRenderer(contentState, editable) {
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
    function Math(props) {
        return _super.call(this, props) || this;
    }
    Math.prototype.onClick = function () {
        if (!this.props.editable) {
            return;
        }
        var block = this.props.block;
        var contentState = this.props.contentState;
        var newTex = prompt("Enter your tex here", this.props.src);
        var entityKey = block.getEntityAt(0);
        contentState.mergeEntityData(entityKey, { src: newTex });
    };
    Math.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement(MathOutput, { content: this.props.src, onClick: function () { return _this.onClick(); } }));
    };
    return Math;
}(React.Component));
var MathOutput = (function (_super) {
    __extends(MathOutput, _super);
    function MathOutput(props) {
        var _this = _super.call(this, props) || this;
        _this._timer = null;
        _this._container = null;
        return _this;
    }
    MathOutput.prototype._update = function () {
        var _this = this;
        if (this._timer) {
            clearTimeout(this._timer);
        }
        this._timer = setTimeout(function () {
            katex.render(_this.props.content, _this._container, { displayMode: false });
        }, 0);
    };
    MathOutput.prototype.componentDidMount = function () {
        this._update();
    };
    MathOutput.prototype.componentWillReceiveProps = function (props) {
        if (props.src !== this.props.content) {
            this._update();
        }
    };
    MathOutput.prototype.componentWillUnmount = function () {
        clearTimeout(this._timer);
        this._timer = null;
    };
    MathOutput.prototype.render = function () {
        var _this = this;
        return React.createElement("span", { ref: function (c) { return _this._container = c; }, onClick: this.props.onClick });
    };
    return MathOutput;
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
    var entity = props.contentState.getEntity(props.block.getEntityAt(0));
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
        return React.createElement(Math, { src: src, editable: editable, contentState: props.contentState, block: props.block });
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
                React.createElement("button", { className: "text-editor__menu-button text-editor__menu-button--code", onClick: function () { return _this.props.insert_media(prompt("Insert your latex code here"), "mathblock"); } }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmljaF90ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlYWN0X21vbmFkL3JpY2hfdGV4dC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBK0I7QUFHL0IscUNBQXFJO0FBQ3JJLGdDQUFrQztBQUNsQywrQkFBbUU7QUFDbkUsNkJBQStCO0FBNkMvQjtJQUEwQiwrQkFBdUM7SUFDL0QscUJBQVksS0FBZ0IsRUFBRSxPQUFPO1FBQXJDLFlBQ0Usa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUd0QjtRQXdFRCxZQUFNLEdBQVcsSUFBSSxDQUFBO1FBekVuQixLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsWUFBWSxFQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUE7O0lBQ3pELENBQUM7SUFFTSwyQkFBZSxHQUF0QixVQUF1QixZQUF3QjtRQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUM3RSxDQUFDO0lBRU0sNkJBQWlCLEdBQXhCLFVBQXlCLFdBQWU7UUFDdEMsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLHNCQUFXLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNyRixDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDbEMsQ0FBQztJQUNILENBQUM7SUFFTSx1QkFBVyxHQUFsQjtRQUNFLE1BQU0sQ0FBQyxzQkFBVyxDQUFDLFdBQVcsRUFBRSxDQUFBO0lBQ2xDLENBQUM7SUFFRCw4QkFBUSxHQUFSLFVBQVMsZ0JB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