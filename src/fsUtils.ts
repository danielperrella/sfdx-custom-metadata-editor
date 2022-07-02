import * as fs from "fs";
import * as path from "path";

function makeDirSync(dir: string) {
    if (fs.existsSync(dir)) {
        return;
    }
    if (!fs.existsSync(path.dirname(dir))) {
        makeDirSync(path.dirname(dir));
    }
    fs.mkdirSync(dir);
}
export function makeFileSync(filename: string, filebody: string) {
    makeDirSync(path.dirname(filename));
    var myWriteStream = fs.createWriteStream(filename);
    myWriteStream.write(filebody);
    myWriteStream.close();
}