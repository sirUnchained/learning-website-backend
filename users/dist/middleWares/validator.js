"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validator(validator) {
    return async (req, res, next) => {
        try {
            await validator.validate(req.body, { abortEarly: false });
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = validator;
