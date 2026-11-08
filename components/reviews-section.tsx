const reviews = [
  {
    name: 'Amelia',
    initial: 'A',
    quote: 'A lovely creamy texture that rinses away easily. My skin feels soft after washing, without that tight feeling.',
    product: 'Gentle Cream Cleanser',
  },
  {
    name: 'Marcus',
    initial: 'M',
    quote: 'Rich enough for my dry skin, but comfortable for everyday use. A simple, comforting last step in my evening routine.',
    product: 'Barrier Repair Cream',
  },
  {
    name: 'Chloe',
    initial: 'C',
    quote: 'The little sizes made it easy to try the routine before choosing full sizes. Such a thoughtful way to get started.',
    product: 'Discovery Kit',
  },
];

export function ReviewsSection() {
  return (
    <section className="band reviews" id="c-reviews" aria-labelledby="c-reviews-h">
      <div className="wrap">
        <div className="reviews-layout">
          <div className="reviews-intro">
            <h2 className="h-lg" id="c-reviews-h">A little more calm.</h2>
            <p className="reviews-disclosure" id="c-reviews-note">
              <strong>Sample reviews</strong>
              <span>Illustrative testimonials for this demo.</span>
            </p>
          </div>
          <ul className="reviews-list" tabIndex={0} aria-label="Sample customer reviews" aria-describedby="c-reviews-note">
            {reviews.map(review => (
              <li className="review-card" key={review.name}>
                <figure>
                  <figcaption className="review-person">
                    <span className="review-avatar" aria-hidden="true">{review.initial}</span>
                    <span><b>{review.name}</b><span className="review-sample">Sample review</span></span>
                  </figcaption>
                  <span className="review-rating">
                    <span className="sr">5 out of 5 stars, sample rating</span>
                    <span className="review-stars" aria-hidden="true">
                      {Array.from({ length: 5 }, (_, index) => (
                        <svg key={index} viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.5 2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55-4.76-4.64 6.58-.96z" /></svg>
                      ))}
                    </span>
                  </span>
                  <blockquote><p>&ldquo;{review.quote}&rdquo;</p></blockquote>
                  <p className="review-product">{review.product}</p>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
