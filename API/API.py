from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from mysql.connector import Error
import mysql.connector

app = Flask(__name__)
CORS(app)

def connect_to_database():
    try:
        connection = mysql.connector.connect(
            host='127.0.0.1',
            database='MovieDB',
            user='root',
            password='temp1234'
        )
        if connection.is_connected():
            print('Connected to MySQL database')
            return connection
    except Error as e:
        print(f"Error connecting to MySQL database: {e}")
        return None

# Function to execute SQL query
def execute_query(query, params=None):
    connection = connect_to_database()
    if connection:
        try:
            cursor = connection.cursor(dictionary=True)
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            result = cursor.fetchall()
            return result
        except Error as e:
            print(f"Error executing query: {e}")
            return None
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()

#Gets movies for "Coming soon" page
@app.route('/ComingSoon', methods=['GET'])
def get_coming_soon():
    # Query for movies that haven't been shown yet
    query = """SELECT *
        FROM Movies
        WHERE id IN (
            SELECT movie_id
            FROM Showtimes
            WHERE date > CURRENT_DATE
        )
        AND id NOT IN (
            SELECT movie_id
            FROM Showtimes
            WHERE date <= CURRENT_DATE
        );"""

    results = execute_query(query)
    if results is not None:
        return jsonify(results)
    else:
        return jsonify({'error': 'Internal Server Error'}), 500

#Gets movies for "Now Showing" page
@app.route('/NowShowing', methods=['GET'])
def get_now_showing():
    query = """SELECT * FROM Movies
        WHERE id IN (
        SELECT movie_id
        FROM Showtimes
        WHERE date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL 7 DAY
        );"""
    results = execute_query(query)
    if results is not None:
        return jsonify(results)
    else:
        return jsonify({'error': 'Internal Server Error'}), 500


#Get movie by title
@app.route('/movies', methods=['GET'])
def search_by_title():
    title = request.args.get('title')
    query = """SELECT * FROM Movies WHERE title LIKE %s;"""
    params = (f"%{title}%",)
    results = execute_query(query, params)
    if results is not None:
        return jsonify(results)
    else:
        return jsonify({'error': 'Internal Server Error'}), 500


if __name__ == '__main__':
    app.run(debug=True)

