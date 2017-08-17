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
        var new_content_state = contentState.createEntity(url_type, 'IMMUTABLE', { src: url });
        var entity_key = new_content_state.getLastCreatedEntityKey();
        var new_editor_state = draft_js_1.AtomicBlockUtils.insertAtomicBlock(this.state.editor_state, entity_key, ' ');
        this.setState(__assign({}, this.state, { editor_state: new_editor_state }), function () {
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
        return (React.createElement("div", null,
            React.createElement(MathOutput, { content: this.props.src, onClick: function () { return _this.onClick(); } })));
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
            katex.render(_this.props.content, _this._container, { displayMode: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmljaF90ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlYWN0X21vbmFkL3JpY2hfdGV4dC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBK0I7QUFHL0IscUNBQTJIO0FBQzNILGdDQUFrQztBQUNsQywrQkFBbUU7QUFDbkUsNkJBQStCO0FBNkMvQjtJQUEwQiwrQkFBdUM7SUFDL0QscUJBQVksS0FBZ0IsRUFBRSxPQUFPO1FBQXJDLFlBQ0Usa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQyxTQUd0QjtRQThERCxZQUFNLEdBQVcsSUFBSSxDQUFBO1FBL0RuQixLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsWUFBWSxFQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUE7O0lBQ3pELENBQUM7SUFFTSwyQkFBZSxHQUF0QixVQUF1QixZQUF3QjtRQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUM3RSxDQUFDO0lBRU0sNkJBQWlCLEdBQXhCLFVBQXlCLFdBQWU7UUFDdEMsSUFBSSxDQUFDO1lBQ0gsTUFBTSxDQUFDLHNCQUFXLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNyRixDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDbEMsQ0FBQztJQUNILENBQUM7SUFFTSx1QkFBVyxHQUFsQjtRQUNFLE1BQU0sQ0FBQyxzQkFBVyxDQUFDLFdBQVcsRUFBRSxDQUFBO0lBQ2xDLENBQUM7SUFFRCw4QkFBUSxHQUFSLFVBQVMsZ0JBQTRCLEVBQUUsVUFBdUI7UUFBOUQsaUJBT0M7UUFOQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLFFBQVEsY0FBSyxJQUFJLENBQUMsS0FBSyxJQUFFLFlBQVksRUFBRSxnQkFBZ0IsS0FBRztnQkFDN0QsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDO29CQUFDLFVBQVUsRUFBRSxDQUFBO2dCQUM1QixLQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1lBQ3hDLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztJQUNILENBQUM7SUFFRCx1Q0FBaUIsR0FBakIsVUFBa0IsVUFBeUI7UUFBM0MsaUJBT0M7UUFOQyxJQUFJLENBQUMsUUFBUSxDQUNYLG9CQUFTLENBQUMsZUFBZSxDQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFDdkIsVUFBVSxDQUNYLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQW5CLENBQW1CLENBQzdCLENBQUE7SUFDSCxDQUFDO0lBRUQsa0NBQVksR0FBWixVQUFhLE9BQTBCO1FBQ3JDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNoQyxDQUFDO0lBRUQsc0NBQWdCLEdBQWhCLFVBQWlCLE9BQTBCO1FBQTNDLGlCQVNDO1FBUkMsSUFBSSxTQUFTLEdBQUcsb0JBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM3RSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3ZCLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUE7WUFDckIsQ0FBQyxDQUFDLENBQUE7WUFDRixNQUFNLENBQUMsU0FBUyxDQUFBO1FBQ2xCLENBQUM7UUFDRCxNQUFNLENBQUMsYUFBYSxDQUFBO0lBQ3RCLENBQUM7SUFFRCxrQ0FBWSxHQUFaLFVBQWEsWUFBZ0MsRUFBRSxHQUFVLEVBQUUsUUFBa0I7UUFBN0UsaUJBU0M7UUFSQyxJQUFJLGlCQUFpQixHQUFHLFlBQVksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFBO1FBQ3BGLElBQUksVUFBVSxHQUFHLGlCQUFpQixDQUFDLHVCQUF1QixFQUFFLENBQUE7UUFFNUQsSUFBSSxnQkFBZ0IsR0FDbEIsMkJBQWdCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQzlFLElBQUksQ0FBQyxRQUFRLGNBQUssSUFBSSxDQUFDLEtBQUssSUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEtBQUc7WUFDN0QsS0FBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtRQUN4QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFHRCw0QkFBTSxHQUFOO1FBQUEsaUJBdUJDO1FBdEJDLE1BQU0sQ0FBQyxDQUNMLDZCQUFLLFNBQVMsRUFBQyxlQUFlO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtnQkFDcEIsb0JBQUMscUJBQXFCLElBQUMsWUFBWSxFQUFFLFVBQUMsQ0FBb0IsSUFBSyxPQUFBLEtBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQXBCLENBQW9CLEVBQzVELGlCQUFpQixFQUFFLFVBQUMsQ0FBZ0IsSUFBSyxPQUFBLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFBekIsQ0FBeUIsRUFDbEUsWUFBWSxFQUFFLFVBQUMsR0FBVSxFQUFFLFFBQWtCO3dCQUMzQyxPQUFBLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDO29CQUE3RSxDQUE2RSxHQUM1RTs7b0JBRTFCLElBQUk7WUFDTiw2QkFBSyxTQUFTLEVBQUMscUJBQXFCO2dCQUNsQyxvQkFBQyxpQkFBTSxJQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFDcEMsTUFBTSxFQUFFLGNBQU8sQ0FBQyxFQUNoQixRQUFRLEVBQUUsVUFBQSxFQUFFLElBQUksT0FBQSxLQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFqQixDQUFpQixFQUNqQyxnQkFBZ0IsRUFBRSxVQUFDLENBQW9CLElBQUssT0FBQSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEVBQXhCLENBQXdCLEVBQ3BFLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUM5QixlQUFlLEVBQUUsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUNyRyxHQUFHLEVBQUUsVUFBQyxNQUFNLElBQUssT0FBQSxLQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBcEIsQ0FBb0IsRUFDckMsVUFBVSxFQUFFLElBQUksR0FBSSxDQUN4QixDQUNGLENBQ1AsQ0FBQTtJQUNILENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUE1RkQsQ0FBMEIsS0FBSyxDQUFDLFNBQVMsR0E0RnhDO0FBRUQsNEJBQTRCLFlBQWdDLEVBQUUsUUFBZ0I7SUFDNUUsTUFBTSxDQUFDLFVBQUMsS0FBa0I7UUFDeEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDO2dCQUNMLFNBQVMsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDO2dCQUMxQixRQUFRLEVBQUUsS0FBSzthQUNoQixDQUFDO1FBQ0osQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDLENBQUE7QUFDSCxDQUFDO0FBR0Q7SUFBbUIsd0JBQThCO0lBQy9DLGNBQVksS0FBSztlQUNmLGtCQUFNLEtBQUssQ0FBQztJQUNkLENBQUM7SUFFRCxzQkFBTyxHQUFQO1FBQ0UsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUE7UUFBQyxDQUFDO1FBRXBDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFBO1FBQzVCLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFBO1FBRTFDLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzFELElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFcEMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtJQUMxRCxDQUFDO0lBRUQscUJBQU0sR0FBTjtRQUFBLGlCQU1DO1FBTEMsTUFBTSxDQUFDLENBQ0w7WUFDRSxvQkFBQyxVQUFVLElBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLE9BQU8sRUFBRSxFQUFkLENBQWMsR0FBSSxDQUNsRSxDQUNQLENBQUE7SUFDSCxDQUFDO0lBQ0gsV0FBQztBQUFELENBQUMsQUF4QkQsQ0FBbUIsS0FBSyxDQUFDLFNBQVMsR0F3QmpDO0FBR0Q7SUFBeUIsOEJBQW9DO0lBQzNELG9CQUFZLEtBQUs7UUFBakIsWUFDRSxrQkFBTSxLQUFLLENBQUMsU0FDYjtRQUVELFlBQU0sR0FBRyxJQUFJLENBQUM7UUFDZCxnQkFBVSxHQUFnQixJQUFJLENBQUM7O0lBSC9CLENBQUM7SUFLRCw0QkFBTyxHQUFQO1FBQUEsaUJBV0M7UUFWQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNoQixZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztZQUN2QixLQUFLLENBQUMsTUFBTSxDQUNWLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUNsQixLQUFJLENBQUMsVUFBVSxFQUNmLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUN0QixDQUFBO1FBQ0gsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVELHNDQUFpQixHQUFqQjtRQUNFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUNoQixDQUFDO0lBRUQsOENBQXlCLEdBQXpCLFVBQTBCLEtBQUs7UUFDN0IsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2pCLENBQUM7SUFDSCxDQUFDO0lBRUQseUNBQW9CLEdBQXBCO1FBQ0UsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtJQUNwQixDQUFDO0lBRUQsMkJBQU0sR0FBTjtRQUFBLGlCQUVDO1FBREMsTUFBTSxDQUFDLDhCQUFNLEdBQUcsRUFBRSxVQUFDLENBQUMsSUFBSyxPQUFBLEtBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFuQixDQUFtQixFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFBO0lBQzlFLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUF2Q0QsQ0FBeUIsS0FBSyxDQUFDLFNBQVMsR0F1Q3ZDO0FBRUQsSUFBTSxLQUFLLEdBQUcsVUFBQyxLQUFrQjtJQUMvQixNQUFNLENBQUMsNkJBQUssR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEdBQUksQ0FBQztBQUNqQyxDQUFDLENBQUM7QUFFRixJQUFNLEtBQUssR0FBRyxVQUFDLEtBQWtCO0lBQy9CLE1BQU0sQ0FBQywrQkFBTyxRQUFRLFFBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEdBQUksQ0FBQztBQUM1QyxDQUFDLENBQUM7QUFFRixJQUFNLE9BQU8sR0FBRyxVQUFDLEtBQWtCO0lBQ2pDLE1BQU0sQ0FBQyxDQUFDLGdDQUFRLEtBQUssRUFBQyxLQUFLLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFDOUIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHLEdBQ1AsQ0FBQyxDQUFBO0FBQ3BCLENBQUMsQ0FBQztBQUtGLElBQUksS0FBSyxHQUFHLFVBQUMsUUFBZ0IsSUFBSyxPQUFBLFVBQUMsS0FBZ0I7SUFDakQsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNoRSxJQUFBLDBCQUFHLENBQW9CO0lBQzVCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtJQUUzQixFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNyQixNQUFNLENBQUMsb0JBQUMsS0FBSyxJQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUksQ0FBQTtJQUM1QixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxvQkFBQyxLQUFLLElBQUMsR0FBRyxFQUFFLEdBQUcsR0FBSSxDQUFDO0lBQzdCLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLG9CQUFDLE9BQU8sSUFBQyxHQUFHLEVBQUUsR0FBRyxHQUFJLENBQUE7SUFDOUIsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsb0JBQUMsSUFBSSxJQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFBO0lBQ3BHLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFBO0FBQ2IsQ0FBQyxFQWhCaUMsQ0FnQmpDLENBQUE7QUFNRDtJQUFvQyx5Q0FFOUI7SUFDSiwrQkFBWSxLQUFnQyxFQUFFLE9BQU87ZUFDbkQsa0JBQU0sS0FBSyxFQUFFLE9BQU8sQ0FBQztJQUN2QixDQUFDO0lBRUQsc0NBQU0sR0FBTjtRQUFBLGlCQThEQztRQTdEQyxNQUFNLENBQUMsQ0FDSCw2QkFBSyxLQUFLLEVBQUUsRUFBQyxPQUFPLEVBQUMsY0FBYyxFQUFDLEVBQUUsU0FBUyxFQUFDLHVCQUF1QjtZQUNyRSw2QkFBSyxTQUFTLEVBQUMseUJBQXlCO2dCQUN0QyxnQ0FBUSxTQUFTLEVBQUMseURBQXlELEVBQ25FLE9BQU8sRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQS9CLENBQStCLEdBQzdDO2dCQUNULGdDQUFRLFNBQVMsRUFBRSwyREFBMkQsRUFDdEUsT0FBTyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsRUFBakMsQ0FBaUMsR0FDL0M7Z0JBQ1QsZ0NBQVEsU0FBUyxFQUFFLDhEQUE4RCxFQUN6RSxPQUFPLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxFQUFwQyxDQUFvQyxHQUNsRCxDQUNMO1lBRU4sNkJBQUssU0FBUyxFQUFDLHlCQUF5QjtnQkFDdEMsZ0NBQVEsU0FBUyxFQUFFLHVEQUF1RCxFQUNsRSxPQUFPLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLEVBQTFDLENBQTBDLEdBQ3hEO2dCQUNULGdDQUFRLFNBQVMsRUFBRSx1REFBdUQsRUFDbEUsT0FBTyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxFQUExQyxDQUEwQyxHQUN4RDtnQkFDVCxnQ0FBUSxTQUFTLEVBQUUsdURBQXVELEVBQ2xFLE9BQU8sRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsRUFBNUMsQ0FBNEMsR0FDMUQsQ0FDTDtZQUVOLDZCQUFLLFNBQVMsRUFBQyx5QkFBeUI7Z0JBQ3RDLGdDQUFRLFNBQVMsRUFBRSx1REFBdUQsRUFDbEUsT0FBTyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDLEVBQW5ELENBQW1ELEdBQ2pFO2dCQUNULGdDQUFRLFNBQVMsRUFBRSx1REFBdUQsRUFDbEUsT0FBTyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLEVBQWpELENBQWlELEdBQy9ELENBQ0w7WUFFTiw2QkFBSyxTQUFTLEVBQUMseUJBQXlCO2dCQUN0QyxnQ0FBUSxTQUFTLEVBQUUseURBQXlELEVBQ3BFLE9BQU8sRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsRUFBMUMsQ0FBMEMsR0FDeEQ7Z0JBQ1QsZ0NBQVEsU0FBUyxFQUFFLCtEQUErRCxFQUMxRSxPQUFPLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLEVBQTFDLENBQTBDLEdBQ3hEO2dCQUNULGdDQUFRLFNBQVMsRUFBRSx5REFBeUQsRUFDcEUsT0FBTyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsNkJBQTZCLENBQUMsRUFBRSxXQUFXLENBQUMsRUFBM0UsQ0FBMkUsR0FDekY7Z0JBQ1QsZ0NBQVEsU0FBUyxFQUFFLDBEQUEwRCxFQUNyRSxPQUFPLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEVBQXZCLENBQXVCLEdBQ3JDLENBQ0w7WUFDTiwrQkFBTyxJQUFJLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBRSxVQUFDLENBQW1DO29CQUM3RCxJQUFJLElBQUksR0FBSSxDQUFDLENBQUMsTUFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDckMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQUMsTUFBTSxDQUFBO29CQUNqQixJQUFJLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFBO29CQUM3QixNQUFNLENBQUMsTUFBTSxHQUFHLFVBQUMsQ0FBTzt3QkFDdEIsSUFBSSxRQUFRLEdBQUksQ0FBQyxDQUFDLE1BQWMsQ0FBQyxNQUFNLENBQUE7d0JBQ3ZDLEtBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQTtvQkFDNUMsQ0FBQyxDQUFBO29CQUNELE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQzlCLENBQUMsRUFBRyxHQUFHLEVBQUUsVUFBQyxVQUFVLElBQUssT0FBQSxLQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsRUFBNUIsQ0FBNEIsRUFBRSxLQUFLLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFDLEdBQUcsQ0FDOUUsQ0FDVCxDQUFBO0lBQ0gsQ0FBQztJQUVILDRCQUFDO0FBQUQsQ0FBQyxBQXZFRCxDQUFvQyxLQUFLLENBQUMsU0FBUyxHQXVFbEQ7QUFLRDtJQUF1Qiw0QkFBNEM7SUFDakUsa0JBQVksS0FBbUIsRUFBQyxPQUFXO1FBQTNDLFlBQ0UsaUJBQU8sU0FFUjtRQURDLEtBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxhQUFhLEVBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFBOztJQUNqRCxDQUFDO0lBQ0QsNENBQXlCLEdBQXpCLFVBQTBCLFNBQXVCO1FBQWpELGlCQU9DO1FBTkMsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQTtRQUNwQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxRQUFRLGNBQUssSUFBSSxDQUFDLEtBQUssSUFBRSxhQUFhLEVBQUMsU0FBUyxLQUFHO2dCQUN0RCxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQU8sQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7WUFBbkQsQ0FBbUQsQ0FDcEQsQ0FBQTtRQUNILENBQUM7SUFDSCxDQUFDO0lBQ0QscUNBQWtCLEdBQWxCO1FBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBQ3JELENBQUM7SUFDRCx5QkFBTSxHQUFOO1FBQUEsaUJBY0M7UUFiQyxNQUFNLENBQUMsb0JBQUMsV0FBVyxJQUNULGFBQWEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWE7Z0JBQzdCLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQztnQkFDdkQsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUNuQyxTQUFTLEVBQUUsVUFBQyxDQUFtQixFQUFFLFVBQXVCO2dCQUN0RCxJQUFJLFNBQVMsR0FBRyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBVyxDQUFBO2dCQUN4RCxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxLQUFJLENBQUMsUUFBUSxjQUFLLEtBQUksQ0FBQyxLQUFLLElBQUUsYUFBYSxFQUFDLFNBQVMsS0FBRzt3QkFDdEQsT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDO29CQUFuRCxDQUFtRCxDQUNwRCxDQUFBO2dCQUNILENBQUM7WUFDSCxDQUFDLEVBQ0QsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLE1BQU0sR0FBSSxDQUFBO0lBQ25ELENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxBQS9CRCxDQUF1QixLQUFLLENBQUMsU0FBUyxHQStCckM7QUFFRCxtQkFBMEIsSUFBUyxFQUFFLEdBQVcsRUFBRSxHQUFpQjtJQUNqRSxNQUFNLENBQUMsVUFBQSxVQUFVLElBQUksT0FBQSxhQUFNLENBQVMsVUFBQSxJQUFJLElBQUksT0FBQSxVQUFBLElBQUk7UUFDOUMsT0FBQSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQWdCLFFBQVEsRUFDNUMsRUFBRSxJQUFJLEVBQUMsV0FBVyxFQUFFLFVBQVUsRUFBQyxHQUFHLEVBQUUsVUFBVSxFQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUQxRyxDQUMwRyxFQUZoRSxDQUVnRSxDQUFDLEVBRnhGLENBRXdGLENBQUE7QUFDL0csQ0FBQztBQUpELDhCQUlDIn0=