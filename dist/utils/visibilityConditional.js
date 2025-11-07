"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visibilityConditional = void 0;
const post_type_1 = require("../modules/postModule/post.type");
const visibilityConditional = (user) => {
    return [
        {
            visibility: post_type_1.Visibility.PUBLIC,
        },
        {
            visibility: post_type_1.Visibility.PRIVATE,
            createdBy: user._id,
        },
        {
            visibility: post_type_1.Visibility.FRIENDS,
            createdBy: {
                $in: [...user.friends, user._id],
            },
        },
        {
            visibility: post_type_1.Visibility.PRIVATE,
            tags: { $in: user._id },
        },
    ];
};
exports.visibilityConditional = visibilityConditional;
