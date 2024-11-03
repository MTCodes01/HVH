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
  }, 2000);

  setTimeout(() => {
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
      // Populate the datas object with the fetched data
      datas["avg_hours_worked"] = data.avg_hours_worked;
      datas["avg_efficiency_score"] = data.avg_efficiency_score;
      datas["avg_idle_time"] = data.avg_idle_time;

      // Now call generateChart only after the data is fetched
      generateChart();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  // "skill_level": len(skill_level), "shift": len(shift), "availability_status": len(availability_status)
  // Initialize the workers object to avoid errors
  let workers = {
    skill_level: { Intermediate: 0, Expert: 0, Beginner: 0 },
    shift: { Night: 0, Day: 0, Evening: 0 },
    availability_status: { Available: 0, Unavailable: 0, "On Leave": 0 },
  };

  fetch("/workers/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Update the workers object with the data received
      workers.skill_level.Intermediate = data.skill_level?.Intermediate || 0;
      workers.skill_level.Expert = data.skill_level?.Expert || 0;
      workers.skill_level.Beginner = data.skill_level?.Beginner || 0;

      workers.shift.Night = data.shift?.Night || 0;
      workers.shift.Day = data.shift?.Day || 0;
      workers.shift.Evening = data.shift?.Evening || 0;

      workers.availability_status.Available =
        data.availability_status?.Available || 0;
      workers.availability_status.Unavailable =
        data.availability_status?.Unavailable || 0;
      workers.availability_status["On Leave"] =
        data.availability_status?.["On Leave"] || 0;
    })
    .catch((error) => console.error("Error fetching data:", error));

  console.log(workers);
  function getCSRFToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, 11) === "csrftoken=") {
          cookieValue = decodeURIComponent(cookie.substring(11));
          break;
        }
      }
    }
    return cookieValue;
  }

  // function generateChart() {
  //   // document.getElementsByClassName("title")[0].textContent = "Average Stats";
  //   console.log(datas);

  //   // Ensure all required data points are present before rendering the chart
  //   const values = [
  //     datas["avg_hours_worked"] ?? 0,
  //     datas["avg_efficiency_score"] ?? 0,
  //     datas["avg_idle_time"] ?? 0,
  //   ];
  //   const labels = ["Average Hours Worked", "Average Efficiency Score", "Average Idle Time"];

  //   const data = [
  //     {
  //       type: "pie",
  //       values: values,
  //       labels: labels,
  //       hoverinfo: "label+percent",
  //       textinfo: "percent",
  //       textposition: "inside",
  //       marker: {
  //         colors: ["#FF6384", "#36A2EB", "#FFCE56"],
  //       },
  //     },
  //   ];

  //   const layout = {
  //     title: "Average Stats",
  //     showlegend: true,
  //     paper_bgcolor: "rgba(0,0,0,0)",
  //     plot_bgcolor: "rgba(0,0,0,0)",
  //   };

  //   Plotly.newPlot("chart", data, layout);
  // }
  generateChart2();
  function generateChart2() {
    var chart = new CanvasJS.Chart("chartContainer2", {
      title: {
        text: "Workers",
      },
      animationEnabled: true,
      backgroundColor: "transparent",
      theme: "dark1",
      data: [
        {
          type: "bar",
          showInLegend: true,
          legendText: "Skill Level",
          dataPoints: [
            { label: "Intermediate", y: 3325 },
            { label: "Expert", y: 3324 },
            { label: "Beginner", y: 3351 },
          ],
        },
        {
          type: "bar",
          showInLegend: true,
          legendText: "Shift",
          dataPoints: [
            { label: "Night", y: 3383 },
            { label: "Day", y: 3343 },
            { label: "Evening", y: 3274 },
          ],
        },
        {
          type: "bar",
          showInLegend: true,
          legendText: "Availability Status",
          dataPoints: [
            { label: "Available", y: 3282 },
            {
              label: "Unavailable",
              y: 3355,
            },
            { label: "On Leave", y: 3363 },
          ],
        },
      ],
    });

    chart.render();
  }

  function generateChart() {
    // Set the title in the HTML if needed
    // document.getElementsByClassName("title")[0].textContent = "Average Stats";

    // Ensure all required data points are present before rendering the chart
    const values = [
      datas["avg_hours_worked"] ?? 0,
      datas["avg_efficiency_score"] ?? 0,
      datas["avg_idle_time"] ?? 0,
    ];

    const labels = [
      "Average Hours Worked",
      "Average Efficiency Score",
      "Average Idle Time",
    ];

    // Prepare dataPoints array for CanvasJS
    const dataPoints = labels.map((label, index) => ({
      label: label,
      y: values[index],
    }));

    // Define and render the CanvasJS chart
    var chart = new CanvasJS.Chart("chartContainer", {
      theme: "dark1",
      animationEnabled: true,
      backgroundColor: "transparent",
      title: {
        text: "Average Stats",
      },
      data: [
        {
          type: "pie",
          startAngle: 240,
          yValueFormatString: '##0.00"%"',
          indexLabel: "{label} {y}",
          dataPoints: dataPoints,
        },
      ],
    });

    chart.render();
  }
});
