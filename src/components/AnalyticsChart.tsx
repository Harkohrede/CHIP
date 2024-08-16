import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './AnalyticsChart.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const user = auth.currentUser;

        // Check if user is authenticated
        if (!user) {
          setError("User not authenticated");
          setLoading(false);
          console.error("User not authenticated");
          return;
        }

        console.log("Authenticated user:", user);

        const userId = user.uid;
        const userLinksRef = collection(db, 'users', userId, 'LinkDATAS');
        const q = query(userLinksRef); // Query for the user's links collection

        const querySnapshot = await getDocs(q);

        // Check if there are any documents returned
        if (querySnapshot.empty) {
          setError("No data found for this user");
          setLoading(false);
          console.log("No data found for this user");
          return;
        }

        // Prepare the data for Chart.js
        const labels: string[] = [];
        const data: number[] = [];

        querySnapshot.forEach((doc) => {
          const urlData = doc.data();
          labels.push(urlData.shortUrl); // Example: Use URL or a custom label
          data.push(urlData.clickCount || 0); // Number of clicks (default to 0 if not present)
          console.log("Link Data:", doc.id, "=>", urlData);
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Number of Clicks',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
  };
  
  
  const navigate = useNavigate();

  const handleDash = () =>{
    navigate('/dashboard')
  }

  return (
    <div className="analytics-container">
      <button onClick={handleDash}>Dashboard</button>
      <h2>Analytics Chart</h2>
      {loading ? (
        <p>Loading chart data...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : chartData ? (
        <div className="chart-wrapper">
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default AnalyticsChart;
