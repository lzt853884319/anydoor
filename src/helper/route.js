

const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;
const stat = promisify(fs.stat);
const HandleBars = require("handlebars");
const readdir = promisify(fs.readdir);

const tplPath = path.join(__dirname, "../template/dir.tpl");
const source = fs.readFileSync(tplPath, "utf-8");
const template = HandleBars.compile(source);
const config = require("../config/defaultConfig");
const mime = require("mime-types");
const compress = require("./compress");
const range = require("./range");

module.exports = async function (req, res, filePath) {
    try {
        const stats = await stat(filePath);
        if(stats.isFile()) {
            res.statusCode = 200;
            res.setHeader("Content-Type", mime.lookup(filePath));
            let rs;
            const {code, start, end} = range(stats.size, req, res);

            if(code === 200) {
                res.statusCode = 200;
                rs = fs.createReadStream(filePath);
            } else {
                res.statusCode = 206;
                rs = fs.createReadStream(filePath, {start, end});
            }


            rs = compress(rs, req, res);
            rs.pipe(res);
        } else if(stats.isDirectory()) {
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            const dir = path.relative(config.root, filePath);

            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}`: "",
                files
            };
            res.end(template(data));
        }
    } catch(err) {
        console.error(err);
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end(`${filePath} is not directory or file\n ${err}`);
    }
};
