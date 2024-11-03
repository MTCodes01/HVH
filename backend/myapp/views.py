# views.py
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .models import UserProfile
from django.views.decorators.csrf import csrf_exempt
import json
import pandas as pd

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

def home(request):
    # return render(request, 'index.html')
    return JsonResponse({"success": "success"}, status=200)

def workers(request):
    if request.method != 'GET':
        return JsonResponse({"error": "Invalid request method"}, status=405)

    # Replace these with your actual database credentials
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': '123#sree#789',
        'database': 'factory_db'
    }

    connection = None
    cursor = None

    try:
        # Establish a connection to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        query = """
        SELECT skill_level AS skill_level,
               shift AS shift,
               availability_status AS availability_status
        FROM workers
        """
        cursor.execute(query)
        result = cursor.fetchall()

        if result:
            skill_level, shift, availability_status = map(list, zip(*[row.values() for row in result]))
            skill_count = {i : skill_level.count(i) for i in set(skill_level)}
            shift_count = {i : shift.count(i) for i in set(shift)}
            availability_count = {i : availability_status.count(i) for i in set(availability_status)}
            print(skill_count)
            print(shift_count)
            print(availability_count)
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
    return JsonResponse({"skill_level": {i : j for i, j in skill_count.items()}, "shift": {i : j for i, j in shift_count.items()}, "availability_status": {i : j for i, j in availability_count.items()}})

def profit(request):
    import matplotlib
    matplotlib.use('Agg')  # Set the backend before importing pyplot
    import matplotlib.pyplot as plt
    import pandas as pd
    import seaborn as sns

    # Read the CSV file
    print("Loading data...")
    df = pd.read_csv('./models/Workforce_Productivity.csv')

    # First figure - Work metrics
    print("Creating first set of visualizations...")
    plt.figure(figsize=(15, 10))

    # 1. Scatter plot of Hours Worked vs Idle Time
    plt.subplot(2, 2, 1)
    plt.scatter(df['hours_worked'], df['idle_time'], alpha=0.6)
    plt.title('Hours Worked vs Idle Time')
    plt.xlabel('Hours Worked')
    plt.ylabel('Idle Time')
    plt.grid(True)

    # 2. Distribution of Hours Worked
    plt.subplot(2, 2, 2)
    plt.hist(df['hours_worked'], bins=20, color='skyblue', edgecolor='black')
    plt.title('Distribution of Hours Worked')
    plt.xlabel('Hours Worked')
    plt.ylabel('Frequency')
    plt.grid(True)

    # 3. Distribution of Idle Time
    plt.subplot(2, 2, 3)
    plt.hist(df['idle_time'], bins=20, color='lightgreen', edgecolor='black')
    plt.title('Distribution of Idle Time')
    plt.xlabel('Idle Time')
    plt.ylabel('Frequency')
    plt.grid(True)

    # 4. Bar plot of average metrics
    plt.subplot(2, 2, 4)
    avg_metrics = [df['hours_worked'].mean(), df['idle_time'].mean()]
    labels = ['Avg Hours Worked', 'Avg Idle Time']
    plt.bar(labels, avg_metrics, color=['skyblue', 'lightgreen'])
    plt.title('Average Work Metrics')
    plt.ylabel('Hours')
    for i, v in enumerate(avg_metrics):
        plt.text(i, v, f'{v:.2f}', ha='center', va='bottom')
    plt.grid(True)

    # Adjust layout and save
    plt.tight_layout()
    plt.savefig('./models/workforce_analysis.png')
    plt.close()

    # Second figure - Productivity insights
    print("Creating second set of visualizations...")
    plt.figure(figsize=(15, 5))

    # 1. Productivity Ratio
    plt.subplot(1, 2, 1)
    productivity_ratio = (df['hours_worked'] - df['idle_time']) / df['hours_worked']
    plt.hist(productivity_ratio, bins=20, color='orange', edgecolor='black')
    plt.title('Distribution of Productivity Ratio')
    plt.xlabel('Productivity Ratio')
    plt.ylabel('Frequency')
    plt.grid(True)

    # 2. Time breakdown
    plt.subplot(1, 2, 2)
    productive_time = df['hours_worked'].mean() - df['idle_time'].mean()
    time_breakdown = [df['idle_time'].mean(), productive_time]
    labels = ['Idle Time', 'Productive Time']
    plt.pie(time_breakdown, labels=labels, autopct='%1.1f%%', colors=['lightcoral', 'lightgreen'])
    plt.title('Average Time Breakdown')

    # Save second figure
    plt.tight_layout()
    plt.savefig('./models/productivity_analysis.png')
    plt.close()

    # Calculate and print statistics
    print("\nCalculating statistics...")
    print("\nWorkforce Productivity Summary:")
    print("-" * 30)
    print(f"Average Hours Worked: {df['hours_worked'].mean():.2f} hours")
    print(f"Average Idle Time: {df['idle_time'].mean():.2f} hours")
    print(f"Average Productivity Ratio: {productivity_ratio.mean():.2%}")
    print(f"Maximum Hours Worked: {df['hours_worked'].max():.2f} hours")
    print(f"Maximum Idle Time: {df['idle_time'].max():.2f} hours")
    print(f"Minimum Hours Worked: {df['hours_worked'].min():.2f} hours")
    print(f"Minimum Idle Time: {df['idle_time'].min():.2f} hours")

    # Calculate correlation
    correlation = df['hours_worked'].corr(df['idle_time'])
    print(f"\nCorrelation between Hours Worked and Idle Time: {correlation:.2f}")

    # Save statistics to file
    print("\nSaving summary to file...")
    with open('productivity_summary.txt', 'w') as f:
        f.write("Workforce Productivity Summary\n")
        f.write("-" * 30 + "\n")
        f.write(f"Average Hours Worked: {df['hours_worked'].mean():.2f} hours\n")
        f.write(f"Average Idle Time: {df['idle_time'].mean():.2f} hours\n")
        f.write(f"Average Productivity Ratio: {productivity_ratio.mean():.2%}\n")
        f.write(f"Maximum Hours Worked: {df['hours_worked'].max():.2f} hours\n")
        f.write(f"Maximum Idle Time: {df['idle_time'].max():.2f} hours\n")
        f.write(f"Minimum Hours Worked: {df['hours_worked'].min():.2f} hours\n")
        f.write(f"Minimum Idle Time: {df['idle_time'].min():.2f} hours\n")
        f.write(f"\nCorrelation between Hours Worked and Idle Time: {correlation:.2f}\n")

    print("\nAnalysis complete! Check the following files:")
    print("1. workforce_analysis.png - Main visualization")
    print("2. productivity_analysis.png - Productivity insights")
    print("3. productivity_summary.txt - Detailed statistics")

def add_tables(request):
    return render(request, 'workers.html')

def cont(request):
    return render(request, 'continue.html')