const createReview = async (req, res) => {};
const getAllReviews = async (req, res) => {
    const apartmentId = req.params.apartmentId;
};
const getReview = async (req, res) => {
    const id = req.params.id;
};
const updateReview = async (req, res) => {
    const id = req.params.id;
};
const deleteReview = async (req, res) => {
    const id = req.params.id;
};
const markHelpful = async (req, res) => {
    const id = req.params.id;
};

module.exports = {
    createReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview,
    markHelpful,
};
