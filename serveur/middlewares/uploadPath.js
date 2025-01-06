import path from "path";

export const uploadPath = (req, res, next) => {
    if (req.file) {
        req.uploadInfo = {
            destination: `client/uploads/images/${req.uploadParams.type}`,
            filename: path.join(req.file.path, "")
        };
    }
    next();
};