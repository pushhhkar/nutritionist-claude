import React, { useState } from "react";
import './App.css';
function App() {
  const [foodName, setFoodName] = useState("")
  const [nutrition, setNutrition] = useState("");
  const [signIn, setSignIn] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showBMIForm, setShowBMIForm] = useState(false);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  function handleSearch(){
    const markdown = `**FOOd:**${foodName}
    **Calories:** 89 kcal
    **Protein:** 1.1 g
    **Carbs:** 22.8 g`;
    setNutrition(markdown);
  }


  function validateSignIn(){
    const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailpattern.test(email)) {
      alert("❌ Please enter a valid email like example@domain.com");
      return;
    }

    if (password.trim().length < 6) {
      alert("❌ Password must be at least 6 characters long");
      return;
    }
    setIsAuthenticated(true);
    setSignIn(false);
    alert("✅ Signed in successfully!");
  }


   function validateSignUp() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (signUpName.trim().length < 2) {
      alert("❌ Please enter your full name");
      return;
    }

    if (!emailPattern.test(signUpEmail)) {
      alert("❌ Please enter a valid email like example@domain.com");
      return;
    }

    if (signUpPassword.trim().length < 6) {
      alert("❌ Password must be at least 6 characters long");
      return;
    }

    alert("✅ Registered successfully! You can now sign in.");
    setSignUp(false);
    setSignIn(true); 
  }



  return (
   <div className="App">
      <nav className="navbar">
        <div className="nav-left">
          <span className="nav-item">📊 Calorie Count of the Day</span>
          <span 
          className="nav-item"
            onClick={() => {
              if(!isAuthenticated){
                setSignIn(true);
              }else{
                setShowBMIForm(true);
              }
            }}
          >
            🥗 Personalized Diet Plan
            </span>
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
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="modal-buttons">
              
              <button onClick={() => {setSignIn(false); setSignUp(true);}}>Sign Up</button>
              <button onClick={validateSignIn}>Submit</button>
            </div>
          </div>
        </div>
      )}


      {signUp && (
        <div className="signinform">
          <div className="modal">
            <span className="close-icon" onClick={() => setSignUp(false)}>✖</span>
            <h2>Sign Up</h2>
            <input type="text" placeholder="Full Name" value={signUpName} onChange={(e) => setSignUpName(e.target.value)}/>
            <input type="email" placeholder="Email" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)}/>
            <input type="password" placeholder="Password" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)}/>
            <div className="modal-buttons">
              <button onClick={() => {setSignUp(false); setSignIn(true);}}>Back</button>
              <button onClick={validateSignUp}>Register</button>
            </div>
          </div>
        </div>
      )}

      {showBMIForm && (
        <div className="signinform">
          <div className="modal">
            <span className="close-icon" onClick={() => setShowBMIForm(false)}>✖</span>
            <h2>Enter Your Details</h2>
            <input type="number" placeholder="Height (cm)"/>
            <input type="number" placeholder="Weight (kg)"/>
            <input type="number" placeholder="Age"/>
            <div className="modal-buttons">
              <button>Check Fitness</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
