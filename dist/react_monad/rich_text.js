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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmljaF90ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlYWN0X21vbmFkL3JpY2hfdGV4dC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBK0I7QUFHL0IscUNBQXlKO0FBQ3pKLGdDQUFrQztBQUNsQywrQkFBbUU7QUFDbkUsNkJBQStCO0FBOEMvQjtJQUEwQiwrQkFBdUM7SUFDL0QscUJBQVksS0FBZ0IsRUFBRSxPQUFPO1FBQXJDLFlBQ0Usa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUd0QjtRQTRHRCxZQUFNLEdBQVcsSUFBSSxDQUFBO1FBN0duQixLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsWUFBWSxFQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUE7O0lBQ3pELENBQUM7SUFTTSwyQkFBZSxHQUF0QixVQUF1QixZQUF3QjtRQUM3QyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDN0UsQ0FBQztJQUVNLDZCQUFpQixHQUF4QixVQUF5QixXQUFlO1FBQ3RDLElBQUk7WUFDRixPQUFPLHNCQUFXLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUE7U0FDN0c7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sV0FBVyxDQUFDLFdBQVcsRUFBRSxDQUFBO1NBQ2pDO0lBQ0gsQ0FBQztJQWVNLHVCQUFXLEdBQWxCO1FBQ0UsT0FBTyxzQkFBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQTtJQUN6RCxDQUFDO0lBRUQsOEJBQVEsR0FBUixVQUFTLGdCQUE0QixF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