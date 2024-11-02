// Fetch machine data from Flask API
        async function fetchMachines() {
            try {
                const response = await fetch('/api/machines'); // This will call the new endpoint
                const machines = await response.json();
                displayMachines(machines);
            } catch (error) {
                console.error('Error fetching machine data:', error);
            }
        }

        // Display machine data on the page
        function displayMachines(machines) {
            const machineList = document.getElementById('machineList');
            machineList.innerHTML = ''; // Clear any existing data

            machines.forEach(machine => {
                const machineCard = document.createElement('div');
                machineCard.className = 'machine-card';

                // Set machine card content
                machineCard.innerHTML = `
                    <h3>${machine.name}</h3>
                    <p style="color: ${getStatusColor(machine.status)};">Status: ${machine.status}</p>
                    <p>Usage Metrics: ${machine.usage_metrics}</p>
                    <p>Last Maintenance: ${machine.last_maintenance}</p>
                    <p>Next Maintenance: ${machine.next_maintenance}</p>
                `;

                // Append to machine list
                machineList.appendChild(machineCard);
            });
        }

        // Helper function to get color based on machine status
        function getStatusColor(status) {
            switch (status) {
                case 'Operational': return 'green';
                case 'In Maintenance': return 'orange';
                case 'Idle': return 'gray';
                default: return 'black';
            }
        }

        // Load machines on page load
        document.addEventListener('DOMContentLoaded', fetchMachines);