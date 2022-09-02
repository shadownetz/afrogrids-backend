import * as functions from "firebase-functions";
import FirestoreReferences from "../configs/firestoreReferences";

class ReviewsListener {
  firestoreRef = new FirestoreReferences();
  usersRef = this.firestoreRef.usersRef;

  calcUserRatings = functions
      .firestore
      .document("reviews/{reviewId}")
      .onCreate(async (snapshot)=>{
        const review = snapshot.data();
        const userId = review.createdFor;
        const rating = review.rating;
        const user = await this.usersRef.doc(userId).get();
        if (user.exists) {
          const userData = user.data() as Record<string, never>;
          const userReviews = userData.reviews as Record<string, number>;
          const ratingTotal = parseInt(userReviews.total+rating);
          const ratingCount = userReviews.count+1;
          await this.usersRef.doc(userId).update({
            reviews: {
              total: ratingTotal,
              average: ratingTotal/ratingCount,
              count: ratingCount,
            },
          });
        }
      });
}

export default ReviewsListener;
