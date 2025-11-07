"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeType = exports.Visibility = void 0;
var Visibility;
(function (Visibility) {
    Visibility["PUBLIC"] = "public";
    Visibility["FRIENDS"] = "friends";
    Visibility["PRIVATE"] = "private";
})(Visibility || (exports.Visibility = Visibility = {}));
var LikeType;
(function (LikeType) {
    LikeType["LIKE"] = "like";
    LikeType["UNLIKE"] = "unLike";
})(LikeType || (exports.LikeType = LikeType = {}));
