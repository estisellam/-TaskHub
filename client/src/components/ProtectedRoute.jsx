import { Navigate } from "react-router-dom";

function ProtectedRoute({ children })
{
    // 1. שליפת המשתמש המחובר מה-localStorage
    const userString = localStorage.getItem("user");

    // אם אין משתמש מחובר בכלל - מעבירים אותו ל-Login
    if(!userString)
    {
        return <Navigate to="/login" replace />;
    }

    // המרת מחרוזת הטקסט חזרה לאובייקט JavaScript
    const user = JSON.parse(userString);

    // 2. ⛔ בדיקת חסימה: אם המשתמש מוגדר כחסום (is_blocked === 1)
    if (user && user.is_blocked === 1)
    {
        // מנקים את ה-localStorage כדי שהוא לא יישאר מחובר
        localStorage.clear();
        
        // מציגים לו התראה רשמית באנגלית
        alert("Your account has been blocked by the administrator! ⛔");
        
        // זורקים אותו חזרה לעמוד ה-Login
        return <Navigate to="/login" replace />;
    }

    // אם המשתמש מחובר ותקין - נותנים לו להיכנס לעמוד המבוקש
    return children;
}

export default ProtectedRoute;