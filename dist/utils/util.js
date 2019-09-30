"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class util {
    static getMaxId(contents) {
        const ids = contents.map((c) => {
            return c.id;
        });
        if (ids.length > 0) {
            return Math.max(...ids);
        }
        return 0;
    }
}
exports.default = util;
//# sourceMappingURL=util.js.map