import React, { useState } from "react";
import './App.css';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

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

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [bmiResult, setBMIResult] = useState("")
  const [dietPlan, setDietPlan] = useState([]);

  const [showCalorieModal, setShowCalorieModal] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealQuantity, setMealQuantity] = useState("");
  const [dailyMeals, setDailyMeals] = useState([]);

  const [loggedInUser, setLoggedInUser] = useState("");

  const API_KEY = process.env.REACT_APP_SPOONACULAR_KEY;



React.useEffect(() => {
  if (isAuthenticated) {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      localStorage.setItem(`dailyMeals_${currentUser}`, JSON.stringify(dailyMeals));
    }
  }
}, [dailyMeals, isAuthenticated]);
  
  React.useEffect(() => {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    setIsAuthenticated(true);
    setLoggedInUser(currentUser.split("@")[0]);
    loadMealsForUser(currentUser);  
  }
}, []);
  

  
  function loadMealsForUser(userEmail) {
    const savedMeals = localStorage.getItem(`dailyMeals_${userEmail}`);
    if (savedMeals) {
      setDailyMeals(JSON.parse(savedMeals));
    } else {
      setDailyMeals([]);
    }
  }

  function handleSearch() {
    if (!foodName.trim()) {
      alert("Please enter a food name!");
      return;
    }

    fetch(`https://api.spoonacular.com/food/ingredients/search?query=${foodName}&number=1&apiKey=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.results || data.results.length === 0) {
          setNutrition(` No nutrition data found for "${foodName}".`);
          return;
        }

        const ingredientId = data.results[0].id;
        return fetch(
          `https://api.spoonacular.com/food/ingredients/${ingredientId}/information?amount=100&unit=gram&apiKey=${API_KEY}`
        )
          .then((res) => res.json())
          .then((info) => {
            if (!info.nutrition || !info.nutrition.nutrients) {
              setNutrition(` No nutrition data found for "${foodName}".`);
              return;
            }

            const nutrients = info.nutrition.nutrients;
            const calories = nutrients.find((n) => n.name === "Calories")?.amount || "N/A";
            const protein = nutrients.find((n) => n.name === "Protein")?.amount || "N/A";
            const carbs = nutrients.find((n) => n.name === "Carbohydrates")?.amount || "N/A";
            const fat = nutrients.find((n) => n.name === "Fat")?.amount || "N/A";

            setNutrition(
              `🍽 **${info.name} (per 100g)**\n` +
              ` Calories: ${calories} kcal\n` +
              ` Protein: ${protein} g\n` +
              ` Carbs: ${carbs} g\n` +
              ` Fat: ${fat} g`
            );
          });
      })
      .catch(() => {
        setNutrition(` Failed to fetch nutrition info for "${foodName}".`);
      });
  }

  async function validateSignUp() {
    if (signUpName.trim().length < 2) {
      alert(" Please enter your full name");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(signUpEmail)) {
      alert(" Please enter a valid email like example@domain.com");
      return;
    }

    if (signUpPassword.trim().length < 6) {
      alert(" Password must be at least 6 characters long");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      alert("✅ Registered successfully! You can now sign in.");
      setSignUp(false);
      setSignIn(true);
    } catch (error) {
      alert(` Sign Up Failed: ${error.message}`);
    }
  }

  async function validateSignIn() {
    const emailpattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailpattern.test(email)) {
      alert(" Please enter a valid email like example@domain.com");
      return;
    }

    if (password.trim().length < 6) {
      alert(" Password must be at least 6 characters long");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      setSignIn(false);

      
      localStorage.setItem("currentUser", email);

      setLoggedInUser(email.split("@")[0]);

     
      loadMealsForUser(email);

      alert("✅ Signed in successfully!");
    } catch (error) {
      alert(` Sign In Failed: ${error.message}`);
    }
  }

  function handleLogout() {
  localStorage.removeItem("currentUser");
  setIsAuthenticated(false);
  setLoggedInUser("");
  setDailyMeals([]); 
  alert("You have been logged out.");
}

  function fetchIndianDietPlan(status) {
    let extraFilters = "";
    if (status === "Underweight") extraFilters = "&minCalories=500";
    else if (status === "Overweight") extraFilters = "&maxCalories=300";

    const randomOffset = Math.floor(Math.random() * 20);

    fetch(`https://api.spoonacular.com/recipes/complexSearch?cuisine=Indian&number=4&offset=${randomOffset}${extraFilters}&apiKey=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results && data.results.length >= 4) {
          const meals = ["Breakfast", "Lunch", "Snacks", "Dinner"];
          const mappedMeals = meals.map((meal, idx) => ({
            meal,
            recipe: data.results[idx] || null
          }));
          setDietPlan(mappedMeals);
        } else {
          console.warn(" No recipes found! Showing backup plan.");
          setDietPlan([
            { meal: "Breakfast", recipe: { id: 1, title: "Poha with peanuts & tea" } },
            { meal: "Lunch", recipe: { id: 2, title: "Dal Tadka with Jeera Rice & Salad" } },
            { meal: "Snacks", recipe: { id: 3, title: "Sprouts Chaat with lemon" } },
            { meal: "Dinner", recipe: { id: 4, title: "Roti, Paneer Bhurji & Cucumber Raita" } }
          ]);
        }
      })
      .catch(() => {
        setDietPlan([
          { meal: "Breakfast", recipe: { id: 1, title: "Poha with peanuts & tea" } },
          { meal: "Lunch", recipe: { id: 2, title: "Dal Tadka with Jeera Rice & Salad" } },
          { meal: "Snacks", recipe: { id: 3, title: "Sprouts Chaat with lemon" } },
          { meal: "Dinner", recipe: { id: 4, title: "Roti, Paneer Bhurji & Cucumber Raita" } }
        ]);
      });
  }

  function calculateBMIAndGetDiet() {
    if (!height || !weight) {
      alert(" Please enter valid height & weight");
      return;
    }

    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    let status = bmi < 18.5 ? "Underweight" : bmi < 24.9 ? "Normal" : "Overweight";

    setBMIResult(`Your BMI is ${bmi} - You are ${status}`);
    fetchIndianDietPlan(status);
  }

  function addMealToList() {
    if (!mealName || !mealQuantity) {
      alert("Please enter meal name & quantity!");
      return;
    }

    fetch(`https://api.spoonacular.com/food/ingredients/search?query=${mealName}&number=1&apiKey=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if (!data.results || data.results.length === 0) {
          alert(`No nutrition data found for "${mealName}"`);
          return;
        }

        const ingredientId = data.results[0].id;
        return fetch(
          `https://api.spoonacular.com/food/ingredients/${ingredientId}/information?amount=${mealQuantity}&unit=gram&apiKey=${API_KEY}`
        );
      })
      .then(res => res.json())
      .then(info => {
        if (!info || !info.nutrition || !info.nutrition.nutrients) {
          alert(`No calorie info for "${mealName}"`);
          return;
        }

        const calories = info.nutrition.nutrients.find(n => n.name === "Calories")?.amount || 0;
        const newMeal = { name: `${mealName} (${mealQuantity}g)`, calories: Math.round(calories) };

        setDailyMeals(prev => [...prev, newMeal]);

        setMealName("");
        setMealQuantity("");
      })
      .catch(() => alert("Failed to fetch calorie info. Try again later."));
  }

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <span className="nav-item" onClick={() => {
  if (!isAuthenticated) {
    
    alert("Please sign in first to use Calorie Tracker!");
    setSignIn(true);
  } else {
    
    setShowCalorieModal(true);
  }
}}>
  📊 Calorie Count of the Day
</span>
          <span className="nav-item" onClick={() => {
            if (!isAuthenticated) setSignIn(true);
            else setShowBMIForm(true);
          }}>
            🥗 Personalized Diet Plan
          </span>
        </div>
        <div className="nav-right">
        {!isAuthenticated ? (
          <button className="sign-btn" onClick={() => setSignIn(true)}>Sign In</button>
        ) : (
          <>
            <span className="nav-user">👤 {loggedInUser}</span>
            <button
              className="logout-btn"
              style={{
                marginLeft: "10px",
                backgroundColor: "red",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <h1>Nutritionist Claude 🥗</h1>
        <p>Your personal <strong>🤖 nutrition assistant</strong> – helping you eat better, live healthier!</p>
        <h2 className="hero-tagline">Eat Smart. Live Better.</h2>

        <div className="search-box">
          <input type="text" placeholder="Enter food name..." value={foodName} onChange={(e) => setFoodName(e.target.value)} />
          <button onClick={handleSearch}>Get Nutrition</button>
        </div>
        {nutrition && <pre>{nutrition}</pre>}
      </section>

      {/* Footer */}
      <footer>
        <p>© 2025 Nutritionist Claude. All rights reserved.</p>
      </footer>

      {/* Sign In Modal */}
      {signIn && (
        <div className="signinform">
          <div className="modal">
            <span className="close-icon" onClick={() => setSignIn(false)}>✖</span>
            <h2>Sign In</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="modal-buttons">
              <button onClick={() => { setSignIn(false); setSignUp(true); }}>Sign Up</button>
              <button onClick={validateSignIn}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {signUp && (
        <div className="signinform">
          <div className="modal">
            <span className="close-icon" onClick={() => setSignUp(false)}>✖</span>
            <h2>Sign Up</h2>
            <input type="text" placeholder="Full Name" value={signUpName} onChange={(e) => setSignUpName(e.target.value)} />
            <input type="email" placeholder="Email" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} />
            <div className="modal-buttons">
              <button onClick={() => { setSignUp(false); setSignIn(true); }}>Back</button>
              <button onClick={validateSignUp}>Register</button>
            </div>
          </div>
        </div>
      )}

      {/* BMI Modal */}
      {showBMIForm && (
        <div className="signinform">
          <div className="modal">
            <span className="close-icon" onClick={() => { setShowBMIForm(false); setDietPlan([]); setBMIResult(""); }}>✖</span>
            <h2>Enter Your Details</h2>
            <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} />
            <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
            <div className="modal-buttons">
              <button onClick={calculateBMIAndGetDiet}>Check Fitness</button>
            </div>
            {bmiResult && <p style={{ marginTop: "10px" }}>{bmiResult}</p>}

            {dietPlan.length > 0 && (
              <div style={{ marginTop: "15px" }}>
                <h3>🍛 Suggested Indian Meals:</h3>
                <ul>
                  {dietPlan.map(({ meal, recipe }) =>
                    recipe ? (
                      <li key={recipe.id}>
                        <strong>{meal}:</strong>{" "}
                        {recipe.sourceUrl ? (
                          <a href={recipe.sourceUrl || `https://spoonacular.com/recipes/${recipe.id}`} target="_blank" rel="noreferrer">
                            {recipe.title}
                          </a>
                        ) : (
                          recipe.title
                        )}
                      </li>
                    ) : (
                      <li key={meal}>{meal}: No recipe found</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Calorie Modal */}
      {showCalorieModal && (
        <div className="signinform">
          <div className="modal">
            <span className="close-icon" onClick={() => setShowCalorieModal(false)}>✖</span>
            <h2>📊 Calorie Count of the Day</h2>

            <input
              type="text"
              placeholder="Enter meal (e.g. Rice)"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity (grams)"
              value={mealQuantity}
              onChange={(e) => setMealQuantity(e.target.value)}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={addMealToList}>Add Meal</button>
              <button
                style={{ backgroundColor: "red", color: "white" }}
                onClick={() => {
                  setDailyMeals([]);
                  const currentUser = localStorage.getItem("currentUser");
                  if (currentUser) {
                    localStorage.removeItem(`dailyMeals_${currentUser}`);
                  }
                }}
              >
                Reset
              </button>
            </div>

            {dailyMeals.length > 0 && (
              <>
                <h3 style={{ marginTop: "10px" }}>Today's Meals</h3>
                <ul>
                  {dailyMeals.map((m, idx) => (
                    <li key={idx}>{m.name} - {m.calories} kcal</li>
                  ))}
                </ul>
                <strong>Total Calories: {dailyMeals.reduce((sum, m) => sum + m.calories, 0)} kcal</strong>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;