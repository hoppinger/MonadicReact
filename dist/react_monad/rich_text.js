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
var DraftEditor = /** @class */ (function (_super) {
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
var Math = /** @class */ (function (_super) {
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
        var newTex = prompt("Enter your tex here", this.props.src) || this.props.src;
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
var MathOutput = /** @class */ (function (_super) {
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
var SlideEditorButtonsBar = /** @class */ (function (_super) {
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
var RichText = /** @class */ (function (_super) {
    __extends(RichText, _super);
    function RichText(props, context) {
        var _this = _super.call(this, props, context) || this;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmljaF90ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlYWN0X21vbmFkL3JpY2hfdGV4dC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBK0I7QUFHL0IscUNBQXFJO0FBQ3JJLGdDQUFrQztBQUNsQywrQkFBbUU7QUFDbkUsNkJBQStCO0FBNkMvQjtJQUEwQiwrQkFBdUM7SUFDL0QscUJBQVksS0FBZ0IsRUFBRSxPQUFPO1FBQXJDLFlBQ0Usa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUd0QjtRQTBFRCxZQUFNLEdBQVcsSUFBSSxDQUFBO1FBM0VuQixLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsWUFBWSxFQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUE7O0lBQ3pELENBQUM7SUFFTSwyQkFBZSxHQUF0QixVQUF1QixZQUF3QjtRQUM3QyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDN0UsQ0FBQztJQUVNLDZCQUFpQixHQUF4QixVQUF5QixXQUFlO1FBQ3RDLElBQUk7WUFDRixPQUFPLHNCQUFXLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUNwRjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUE7U0FDakM7SUFDSCxDQUFDO0lBRU0sdUJBQVcsR0FBbEI7UUFDRSxPQUFPLHNCQUFXLENBQUMsV0FBVyxFQUFFLENBQUE7SUFDbEMsQ0FBQztJQUVELDhCQUFRLEdBQVIsVUFBUyxnQkFBNEIsRUFBRSxVQUF1QjtRQUE5RCxpQkFPQztRQU5DLElBQUksSUFBSSxDQUFDLEtBQUssQ0FB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