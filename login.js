const SUPABASE_URL =

    "https://bggvlpsehntmrxkdrsie.supabase.co";

const SUPABASE_KEY =

    "sb_publishable_YQTwXehHVdNjOv-LsAjnUQ_T1UZEEDi";

const loginForm =

    document.getElementById("loginForm");

const loginMessage =

    document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email =

        document.getElementById("email").value;

    const password =

        document.getElementById("password").value;

    try {

        const response = await fetch(

            `${SUPABASE_URL}/auth/v1/token?grant_type=password`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "apikey": SUPABASE_KEY

                },

                body: JSON.stringify({

                    email: email,

                    password: password

                })

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(

                data.error_description ||

                "Login failed"

            );

        }

        localStorage.setItem(

            "adminAccessToken",

            data.access_token

        );

        window.location.href = "admin.html";

    } catch (error) {

        console.error(error);

        loginMessage.innerHTML = `

            <p style="color:red;">

                ❌ ${error.message}

            </p>

        `;

    }

});