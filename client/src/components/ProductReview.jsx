import React, { useEffect, useState } from 'react'
import { ProductReviewList, CreateReview } from '../APIRequest/APIRequest'
import { readCookie } from '../helper/cookie'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductReview = ({ productID }) => {
    let token = readCookie("token")
    const navigate = useNavigate();

    let [reviews, setReviews] = useState([])
    let [rating, setRating] = useState(5)
    let [message, setMessage] = useState("")
    let [submitting, setSubmitting] = useState(false)

    useEffect(() => {

        (async () => {
            console.log("Product ID:", productID)
            let data = await ProductReviewList(productID)
            console.log("data:", data)
            data = data.data ? data.data : data
            console.log("data:", data)
            setReviews(data)
            console.log("reviews:", reviews)
        })()

    }, [productID])

    const submitReview = async () => {
        if (token) {
            if (!message.trim()) {
                toast.error("Please enter a review message.");
                return;
            }
            setSubmitting(true);
            let reviewInfo = {
                productID,
                des: message,
                rating: rating.toString()
            }
            try {
                let res = await CreateReview(reviewInfo, token);
                if (res) {
                    toast.success("Review submitted successfully!");
                    setMessage("");
                    setRating(5);
                    // Refetch reviews
                    let data = await ProductReviewList(productID);
                    data = data.data ? data.data : data;
                    setReviews(data);
                } else {
                    toast.error("Failed to submit review.");
                }
            } catch (error) {
                toast.error("An error occurred. Please try again.");
                console.error("Submit review error:", error);
            } finally {
                setSubmitting(false);
            }
        } else {
            navigate('/login');
        }
    }

    return (
        <>
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                            <div className="flex items-center mb-2">
                                <span className="font-semibold mr-2">{review.profile.cus_name || 'Anonymous'}</span>
                                <span className="text-yellow-500">
                                    {'★'.repeat(Math.floor(review.rating))}{'☆'.repeat(5 - Math.floor(review.rating))}
                                </span>
                                <span className="ml-2 text-sm text-gray-600">{review.rating}</span>
                            </div>
                            <p className="text-gray-700">{review.des}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No reviews yet.</p>
                )}
            </div>
            <div>
                <div className="rating">
                    {[1,2,3,4,5].map(star => (
                        <input 
                            key={star} 
                            type="radio" 
                            name="rating" 
                            className="mask mask-star-2 bg-orange-400" 
                            checked={rating === star} 
                            onChange={() => setRating(star)} 
                            aria-label={`${star} star`} 
                        />
                    ))}
                </div>
                <textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Write your review here..." 
                    className="w-full p-2 border rounded mt-2"
                />
                <button 
                    onClick={submitReview} 
                    disabled={submitting} 
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                    {submitting ? "Submitting..." : "Submit Review"}
                </button>
            </div>
        </>
    )
}

export default ProductReview