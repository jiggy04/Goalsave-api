const Wallet = require("../models/Wallet");

const AppError = require("../utils/AppError");
const getQueryFeatures = require("../utils/queryFeatures");

const createWallet = async (payload, userId) => {
    if (!payload || !payload.name) {

        throw new AppError(
            "Wallet name is required",
            400
        );

    }

    const existingWallet = await Wallet.findOne({
        user: userId,
        name: payload.name.trim(),
        isActive: true
    });

    if (existingWallet) {
        throw new AppError("Wallet already exists", 409);
    }

    const wallet = await Wallet.create({
        user: userId,
        name: payload.name.trim(),
        balance: payload.balance || 0,
        currency: payload.currency || "NGN",
        isDefault: payload.isDefault || false
    });

    if (wallet.isDefault) {

        await Wallet.updateMany(
            {
                user: userId,
                _id: { $ne: wallet._id }
            },
            {
                isDefault: false
            }
        );

    }

    return wallet;

};

const getWallets = async (userId, query ={}) => {

    const filter = {
        user: userId,
        isActive: true
    };

    query = query || {};

    if (query.search) {

        filter.name = {
            $regex: query.search,
            $options: "i"
        };

    }

    const {
        limit,
        skip,
        sort
    } = getQueryFeatures(query);

    return await Wallet.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

};

const getWalletById = async (id, userId) => {

    const wallet = await Wallet.findOne({
        _id: id,
        user: userId,
        isActive: true
    });

    if (!wallet) {
        throw new AppError("Wallet not found", 404);
    }

    return wallet;

};

const updateWallet = async (id, payload, userId) => {

    const wallet = await Wallet.findOne({
        _id: id,
        user: userId,
        isActive: true
    });

    if (!wallet) {
        throw new AppError("Wallet not found", 404);
    }

    if (payload.name) {

        const existingWallet = await Wallet.findOne({
            user: userId,
            name: payload.name.trim(),
            isActive: true,
            _id: { $ne: id }
        });

        if (existingWallet) {
            throw new AppError(
                "Wallet name already exists",
                409
            );
        }

        wallet.name = payload.name.trim();

    }

    if (payload.currency) {
        wallet.currency = payload.currency;
    }

    if (payload.color) {
        wallet.color = payload.color;
    }

    if (payload.icon) {
        wallet.icon = payload.icon;
    }

    if (payload.isDefault !== undefined) {

        if (payload.isDefault) {

            await Wallet.updateMany(
                {
                    user: userId,
                    _id: { $ne: id }
                },
                {
                    isDefault: false
                }
            );

        }

        wallet.isDefault = payload.isDefault;

    }

    await wallet.save();

    return wallet;

};

const deleteWallet = async (id, userId) => {

    const wallet = await Wallet.findOne({
        _id: id,
        user: userId,
        isActive: true
    });

    if (!wallet) {
        throw new AppError("Wallet not found", 404);
    }

    wallet.isActive = false;

    await wallet.save();

};

const setDefaultWallet = async (id, userId) => {

    const wallet = await Wallet.findOne({
        _id: id,
        user: userId,
        isActive: true
    });

    if (!wallet) {
        throw new AppError("Wallet not found", 404);
    }

    await Wallet.updateMany(
        {
            user: userId
        },
        {
            isDefault: false
        }
    );

    wallet.isDefault = true;

    await wallet.save();

    return wallet;

};

module.exports = {
    createWallet,
    getWallets,
    getWalletById,
    updateWallet,
    deleteWallet,
    setDefaultWallet
};