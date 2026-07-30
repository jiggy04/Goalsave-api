const userResponse = (user) => ({

    id: user._id,

    firstName: user.firstName,

    lastName: user.lastName,

    email: user.email,

    image: user.image,

    currency: user.currency,

    createdAt: user.createdAt,

    updatedAt: user.updatedAt

});

module.exports = userResponse;