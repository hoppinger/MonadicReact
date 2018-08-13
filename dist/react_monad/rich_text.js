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
            return draft_js_1.EditorState.createWithContent(Draft.convertFromRaw(JSON.parse(raw_content)), DraftEditor.decorator());
        }
        catch (e) {
            return DraftEditor.empty_state();
        }
    };
    DraftEditor.empty_state = function () {
        return draft_js_1.EditorState.createEmpty(DraftEditor.decorator());
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
    DraftEditor.prototype.insert_link = function (contentState, url) {
        var _this = this;
        var contentStateWithEntity = contentState.createEntity('LINK', 'IMMUTABLE', { url: url });
        var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        var newEditorState = draft_js_1.RichUtils.toggleLink(this.state.editor_state, this.state.editor_state.getSelection(), entityKey);
        this.setState(__assign({}, this.state, { editor_state: newEditorState }), function () {
            _this.props.set_state(newEditorState);
        });
    };
    DraftEditor.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: "editor__inner" },
            this.props.editable ?
                React.createElement(SlideEditorButtonsBar, { toggle_style: function (s) { return _this.toggle_style(s); }, toggle_block_type: function (s) { return _this.toggle_block_type(s); }, insert_media: function (url, url_type) {
                        return _this.insert_media(_this.state.editor_state.getCurrentContent(), url, url_type);
                    }, insert_link: function (url) { return _this.insert_link(_this.state.editor_state.getCurrentContent(), url); } })
                :
                    null,
            React.createElement("div", { className: "slide__text__editor" },
                React.createElement(draft_js_1.Editor, { editorState: this.state.editor_state, onBlur: function () { }, onChange: function (es) { return _this.onChange(es); }, handleKeyCommand: function (c) { return _this.handleKeyCommand(c); }, readOnly: !this.props.editable, blockRendererFn: mediaBlockRenderer(this.state.editor_state.getCurrentContent(), this.props.editable), ref: function (editor) { return _this.editor = editor; }, spellCheck: true }))));
    };
    DraftEditor.decorator = function () { return new draft_js_1.CompositeDecorator([
        {
            strategy: DraftEditor.findLinkentities,
            component: Link,
        },
    ]); };
    DraftEditor.findLinkentities = function (contentBlock, callback) {
        contentBlock.findEntityRanges(function (character) {
            var entityKey = character.getEntity();
            return (entityKey !== null &&
                draft_js_1.Entity.get(entityKey).getType() === 'LINK');
        }, callback);
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
var Link = function (props) {
    var url = draft_js_1.Entity.get(props.entityKey).getData().url;
    return (React.createElement("a", { href: url }, props.children));
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
                React.createElement("button", { className: "text-editor__menu-button text-editor__menu-button--image", onClick: function () { return _this.file_input.click(); } }),
                React.createElement("button", { className: "text-editor__menu-button text-editor__menu-button--link", onClick: function () { return _this.props.insert_link(prompt("Insert your link here")); } })),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmljaF90ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlYWN0X21vbmFkL3JpY2hfdGV4dC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBK0I7QUFHL0IscUNBQXlKO0FBQ3pKLGdDQUFrQztBQUNsQywrQkFBbUU7QUFDbkUsNkJBQStCO0FBOEMvQjtJQUEwQiwrQkFBdUM7SUFDL0QscUJBQVksS0FBZ0IsRUFBRSxPQUFPO1FBQXJDLFlBQ0Usa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUd0QjtRQTRHRCxZQUFNLEdBQVcsSUFBSSxDQUFBO1FBN0duQixLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsWUFBWSxFQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUE7O0lBQ3pELENBQUM7SUFTTSwyQkFBZSxHQUF0QixVQUF1QixZQUF3QjtRQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUM3RSxDQUFDO0lBRU0sNkJBQWlCLEdBQXhCLFVBQXlCLFdBQWU7UUFDdEMsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLHNCQUFXLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUE7UUFDOUcsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWCxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQ2xDLENBQUM7SUFDSCxDQUFDO0lBZU0sdUJBQVcsR0FBbEI7UUFDRSxNQUFNLENBQUMsc0JBQVcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFNBQVMs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