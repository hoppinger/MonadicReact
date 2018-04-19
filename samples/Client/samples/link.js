"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monadic_react_1 = require("../../../src/monadic_react");
exports.link_sample = monadic_react_1.any(`link sample`)([
    _ => monadic_react_1.link(`Google`, "https://www.google.com", false, "google"),
    _ => monadic_react_1.link(`Facebook`, "https://www.facebook.com", false, "facebook"),
    _ => monadic_react_1.link(`Hoppinger`, "https://www.hoppinger.com", false, "hoppinger")
])(null);
//# sourceMappingURL=link.js.map