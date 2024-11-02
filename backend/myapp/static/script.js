window.addEventListener("load", function () {
  const loading = document.getElementById("loading");
  const content = document.getElementById("content");
  const logo = document.getElementById("logo");
  const datas = {};
  document.querySelector(".profile-name").textContent =
    localStorage.getItem("name");
  // Show loading for 4 seconds
  setTimeout(() => {
    loading.style.transform = "translateY(-45%)"; // Move the loading screen up
    // Show content
  }, 2000);
  setTimeout(() => {
    // 4000 milliseconds = 4 seconds
    content.style.opacity = 1;
  }, 2500);

  if (this.localStorage.getItem("done") !== "true") {
    this.window.location.href = "/login/";
  }

  fetch("/worker_score/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched data:", data);
      Object.entries(data).forEach(([key, value]) => {
        datas[key] = value;
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  function getCSRFToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, 11) === "csrftoken=") {
          cookieValue = decodeURIComponent(cookie.substring(11));
          break;
        }
      }
    }
    return cookieValue;
  }

  // generateChart();

  function generateChart() {
    // Display title
    document.getElementsByClassName("title")[0].textContent = "Average Stats";
    // const datas = {
    //   "Average Hours Worked": 6.494644000000024,
    //   "Average Efficiency Score": 79.98208599999974,
    //   "Average Idle Time": 1.4843020000000031,
    // };
    // Data for the pie chart
    const data = [
      {
        type: "pie",
        values: Object.values(datas),
        labels: Object.keys(datas),
        hoverinfo: "label+percent",
        textinfo: "percent",
        textposition: "inside",
        marker: {
          colors: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      },
    ];

    // Layout for the chart
    const layout = {
      title: "Average Stats",
      showlegend: true,
    };

    // Render the chart in the specified div
    Plotly.newPlot("chart", data, layout);
    // Show the chart container
    // document.getElementById("chart-container").style.display = "block";
  }
  // Call the function to generate the chart on page load
  // window.onload = generateChart;
});
