class Router {

    /**
     *
     * @param expressApp
     * @param serializer
     */
    constructor(expressApp, serializer, doc) {
        this._app = expressApp;
        this._serializer = serializer;
        this._doc = doc;
    }

    /**
     *
     */
    init() {
        console.log('he he he')
        this._app.use(( req, res, next ) => {

            console.log(req.originalUrl);

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(this._serializer(this._doc));
            res.end();
            next();
        } );
    }
}

module.exports = Router;