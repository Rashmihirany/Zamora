'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface Review {
  _id: string;
  username: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt?: string;
}

interface ReviewSectionProps {
  productId: string;
  initialReviews: Review[];
}

const ReviewSection = ({ productId, initialReviews }: ReviewSectionProps) => {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.type.startsWith('image/'));

    if (selectedImages.length + validFiles.length > 5) {
      alert('Maximum 5 images allowed per review');
      return;
    }

    setSelectedImages((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    setIsLoading(true);
    try {
      // Convert images to base64
      const base64Images: string[] = [];
      for (const file of selectedImages) {
        const base64 = await convertImageToBase64(file);
        base64Images.push(base64);
      }

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating: parseInt(rating),
          comment,
          images: base64Images,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newReview: Review = {
          _id: data.review._id,
          username: session?.user?.name || session?.user?.username || 'Anonymous',
          rating: parseInt(rating),
          comment,
          images: base64Images,
          createdAt: new Date().toISOString(),
        };
        setReviews([newReview, ...reviews]);
        setComment('');
        setRating('5');
        setSelectedImages([]);
        setImagePreviewUrls([]);
        alert('Review submitted successfully!');
      } else {
        alert('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    } finally {
      setIsLoading(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="review-section-container">
      {/* Review Header */}
      <div className="review-header">
        <div className="review-header-title">
          <h2>Customer Reviews</h2>
          <div className="review-stats">
            <span className="review-count">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
            {reviews.length > 0 && (
              <span className="review-average">
                <span className="stars-display">
                  {'★'.repeat(Math.round(Number(averageRating)))}
                  {'☆'.repeat(5 - Math.round(Number(averageRating)))}
                </span>
                <span className="average-text">{averageRating} out of 5</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Existing Reviews */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header-info">
                <div className="review-user-info">
                  <h4 className="review-username">{review.username}</h4>
                  <span className="review-date">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : ''}
                  </span>
                </div>
                <span className="review-rating">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </span>
              </div>

              <p className="review-comment">{review.comment}</p>

              {/* Review Images Gallery */}
              {review.images && review.images.length > 0 && (
                <div className="review-images-gallery">
                  {review.images.map((image, idx) => (
                    <div key={idx} className="review-image-thumb">
                      <Image
                        src={image}
                        alt={`Review image ${idx + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Write Review Section */}
      {session ? (
        <div className="write-review-section">
          <h3>Write a Review</h3>
          <div className="review-form">
            {/* Rating Selection */}
            <div className="form-group">
              <label>Rating</label>
              <div className="rating-selector">
                {[5, 4, 3, 2, 1].map((value) => (
                  <button
                    key={value}
                    className={`rating-btn ${rating === String(value) ? 'active' : ''}`}
                    onClick={() => setRating(String(value))}
                    type="button"
                  >
                    <span className="stars-preview">
                      {'★'.repeat(value)}
                      {'☆'.repeat(5 - value)}
                    </span>
                    <span className="rating-label">{value} Star{value !== 1 ? 's' : ''}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="form-group">
              <label htmlFor="review-comment">Your Review</label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product. What did you like about it?"
                rows={4}
                className="review-textarea"
              />
              <span className="char-count">{comment.length}/500</span>
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label>Add Images (Optional - up to 5)</label>
              <div className="image-upload-area">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden-file-input"
                  disabled={selectedImages.length >= 5}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="upload-btn"
                  disabled={selectedImages.length >= 5}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Click to upload images
                </button>
                <p className="upload-hint">or drag and drop (PNG, JPG, GIF up to 5 images)</p>
              </div>

              {/* Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="image-preview-grid">
                  {imagePreviewUrls.map((url, idx) => (
                    <div key={idx} className="image-preview-item">
                      <Image
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="remove-image-btn"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitReview}
              disabled={isLoading}
              className="submit-review-btn"
            >
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      ) : (
        <div className="login-prompt">
          <p>Please log in to leave a review</p>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
