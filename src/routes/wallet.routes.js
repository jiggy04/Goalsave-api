const express = require("express");

const walletController = require("../controllers/wallet.controller");

const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const {
    createWalletSchema,
    updateWalletSchema
} = require("../validators/wallet.validator");


const router = express.Router();

router.use(authenticate);

router.post(
    "/",
    validate(createWalletSchema),
    walletController.createWallet
);

router.get(
    "/",
    walletController.getWallets
);

router.get(
    "/:id",
    walletController.getWalletById
);

router.patch(
    "/:id",
    validate(updateWalletSchema),
    walletController.updateWallet
);

router.delete(
    "/:id",
    walletController.deleteWallet
);

router.patch(
    "/:id/default",
    walletController.setDefaultWallet
);

module.exports = router;