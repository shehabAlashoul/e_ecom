import { Router } from "express";
import { addReviewSchema, deleteReviewSchema, getReviewsSchema, updateReviewSchema } from "../validations/review.validations.js";
import { authenticate, authorize } from "../../users/middleware/auth.middleware.js";
import { validate } from "../../../../middlewares/validation.middleware.js";
import { ROLE } from "../../../../utils/enums.js";
import { addReview, deleteReview, getReviews, updateReview } from "../controllers/review.controllers.js";

const reviewRouter = Router({mergeParams: true})

reviewRouter
	.route('/')
	.get(
        validate(getReviewsSchema),
		getReviews
        )
        .post(
            authenticate,
            authorize(ROLE.ADMIN),
            validate(addReviewSchema),
	addReview

	)
	.put(
		authenticate,
		authorize(ROLE.ADMIN),
		validate(updateReviewSchema),
	updateReview
	)
	.delete(
		authenticate,
		authorize(ROLE.ADMIN),
		validate(deleteReviewSchema),
        deleteReview
	)


export default reviewRouter