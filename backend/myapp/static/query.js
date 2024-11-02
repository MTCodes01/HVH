let currentQuestion = 1;
        const totalQuestions = 5;

        const roles = [
            "Chief Executive Officer (CEO)",
            "Chief Marketing Officer (CMO)",
            "Chief Human Resources Officer (CHRO)",
            "Chief Financial Officer (CFO)",
            "Vice President (VP)",
            "Assistant Vice President (AVP)",
            "Senior Manager",
            "Manager",
            "Assistant Manager",
            "Associate / Executive"
        ];

        function nextQuestion(current) {
            // Validate current question before moving to next
            if (current === 1 && !document.querySelector('input[name="industry"]:checked')) {
                alert("Please select an industry.");
                return;
            }

            if (current === 2) {
                // Validate company name and location
                const companyName = document.getElementById('company-name').value;
                const companyLocation = document.getElementById('company-location').value;
                if (!companyName || !companyLocation) {
                    alert("Please fill in both company name and location.");
                    return;
                }
            }

            if (current === 4 && !document.querySelector('input[name="challenges"]:checked')) {
                alert("Please select a challenge.");
                return;
            }

            if (current === 5 && !document.querySelector('input[name="goals"]:checked')) {
                alert("Please select a goal.");
                return;
            }

            // Hide current question
            document.getElementById(`q${current}`).classList.remove('active');
            currentQuestion++;
            document.getElementById(`q${currentQuestion}`).classList.add('active');
            updateProgress();
        }

        function previousQuestion(current) {
            document.getElementById(`q${current}`).classList.remove('active');
            currentQuestion--;
            document.getElementById(`q${currentQuestion}`).classList.add('active');
            updateProgress();
        }

        function updateProgress() {
            const progress = (currentQuestion / totalQuestions) * 100;
            document.getElementById('progress').style.width = progress + '%';
        }

        // Handle showing/hiding other input fields
        document.querySelectorAll('input[name="industry"]').forEach((radio) => {
            radio.addEventListener('change', function() {
                const otherInput = document.getElementById('industry-other');
                if (this.value === 'Other') {
                    otherInput.classList.add('active');
                } else {
                    otherInput.classList.remove('active');
                }
            });
        });

        document.querySelectorAll('input[name="challenges"]').forEach((radio) => {
            radio.addEventListener('change', function() {
                const otherInput = document.getElementById('challenges-other');
                if (this.value === 'Other') {
                    otherInput.classList.add('active');
                } else {
                    otherInput.classList.remove('active');
                }
            });
        });

        document.querySelectorAll('input[name="goals"]').forEach((radio) => {
            radio.addEventListener('change', function() {
                const otherInput = document.getElementById('goals-other');
                if (this.value === 'Other') {
                    otherInput.classList.add('active');
                } else {
                    otherInput.classList.remove('active');
                }
            });
        });

        async function fetchLocations(query) {
            const suggestionsBox = document.getElementById('location-suggestions');
            suggestionsBox.innerHTML = ''; // Clear previous suggestions
            if (query.length < 2) {
                suggestionsBox.style.display = 'none'; // Hide suggestions if input is too short
                return;
            }

            const apiKey = 'pk.8f23c36b3721a748dee3ec5aae8428c0'; // Replace with your LocationIQ API key
            const url = `https://us1.locationiq.com/v1/autocomplete.php?key=${apiKey}&q=${encodeURIComponent(query)}&format=json`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.length > 0) {
                    suggestionsBox.style.display = 'block'; // Show suggestions
                    data.forEach(result => {
                        const suggestion = document.createElement('div');
                        suggestion.classList.add('suggestion-item');
                        suggestion.textContent = `${result.display_place}, ${result.address.city || ''} ${result.address.state || ''}`.trim(); // Format as needed
                        suggestion.onclick = () => selectLocation(suggestion.textContent);
                        suggestionsBox.appendChild(suggestion);
                    });
                } else {
                    suggestionsBox.style.display = 'none'; // Hide if no results
                }
            } catch (error) {
                console.error('Error fetching location suggestions:', error);
                suggestionsBox.style.display = 'none'; // Hide on error
            }
        }

        // Function to handle when a location suggestion is selected
        function selectLocation(location) {
            document.getElementById('company-location').value = location; // Set the input field value
            document.getElementById('location-suggestions').innerHTML = ''; // Clear suggestions
            document.getElementById('location-suggestions').style.display = 'none'; // Hide suggestions
        }

        // Function to filter role suggestions
        function filterRoles(query) {
            const suggestionsBox = document.getElementById('role-suggestions');
            suggestionsBox.innerHTML = ''; // Clear previous suggestions
            if (query.length < 1) {
                suggestionsBox.style.display = 'none'; // Hide suggestions if input is too short
                return;
            }

            const filteredRoles = roles.filter(role => role.toLowerCase().includes(query.toLowerCase()));
            if (filteredRoles.length > 0) {
                suggestionsBox.style.display = 'block'; // Show suggestions
                filteredRoles.forEach(role => {
                    const suggestion = document.createElement('div');
                    suggestion.classList.add('suggestion-item');
                    suggestion.textContent = role; // Role text
                    suggestion.onclick = () => selectRole(role);
                    suggestionsBox.appendChild(suggestion);
                });
            } else {
                suggestionsBox.style.display = 'none'; // Hide if no results
            }
        }

        // Function to handle when a role suggestion is selected
        function selectRole(role) {
            document.getElementById('role').value = role; // Set the input field value
            document.getElementById('role-suggestions').innerHTML = ''; // Clear suggestions
            document.getElementById('role-suggestions').style.display = 'none'; // Hide suggestions
        }

        function submitForm() {
            document.querySelector('.query-container').style.display = 'none'; // Hide the form
            document.getElementById('thank-you').style.display = 'flex'; // Show thank you page
            // Here you can gather the data and send it to your backend
        }

        function handleIndustryChange(question, value) {
                    if (question === 'Other') {
                        const otherInput = document.getElementById('industry-other-input').value;
                        localStorage.setItem('selectedIndustry', otherInput);
                    } else {
                        localStorage.setItem('selectedIndustry', value);
                    }
                }