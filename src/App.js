import React, { useState } from "react";
import './App.css';
function App() {
  const [foodName, setFoodName] = useState("")
  const [nutrition, setNutrition] = useState("");
  const [signIn, setSignIn] = useState(false);
  function handleSearch(){
    const markdown = `**FOOd:**${foodName}
    **Calories:** 89 kcal
    **Protein:** 1.1 g
    **Carbs:** 22.8 g`;
    setNutrition(markdown);
  }
  return (
   <div className="App">
      <nav className="navbar">
        <div className="nav-left">
          <span className="nav-item">📊 Calorie Count of the Day</span>
          <span className="nav-item">🥗 Personalized Diet Plan</span>
        </div>
        <div className="nav-right">
           <button className="sign-btn" onClick={() => setSignIn(true)}>Sign In</button>
        </div>
      </nav>


      <section className="hero">
        <h1>Nutritionist Claude 🥗</h1>
        <p>
          Your personal <strong> 🤖 nutrition assistant</strong> – helping you eat better, live healthier!
        </p>
        <h2 className="hero-tagline">Eat Smart. Live Better.</h2>

        
        <div className="search-box">
          <input
            type="text"
            placeholder="Enter food name..."
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
          <button onClick={handleSearch}>Get Nutrition</button>
        </div>
        {nutrition && <pre>{nutrition}</pre>}
      </section>


    <footer>
      <p>© 2025 Nutritionist Claude. All rights reserved.</p>
    </footer>
    {signIn && (
        <div className="signinform">
          <div className="modal">

            <span className="close-icon" onClick={() => setSignIn(false)}>✖</span>
            <h2>Sign In</h2>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <div className="modal-buttons">
              
              <button>Sign Up</button>
              <button>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
