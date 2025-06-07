import React, { useState } from "react";
import "./App.css";
import backgroundImage from "./592545406.jpg";

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");

  // Review state
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  // Search/filter state for reviews
  const [searchTerm, setSearchTerm] = useState("");

  // Hotel search state
  const [hotels, setHotels] = useState([]);
  const [hotelsSearchTerm, setHotelsSearchTerm] = useState("");

  // Dummy authentication handler (username: admin, password: password)
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginName === "admin" && password === "password") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials!");
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (name && review && rating) {
      const newReview = { name, review, rating };
      setReviews([...reviews, newReview]);
      setName("");
      setReview("");
      setRating(0);
      setIsScrolled(true);
    } else {
      alert("Please fill in all fields and give a rating!");
    }
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  // Filter reviews based on search term
  const filteredReviews = reviews.filter((rev) =>
    rev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.review.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to fetch hotels using Amadeus API based on a city code
  const fetchHotels = () => {
    if (!hotelsSearchTerm) return;
    // The Amadeus API endpoint for hotel offers; note that hotelsSearchTerm should be a valid city code (e.g., "DEL")
    fetch(`https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode=${hotelsSearchTerm}`, {
      headers: {
        "Authorization": "Bearer YOUR_ACCESS_TOKEN"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming that data.data is an array of hotel offers
        setHotels(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching hotels: ", error);
      });
  };

  // Render the login page with a full-size background image if not authenticated
  if (!isAuthenticated) {
    return (
      <div
        className="login-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div
          className="login-form"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "2rem",
            borderRadius: "8px"
          }}
        >
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Username:</label>
              <input
                type="text"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="input-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            <button type="submit" className="button">Login</button>
          </form>
        </div>
      </div>
    );
  }

  // Main application after authentication
  return (
    <div
      className={`background ${isScrolled ? "scrolled" : ""}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container">
        <h1>MAYFAIR Lagoon, Bhubaneswar</h1>

        {/* Review Section */}
        <h2>Write a review here:</h2>
        <form onSubmit={handleSubmitReview} className="form">
          <div className="input-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="input"
            />
          </div>

          <div className="input-group">
            <label>Review:</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review..."
              rows="4"
              className="textarea"
            ></textarea>
          </div>

          <div className="input-group">
            <label>Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={`star ${star <= rating ? "filled" : ""}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="button">
            Submit Review
          </button>
        </form>

        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reviews..."
            className="input search-input"
          />
        </div>

        {filteredReviews.length > 0 ? (
          <div className="output">
            <h2>Reviews:</h2>
            {filteredReviews.map((rev, index) => (
              <div key={index} className="review">
                <p>
                  <strong>Name:</strong> {rev.name}
                </p>
                <p>
                  <strong>Review:</strong> {rev.review}
                </p>
                <p>
                  <strong>Rating:</strong>
                  <span className="star-rating-output">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= rev.rating ? "filled" : ""}`}
                      >
                        ★
                      </span>
                    ))}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews found.</p>
        )}

        {/* Hotel Search Section using Amadeus API */}
        <div className="hotel-search">
          <h2>Search Hotels in India</h2>
          <div>
            <input
              type="text"
              value={hotelsSearchTerm}
              onChange={(e) => setHotelsSearchTerm(e.target.value)}
              placeholder="Enter city code (e.g., DEL)"
              className="input search-input"
            />
            <button onClick={fetchHotels} className="button">
              Search Hotels
            </button>
          </div>
          {hotels.length > 0 ? (
            <div className="hotel-results">
              {hotels.map((hotel, index) => (
                <div key={index} className="hotel">
                  <p>
                    <strong>{hotel.hotel.name}</strong> -{" "}
                    {hotel.hotel.address.cityName}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No hotels found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
