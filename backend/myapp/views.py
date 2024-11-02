# views.py
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .models import UserProfile
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            phone = data.get('phone')

            # Check if the username already exists
            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already exists."}, status=400)

            # Create a new user
            user = User.objects.create_user(username=username, email=email, password=password)

            # Create UserProfile instance if UserProfile table exists
            try:
                user_profile = UserProfile.objects.get_or_create(user=user)[0]
                user_profile.phone = phone
                user_profile.save()
            except Exception as profile_error:
                print(f"Error creating UserProfile: {profile_error}")

            return JsonResponse({"success": "User created successfully"}, status=201)

        except Exception as e:
            print(f"Error in signup view: {e}")
            return JsonResponse({"error": "An error occurred during sign-up."}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)

def query(request):
    return render(request, 'query.html')

@csrf_exempt
def Login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"success": "Login successful"}, status=200)
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=400)
    return render(request, 'login.html')

def index(request):
    return render(request, 'index.html')

def machines(request):
    return render(request, 'machines.html')

import mysql.connector

def worker_score(request):
    if request.method != 'GET':
        return JsonResponse({"error": "Invalid request method"}, status=405)

    # Replace these with your actual database credentials
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': '123#sree#789',
        'database': 'factory_db'
    }

    # Initialize variables to store averages
    avg_hours_worked = 0
    avg_efficiency_score = 0
    avg_idle_time = 0

    connection = None
    cursor = None

    try:
        # Establish a connection to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        query = """
        SELECT AVG(hours_worked) AS avg_hours_worked,
               AVG(efficiency_score) AS avg_efficiency_score,
               AVG(idle_time) AS avg_idle_time
        FROM workforce_productivity
        """
        cursor.execute(query)
        result = cursor.fetchone()

        if result:
            avg_hours_worked = result.get('avg_hours_worked', 0)
            avg_efficiency_score = result.get('avg_efficiency_score', 0)
            avg_idle_time = result.get('avg_idle_time', 0)

    except mysql.connector.Error as e:
        print("Error connecting to MySQL:", e)
        return JsonResponse({"error": str(e)}, status=500)
    finally:
        # Close the cursor and connection
        if cursor:
            cursor.close()
        if connection:
            connection.close()

    # Return the averages as a JSON response
    return JsonResponse({"avg_hours_worked": avg_hours_worked, "avg_efficiency_score": avg_efficiency_score, "avg_idle_time": avg_idle_time})

