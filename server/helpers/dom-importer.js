let fs = require('fs');

/**
 * @constructor
 */
class DomImporter {

    /**
     *
     * @param window
     * @param dom
     * @param dependencies
     */
    constructor(window, dom, dependencies) {
        this._window = window;
        this._dom = dom;
        this.modules = {};
        this.dependencies = dependencies;
        this.allModules = [];
    }

    /**
     *
     */
    setGlobals() {
        if (global && !global.window) {
            global.window = this._window;
        }
        if (global && !global.document) {
            global.document = this._dom;
        }
    }

    /**
     *
     */
    init() {
         this._getModules();
    }

    /**
     *
     * @returns {{}|*}
     * @private
     */
    _getModules() {
        for (let key in this.dependencies) {
            if (this.dependencies.hasOwnProperty(key)) {
                let value = this.dependencies[key];
                try {

                    // for the server
                    let tmp = require(`../../${value}`);
                    if (!this._window[key]) {
                        this._window[key] = tmp;
                    }
                    this.modules[key] = tmp;
                    if (global && !global[key]) {
                        global[key] = this._window[key];
                    }
                    /*

                    // for the client
                    let contents = fs.readFileSync(`../${value}`).toString();

                    console.log(contents)

                    let script =  this._dom.createElement("script");
                    script.type = "text/javascript";
                    script.innerHTML = contents.toString();
                    let body = this._dom.getElementsByTagName('body')[0];
                    body.appendChild(script);
*/

                } catch (e) {
                    throw new Error(`HINT: Dependency not found having as a value: ${value}. Maybe run npm install before? \n\n Error: ${e}`);
                }
            }
        }
        let results = this._allFilesRecursive('../both/modules');
        results.forEach((value) => {
            require(`../../both/modules/${value}`);
/*

            // for the client
            let contents = fs.readFileSync(`../both/modules/${value}`).toString();

            console.log(contents)

            let script =  this._dom.createElement("script");
            script.type = "text/javascript";
            script.innerHTML = contents.toString();
            let body = this._dom.getElementsByTagName('body')[0];
            body.appendChild(script);

            */

        });
    }

    /**
     *
     * @param dir
     * @private
     */
    _allFilesRecursive(dir) {
        const allFilesSync = (dir, fileList = []) => {
            fs.readdirSync(dir).forEach(file => {
                const filePath = `${dir}/${file}`;
                fileList.push(
                    fs.statSync(filePath).isDirectory()
                        ? {[file]: allFilesSync(filePath)}
                        : file
                )
            });
            return fileList
        };
        return allFilesSync(dir);
    }
}

module.exports = DomImporter;