const walletService = require("../services/wallet.service");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createWallet = asyncHandler(async (req, res) => {
    const wallet = await walletService.createWallet(
        req.body,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Wallet created successfully",
        wallet,
        201
    );
});

const getWallets = asyncHandler(async (req, res) => {
    const wallets = await walletService.getWallets(req.user._id, req.query);

    return ApiResponse.success(
        res,
        "Wallets retrieved successfully",
        wallets.items,
        200,
        wallets.pagination
    );
});

const getWalletById = asyncHandler(async (req, res) => {
    const wallet = await walletService.getWalletById(
        req.params.id,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Wallet retrieved successfully",
        wallet
    );
});

const updateWallet = asyncHandler(async (req, res) => {
    
    const wallet = await walletService.updateWallet(
        req.params.id,
        req.body,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Wallet updated successfully",
        wallet
    );

});

const deleteWallet = asyncHandler(async (req, res) => {

    await walletService.deleteWallet(
        req.params.id,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Wallet deleted successfully",
        null
    );

});

const setDefaultWallet = asyncHandler(async (req, res) => {

    const wallet = await walletService.setDefaultWallet(
        req.params.id,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Default wallet updated successfully",
        wallet
    );

});

module.exports = {
    createWallet,
    getWallets,
    getWalletById,
    updateWallet,
    deleteWallet,
    setDefaultWallet
};
