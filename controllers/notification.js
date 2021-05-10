const NodeCache = require( "node-cache" );
const validUrl = require('valid-url');
const axios = require('axios');
const asyncHandler = require("../middleware/async");
const myCache = new NodeCache();


    // @desc        Subscribe to a topic
    // @route       Post /subscribe/:topic
    // @access      public
    exports.subscribe = asyncHandler(async (req, res, next) => {
        const {url} = req.body
        const {topic} = req.params

        if (!validUrl.isUri(url)) {
            res.status(400).json({
                message: "provided url is invalid"
            })
        }

        cachedUrls = myCache.get(topic)
        if (cachedUrls == undefined) {
            cachedUrls = []
        }

        if (!cachedUrls.includes(url)) {
            cachedUrls.push(url)
            myCache.set( topic, cachedUrls );
        }
        res.status(200).json({
            url,
            topic
        })
        next()

    })

    // @desc        Publish to a topic
    // @route       Post /publish/:topic
    // @access      public
    exports.publish = asyncHandler(async (req, res, next) => {
        const {topic} = req.params
        const payload = req.body

        cachedUrls = myCache.get(topic)
        if (cachedUrls == undefined) {
            res.status(400).json({
                message: 'There are no subscriptions for that topic'
            })
        }
        
        
        cachedUrls.forEach(async (url) => {
            await axios.post(url, {topic, data: payload})    
        });
         res.status(200).json({
            message: `Successfully published to ${cachedUrls.length} subscriber(s)`
        })
    });
