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
        // new_content_state = new_editor_state.getCurrentContent()
        // var anchorKey = selectionState.getAnchorKey();
        // var currentContentBlock = new_content_state.getBlockForKey(anchorKey)
        // let blockMap = new_content_state.getBlockMap()
        // let newBlockMap = currentContentBlock.getText() == "" ? blockMap.remove(currentContentBlock.getKey()) : blockMap
        // const newContentState = contentState.set('blockMap', newBlockMap) as ContentState;
        // let newEditorState = EditorState.createWithContent(newContentState)
        var newEditorState = new_editor_state;
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
                React.createElement("button", { className: "text-editor__menu-button text-editor__menu-button--latex", onClick: function () { return _this.props.insert_media(prompt("Insert your latex code here"), "mathblock"); } }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmljaF90ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlYWN0X21vbmFkL3JpY2hfdGV4dC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBK0I7QUFHL0IscUNBQXFJO0FBQ3JJLGdDQUFrQztBQUNsQywrQkFBbUU7QUFDbkUsNkJBQStCO0FBNkMvQjtJQUEwQiwrQkFBdUM7SUFDL0QscUJBQVksS0FBZ0IsRUFBRSxPQUFPO1FBQXJDLFlBQ0Usa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUd0QjtRQTBFRCxZQUFNLEdBQVcsSUFBSSxDQUFBO1FBM0VuQixLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsWUFBWSxFQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUE7O0lBQ3pELENBQUM7SUFFTSwyQkFBZSxHQUF0QixVQUF1QixZQUF3QjtRQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUM3RSxDQUFDO0lBRU0sNkJBQWlCLEdBQXhCLFVBQXlCLFdBQWU7UUFDdEMsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLHNCQUFXLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNyRixDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDbEMsQ0FBQztJQUNILENBQUM7SUFFTSx1QkFBVyxHQUFsQjtRQUNFLE1BQU0sQ0FBQyxzQkFBVyxDQUFDLFdBQVcsRUFBRSxDQUFBO0lBQ2xDLENBQUM7SUFFRCw4QkFBUSxHQUFSLFVBQVMsZ0JB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