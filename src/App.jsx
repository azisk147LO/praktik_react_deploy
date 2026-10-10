import { useEffect, useRef, useState } from "react"
import "./App.css"

function App() {
  const playerRef = useRef(null)
  const loginRef = useRef(null)

  const [angle, setAngle] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [placed, setPlaced] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")

  const pivot = {
    x: 410,
    y: 65
  }

  const baseNeedleAngle = 173

  useEffect(() => {
    if (!placed) return

    const timer = setTimeout(() => {
      setShowLogin(true)
    }, 1800)

    return () => clearTimeout(timer)
  }, [placed])

  useEffect(() => {
    if (!showLogin || !loginRef.current) return

    const timer = setTimeout(() => {
      loginRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      })
    }, 150)

    return () => clearTimeout(timer)
  }, [showLogin])

  const handlePointerDown = (e) => {
    if (placed) return

    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }

  const handlePointerMove = (e) => {
    if (!dragging || placed || !playerRef.current) return

    const rect = playerRef.current.getBoundingClientRect()

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const dx = mouseX - pivot.x
    const dy = mouseY - pivot.y

    const mouseAngle = Math.atan2(dy, dx) * (180 / Math.PI)

    let newAngle = mouseAngle - baseNeedleAngle

    newAngle = Math.max(-60, Math.min(10, newAngle))

    setAngle(newAngle)
  }

  const handlePointerUp = (e) => {
    if (!dragging || !playerRef.current) return

    setDragging(false)

    const rect = playerRef.current.getBoundingClientRect()

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const vinylCenter = {
      x: 225,
      y: 180
    }

    const distance = Math.sqrt(
      Math.pow(mouseX - vinylCenter.x, 2) +
      Math.pow(mouseY - vinylCenter.y, 2)
    )

    if (distance < 145 && angle < -10) {
      setAngle(-24)
      setPlaced(true)
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()

    if (!username || !password) {
      setMessage("Please fill in all fields.")
      return
    }

    setMessage("Login successful!")
  }

  return (
    <div className="app">
      <div className="main-content">

        <div className="title">
          <h1>PLAY TO LOGIN</h1>

          <p>
            {showLogin
              ? "Welcome back"
              : placed
              ? "Music is playing..."
              : "Drag the tonearm to the vinyl"}
          </p>
        </div>

        <div
          className="player"
          ref={playerRef}
        >

          <div className={`vinyl ${placed ? "playing" : ""}`}>
            <div className="vinyl-center"></div>

            {!placed && (
              <div className="target-ring">
                DROP HERE
              </div>
            )}
          </div>

          <div
            className={`tonearm ${
              dragging ? "dragging" : ""
            } ${
              placed ? "placed" : ""
            }`}
            style={{
              transform: `rotate(${angle}deg)`
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <div className="pivot"></div>

            <div className="arm">
              <div className="needle"></div>
            </div>
          </div>

          <button className="power-button">
            ●
          </button>

        </div>

        {placed && (
          <div className="playing-text">
            ♪ NOW PLAYING ♪
          </div>
        )}

        {showLogin && (
          <div
            className="login-container"
            ref={loginRef}
          >
            <div className="login-card">

              <h2>Welcome</h2>

              <p className="login-subtitle">
                Sign in to continue
              </p>

              <form onSubmit={handleLogin}>

                <div className="input-group">
                  <label>Username</label>

                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                  />
                </div>

                <div className="input-group">
                  <label>Password</label>

                  <div className="password-box">
                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="show-password"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="login-button"
                >
                  LOGIN
                </button>

              </form>

              {message && (
                <p
                  className={`message ${
                    message === "Login successful!"
                      ? "success"
                      : "error"
                  }`}
                >
                  {message}
                </p>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App