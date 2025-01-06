export const uploadParams = (params) => (req, res, next) => {
    req.uploadParams = params;
    next();
}