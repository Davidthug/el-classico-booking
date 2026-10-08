const SUPABASE_URL = "https://bggvlpsehntmrxkdrsie.supabase.co";

const SUPABASE_KEY = "sb_publishable_YQTwXehHVdNjOv-LsAjnUQ_T1UZEEDi";

const bookingForm = document.getElementById("bookingForm");

const confirmation = document.getElementById("confirmation");

bookingForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const booking = {

        name: document.getElementById("name").value,

        phone: document.getElementById("phone").value,

        date: document.getElementById("date").value,

        time: document.getElementById("time").value,

        guests: Number(document.getElementById("guests").value),

        message: document.getElementById("message").value,

        status: "Pending"

    };

    try {

        const response = await fetch(

            `${SUPABASE_URL}/rest/v1/bookings`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "apikey": SUPABASE_KEY,

                    "Authorization": `Bearer ${SUPABASE_KEY}`,

                    "Prefer": "return=minimal"

                },

                body: JSON.stringify(booking)

            }

        );

        if (!response.ok) {

            const error = await response.text();

            throw new Error(error);

        }

        confirmation.innerHTML = `

            <h3>Booking Received! ✅</h3>

            <p>Thank you, ${booking.name}.</p>

            <p>Your booking has been sent successfully.</p>

            <p>We will contact you at ${booking.phone} to confirm it.</p>

        `;

        bookingForm.reset();

        localStorage.setItem("bookingPhone", booking.phone);

    } catch (error) {

        console.error(error);

        confirmation.innerHTML = `

            <p>❌ Booking could not be sent.</p>

            <p>Please try again.</p>

        `;

    }

});

async function checkBookingStatus() {

    const phone = localStorage.getItem("bookingPhone");

    if (!phone) {

        return;

    }

    try {

        const response = await fetch(

            `${SUPABASE_URL}/rest/v1/bookings?phone=eq.${encodeURIComponent(phone)}&select=id,name,status,date,time&order=id.desc&limit=1`,

            {

                method: "GET",

                headers: {

                    "apikey": SUPABASE_KEY,

                    "Authorization": `Bearer ${SUPABASE_KEY}`

                }

            }

        );

        if (!response.ok) {

            throw new Error(await response.text());

        }

        const bookings = await response.json();

        if (bookings.length === 0) {

            return;

        }

        const booking = bookings[0];

        const bookingStatus = document.getElementById("bookingStatus");

        let message = "";

        if (booking.status === "Confirmed") {

            message = `

                <div style="

                    background:#d4edda;

                    padding:20px;

                    border-radius:10px;

                    color:#155724;

                ">

                    <h3>✅ Booking Confirmed!</h3>

                    <p>Hello ${booking.name}.</p>

                    <p>Your booking has been confirmed.</p>

                    <p><strong>Date:</strong> ${booking.date}</p>

                    <p><strong>Time:</strong> ${booking.time}</p>

                </div>

            `;

        } else if (booking.status === "Cancelled") {

            message = `

                <div style="

                    background:#f8d7da;

                    padding:20px;

                    border-radius:10px;

                    color:#721c24;

                ">

                    <h3>❌ Booking Cancelled</h3>

                    <p>Hello ${booking.name}.</p>

                    <p>Your booking has been cancelled.</p>

                </div>

            `;

        } else {

            message = `

                <div style="

                    background:#fff3cd;

                    padding:20px;

                    border-radius:10px;

                    color:#856404;

                ">

                    <h3>🟡 Booking Pending</h3>

                    <p>Hello ${booking.name}.</p>

                    <p>Your booking is waiting for confirmation.</p>

                </div>

            `;

        }

        bookingStatus.innerHTML = message;

    } catch (error) {

        console.error("Status error:", error);

    }

}
checkBookingStatus();

setInterval(checkBookingStatus, 10000);