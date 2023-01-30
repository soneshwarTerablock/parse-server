/******/ (() => { // webpackBootstrap
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
Moralis.settings.setAPIRateLimit({
    anonymous: 100000000000000000, authenticated: 200000000000000000, windowMs: 60000
})

Moralis.Cloud.define('getUserTransactions', async (request) => {
    const userAddress = request.params.userAddress;
    const page = request.params.page || 1;
    const limit = request.params.limit;
    const query = new Moralis.Query("EthTransactions");

    const pipeline = [
        { sort: { block_timestamp: -1 } },
        { skip: (page - 1) * limit },
        { limit: limit },

        {
            match: { $expr: { $or: [{ $eq: ["$from_address", userAddress] }, { $eq: ["$to_address", userAddress] }] } }
        }
    ]

    return await query.aggregate(pipeline);
});

Moralis.Cloud.define('getTokens', async (request) => {
    const query = new Moralis.Query("Tokens");
    if (request.params.chain !== 'all') {
        console.log("---", request.params.chain)
        query.equalTo("chain", request.params.chain);
    }
    return await query.aggregate([], (error, data) => {
        if (error) {
            throw error;
        }
        return data;
    });
})


Moralis.Cloud.afterSave(Moralis.User, async (request) => { //object
    const config = await Moralis.Config.get({ useMasterKey: false });
    const backendUrl = config.get("backend_url");

    const logger = Moralis.Cloud.getLogger();
    logger.info("after save user");
    logger.info("after save user done.acc.tokens");
    logger.info(JSON.stringify(request.object));
    logger.info(request.object.get('accounts'));
    const user = request.object;
    const user_addresses = user.get('accounts');
    const chain = 'all';

    if (user_addresses) {
        Moralis.Cloud.httpRequest({
            url: `${backendUrl}/import-tokens?userAddresses=${user_addresses}&chain=${chain}`,
        }).then(function (httpResponse) {
            // success
            logger.info("after success call import chart");

            Moralis.Cloud.httpRequest({
                url: `${backendUrl}/import-chart?userAddresses=${user_addresses}&chain=${chain}`,
            }).then(function (httpResponse) {
                // success
                logger.info(httpResponse.text);
            }, function (httpResponse) {
                // error
                logger.error('Request failed with response code ' + httpResponse.status);
            });
            logger.info(httpResponse.text);
        }, function (httpResponse) {
            // error
            logger.error('Request failed with response code ' + httpResponse.status);
        });
    }
});

// Moralis.Cloud.afterSave(Moralis.User, async (request) => { //object
//     const config = await Moralis.Config.get({ useMasterKey: false });
//     const backendUrl = config.get("backend_url");

//     const logger = Moralis.Cloud.getLogger();
//     logger.info("after save user");
//     logger.info("after save user done..import chart");
//     logger.info(JSON.stringify(request.object));
//     logger.info(request.object.get('accounts'));
//     const user = request.object;
//     const user_addresses = user.get('accounts');
//     const chain = 'all';

//     Moralis.Cloud.httpRequest({
//         url: `${backendUrl}/import-chart?userAddresses=${user_addresses}&chain=${chain}`,
//     }).then(function (httpResponse) {
//         // success
//         logger.info(httpResponse.text);
//     }, function (httpResponse) {
//         // error
//         logger.error('Request failed with response code ' + httpResponse.status);
//     });
// });

Moralis.Cloud.afterSave("EthTokenTransfers", async (request) => {
    const config = await Moralis.Config.get({ useMasterKey: false });
    const backendUrl = config.get("backend_url");

    const logger = Moralis.Cloud.getLogger();
    const token = request.object;
    const from_address = token.get('from_address');
    const to_address = token.get('to_address');
    const token_address = token.get('token_address')
    const confirmed = token.get("confirmed");
    const value = token.get("value");

    if (confirmed) {
        Moralis.Cloud.httpRequest({
            url: `${backendUrl}/update-user-balance`,
            params: {
                fromAddress: from_address,
                toAddress: to_address,
                chain: 'eth',
                tokenAddress: token_address,
                value: value
            }
        }).then(function (httpResponse) {
            // success
            logger.info(httpResponse.text);
        }, function (httpResponse) {
            // error
            logger.error('Request failed with response code ' + httpResponse.status);
        });
    } else {
        return
    }
});

Moralis.Cloud.afterSave("BscTokenTransfers", async (request) => {
    const config = await Moralis.Config.get({ useMasterKey: false });
    const backendUrl = config.get("backend_url");

    const logger = Moralis.Cloud.getLogger();
    const token = request.object;
    const from_address = token.get('from_address');
    const to_address = token.get('to_address');
    const token_address = token.get('token_address')
    const confirmed = token.get("confirmed");
    const value = token.get("value");

    if (confirmed) {
        Moralis.Cloud.httpRequest({
            url: `${backendUrl}/update-user-balance`,
            params: {
                fromAddress: from_address,
                toAddress: to_address,
                chain: 'bsc',
                tokenAddress: token_address,
                value: value
            }
        }).then(function (httpResponse) {
            // success
            logger.info(httpResponse.text);
        }, function (httpResponse) {
            // error
            logger.error('Request failed with response code ' + httpResponse.status);
        });
    } else {
        return
    }

});

Moralis.Cloud.afterSave("PolygonTokenTransfers", async (request) => {
    const config = await Moralis.Config.get({ useMasterKey: false });
    const backendUrl = config.get("backend_url");

    const logger = Moralis.Cloud.getLogger();
    const token = request.object;
    const from_address = token.get('from_address');
    const to_address = token.get('to_address');
    const token_address = token.get('token_address')
    const confirmed = token.get("confirmed");
    const value = token.get("value");

    if (confirmed) {
        Moralis.Cloud.httpRequest({
            url: `${backendUrl}/update-user-balance`,
            params: {
                fromAddress: from_address,
                toAddress: to_address,
                chain: 'polygon',
                tokenAddress: token_address,
                value: value
            }
        }).then(function (httpResponse) {
            // success
            logger.info(httpResponse.text);
        }, function (httpResponse) {
            // error
            logger.error('Request failed with response code ' + httpResponse.status);
        });
    } else {
        return
    }
})

module.exports = __webpack_exports__;
/******/ })()
;
