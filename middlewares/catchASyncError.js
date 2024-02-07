export const catchASyncError = (fun) => {
    return (req, res, next) => {    
        Promise.resolve(fun(req, res, next).catch(next));
    };
}