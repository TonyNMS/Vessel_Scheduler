import React from "react";

const DrivingTimeCalculator =()=>{
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [drivingTime, setDrivingTime] = useState(null);

    const calculateDrivingTime = async () => {
        const API_KEY = "";
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&mode=driving&key=${API_KEY}`;

        try {
        const response = await axios.get(url);
        const time = response.data.rows[0].elements[0].duration.text;
        setDrivingTime(time);
        } catch (error) {
        console.error("Error fetching driving time:", error);
        }
    };
    return (
        <div>
            <h2>Driving Time Calculator</h2>
            <input
                type="text"
                placeholder="Enter origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
            />
            <button onClick={calculateDrivingTime}>Calculate Driving Time</button>
            {drivingTime && <p>Estimated Driving Time: {drivingTime}</p>}
        </div>
    )
}

export default DrivingTimeCalculator;