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
    DraftEditor.prototype.componentWillReceiveProps = function (new_props) {
        var new_state = new_props.initial_state;
        if (this.state.editor_state != new_state) {
            this.setState(__assign({}, this.state, { editor_state: new_state }));
        }
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmljaF90ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlYWN0X21vbmFkL3JpY2hfdGV4dC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBK0I7QUFHL0IscUNBQXlKO0FBQ3pKLGdDQUFrQztBQUNsQywrQkFBbUU7QUFDbkUsNkJBQStCO0FBOEMvQjtJQUEwQiwrQkFBdUM7SUFDL0QscUJBQVksS0FBZ0IsRUFBRSxPQUFPO1FBQXJDLFlBQ0Usa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUd0QjtRQW1IRCxZQUFNLEdBQVcsSUFBSSxDQUFBO1FBcEhuQixLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsWUFBWSxFQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUE7O0lBQ3pELENBQUM7SUFFRCwrQ0FBeUIsR0FBekIsVUFBMEIsU0FBb0I7UUFDNUMsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQTtRQUN2QyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxJQUFJLFNBQVMsRUFBRTtZQUN4QyxJQUFJLENBQUMsUUFBUSxjQUFLLElBQUksQ0FBQyxLQUFLLElBQUUsWUFBWSxFQUFDLFNBQVMsSUFBRSxDQUFBO1NBQ3ZEO0lBQ0gsQ0FBQztJQVNNLDJCQUFlLEdBQXRCLFVBQXVCLFlBQXdCO1FBQzdDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUM3RSxDQUFDO0lBRU0sNkJBQWlCLEdBQXhCLFVBQXlCLFdBQWU7UUFDdEMsSUFBSTtZQUNGLE9BQU8sc0JBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsU0FBUyxF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